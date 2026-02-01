/**
 * Next.js Project Scaffolder
 *
 * Generates a complete Next.js 14 App Router project structure
 * from a parsed Unframe AST.
 */

import type {
  UnframeAST,
  PageAST,
  ComponentAST,
  StylesAST,
  AssetAST,
} from '../types/ast.js'

import type { OutputFile, ExportConfig } from '../types/output.js'

import {
  ReactGenerator,
  createReactGenerator,
  type GeneratedComponent,
} from './react-generator.js'

// ============================================
// Types
// ============================================

export interface ScaffoldResult {
  files: OutputFile[]
  directories: string[]
  tailwindConfig: TailwindConfigData
  packageJson: PackageJsonData
}

export interface TailwindConfigData {
  colors: Record<string, string>
  fontFamily: Record<string, string[]>
  extend: Record<string, unknown>
}

export interface PackageJsonData {
  name: string
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}

// ============================================
// Next.js Scaffolder
// ============================================

export class NextjsScaffolder {
  private config: ExportConfig
  private generator: ReactGenerator

  constructor(config: Partial<ExportConfig> = {}) {
    this.config = {
      outputDir: config.outputDir || './out',
      framework: 'nextjs-app',
      styling: config.styling || 'tailwind',
      features: {
        animations: config.features?.animations ?? true,
        cms: config.features?.cms ?? true,
        responsive: config.features?.responsive ?? true,
        darkMode: config.features?.darkMode ?? false,
      },
      codeStyle: {
        typescript: config.codeStyle?.typescript ?? true,
        semicolons: config.codeStyle?.semicolons ?? false,
        singleQuote: config.codeStyle?.singleQuote ?? true,
        tabWidth: config.codeStyle?.tabWidth ?? 2,
      },
    }

    this.generator = createReactGenerator({
      typescript: this.config.codeStyle.typescript,
      semicolons: this.config.codeStyle.semicolons,
      singleQuote: this.config.codeStyle.singleQuote,
      indent: this.config.codeStyle.tabWidth,
      useMotion: this.config.features.animations,
    })
  }

  /**
   * Generate complete Next.js project from AST
   */
  scaffold(ast: UnframeAST): ScaffoldResult {
    const files: OutputFile[] = []
    const directories: string[] = [
      'app',
      'components',
      'lib',
      'public',
      'public/images',
      'styles',
    ]

    // Generate Tailwind config data
    const tailwindConfig = this.extractTailwindConfig(ast.styles)

    // Generate package.json data
    const packageJson = this.generatePackageJson(ast)

    // Generate config files
    files.push(this.generateTailwindConfigFile(tailwindConfig))
    files.push(this.generatePackageJsonFile(packageJson, ast.metadata.name))
    files.push(this.generateTsConfig())
    files.push(this.generateNextConfig())
    files.push(this.generateGlobalCss(ast.styles))
    files.push(this.generatePostCssConfig())

    // Build component name map for proper import resolution
    // Maps componentRef (ID) -> normalized component name
    const componentNameMap = new Map<string, string>()
    for (const component of ast.components) {
      componentNameMap.set(component.id, component.name)
    }
    
    // Recreate generator with component name map for proper import resolution
    this.generator = createReactGenerator({
      typescript: this.config.codeStyle.typescript,
      semicolons: this.config.codeStyle.semicolons,
      singleQuote: this.config.codeStyle.singleQuote,
      indent: this.config.codeStyle.tabWidth,
      useMotion: this.config.features.animations,
      componentNameMap,
    })

    // Generate layout
    files.push(this.generateRootLayout(ast))

    // Generate pages
    for (const page of ast.pages) {
      const pageFile = this.generatePageFile(page)
      files.push(pageFile)

      // Add subdirectories for nested routes
      const pathParts = page.path.split('/').filter(Boolean)
      if (pathParts.length > 1) {
        directories.push(`app/${pathParts.slice(0, -1).join('/')}`)
      }
    }

    // Generate components
    for (const component of ast.components) {
      const componentFile = this.generateComponentFile(component)
      files.push(componentFile)
    }

    // Generate lib utilities
    files.push(this.generateCnUtil())

    return {
      files,
      directories,
      tailwindConfig,
      packageJson,
    }
  }

  // ============================================
  // Config File Generators
  // ============================================

  private generateTailwindConfigFile(config: TailwindConfigData): OutputFile {
    const ext = this.config.codeStyle.typescript ? 'ts' : 'js'
    const q = this.config.codeStyle.singleQuote ? "'" : '"'

    const colorEntries = Object.entries(config.colors)
      .map(([name, value]) => `        ${q}${name}${q}: ${q}${value}${q},`)
      .join('\n')

    const fontEntries = Object.entries(config.fontFamily)
      .map(([name, fonts]) => `        ${q}${name}${q}: [${fonts.map(f => `${q}${f}${q}`).join(', ')}],`)
      .join('\n')

    const content = `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
${colorEntries}
      },
      fontFamily: {
${fontEntries}
      },
    },
  },
  plugins: [],
}

export default config
`

    return {
      path: `tailwind.config.${ext}`,
      content,
      type: ext === 'ts' ? 'ts' : 'js',
      description: 'Tailwind CSS configuration with extracted colors and fonts',
    }
  }

  private generatePackageJsonFile(data: PackageJsonData, projectName: string): OutputFile {
    const pkg = {
      name: this.toKebabCase(projectName),
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
      },
      dependencies: {
        next: '^14.0.0',
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        ...data.dependencies,
      },
      devDependencies: {
        '@types/node': '^20.0.0',
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        typescript: '^5.0.0',
        tailwindcss: '^3.4.0',
        postcss: '^8.4.0',
        autoprefixer: '^10.0.0',
        ...data.devDependencies,
      },
    }

    return {
      path: 'package.json',
      content: JSON.stringify(pkg, null, 2) + '\n',
      type: 'json',
      description: 'Project dependencies and scripts',
    }
  }

  private generateTsConfig(): OutputFile {
    const config = {
      compilerOptions: {
        target: 'ES2017',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [{ name: 'next' }],
        paths: {
          '@/*': ['./*'],
        },
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules'],
    }

    return {
      path: 'tsconfig.json',
      content: JSON.stringify(config, null, 2) + '\n',
      type: 'json',
      description: 'TypeScript configuration',
    }
  }

  private generateNextConfig(): OutputFile {
    const ext = this.config.codeStyle.typescript ? 'mjs' : 'js'

    const content = `/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
`

    return {
      path: `next.config.${ext}`,
      content,
      type: 'js',
      description: 'Next.js configuration',
    }
  }

  private generatePostCssConfig(): OutputFile {
    const content = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`

    return {
      path: 'postcss.config.js',
      content,
      type: 'js',
      description: 'PostCSS configuration for Tailwind',
    }
  }

  private generateGlobalCss(styles: StylesAST): OutputFile {
    const colorVars = styles.colors
      .map(c => `  ${c.cssVariable}: ${c.light};`)
      .join('\n')

    const darkColorVars = styles.colors
      .filter(c => c.dark)
      .map(c => `    ${c.cssVariable}: ${c.dark};`)
      .join('\n')

    let content = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
${colorVars}
}
`

    if (this.config.features.darkMode && darkColorVars) {
      content += `
@media (prefers-color-scheme: dark) {
  :root {
${darkColorVars}
  }
}
`
    }

    // Add typography classes
    if (styles.typography.length > 0) {
      content += '\n/* Typography Styles */\n'
      for (const typo of styles.typography) {
        const rules = typo.styles
          .map(r => `  ${r.property}: ${r.value};`)
          .join('\n')
        content += `
.${typo.cssClass} {
${rules}
}
`
      }
    }

    return {
      path: 'app/globals.css',
      content,
      type: 'css',
      description: 'Global styles with CSS variables and typography',
    }
  }

  // ============================================
  // Component & Page Generators
  // ============================================

  private generateRootLayout(ast: UnframeAST): OutputFile {
    const ext = this.config.codeStyle.typescript ? 'tsx' : 'jsx'
    const q = this.config.codeStyle.singleQuote ? "'" : '"'
    const semi = this.config.codeStyle.semicolons ? ';' : ''

    // Extract fonts from styles
    const fonts = this.extractFonts(ast.styles)
    const fontImports = fonts
      .map(f => `import { ${f.importName} } from ${q}next/font/google${q}${semi}`)
      .join('\n')

    const fontInstances = fonts
      .map(f => `const ${f.varName} = ${f.importName}({ subsets: [${q}latin${q}]${f.weight ? `, weight: [${f.weight.map(w => `${q}${w}${q}`).join(', ')}]` : ''} })${semi}`)
      .join('\n')

    const fontClasses = fonts.map(f => `\${${f.varName}.className}`).join(' ')

    const content = `import type { Metadata } from ${q}next${q}${semi}
${fontImports}
import ${q}./globals.css${q}${semi}

export const metadata: Metadata = {
  title: ${q}${ast.metadata.name}${q},
  description: ${q}Generated by Unframe${q},
}${semi}

${fontInstances}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={\`${fontClasses}\`}>
        {children}
      </body>
    </html>
  )${semi}
}
`

    return {
      path: `app/layout.${ext}`,
      content,
      type: ext === 'tsx' ? 'tsx' : 'jsx',
      description: 'Root layout with fonts and global styles',
    }
  }

  private generatePageFile(page: PageAST): OutputFile {
    const ext = this.config.codeStyle.typescript ? 'tsx' : 'jsx'
    
    const generated = this.generator.generatePage(page)
    const content = this.generator.generateFile(generated)

    // Determine file path based on route
    let filePath: string
    if (page.path === '/') {
      filePath = `app/page.${ext}`
    } else if (page.path.includes(':')) {
      // Dynamic route: /blog/:slug -> app/blog/[slug]/page.tsx
      const routePath = page.path
        .replace(/:(\w+)/g, '[$1]')
        .replace(/^\//, '')
      filePath = `app/${routePath}/page.${ext}`
    } else {
      // Static route: /about -> app/about/page.tsx
      const routePath = page.path.replace(/^\//, '')
      filePath = `app/${routePath}/page.${ext}`
    }

    return {
      path: filePath,
      content,
      type: ext === 'tsx' ? 'tsx' : 'jsx',
      description: `Page: ${page.name}`,
    }
  }

  private generateComponentFile(component: ComponentAST): OutputFile {
    const ext = this.config.codeStyle.typescript ? 'tsx' : 'jsx'
    
    const generated = this.generator.generateComponent(component)
    const content = this.generator.generateFile(generated)

    // Normalize to PascalCase first (same as toComponentName in react-generator),
    // then convert to kebab-case. This ensures file names match import paths.
    const normalizedName = this.toPascalCase(component.name)
    const fileName = this.toKebabCase(normalizedName)
    const filePath = `components/${fileName}.${ext}`

    return {
      path: filePath,
      content,
      type: ext === 'tsx' ? 'tsx' : 'jsx',
      description: `Component: ${component.originalName}`,
    }
  }
  
  private toPascalCase(str: string): string {
    // Same logic as react-generator's toComponentName
    // "cta-button" -> "CtaButton"
    // "elements/badge" -> "ElementsBadge"
    let cleaned = str
      .replace(/\//g, '')
      .replace(/[\s-]+/g, '')
    
    // Ensure first character is uppercase
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
    
    return cleaned
  }

  private generateCnUtil(): OutputFile {
    const ext = this.config.codeStyle.typescript ? 'ts' : 'js'
    const q = this.config.codeStyle.singleQuote ? "'" : '"'
    const semi = this.config.codeStyle.semicolons ? ';' : ''

    const content = `import { clsx, type ClassValue } from ${q}clsx${q}${semi}
import { twMerge } from ${q}tailwind-merge${q}${semi}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))${semi}
}
`

    return {
      path: `lib/utils.${ext}`,
      content,
      type: ext === 'ts' ? 'ts' : 'js',
      description: 'Utility for merging Tailwind classes',
    }
  }

  // ============================================
  // Data Extraction
  // ============================================

  private extractTailwindConfig(styles: StylesAST): TailwindConfigData {
    const colors: Record<string, string> = {}
    const fontFamily: Record<string, string[]> = {}

    // Extract colors
    for (const color of styles.colors) {
      const name = this.colorPathToName(color.path)
      colors[name] = color.light
    }

    // Extract fonts from typography
    for (const typo of styles.typography) {
      const fontRule = typo.styles.find(s => s.property === 'font-family')
      if (fontRule) {
        const fontName = this.extractFontName(fontRule.value)
        if (fontName && !fontFamily[fontName.toLowerCase()]) {
          fontFamily[fontName.toLowerCase()] = [fontName, 'sans-serif']
        }
      }
    }

    return { colors, fontFamily, extend: {} }
  }

  private generatePackageJson(ast: UnframeAST): PackageJsonData {
    const dependencies: Record<string, string> = {}
    const devDependencies: Record<string, string> = {}

    // Add motion if animations enabled
    if (this.config.features.animations) {
      dependencies['framer-motion'] = '^10.0.0'
    }

    // Add clsx and tailwind-merge for cn utility
    dependencies['clsx'] = '^2.0.0'
    dependencies['tailwind-merge'] = '^2.0.0'

    return {
      name: this.toKebabCase(ast.metadata.name || 'unframe-export'),
      dependencies,
      devDependencies,
    }
  }

  private extractFonts(styles: StylesAST): Array<{
    importName: string
    varName: string
    weight?: string[]
  }> {
    const fonts = new Map<string, Set<string>>()

    for (const typo of styles.typography) {
      const fontRule = typo.styles.find(s => s.property === 'font-family')
      const weightRule = typo.styles.find(s => s.property === 'font-weight')

      if (fontRule) {
        const fontName = this.extractFontName(fontRule.value)
        if (fontName) {
          if (!fonts.has(fontName)) {
            fonts.set(fontName, new Set())
          }
          if (weightRule) {
            fonts.get(fontName)!.add(weightRule.value)
          }
        }
      }
    }

    return Array.from(fonts.entries()).map(([name, weights]) => ({
      importName: name.replace(/[\s-]+/g, '_'),
      varName: name.toLowerCase().replace(/[\s-]+/g, ''),
      weight: weights.size > 0 ? Array.from(weights) : undefined,
    }))
  }

  // ============================================
  // Helper Methods
  // ============================================

  private colorPathToName(path: string): string {
    return path
      .replace(/^\//, '')
      .replace(/\//g, '-')
      .replace(/\s+/g, '-')
      .toLowerCase()
  }

  private extractFontName(value: string): string | null {
    // Extract from "'Outfit', sans-serif" or "Outfit"
    const match = value.match(/'([^']+)'/) || value.match(/^(\w+)/)
    if (!match) return null
    
    // Handle font variants like "Inter-Bold" -> "Inter"
    // The weight is handled separately via font-weight CSS property
    const fontName = match[1].split('-')[0]
    return fontName
  }

  private toKebabCase(str: string): string {
    return str
      // Handle sequences of uppercase (acronyms) followed by uppercase+lowercase
      // "CTAButton" -> "CTA-Button" -> "cta-button"
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
      // Handle lowercase followed by uppercase
      // "ctaButton" -> "cta-Button"
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase()
  }
}

/**
 * Create a Next.js scaffolder instance
 */
export function createNextjsScaffolder(config?: Partial<ExportConfig>): NextjsScaffolder {
  return new NextjsScaffolder(config)
}

/**
 * Convenience function to scaffold a project
 */
export function scaffoldNextjsProject(ast: UnframeAST, config?: Partial<ExportConfig>): ScaffoldResult {
  const scaffolder = createNextjsScaffolder(config)
  return scaffolder.scaffold(ast)
}

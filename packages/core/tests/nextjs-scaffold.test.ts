/**
 * Next.js Scaffolder Tests
 */

import { describe, it, expect } from 'vitest'
import { createNextjsScaffolder, scaffoldNextjsProject } from '../src/generator/nextjs-scaffold'
import type { UnframeAST } from '../src/types/ast'

describe('NextjsScaffolder', () => {
  const sampleAST: UnframeAST = {
    type: 'Project',
    metadata: {
      name: 'Test Project',
      productionUrl: 'https://example.com',
      exportedAt: '2024-01-01T00:00:00Z',
    },
    pages: [
      {
        id: 'page-1',
        path: '/',
        name: 'Home',
        breakpoints: {
          desktop: {
            id: 'desktop-1',
            type: 'div',
            name: 'Desktop',
            props: {},
            styles: [
              { property: 'display', value: 'flex' },
              { property: 'flex-direction', value: 'column' },
            ],
            children: [
              {
                id: 'hero-1',
                type: 'h1',
                name: 'Hero',
                props: {},
                styles: [
                  { property: 'font-size', value: '72px' },
                ],
                children: [
                  { type: 'text', content: 'Welcome' },
                ],
              },
            ],
          },
        },
      },
      {
        id: 'page-2',
        path: '/about',
        name: 'About',
        breakpoints: {
          desktop: {
            id: 'desktop-2',
            type: 'div',
            name: 'Desktop',
            props: {},
            styles: [],
            children: [],
          },
        },
      },
    ],
    components: [
      {
        id: 'comp-1',
        name: 'Button',
        originalName: 'Elements/Button',
        props: [
          { name: 'label', type: 'string', defaultValue: 'Click me' },
          { name: 'variant', type: 'enum', enumValues: ['primary', 'secondary'] },
        ],
        variants: [],
        defaultVariant: 'default',
        element: {
          id: 'btn-1',
          type: 'button',
          name: 'Button',
          props: {},
          styles: [
            { property: 'padding', value: '12px 24px' },
            { property: 'border-radius', value: '8px' },
            { property: 'background-color', value: 'rgb(81, 47, 235)' },
          ],
          children: [
            { type: 'text', content: 'Click me' },
          ],
        },
      },
    ],
    styles: {
      colors: [
        {
          name: 'Primary',
          path: '/Brand/Primary',
          light: 'rgb(81, 47, 235)',
          cssVariable: '--color-brand-primary',
        },
        {
          name: 'Background',
          path: '/Background',
          light: 'rgb(0, 0, 0)',
          dark: 'rgb(255, 255, 255)',
          cssVariable: '--color-background',
        },
      ],
      typography: [
        {
          name: 'Heading 1',
          path: '/Heading 1',
          styles: [
            { property: 'font-family', value: "'Outfit', sans-serif" },
            { property: 'font-size', value: '72px' },
            { property: 'font-weight', value: '500' },
            { property: 'line-height', value: '1.1em' },
          ],
          tag: 'h1',
          cssClass: 'text-heading-1',
        },
      ],
      global: [],
    },
    content: [],
    assets: [],
  }

  describe('scaffold', () => {
    it('should generate required directories', () => {
      const result = scaffoldNextjsProject(sampleAST)
      
      expect(result.directories).toContain('app')
      expect(result.directories).toContain('components')
      expect(result.directories).toContain('lib')
      expect(result.directories).toContain('public')
      expect(result.directories).toContain('styles')
    })

    it('should generate package.json', () => {
      const result = scaffoldNextjsProject(sampleAST)
      const pkgFile = result.files.find(f => f.path === 'package.json')
      
      expect(pkgFile).toBeDefined()
      const pkg = JSON.parse(pkgFile!.content)
      
      expect(pkg.name).toBe('test-project')
      expect(pkg.dependencies.next).toBeDefined()
      expect(pkg.dependencies.react).toBeDefined()
      expect(pkg.dependencies['react-dom']).toBeDefined()
      expect(pkg.devDependencies.typescript).toBeDefined()
      expect(pkg.devDependencies.tailwindcss).toBeDefined()
    })

    it('should generate tailwind.config.ts', () => {
      const result = scaffoldNextjsProject(sampleAST)
      const configFile = result.files.find(f => f.path === 'tailwind.config.ts')
      
      expect(configFile).toBeDefined()
      expect(configFile!.content).toContain("'brand-primary':")
      expect(configFile!.content).toContain("'background':")
    })

    it('should generate globals.css with CSS variables', () => {
      const result = scaffoldNextjsProject(sampleAST)
      const cssFile = result.files.find(f => f.path === 'app/globals.css')
      
      expect(cssFile).toBeDefined()
      expect(cssFile!.content).toContain('@tailwind base;')
      expect(cssFile!.content).toContain('@tailwind components;')
      expect(cssFile!.content).toContain('@tailwind utilities;')
      expect(cssFile!.content).toContain('--color-brand-primary: rgb(81, 47, 235);')
      expect(cssFile!.content).toContain('.text-heading-1')
    })

    it('should generate root layout', () => {
      const result = scaffoldNextjsProject(sampleAST)
      const layoutFile = result.files.find(f => f.path === 'app/layout.tsx')
      
      expect(layoutFile).toBeDefined()
      expect(layoutFile!.content).toContain("import type { Metadata }")
      expect(layoutFile!.content).toContain("import './globals.css'")
      expect(layoutFile!.content).toContain('export default function RootLayout')
      expect(layoutFile!.content).toContain('<html lang="en">')
    })

    it('should generate home page', () => {
      const result = scaffoldNextjsProject(sampleAST)
      const pageFile = result.files.find(f => f.path === 'app/page.tsx')
      
      expect(pageFile).toBeDefined()
      expect(pageFile!.content).toContain('export default function HomePage()')
      expect(pageFile!.content).toContain('flex')
      expect(pageFile!.content).toContain('flex-col')
    })

    it('should generate nested route pages', () => {
      const result = scaffoldNextjsProject(sampleAST)
      const aboutFile = result.files.find(f => f.path === 'app/about/page.tsx')
      
      expect(aboutFile).toBeDefined()
      expect(aboutFile!.content).toContain('export default function AboutPage()')
    })

    it('should generate components', () => {
      const result = scaffoldNextjsProject(sampleAST)
      const buttonFile = result.files.find(f => f.path === 'components/button.tsx')
      
      expect(buttonFile).toBeDefined()
      expect(buttonFile!.content).toContain('export function Button')
      expect(buttonFile!.content).toContain('rounded-lg')
    })

    it('should generate utility files', () => {
      const result = scaffoldNextjsProject(sampleAST)
      const utilsFile = result.files.find(f => f.path === 'lib/utils.ts')
      
      expect(utilsFile).toBeDefined()
      expect(utilsFile!.content).toContain("import { clsx")
      expect(utilsFile!.content).toContain("import { twMerge }")
      expect(utilsFile!.content).toContain('export function cn(')
    })

    it('should generate tsconfig.json', () => {
      const result = scaffoldNextjsProject(sampleAST)
      const tsconfigFile = result.files.find(f => f.path === 'tsconfig.json')
      
      expect(tsconfigFile).toBeDefined()
      const config = JSON.parse(tsconfigFile!.content)
      expect(config.compilerOptions.paths['@/*']).toEqual(['./*'])
    })

    it('should generate next.config.mjs', () => {
      const result = scaffoldNextjsProject(sampleAST)
      const nextConfigFile = result.files.find(f => f.path === 'next.config.mjs')
      
      expect(nextConfigFile).toBeDefined()
      expect(nextConfigFile!.content).toContain('images:')
      expect(nextConfigFile!.content).toContain('remotePatterns')
    })

    it('should generate postcss.config.js', () => {
      const result = scaffoldNextjsProject(sampleAST)
      const postcssFile = result.files.find(f => f.path === 'postcss.config.js')
      
      expect(postcssFile).toBeDefined()
      expect(postcssFile!.content).toContain('tailwindcss')
      expect(postcssFile!.content).toContain('autoprefixer')
    })
  })

  describe('configuration options', () => {
    it('should respect code style options', () => {
      const scaffolder = createNextjsScaffolder({
        codeStyle: {
          typescript: true,
          semicolons: true,
          singleQuote: false,
          tabWidth: 4,
        },
      })

      const result = scaffolder.scaffold(sampleAST)
      const layoutFile = result.files.find(f => f.path === 'app/layout.tsx')
      
      expect(layoutFile).toBeDefined()
      // Check for semicolons
      expect(layoutFile!.content).toContain(';')
      // Check for double quotes in imports
      expect(layoutFile!.content).toContain('"next"')
    })

    it('should include framer-motion when animations enabled', () => {
      const result = scaffoldNextjsProject(sampleAST, {
        features: { animations: true, cms: false, responsive: true, darkMode: false },
      })
      
      const pkgFile = result.files.find(f => f.path === 'package.json')
      const pkg = JSON.parse(pkgFile!.content)
      
      expect(pkg.dependencies['framer-motion']).toBeDefined()
    })
  })

  describe('tailwindConfig data', () => {
    it('should extract colors from styles', () => {
      const result = scaffoldNextjsProject(sampleAST)
      
      expect(result.tailwindConfig.colors).toHaveProperty('brand-primary')
      expect(result.tailwindConfig.colors['brand-primary']).toBe('rgb(81, 47, 235)')
    })

    it('should extract fonts from typography', () => {
      const result = scaffoldNextjsProject(sampleAST)
      
      expect(result.tailwindConfig.fontFamily).toHaveProperty('outfit')
      expect(result.tailwindConfig.fontFamily['outfit']).toContain('Outfit')
    })
  })

  describe('dynamic routes', () => {
    it('should handle dynamic route parameters', () => {
      const astWithDynamic: UnframeAST = {
        ...sampleAST,
        pages: [
          ...sampleAST.pages,
          {
            id: 'page-3',
            path: '/blog/:slug',
            name: 'Blog Post',
            breakpoints: {
              desktop: {
                id: 'desktop-3',
                type: 'div',
                name: 'Desktop',
                props: {},
                styles: [],
                children: [],
              },
            },
          },
        ],
      }

      const result = scaffoldNextjsProject(astWithDynamic)
      const blogFile = result.files.find(f => f.path === 'app/blog/[slug]/page.tsx')
      
      expect(blogFile).toBeDefined()
    })
  })
})

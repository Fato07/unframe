/**
 * High-Level Conversion API
 *
 * Provides a simple interface to convert Framer XML to React code.
 */

import { parseProjectXml, parseNodeXml } from './parser/xml-parser.js'
import { createASTBuilder, type ASTBuilderOptions } from './parser/ast-builder.js'
import { createStyleExtractor } from './transformer/style-extractor.js'
import { createReactGenerator, type GeneratorConfig, type GeneratedComponent } from './generator/react-generator.js'
import type { UnframeAST, PageAST, ComponentAST } from './types/ast.js'
import type { FramerProject, FramerNode } from './types/framer.js'

// ============================================
// Types
// ============================================

export interface ConvertOptions {
  /** Project name for metadata */
  projectName?: string
  /** Production URL */
  productionUrl?: string
  /** Staging URL */
  stagingUrl?: string
  /** React generator config */
  generator?: Partial<GeneratorConfig>
}

export interface ConvertedProject {
  /** The internal AST representation */
  ast: UnframeAST
  /** Generated page components */
  pages: GeneratedPageOutput[]
  /** Generated reusable components */
  components: GeneratedComponentOutput[]
  /** Global CSS for color variables and typography */
  globalCss: string
}

export interface GeneratedPageOutput {
  /** Page path (e.g., "/" or "/blog/:slug") */
  path: string
  /** Suggested filename (e.g., "page.tsx" or "[slug]/page.tsx") */
  filename: string
  /** Generated React code */
  code: string
  /** Required imports */
  imports: string
}

export interface GeneratedComponentOutput {
  /** Component name */
  name: string
  /** Original Framer name (e.g., "Navigation/Navbar") */
  originalName: string
  /** Suggested filename (e.g., "navigation-navbar.tsx") */
  filename: string
  /** Generated React code */
  code: string
  /** Required imports */
  imports: string
}

// ============================================
// Main Conversion Function
// ============================================

/**
 * Convert Framer project XML and node XMLs to React code
 *
 * @example
 * ```ts
 * const result = await convert({
 *   projectXml: '<Project>...</Project>',
 *   pageNodes: new Map([
 *     ['pageId', '<Desktop>...</Desktop>']
 *   ]),
 *   options: { projectName: 'MyApp' }
 * })
 *
 * // Write to disk
 * for (const page of result.pages) {
 *   fs.writeFileSync(`app/${page.filename}`, page.imports + '\n\n' + page.code)
 * }
 * ```
 */
export function convert(input: {
  projectXml: string
  pageNodes: Map<string, string>
  componentNodes?: Map<string, string>
  options?: ConvertOptions
}): ConvertedProject {
  const { projectXml, pageNodes, componentNodes = new Map(), options = {} } = input

  // Step 1: Parse project structure
  const project = parseProjectXml(projectXml)

  // Step 2: Parse all node XMLs
  const parsedPageNodes = new Map<string, FramerNode>()
  for (const [nodeId, xml] of pageNodes) {
    try {
      parsedPageNodes.set(nodeId, parseNodeXml(xml))
    } catch (e) {
      console.warn(`Failed to parse page node ${nodeId}:`, e)
    }
  }

  const parsedComponentNodes = new Map<string, FramerNode>()
  for (const [nodeId, xml] of componentNodes) {
    try {
      parsedComponentNodes.set(nodeId, parseNodeXml(xml))
    } catch (e) {
      console.warn(`Failed to parse component node ${nodeId}:`, e)
    }
  }

  // Step 3: Build AST
  const builder = createASTBuilder({
    projectName: options.projectName,
    productionUrl: options.productionUrl,
    stagingUrl: options.stagingUrl,
  })

  const ast = builder.buildProject(project, parsedPageNodes, parsedComponentNodes)

  // Step 4: Initialize style extractor with project colors
  const styleExtractor = createStyleExtractor()
  styleExtractor.initializeFromStyles(ast.styles)

  // Step 5: Create React generator
  const generator = createReactGenerator(options.generator)

  // Step 6: Generate pages
  const pages: GeneratedPageOutput[] = []
  for (const page of ast.pages) {
    const generated = generator.generatePage(page)
    pages.push({
      path: page.path,
      filename: pathToFilename(page.path),
      code: generated.code,
      imports: generator.generateImports(generated.imports),
    })
  }

  // Step 7: Generate components
  const components: GeneratedComponentOutput[] = []
  for (const component of ast.components) {
    const generated = generator.generateComponent(component)
    components.push({
      name: component.name,
      originalName: component.originalName,
      filename: `${toKebabCase(component.name)}.tsx`,
      code: generated.code,
      imports: generator.generateImports(generated.imports),
    })
  }

  // Step 8: Generate global CSS
  const globalCss = generateGlobalCss(ast)

  return {
    ast,
    pages,
    components,
    globalCss,
  }
}

// ============================================
// Simpler Single-Node Conversion
// ============================================

/**
 * Convert a single Framer node XML to React JSX
 *
 * @example
 * ```ts
 * const jsx = convertNode('<Frame width="100px">Hello</Frame>')
 * // Returns: <div className="w-[100px]">Hello</div>
 * ```
 */
export function convertNode(
  nodeXml: string,
  options?: { generator?: Partial<GeneratorConfig> }
): string {
  const node = parseNodeXml(nodeXml)
  const builder = createASTBuilder()
  const element = builder.buildElement(node)
  const generator = createReactGenerator(options?.generator)

  // Generate just the element (depth 0 = no extra indentation)
  return generator.generateElement(element, 0)
}

/**
 * Convert a component node XML to a full React component
 *
 * @example
 * ```ts
 * const { code, imports } = convertComponent(
 *   '<Frame name="Button">Click me</Frame>',
 *   { name: 'Button' }
 * )
 * ```
 */
export function convertComponent(
  nodeXml: string,
  meta: { name: string; originalName?: string },
  options?: { generator?: Partial<GeneratorConfig> }
): GeneratedComponent {
  const node = parseNodeXml(nodeXml)
  const builder = createASTBuilder()
  const element = builder.buildElement(node)

  const componentAst: ComponentAST = {
    id: node.nodeId || 'component',
    name: meta.name,
    originalName: meta.originalName || meta.name,
    props: [],
    variants: [],
    defaultVariant: 'default',
    element,
  }

  const generator = createReactGenerator(options?.generator)
  return generator.generateComponent(componentAst)
}

// ============================================
// Helper Functions
// ============================================

function pathToFilename(path: string): string {
  if (path === '/') {
    return 'page.tsx'
  }

  // Handle dynamic routes like /blog/:slug
  const segments = path.split('/').filter(Boolean)
  const converted = segments.map(s => {
    if (s.startsWith(':')) {
      return `[${s.slice(1)}]`
    }
    return s
  })

  return `${converted.join('/')}/page.tsx`
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase()
}

function generateGlobalCss(ast: UnframeAST): string {
  let css = '/* Generated by Unframe */\n\n'

  // CSS Variables for colors
  css += ':root {\n'
  for (const color of ast.styles.colors) {
    css += `  ${color.cssVariable}: ${color.light};\n`
  }
  css += '}\n\n'

  // Dark mode colors (if any have dark variants)
  const darkColors = ast.styles.colors.filter(c => c.dark)
  if (darkColors.length > 0) {
    css += '.dark {\n'
    for (const color of darkColors) {
      css += `  ${color.cssVariable}: ${color.dark};\n`
    }
    css += '}\n\n'
  }

  // Typography classes
  for (const typo of ast.styles.typography) {
    css += `.${typo.cssClass} {\n`
    for (const rule of typo.styles) {
      css += `  ${rule.property}: ${rule.value};\n`
    }
    css += '}\n\n'
  }

  return css
}

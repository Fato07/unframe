/**
 * React Component Generator
 *
 * Converts Unframe AST to React/JSX code.
 * Generates clean, readable React functional components.
 */

import type {
  ElementAST,
  TextAST,
  ComponentAST,
  PageAST,
  StyleRule,
  PropDefinition,
} from '../types/ast.js'

import {
  StyleExtractor,
  createStyleExtractor,
  classesToString,
  type ExtractedStyles,
} from '../transformer/style-extractor.js'

// ============================================
// Types
// ============================================

export interface GeneratorConfig {
  /** Use TypeScript */
  typescript: boolean
  /** Import style for images */
  imageComponent: 'img' | 'next/image'
  /** Use motion components for animations */
  useMotion: boolean
  /** Indentation (spaces) */
  indent: number
  /** Use single quotes */
  singleQuote: boolean
  /** Add semicolons */
  semicolons: boolean
  /** Generate inline styles for custom values or className only */
  inlineStyles: boolean
}

export interface GeneratedComponent {
  name: string
  code: string
  imports: ImportStatement[]
  props?: PropDefinition[]
}

export interface ImportStatement {
  from: string
  default?: string
  named?: string[]
  type?: boolean
}

const defaultConfig: GeneratorConfig = {
  typescript: true,
  imageComponent: 'next/image',
  useMotion: true,
  indent: 2,
  singleQuote: true,
  semicolons: false,
  inlineStyles: false,
}

// ============================================
// React Generator
// ============================================

export class ReactGenerator {
  private config: GeneratorConfig
  private styleExtractor: StyleExtractor
  private usedComponents: Set<string> = new Set()
  private usedMotion: boolean = false

  constructor(config: Partial<GeneratorConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
    this.styleExtractor = createStyleExtractor()
  }

  /**
   * Generate a React component from AST element
   */
  generateComponent(ast: ComponentAST): GeneratedComponent {
    this.usedComponents.clear()
    this.usedMotion = false

    const propsInterface = this.generatePropsInterface(ast.props)
    const componentBody = this.generateElement(ast.element, 1)
    
    const imports = this.collectImports()
    const q = this.config.singleQuote ? "'" : '"'
    const semi = this.config.semicolons ? ';' : ''

    let code = ''

    // Props interface
    if (this.config.typescript && ast.props.length > 0) {
      code += propsInterface + '\n\n'
    }

    // Component function
    const propsType = this.config.typescript && ast.props.length > 0
      ? `: ${ast.name}Props`
      : ''
    
    const propsArg = ast.props.length > 0
      ? `{ ${ast.props.map(p => p.name).join(', ')} }${propsType}`
      : ''

    code += `export function ${ast.name}(${propsArg}) {\n`
    code += `  return (\n`
    code += componentBody
    code += `  )${semi}\n`
    code += `}${semi}\n`

    return {
      name: ast.name,
      code,
      imports,
      props: ast.props,
    }
  }

  /**
   * Generate a page component from AST
   */
  generatePage(page: PageAST): GeneratedComponent {
    this.usedComponents.clear()
    this.usedMotion = false

    const pageName = this.pageNameToComponentName(page.name)
    const componentBody = this.generateElement(page.breakpoints.desktop, 1)
    
    const imports = this.collectImports()
    const semi = this.config.semicolons ? ';' : ''

    let code = ''
    code += `export default function ${pageName}() {\n`
    code += `  return (\n`
    code += componentBody
    code += `  )${semi}\n`
    code += `}${semi}\n`

    return {
      name: pageName,
      code,
      imports,
    }
  }

  /**
   * Generate JSX for an element
   */
  generateElement(element: ElementAST, depth: number): string {
    const indent = this.getIndent(depth)
    const childIndent = this.getIndent(depth + 1)

    // Handle component instances
    if (element.type === 'component' && element.componentRef) {
      return this.generateComponentInstance(element, depth)
    }

    const tag = this.getHtmlTag(element)
    const attrs = this.generateAttributes(element, depth)
    const children = this.generateChildren(element.children, depth + 1)

    // Self-closing tags
    if (element.children.length === 0 && this.isSelfClosing(tag)) {
      return `${indent}<${tag}${attrs} />\n`
    }

    // Single text child - inline it
    if (element.children.length === 1 && element.children[0].type === 'text') {
      const text = (element.children[0] as TextAST).content
      if (text.length < 60 && !text.includes('\n')) {
        return `${indent}<${tag}${attrs}>${this.escapeJsx(text)}</${tag}>\n`
      }
    }

    // Multi-line element
    let result = `${indent}<${tag}${attrs}>\n`
    result += children
    result += `${indent}</${tag}>\n`

    return result
  }

  /**
   * Generate a component instance
   */
  private generateComponentInstance(element: ElementAST, depth: number): string {
    const indent = this.getIndent(depth)
    
    // Extract component name from ref or element name
    // Use element.name as component name (e.g., "NavigationNavbar")
    // If it's just an ID, convert to a valid component name
    let componentName = element.name || element.componentRef!.split('/').pop() || 'Component'
    
    // Ensure component name starts with uppercase (JSX requirement)
    componentName = this.toComponentName(componentName)
    this.usedComponents.add(componentName)

    const props = element.componentProps || {}
    const propsString = this.generatePropsString(props)

    if (element.children.length === 0) {
      return `${indent}<${componentName}${propsString} />\n`
    }

    const children = this.generateChildren(element.children, depth + 1)
    return `${indent}<${componentName}${propsString}>\n${children}${indent}</${componentName}>\n`
  }

  /**
   * Generate attributes for an element
   */
  private generateAttributes(element: ElementAST, depth: number): string {
    const attrs: string[] = []
    const indent = this.getIndent(depth)
    const attrIndent = this.getIndent(depth + 1)

    // Extract Tailwind classes
    const extracted = this.styleExtractor.extract(element.styles)
    let className = classesToString(extracted)

    // Add responsive styles
    if (element.responsiveStyles?.tablet) {
      const tabletExtracted = this.styleExtractor.extract(element.responsiveStyles.tablet)
      const tabletClasses = tabletExtracted.classes.map(c => `md:${c.class}`).join(' ')
      if (tabletClasses) className += ` ${tabletClasses}`
    }

    if (element.responsiveStyles?.mobile) {
      const mobileExtracted = this.styleExtractor.extract(element.responsiveStyles.mobile)
      const mobileClasses = mobileExtracted.classes.map(c => `sm:${c.class}`).join(' ')
      if (mobileClasses) className += ` ${mobileClasses}`
    }

    if (className.trim()) {
      attrs.push(`className="${className.trim()}"`)
    }

    // Handle custom inline styles for arbitrary values not in Tailwind
    if (this.config.inlineStyles && extracted.customProperties.size > 0) {
      const styleObj = Array.from(extracted.customProperties.entries())
        .map(([key, value]) => `${this.toCamelCase(key)}: '${value}'`)
        .join(', ')
      attrs.push(`style={{ ${styleObj} }}`)
    }

    // Standard HTML props
    if (element.props.href) {
      attrs.push(`href="${element.props.href}"`)
      if (element.props.target) {
        attrs.push(`target="${element.props.target}"`)
        attrs.push(`rel="noopener noreferrer"`)
      }
    }

    // Image handling
    if (element.type === 'img') {
      const src = element.props.src as string
      if (src) {
        if (this.config.imageComponent === 'next/image') {
          attrs.push(`src="${src}"`)
          attrs.push('alt=""')
          attrs.push('fill')
        } else {
          attrs.push(`src="${src}"`)
          attrs.push('alt=""')
        }
      }
    }

    // Animation props
    if (element.animation && this.config.useMotion) {
      this.usedMotion = true
      const motionProps = this.generateMotionProps(element.animation)
      attrs.push(...motionProps)
    }

    // Format attributes
    if (attrs.length === 0) return ''
    if (attrs.length === 1) return ` ${attrs[0]}`
    if (attrs.join(' ').length < 80) return ` ${attrs.join(' ')}`

    // Multi-line attributes
    return `\n${attrs.map(a => `${attrIndent}${a}`).join('\n')}\n${indent}`
  }

  /**
   * Generate children elements
   */
  private generateChildren(children: (ElementAST | TextAST)[], depth: number): string {
    let result = ''
    
    for (const child of children) {
      if (child.type === 'text') {
        const text = (child as TextAST).content
        const indent = this.getIndent(depth)
        result += `${indent}${this.escapeJsx(text)}\n`
      } else {
        result += this.generateElement(child as ElementAST, depth)
      }
    }

    return result
  }

  /**
   * Generate props interface for TypeScript
   */
  private generatePropsInterface(props: PropDefinition[]): string {
    if (props.length === 0) return ''

    const semi = this.config.semicolons ? ';' : ''
    let result = 'interface Props {\n'

    for (const prop of props) {
      const optional = prop.defaultValue !== undefined ? '?' : ''
      const type = this.propTypeToTS(prop.type, prop.enumValues)
      result += `  ${prop.name}${optional}: ${type}${semi}\n`
    }

    result += '}'
    return result
  }

  /**
   * Generate motion component props
   */
  private generateMotionProps(animation: ElementAST['animation']): string[] {
    if (!animation) return []

    const props: string[] = []

    if (animation.initial) {
      props.push(`initial={${JSON.stringify(animation.initial)}}`)
    }
    if (animation.animate) {
      props.push(`animate={${JSON.stringify(animation.animate)}}`)
    }
    if (animation.exit) {
      props.push(`exit={${JSON.stringify(animation.exit)}}`)
    }
    if (animation.whileHover) {
      props.push(`whileHover={${JSON.stringify(animation.whileHover)}}`)
    }
    if (animation.whileTap) {
      props.push(`whileTap={${JSON.stringify(animation.whileTap)}}`)
    }
    if (animation.whileInView) {
      props.push(`whileInView={${JSON.stringify(animation.whileInView)}}`)
    }
    if (animation.transition) {
      props.push(`transition={${JSON.stringify(animation.transition)}}`)
    }

    return props
  }

  /**
   * Generate props string for component instances
   */
  private generatePropsString(props: Record<string, unknown>): string {
    const entries = Object.entries(props)
    if (entries.length === 0) return ''

    const propsArr = entries.map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}="${value}"`
      }
      if (typeof value === 'boolean') {
        return value ? key : `${key}={false}`
      }
      return `${key}={${JSON.stringify(value)}}`
    })

    if (propsArr.join(' ').length < 60) {
      return ' ' + propsArr.join(' ')
    }

    return '\n  ' + propsArr.join('\n  ') + '\n'
  }

  /**
   * Collect required imports
   */
  private collectImports(): ImportStatement[] {
    const imports: ImportStatement[] = []

    // React import (needed for JSX)
    // In Next.js 13+, not strictly required but good for clarity
    
    // Next.js Image
    if (this.config.imageComponent === 'next/image') {
      imports.push({
        from: 'next/image',
        default: 'Image',
      })
    }

    // Motion
    if (this.usedMotion && this.config.useMotion) {
      imports.push({
        from: 'framer-motion',
        named: ['motion'],
      })
    }

    // Component imports
    for (const comp of this.usedComponents) {
      imports.push({
        from: `@/components/${this.toKebabCase(comp)}`,
        named: [comp],
      })
    }

    return imports
  }

  /**
   * Generate import statements as code
   */
  generateImports(imports: ImportStatement[]): string {
    const q = this.config.singleQuote ? "'" : '"'
    const semi = this.config.semicolons ? ';' : ''

    return imports
      .map(imp => {
        if (imp.default && imp.named?.length) {
          return `import ${imp.default}, { ${imp.named.join(', ')} } from ${q}${imp.from}${q}${semi}`
        }
        if (imp.default) {
          return `import ${imp.default} from ${q}${imp.from}${q}${semi}`
        }
        if (imp.named?.length) {
          const typePrefix = imp.type ? 'type ' : ''
          return `import { ${typePrefix}${imp.named.join(', ')} } from ${q}${imp.from}${q}${semi}`
        }
        return `import ${q}${imp.from}${q}${semi}`
      })
      .join('\n')
  }

  /**
   * Generate a complete file with imports and component
   */
  generateFile(component: GeneratedComponent): string {
    const importCode = this.generateImports(component.imports)
    
    let file = ''
    if (importCode) {
      file += importCode + '\n\n'
    }
    file += component.code

    return file
  }

  // ============================================
  // Helper Methods
  // ============================================

  private getHtmlTag(element: ElementAST): string {
    // Check for motion wrapper
    if (element.animation && this.config.useMotion) {
      this.usedMotion = true
      return `motion.${element.type === 'component' ? 'div' : element.type}`
    }

    // If element has href, it should be an <a> tag regardless of original type
    if (element.props.href) {
      return 'a'
    }

    switch (element.type) {
      case 'div':
      case 'span':
      case 'p':
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
      case 'a':
      case 'button':
        return element.type

      case 'img':
        return this.config.imageComponent === 'next/image' ? 'Image' : 'img'

      case 'svg':
        return 'svg'

      case 'slot':
        return 'div' // Slots become divs with children

      default:
        return 'div'
    }
  }

  private isSelfClosing(tag: string): boolean {
    return ['img', 'Image', 'br', 'hr', 'input', 'meta', 'link'].includes(tag)
  }

  private getIndent(depth: number): string {
    return ' '.repeat(depth * this.config.indent)
  }

  private escapeJsx(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/{/g, '&#123;')
      .replace(/}/g, '&#125;')
  }

  private propTypeToTS(type: PropDefinition['type'], enumValues?: string[]): string {
    switch (type) {
      case 'string':
        return 'string'
      case 'number':
        return 'number'
      case 'boolean':
        return 'boolean'
      case 'enum':
        return enumValues?.map(v => `'${v}'`).join(' | ') || 'string'
      case 'node':
        return 'React.ReactNode'
      default:
        return 'unknown'
    }
  }

  private toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
  }

  private toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase()
  }

  private pageNameToComponentName(name: string): string {
    // "Blog Post" -> "BlogPostPage"
    // "404" -> "Page404" (numbers can't start function names)
    let result = name
      .split(/[\s-]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('') + 'Page'
    
    // If name starts with a number, prefix with "Page"
    if (/^\d/.test(result)) {
      result = 'Page' + result
    }
    
    return result
  }

  private toComponentName(name: string): string {
    // Ensure component name is valid JSX (starts with uppercase letter)
    // "NavigationNavbar" -> "NavigationNavbar"
    // "vTxPF9bF_" -> "VTxPF9bF_"
    // "elements/badge" -> "ElementsBadge"
    // "404Button" -> "Component404Button" (numbers can't start identifiers)
    let cleaned = name
      .replace(/\//g, '')
      .replace(/[\s-]+/g, '')
    
    // Ensure first character is uppercase
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
    
    // If still starts with a number, prefix with "Component"
    if (/^\d/.test(cleaned)) {
      cleaned = 'Component' + cleaned
    }
    
    return cleaned
  }
}

/**
 * Create a React generator instance
 */
export function createReactGenerator(config?: Partial<GeneratorConfig>): ReactGenerator {
  return new ReactGenerator(config)
}

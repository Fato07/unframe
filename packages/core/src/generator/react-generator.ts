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
  extractElementResponsiveClasses,
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
  /** Map from componentRef (ID) to component name - used for resolving imports */
  componentNameMap?: Map<string, string>
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
    
    // Look up actual component name from componentRef if available
    // This ensures import paths match the actual component file names
    let componentName: string
    if (element.componentRef && this.config.componentNameMap?.has(element.componentRef)) {
      componentName = this.config.componentNameMap.get(element.componentRef)!
    } else {
      // Fallback: use element.name or componentRef
      componentName = element.name || element.componentRef!.split('/').pop() || 'Component'
    }
    
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

    // Extract Tailwind classes with responsive support
    // Uses mobile-first approach: base → md: → lg:
    let className: string
    let extracted: ExtractedStyles | undefined
    
    if (element.responsiveStyles?.tablet || element.responsiveStyles?.mobile) {
      // Has responsive overrides - use the smart responsive extractor
      className = extractElementResponsiveClasses(
        this.styleExtractor,
        element.styles,
        element.responsiveStyles
      )
      // Also extract for custom properties (inline styles)
      if (this.config.inlineStyles) {
        extracted = this.styleExtractor.extract(element.styles)
      }
    } else {
      // Desktop only - use standard extraction
      extracted = this.styleExtractor.extract(element.styles)
      className = classesToString(extracted)
    }

    if (className.trim()) {
      attrs.push(`className="${className.trim()}"`)
    }

    // Handle custom inline styles for arbitrary values not in Tailwind
    if (this.config.inlineStyles && extracted && extracted.customProperties.size > 0) {
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
   * Infers semantic prop names from Framer's random IDs based on value patterns
   */
  private generatePropsString(props: Record<string, unknown>): string {
    const entries = Object.entries(props)
    if (entries.length === 0) return ''

    // Track used prop names to avoid duplicates
    const usedNames = new Set<string>()
    
    const propsArr = entries.map(([key, value]) => {
      // Infer semantic name from value if key looks like a Framer ID
      const semanticKey = this.inferPropName(key, value, usedNames)
      usedNames.add(semanticKey)

      if (typeof value === 'string') {
        return `${semanticKey}="${value}"`
      }
      if (typeof value === 'boolean') {
        return value ? semanticKey : `${semanticKey}={false}`
      }
      return `${semanticKey}={${JSON.stringify(value)}}`
    })

    if (propsArr.join(' ').length < 60) {
      return ' ' + propsArr.join(' ')
    }

    return '\n  ' + propsArr.join('\n  ') + '\n'
  }

  /**
   * Infer a semantic prop name from value patterns
   * Converts Framer's random IDs (e.g., "OLBJJ2ZZ2") to meaningful names
   */
  private inferPropName(key: string, value: unknown, usedNames: Set<string>): string {
    // Check if this looks like a Framer random ID
    // Framer IDs have patterns like: OLBJJ2ZZ2, sVlsQOR6K, t90xdY6CE, NAbd17i0q
    // They typically have:
    // - Numbers mixed in the middle (not just at the end)
    // - Unusual uppercase/lowercase patterns (not proper camelCase)
    // - Length 7-12 characters
    
    // First, check if it's a common/semantic prop name we should keep
    const semanticProps = new Set([
      'text', 'label', 'title', 'content', 'children', 'name', 'value',
      'color', 'backgroundColor', 'textColor', 'bgColor', 'fill', 'stroke',
      'size', 'width', 'height', 'padding', 'margin', 'gap', 'fontSize',
      'href', 'link', 'url', 'src', 'alt',
      'disabled', 'enabled', 'active', 'visible', 'hidden', 'selected',
      'variant', 'type', 'kind', 'style', 'className',
      'onClick', 'onPress', 'onHover', 'onChange',
      'id', 'key', 'ref',
    ])
    
    if (semanticProps.has(key)) {
      return key
    }

    // Check if it's a valid camelCase name without numbers mixed in
    // e.g., "buttonText" is semantic, but "t90xdY6CE" is a Framer ID
    const isValidCamelCase = /^[a-z]+[a-zA-Z]*$/.test(key) && key.length >= 4
    if (isValidCamelCase) {
      return key
    }

    // Detect Framer-style random IDs
    // - Has numbers in the middle (not just trailing)
    // - Mix of upper and lowercase in non-camelCase pattern
    // - Contains underscores in weird places
    const hasMiddleNumbers = /[a-zA-Z]\d+[a-zA-Z]/.test(key)
    const hasWeirdCasing = /[a-z][A-Z][a-z]/.test(key) && /[A-Z][a-z][A-Z]/.test(key)
    const hasTrailingUnderscore = /_$/.test(key)
    const isAllCapsWithNumbers = /^[A-Z0-9]+$/.test(key) && /\d/.test(key)
    
    const isFramerId = hasMiddleNumbers || hasWeirdCasing || hasTrailingUnderscore || isAllCapsWithNumbers

    if (!isFramerId) {
      return key
    }

    // Infer name from value type/content
    let inferredName: string | null = null

    if (typeof value === 'string') {
      const strValue = value.toLowerCase()
      
      // Color patterns
      if (/^rgb\(/.test(value) || /^rgba\(/.test(value) || /^#[0-9a-f]{3,8}$/i.test(value)) {
        // Try to infer specific color role from value
        if (strValue.includes('255') && strValue.includes('255') && strValue.includes('255')) {
          inferredName = this.getUniqueName('textColor', usedNames) || 
                         this.getUniqueName('color', usedNames)
        } else if (strValue === 'rgb(0,0,0)' || strValue === 'rgb(0, 0, 0)' || value === '#000' || value === '#000000') {
          inferredName = this.getUniqueName('backgroundColor', usedNames) ||
                         this.getUniqueName('bgColor', usedNames) ||
                         this.getUniqueName('color', usedNames)
        } else {
          inferredName = this.getUniqueName('color', usedNames) ||
                         this.getUniqueName('accentColor', usedNames) ||
                         this.getUniqueName('primaryColor', usedNames)
        }
      }
      // URL patterns
      else if (/^(https?:\/\/|\/|#)/.test(value)) {
        inferredName = this.getUniqueName('href', usedNames) ||
                       this.getUniqueName('link', usedNames) ||
                       this.getUniqueName('url', usedNames)
      }
      // Text content (fallback for strings)
      else {
        inferredName = this.getUniqueName('text', usedNames) ||
                       this.getUniqueName('label', usedNames) ||
                       this.getUniqueName('title', usedNames) ||
                       this.getUniqueName('content', usedNames)
      }
    }
    else if (typeof value === 'number') {
      // Infer from value range
      if (value >= 0 && value <= 1) {
        inferredName = this.getUniqueName('opacity', usedNames) ||
                       this.getUniqueName('alpha', usedNames)
      } else if (value > 1 && value <= 100) {
        inferredName = this.getUniqueName('size', usedNames) ||
                       this.getUniqueName('fontSize', usedNames) ||
                       this.getUniqueName('width', usedNames)
      } else {
        inferredName = this.getUniqueName('value', usedNames) ||
                       this.getUniqueName('size', usedNames) ||
                       this.getUniqueName('amount', usedNames)
      }
    }
    else if (typeof value === 'boolean') {
      inferredName = this.getUniqueName('enabled', usedNames) ||
                     this.getUniqueName('active', usedNames) ||
                     this.getUniqueName('visible', usedNames) ||
                     this.getUniqueName('show', usedNames)
    }

    return inferredName || key
  }

  /**
   * Get a unique prop name, returning null if already used
   */
  private getUniqueName(name: string, usedNames: Set<string>): string | null {
    if (!usedNames.has(name)) {
      return name
    }
    // Try numbered variants
    for (let i = 2; i <= 5; i++) {
      const numbered = `${name}${i}`
      if (!usedNames.has(numbered)) {
        return numbered
      }
    }
    return null
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
      // Handle sequences of uppercase (acronyms) followed by uppercase+lowercase
      // "CTAButton" -> "CTA-Button" -> "cta-button"
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
      // Handle lowercase followed by uppercase
      // "ctaButton" -> "cta-Button"
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

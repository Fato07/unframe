/**
 * AST Builder
 *
 * Converts parsed Framer XML structures into Unframe AST.
 */

import type {
  FramerProject,
  FramerNode,
  FramerNodeAttributes,
  FramerColorStyle,
  FramerTextStyle,
  FramerCMSCollection,
  FramerCMSItem,
} from '../types/framer.js'

import type {
  UnframeAST,
  ProjectMetadata,
  PageAST,
  ComponentAST,
  ElementAST,
  TextAST,
  ElementType,
  StylesAST,
  ColorStyleAST,
  TypographyStyleAST,
  StyleRule,
  ContentAST,
  ContentFieldAST,
  PropDefinition,
  VariantAST,
  AssetAST,
} from '../types/ast.js'

import { parseColorValue, parseFontValue } from './xml-parser.js'

// ============================================
// AST Builder
// ============================================

export interface ASTBuilderOptions {
  /** Project name */
  projectName?: string
  /** Production URL */
  productionUrl?: string
  /** Staging URL */
  stagingUrl?: string
}

export class ASTBuilder {
  private options: ASTBuilderOptions
  private assets: Map<string, AssetAST> = new Map()
  private assetCounter = 0

  constructor(options: ASTBuilderOptions = {}) {
    this.options = options
  }

  /**
   * Build complete AST from Framer project
   */
  buildProject(
    project: FramerProject,
    pageNodes: Map<string, FramerNode>,
    componentNodes: Map<string, FramerNode>,
    cmsCollections?: FramerCMSCollection[],
    cmsItems?: Map<string, FramerCMSItem[]>
  ): UnframeAST {
    // Build styles first (needed for element processing)
    const styles = this.buildStyles(project.colorStyles, project.textStyles)

    // Build pages
    const pages = project.pages.map((page) => {
      const node = pageNodes.get(page.nodeId)
      if (!node) {
        console.warn(`Page node not found: ${page.nodeId}`)
        return null
      }
      return this.buildPage(page.path, node, cmsCollections)
    }).filter((p): p is PageAST => p !== null)

    // Build components
    const components = project.components.map((comp) => {
      const node = componentNodes.get(comp.nodeId)
      if (!node) {
        console.warn(`Component node not found: ${comp.nodeId}`)
        return null
      }
      return this.buildComponent(comp.nodeId, comp.name, node)
    }).filter((c): c is ComponentAST => c !== null)

    // Build content from CMS
    const content: ContentAST[] = []
    if (cmsCollections && cmsItems) {
      for (const collection of cmsCollections) {
        const items = cmsItems.get(collection.id) || []
        for (const item of items) {
          content.push(this.buildContent(collection, item))
        }
      }
    }

    return {
      type: 'Project',
      metadata: {
        name: this.options.projectName || 'Untitled',
        productionUrl: this.options.productionUrl,
        stagingUrl: this.options.stagingUrl,
        exportedAt: new Date().toISOString(),
      },
      pages,
      components,
      styles,
      content,
      assets: Array.from(this.assets.values()),
    }
  }

  /**
   * Build page AST from Framer node
   */
  buildPage(
    path: string,
    node: FramerNode,
    cmsCollections?: FramerCMSCollection[]
  ): PageAST {
    // Find breakpoint containers (Desktop, Tablet, Mobile)
    const breakpoints = this.extractBreakpoints(node)

    // Check if this is a CMS dynamic route
    let cmsCollection: string | undefined
    if (path.includes(':slug') && cmsCollections) {
      // Find collection that matches the route
      const basePath = path.split('/')[1]
      for (const collection of cmsCollections) {
        if (collection.name.toLowerCase() === basePath) {
          cmsCollection = collection.id
          break
        }
      }
    }

    return {
      id: node.nodeId,
      path,
      name: this.pathToName(path),
      breakpoints,
      cmsCollection,
    }
  }

  /**
   * Build component AST from Framer node
   */
  buildComponent(
    id: string,
    name: string,
    node: FramerNode
  ): ComponentAST {
    // Extract props from component controls
    const props = this.extractComponentProps(node)
    
    // Build element tree
    const element = this.buildElement(node)

    return {
      id,
      name: this.componentNameToIdentifier(name),
      originalName: name,
      props,
      variants: [], // TODO: Extract variants from component
      defaultVariant: 'default',
      element,
    }
  }

  /**
   * Build element AST from Framer node
   * @param node The Framer node to convert
   * @param parentLayout The layout type of the parent element (stack, grid, or none)
   */
  buildElement(node: FramerNode, parentLayout: 'stack' | 'grid' | 'none' = 'none'): ElementAST {
    const elementType = this.inferElementType(node)
    
    // Determine current element's layout type for passing to children
    const currentLayout = this.getLayoutType(node.attributes)
    
    // Extract styles, passing parent layout context to skip absolute positioning for flex/grid children
    const styles = this.extractStyles(node.attributes, parentLayout)
    
    // Process children
    const children: (ElementAST | TextAST)[] = []
    
    // Check for text content
    const textContent = (node as FramerNode & { textContent?: string }).textContent
    if (textContent) {
      children.push({
        type: 'text',
        content: textContent,
      })
    }

    // Process child nodes - pass current layout type so children know their parent's layout
    for (const child of node.children) {
      children.push(this.buildElement(child, currentLayout))
    }

    const element: ElementAST = {
      id: node.nodeId,
      type: elementType,
      name: node.name,
      props: this.extractProps(node.attributes),
      styles,
      children,
      parentLayout, // Store parent layout for reference
    }

    // Add component reference if this is a component instance
    if (node.type === 'ComponentInstance' && node.attributes.componentId) {
      element.componentRef = node.attributes.componentId as string
      element.componentProps = this.extractComponentInstanceProps(node.attributes)
    }

    // Extract responsive styles if present
    const responsiveStyles = this.extractResponsiveStyles(node)
    if (Object.keys(responsiveStyles).length > 0) {
      element.responsiveStyles = responsiveStyles
    }

    return element
  }

  /**
   * Determine the layout type of an element from its attributes
   */
  private getLayoutType(attrs: FramerNodeAttributes): 'stack' | 'grid' | 'none' {
    if (attrs.layout === 'stack') {
      return 'stack'
    }
    if (attrs.layout === 'grid') {
      return 'grid'
    }
    return 'none'
  }

  /**
   * Build styles AST from color and text styles
   */
  buildStyles(
    colorStyles: FramerColorStyle[],
    textStyles: FramerTextStyle[]
  ): StylesAST {
    return {
      colors: colorStyles.map((style) => this.buildColorStyle(style)),
      typography: textStyles.map((style) => this.buildTypographyStyle(style)),
      global: [],
    }
  }

  /**
   * Build content AST from CMS item
   */
  buildContent(
    collection: FramerCMSCollection,
    item: FramerCMSItem
  ): ContentAST {
    const fields: Record<string, ContentFieldAST> = {}

    for (const field of collection.fields) {
      const fieldValue = item.fieldData[field.id]
      if (fieldValue) {
        fields[field.name] = {
          name: field.name,
          type: this.cmsFieldTypeToContentType(field.type),
          value: fieldValue.value,
        }
      }
    }

    return {
      collection: collection.name,
      slug: item.slug,
      fields,
    }
  }

  // ============================================
  // Private Helper Methods
  // ============================================

  private extractBreakpoints(node: FramerNode): PageAST['breakpoints'] {
    const breakpoints: PageAST['breakpoints'] = {
      desktop: this.buildElement(node),
    }

    // Look for Desktop, Tablet, Mobile children
    for (const child of node.children) {
      if (child.type === 'Desktop' || child.name === 'Desktop') {
        breakpoints.desktop = this.buildElement(child)
      } else if (child.type === 'Tablet' || child.name === 'Tablet') {
        breakpoints.tablet = this.buildElement(child)
      } else if (child.type === 'Mobile' || child.name === 'Mobile') {
        breakpoints.mobile = this.buildElement(child)
      }
    }

    return breakpoints
  }

  private inferElementType(node: FramerNode): ElementType {
    switch (node.type) {
      case 'Text':
        // Infer heading level from text style
        const textStyle = node.attributes.inlineTextStyle as string | undefined
        if (textStyle) {
          const match = textStyle.match(/\/Heading\s*(\d)?/i)
          if (match) {
            const level = match[1] || '2'
            return `h${level}` as ElementType
          }
        }
        return 'p'
      
      case 'Image':
        return 'img'
      
      case 'SVG':
        return 'svg'
      
      case 'ComponentInstance':
        return 'component'
      
      case 'Frame':
      case 'Stack':
      case 'Desktop':
      case 'Tablet':
      case 'Mobile':
        // Check if it's a link
        if (node.attributes.link) {
          return 'a'
        }
        return 'div'
      
      default:
        return 'div'
    }
  }

  private extractStyles(attrs: FramerNodeAttributes, parentLayout: 'stack' | 'grid' | 'none' = 'none'): StyleRule[] {
    const styles: StyleRule[] = []

    // Determine if this element is a child of a flex/grid container
    // Children of stack (flex) or grid containers should NOT have absolute positioning
    // because their layout is controlled by the parent's flex/grid system
    const isFlexOrGridChild = parentLayout === 'stack' || parentLayout === 'grid'

    // Position - only add if NOT a flex/grid child, or if explicitly set to something other than absolute
    if (attrs.position && attrs.position !== 'relative') {
      // Skip absolute positioning for flex/grid children
      if (!(isFlexOrGridChild && attrs.position === 'absolute')) {
        styles.push({ property: 'position', value: attrs.position as string })
      }
    }

    // Size
    if (attrs.width) {
      styles.push({ property: 'width', value: attrs.width as string })
    }
    if (attrs.height) {
      styles.push({ property: 'height', value: attrs.height as string })
    }
    if (attrs.minWidth) {
      styles.push({ property: 'min-width', value: attrs.minWidth as string })
    }
    if (attrs.maxWidth) {
      styles.push({ property: 'max-width', value: attrs.maxWidth as string })
    }

    // Positioning (absolute/fixed) - SKIP for flex/grid children
    // These properties only make sense for absolutely/fixed positioned elements
    // Flex/grid children are positioned by the parent's layout system
    if (!isFlexOrGridChild) {
      if (attrs.top !== undefined) {
        styles.push({ property: 'top', value: attrs.top as string })
      }
      if (attrs.right !== undefined) {
        styles.push({ property: 'right', value: attrs.right as string })
      }
      if (attrs.bottom !== undefined) {
        styles.push({ property: 'bottom', value: attrs.bottom as string })
      }
      if (attrs.left !== undefined) {
        styles.push({ property: 'left', value: attrs.left as string })
      }
    }

    // Visual
    if (attrs.opacity !== undefined && attrs.opacity !== 1) {
      styles.push({ property: 'opacity', value: String(attrs.opacity) })
    }
    if (attrs.backgroundColor) {
      const color = parseColorValue(attrs.backgroundColor as string)
      if (color.type === 'style') {
        styles.push({ property: 'background-color', value: `var(--color${color.value.replace(/\//g, '-').replace(/\s+/g, '-').toLowerCase()})` })
      } else {
        styles.push({ property: 'background-color', value: color.value })
      }
    }
    if (attrs.borderRadius) {
      styles.push({ property: 'border-radius', value: attrs.borderRadius as string })
    }

    // Layout
    if (attrs.layout === 'stack') {
      styles.push({ property: 'display', value: 'flex' })
      styles.push({ 
        property: 'flex-direction', 
        value: attrs.stackDirection === 'horizontal' ? 'row' : 'column' 
      })
      
      if (attrs.gap) {
        styles.push({ property: 'gap', value: attrs.gap as string })
      }
      
      // Stack distribution -> justify-content
      if (attrs.stackDistribution) {
        const justifyMap: Record<string, string> = {
          'start': 'flex-start',
          'center': 'center',
          'end': 'flex-end',
          'space-between': 'space-between',
          'space-around': 'space-around',
          'space-evenly': 'space-evenly',
        }
        styles.push({ 
          property: 'justify-content', 
          value: justifyMap[attrs.stackDistribution as string] || 'flex-start'
        })
      }

      // Stack alignment -> align-items
      if (attrs.stackAlignment) {
        const alignMap: Record<string, string> = {
          'start': 'flex-start',
          'center': 'center',
          'end': 'flex-end',
        }
        styles.push({ 
          property: 'align-items', 
          value: alignMap[attrs.stackAlignment as string] || 'stretch'
        })
      }

      if (attrs.stackWrap) {
        styles.push({ property: 'flex-wrap', value: 'wrap' })
      }
    }

    if (attrs.layout === 'grid') {
      styles.push({ property: 'display', value: 'grid' })
      
      if (attrs.gridColumns) {
        const cols = attrs.gridColumns === 'auto-fill' 
          ? `repeat(auto-fill, minmax(${attrs.gridColumnMinWidth || attrs.gridColumnWidth || 200}px, 1fr))`
          : `repeat(${attrs.gridColumns}, 1fr)`
        styles.push({ property: 'grid-template-columns', value: cols })
      }

      if (attrs.gap) {
        styles.push({ property: 'gap', value: attrs.gap as string })
      }
    }

    // Padding
    if (attrs.padding) {
      styles.push({ property: 'padding', value: attrs.padding as string })
    }

    return styles
  }

  private extractProps(attrs: FramerNodeAttributes): Record<string, unknown> {
    const props: Record<string, unknown> = {}

    // Link props
    if (attrs.link) {
      props.href = attrs.link
      if (attrs.linkOpenInNewTab) {
        props.target = '_blank'
        props.rel = 'noopener noreferrer'
      }
    }

    // Image props
    if (attrs.backgroundImage) {
      props.src = attrs.backgroundImage
      this.trackAsset(attrs.backgroundImage as string, 'image')
    }

    return props
  }

  private extractComponentProps(node: FramerNode): PropDefinition[] {
    // Component props are extracted from the node's custom attributes
    // In a full implementation, we would analyze the component definition
    return []
  }

  private extractComponentInstanceProps(attrs: FramerNodeAttributes): Record<string, unknown> {
    const props: Record<string, unknown> = {}
    
    // All non-standard attributes are component props
    const standardAttrs = [
      'nodeId', 'componentId', 'position', 'width', 'height',
      'top', 'right', 'bottom', 'left', 'centerX', 'centerY',
      'opacity', 'visible', 'locked', 'rotation',
      'variant'
    ]

    for (const [key, value] of Object.entries(attrs)) {
      if (!standardAttrs.includes(key)) {
        props[key] = value
      }
    }

    return props
  }

  private extractResponsiveStyles(node: FramerNode): { tablet?: StyleRule[]; mobile?: StyleRule[] } {
    // TODO: Extract responsive styles from breakpoint nodes
    return {}
  }

  private buildColorStyle(style: FramerColorStyle): ColorStyleAST {
    const cssVariable = `--color${style.path.replace(/\//g, '-').replace(/\s+/g, '-').toLowerCase()}`
    return {
      name: style.path.split('/').pop() || style.path,
      path: style.path,
      light: style.light,
      dark: style.dark,
      cssVariable,
    }
  }

  private buildTypographyStyle(style: FramerTextStyle): TypographyStyleAST {
    const cssClass = `text${style.path.replace(/\//g, '-').replace(/\s+/g, '-').replace(/[()]/g, '').toLowerCase()}`
    const parsedFont = parseFontValue(style.font)
    
    const styles: StyleRule[] = [
      { property: 'font-family', value: `'${parsedFont.family}', sans-serif` },
      { property: 'font-size', value: style.fontSize },
      { property: 'line-height', value: style.lineHeight },
      { property: 'letter-spacing', value: style.letterSpacing },
      { property: 'text-align', value: style.alignment },
    ]

    if (parsedFont.weight) {
      const weightMap: Record<string, string> = {
        'light': '300',
        'regular': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      }
      styles.push({ 
        property: 'font-weight', 
        value: weightMap[parsedFont.weight.toLowerCase()] || '400' 
      })
    }

    if (style.transform !== 'none') {
      styles.push({ property: 'text-transform', value: style.transform })
    }

    if (style.decoration !== 'none') {
      styles.push({ property: 'text-decoration', value: style.decoration })
    }

    return {
      name: style.path.split('/').pop() || style.path,
      path: style.path,
      styles,
      tag: style.tag,
      cssClass,
    }
  }

  private cmsFieldTypeToContentType(
    type: string
  ): 'string' | 'number' | 'boolean' | 'date' | 'image' | 'richText' | 'reference' {
    switch (type) {
      case 'string':
      case 'color':
      case 'link':
      case 'file':
      case 'enum':
        return 'string'
      case 'number':
        return 'number'
      case 'boolean':
        return 'boolean'
      case 'date':
        return 'date'
      case 'image':
        return 'image'
      case 'formattedText':
        return 'richText'
      case 'collectionReference':
      case 'multiCollectionReference':
        return 'reference'
      default:
        return 'string'
    }
  }

  private pathToName(path: string): string {
    if (path === '/') return 'Home'
    return path
      .split('/')
      .filter(Boolean)
      .map((segment) => {
        if (segment.startsWith(':')) {
          return segment.slice(1)
        }
        return segment.charAt(0).toUpperCase() + segment.slice(1)
      })
      .join(' ')
  }

  private componentNameToIdentifier(name: string): string {
    // "Elements/Badge" -> "ElementsBadge"
    return name
      .split('/')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')
      .replace(/[^a-zA-Z0-9]/g, '')
  }

  private trackAsset(url: string, type: AssetAST['type']): void {
    if (!this.assets.has(url)) {
      this.assetCounter++
      this.assets.set(url, {
        id: `asset-${this.assetCounter}`,
        url,
        localPath: `assets/${type}s/${this.assetCounter}${this.getExtension(url)}`,
        type,
      })
    }
  }

  private getExtension(url: string): string {
    try {
      const pathname = new URL(url).pathname
      const ext = pathname.split('.').pop()
      if (ext && ext.length <= 4) {
        return `.${ext}`
      }
    } catch {
      // Ignore invalid URLs
    }
    return '.bin'
  }
}

/**
 * Create an AST builder with options
 */
export function createASTBuilder(options?: ASTBuilderOptions): ASTBuilder {
  return new ASTBuilder(options)
}

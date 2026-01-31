/**
 * Style Extractor
 *
 * Converts Framer CSS styles to Tailwind CSS classes.
 * Handles colors, spacing, layout, typography, and responsive breakpoints.
 */

import type { StyleRule, StylesAST, ColorStyleAST } from '../types/ast.js'

// ============================================
// Tailwind Spacing Scale
// ============================================

const SPACING_SCALE: Record<string, string> = {
  '0': '0',
  '1px': 'px',
  '2px': '0.5',
  '4px': '1',
  '6px': '1.5',
  '8px': '2',
  '10px': '2.5',
  '12px': '3',
  '14px': '3.5',
  '16px': '4',
  '20px': '5',
  '24px': '6',
  '28px': '7',
  '32px': '8',
  '36px': '9',
  '40px': '10',
  '44px': '11',
  '48px': '12',
  '56px': '14',
  '64px': '16',
  '72px': '18',
  '80px': '20',
  '96px': '24',
  '112px': '28',
  '128px': '32',
  '144px': '36',
  '160px': '40',
  '176px': '44',
  '192px': '48',
  '208px': '52',
  '224px': '56',
  '240px': '60',
  '256px': '64',
  '288px': '72',
  '320px': '80',
  '384px': '96',
}

// ============================================
// Tailwind Font Size Scale
// ============================================

const FONT_SIZE_SCALE: Record<string, string> = {
  '12px': 'xs',
  '14px': 'sm',
  '16px': 'base',
  '18px': 'lg',
  '20px': 'xl',
  '24px': '2xl',
  '30px': '3xl',
  '36px': '4xl',
  '48px': '5xl',
  '60px': '6xl',
  '72px': '7xl',
  '96px': '8xl',
  '128px': '9xl',
}

// ============================================
// Tailwind Border Radius Scale
// ============================================

const BORDER_RADIUS_SCALE: Record<string, string> = {
  '0': 'none',
  '2px': 'sm',
  '4px': 'rounded',
  '6px': 'md',
  '8px': 'lg',
  '12px': 'xl',
  '16px': '2xl',
  '24px': '3xl',
  '9999px': 'full',
  '50%': 'full',
}

// ============================================
// Color Mappings
// ============================================

const COMMON_COLORS: Record<string, string> = {
  'rgb(0, 0, 0)': 'black',
  'rgb(0,0,0)': 'black',
  '#000000': 'black',
  '#000': 'black',
  'rgb(255, 255, 255)': 'white',
  'rgb(255,255,255)': 'white',
  '#ffffff': 'white',
  '#fff': 'white',
  'transparent': 'transparent',
  'rgba(0, 0, 0, 0)': 'transparent',
  'rgba(0,0,0,0)': 'transparent',
}

// ============================================
// Style Extractor
// ============================================

export interface TailwindClass {
  class: string
  responsive?: 'desktop' | 'tablet' | 'mobile'
  arbitraryValue?: boolean
}

export interface ExtractedStyles {
  classes: TailwindClass[]
  customProperties: Map<string, string>
  warnings: string[]
}

export interface StyleExtractorConfig {
  /** Use arbitrary values when no Tailwind match found */
  allowArbitrary: boolean
  /** Custom color mapping */
  colorMap?: Map<string, string>
  /** Prefix for custom CSS variables */
  cssVariablePrefix: string
}

const defaultConfig: StyleExtractorConfig = {
  allowArbitrary: true,
  cssVariablePrefix: '--color',
}

export class StyleExtractor {
  private config: StyleExtractorConfig
  private colorMap: Map<string, string> = new Map()

  constructor(config: Partial<StyleExtractorConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
    if (config.colorMap) {
      this.colorMap = config.colorMap
    }
  }

  /**
   * Initialize color map from project styles
   */
  initializeFromStyles(styles: StylesAST): void {
    for (const color of styles.colors) {
      // Map CSS variable to a short name
      const shortName = this.colorPathToName(color.path)
      this.colorMap.set(color.cssVariable, shortName)
      this.colorMap.set(color.light, shortName)
      if (color.dark) {
        this.colorMap.set(color.dark, `${shortName}-dark`)
      }
    }
  }

  /**
   * Extract Tailwind classes from style rules
   */
  extract(rules: StyleRule[]): ExtractedStyles {
    const result: ExtractedStyles = {
      classes: [],
      customProperties: new Map(),
      warnings: [],
    }

    for (const rule of rules) {
      const extracted = this.extractRule(rule)
      if (extracted) {
        if (typeof extracted === 'string') {
          result.classes.push({ class: extracted, responsive: rule.responsive })
        } else if (Array.isArray(extracted)) {
          // Handle array of classes (e.g., from padding with multiple values)
          for (const item of extracted) {
            result.classes.push({
              ...item,
              responsive: rule.responsive,
            })
          }
        } else if ('class' in extracted) {
          result.classes.push({
            ...extracted,
            responsive: rule.responsive,
          })
        } else if ('customProperty' in extracted) {
          result.customProperties.set(extracted.customProperty.name, extracted.customProperty.value)
        } else if ('warning' in extracted) {
          result.warnings.push(extracted.warning)
        }
      }
    }

    return result
  }

  /**
   * Extract a single style rule
   */
  private extractRule(rule: StyleRule): 
    | string 
    | TailwindClass 
    | TailwindClass[]
    | { customProperty: { name: string; value: string } }
    | { warning: string }
    | null 
  {
    const { property, value } = rule

    switch (property) {
      // Display
      case 'display':
        return this.extractDisplay(value)

      // Flex
      case 'flex-direction':
        return this.extractFlexDirection(value)
      case 'justify-content':
        return this.extractJustifyContent(value)
      case 'align-items':
        return this.extractAlignItems(value)
      case 'flex-wrap':
        return this.extractFlexWrap(value)
      case 'flex':
        return this.extractFlex(value)
      case 'flex-grow':
        return this.extractFlexGrow(value)
      case 'flex-shrink':
        return this.extractFlexShrink(value)

      // Grid
      case 'grid-template-columns':
        return this.extractGridColumns(value)
      case 'grid-template-rows':
        return this.extractGridRows(value)

      // Gap
      case 'gap':
        return this.extractGap(value)
      case 'row-gap':
        return this.extractRowGap(value)
      case 'column-gap':
        return this.extractColumnGap(value)

      // Sizing
      case 'width':
        return this.extractWidth(value)
      case 'height':
        return this.extractHeight(value)
      case 'min-width':
        return this.extractMinWidth(value)
      case 'max-width':
        return this.extractMaxWidth(value)
      case 'min-height':
        return this.extractMinHeight(value)
      case 'max-height':
        return this.extractMaxHeight(value)

      // Spacing
      case 'padding':
        return this.extractPadding(value)
      case 'padding-top':
        return this.extractPaddingTop(value)
      case 'padding-right':
        return this.extractPaddingRight(value)
      case 'padding-bottom':
        return this.extractPaddingBottom(value)
      case 'padding-left':
        return this.extractPaddingLeft(value)
      case 'margin':
        return this.extractMargin(value)
      case 'margin-top':
        return this.extractMarginTop(value)
      case 'margin-right':
        return this.extractMarginRight(value)
      case 'margin-bottom':
        return this.extractMarginBottom(value)
      case 'margin-left':
        return this.extractMarginLeft(value)

      // Position
      case 'position':
        return this.extractPosition(value)
      case 'top':
        return this.extractTop(value)
      case 'right':
        return this.extractRight(value)
      case 'bottom':
        return this.extractBottom(value)
      case 'left':
        return this.extractLeft(value)
      case 'z-index':
        return this.extractZIndex(value)

      // Colors
      case 'background-color':
        return this.extractBackgroundColor(value)
      case 'color':
        return this.extractTextColor(value)
      case 'border-color':
        return this.extractBorderColor(value)

      // Border
      case 'border-radius':
        return this.extractBorderRadius(value)
      case 'border-width':
        return this.extractBorderWidth(value)
      case 'border':
        return this.extractBorder(value)

      // Typography
      case 'font-size':
        return this.extractFontSize(value)
      case 'font-weight':
        return this.extractFontWeight(value)
      case 'font-family':
        return this.extractFontFamily(value)
      case 'line-height':
        return this.extractLineHeight(value)
      case 'letter-spacing':
        return this.extractLetterSpacing(value)
      case 'text-align':
        return this.extractTextAlign(value)
      case 'text-transform':
        return this.extractTextTransform(value)
      case 'text-decoration':
        return this.extractTextDecoration(value)

      // Visual
      case 'opacity':
        return this.extractOpacity(value)
      case 'overflow':
        return this.extractOverflow(value)
      case 'overflow-x':
        return this.extractOverflowX(value)
      case 'overflow-y':
        return this.extractOverflowY(value)

      // Transforms
      case 'transform':
        return this.extractTransform(value)

      default:
        return { warning: `Unknown property: ${property}` }
    }
  }

  // ============================================
  // Display Extractors
  // ============================================

  private extractDisplay(value: string): string | null {
    const map: Record<string, string> = {
      'flex': 'flex',
      'grid': 'grid',
      'block': 'block',
      'inline': 'inline',
      'inline-block': 'inline-block',
      'inline-flex': 'inline-flex',
      'inline-grid': 'inline-grid',
      'none': 'hidden',
    }
    return map[value] || null
  }

  private extractFlexDirection(value: string): string | null {
    const map: Record<string, string> = {
      'row': 'flex-row',
      'row-reverse': 'flex-row-reverse',
      'column': 'flex-col',
      'column-reverse': 'flex-col-reverse',
    }
    return map[value] || null
  }

  private extractJustifyContent(value: string): string | null {
    const map: Record<string, string> = {
      'flex-start': 'justify-start',
      'flex-end': 'justify-end',
      'center': 'justify-center',
      'space-between': 'justify-between',
      'space-around': 'justify-around',
      'space-evenly': 'justify-evenly',
      'start': 'justify-start',
      'end': 'justify-end',
    }
    return map[value] || null
  }

  private extractAlignItems(value: string): string | null {
    const map: Record<string, string> = {
      'flex-start': 'items-start',
      'flex-end': 'items-end',
      'center': 'items-center',
      'baseline': 'items-baseline',
      'stretch': 'items-stretch',
      'start': 'items-start',
      'end': 'items-end',
    }
    return map[value] || null
  }

  private extractFlexWrap(value: string): string | null {
    const map: Record<string, string> = {
      'wrap': 'flex-wrap',
      'wrap-reverse': 'flex-wrap-reverse',
      'nowrap': 'flex-nowrap',
    }
    return map[value] || null
  }

  private extractFlex(value: string): string | null {
    const map: Record<string, string> = {
      '1': 'flex-1',
      '1 1 0%': 'flex-1',
      'auto': 'flex-auto',
      '1 1 auto': 'flex-auto',
      'initial': 'flex-initial',
      '0 1 auto': 'flex-initial',
      'none': 'flex-none',
      '0 0 auto': 'flex-none',
    }
    return map[value] || null
  }

  private extractFlexGrow(value: string): string | null {
    if (value === '0') return 'grow-0'
    if (value === '1') return 'grow'
    return null
  }

  private extractFlexShrink(value: string): string | null {
    if (value === '0') return 'shrink-0'
    if (value === '1') return 'shrink'
    return null
  }

  // ============================================
  // Grid Extractors
  // ============================================

  private extractGridColumns(value: string): TailwindClass | null {
    // Match repeat(N, 1fr)
    const repeatMatch = value.match(/repeat\((\d+),\s*1fr\)/)
    if (repeatMatch) {
      return { class: `grid-cols-${repeatMatch[1]}` }
    }

    // Match repeat(auto-fill, minmax(...))
    if (value.includes('auto-fill') || value.includes('auto-fit')) {
      return { class: `grid-cols-[${value.replace(/\s+/g, '_')}]`, arbitraryValue: true }
    }

    return null
  }

  private extractGridRows(value: string): TailwindClass | null {
    const repeatMatch = value.match(/repeat\((\d+),\s*1fr\)/)
    if (repeatMatch) {
      return { class: `grid-rows-${repeatMatch[1]}` }
    }
    return null
  }

  // ============================================
  // Gap Extractors
  // ============================================

  private extractGap(value: string): string | TailwindClass | null {
    const spacing = this.parseSpacing(value)
    if (spacing) {
      return `gap-${spacing}`
    }
    if (this.config.allowArbitrary) {
      return { class: `gap-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractRowGap(value: string): string | TailwindClass | null {
    const spacing = this.parseSpacing(value)
    if (spacing) {
      return `gap-y-${spacing}`
    }
    if (this.config.allowArbitrary) {
      return { class: `gap-y-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractColumnGap(value: string): string | TailwindClass | null {
    const spacing = this.parseSpacing(value)
    if (spacing) {
      return `gap-x-${spacing}`
    }
    if (this.config.allowArbitrary) {
      return { class: `gap-x-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  // ============================================
  // Sizing Extractors
  // ============================================

  private extractWidth(value: string): string | TailwindClass | null {
    if (value === '100%') return 'w-full'
    if (value === 'auto') return 'w-auto'
    if (value === 'fit-content') return 'w-fit'
    if (value === 'min-content') return 'w-min'
    if (value === 'max-content') return 'w-max'
    if (value === '100vw') return 'w-screen'
    if (value === '1fr') return 'w-full'

    const spacing = this.parseSpacing(value)
    if (spacing) {
      return `w-${spacing}`
    }

    if (this.config.allowArbitrary) {
      return { class: `w-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractHeight(value: string): string | TailwindClass | null {
    if (value === '100%') return 'h-full'
    if (value === 'auto') return 'h-auto'
    if (value === 'fit-content') return 'h-fit'
    if (value === 'min-content') return 'h-min'
    if (value === 'max-content') return 'h-max'
    if (value === '100vh') return 'h-screen'

    const spacing = this.parseSpacing(value)
    if (spacing) {
      return `h-${spacing}`
    }

    if (this.config.allowArbitrary) {
      return { class: `h-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractMinWidth(value: string): string | TailwindClass | null {
    if (value === '0') return 'min-w-0'
    if (value === '100%') return 'min-w-full'
    if (value === 'min-content') return 'min-w-min'
    if (value === 'max-content') return 'min-w-max'
    if (value === 'fit-content') return 'min-w-fit'

    if (this.config.allowArbitrary) {
      return { class: `min-w-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractMaxWidth(value: string): string | TailwindClass | null {
    const namedWidths: Record<string, string> = {
      'none': 'max-w-none',
      '320px': 'max-w-xs',
      '384px': 'max-w-sm',
      '448px': 'max-w-md',
      '512px': 'max-w-lg',
      '576px': 'max-w-xl',
      '672px': 'max-w-2xl',
      '768px': 'max-w-3xl',
      '896px': 'max-w-4xl',
      '1024px': 'max-w-5xl',
      '1152px': 'max-w-6xl',
      '1280px': 'max-w-7xl',
      '100%': 'max-w-full',
    }
    if (namedWidths[value]) return namedWidths[value]

    if (this.config.allowArbitrary) {
      return { class: `max-w-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractMinHeight(value: string): string | TailwindClass | null {
    if (value === '0') return 'min-h-0'
    if (value === '100%') return 'min-h-full'
    if (value === '100vh') return 'min-h-screen'
    if (value === 'min-content') return 'min-h-min'
    if (value === 'max-content') return 'min-h-max'
    if (value === 'fit-content') return 'min-h-fit'

    if (this.config.allowArbitrary) {
      return { class: `min-h-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractMaxHeight(value: string): string | TailwindClass | null {
    if (value === 'none') return 'max-h-none'
    if (value === '100%') return 'max-h-full'
    if (value === '100vh') return 'max-h-screen'
    if (value === 'min-content') return 'max-h-min'
    if (value === 'max-content') return 'max-h-max'
    if (value === 'fit-content') return 'max-h-fit'

    if (this.config.allowArbitrary) {
      return { class: `max-h-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  // ============================================
  // Padding Extractors
  // ============================================

  private extractPadding(value: string): string | TailwindClass[] | null {
    const parts = value.split(/\s+/)
    
    if (parts.length === 1) {
      const spacing = this.parseSpacing(parts[0])
      if (spacing) return `p-${spacing}`
      if (this.config.allowArbitrary) {
        return { class: `p-[${parts[0]}]`, arbitraryValue: true } as any
      }
    }

    if (parts.length === 2) {
      // py px
      const py = this.parseSpacing(parts[0])
      const px = this.parseSpacing(parts[1])
      const classes: TailwindClass[] = []
      
      if (py) {
        classes.push({ class: `py-${py}` })
      } else if (this.config.allowArbitrary) {
        classes.push({ class: `py-[${parts[0]}]`, arbitraryValue: true })
      }
      
      if (px) {
        classes.push({ class: `px-${px}` })
      } else if (this.config.allowArbitrary) {
        classes.push({ class: `px-[${parts[1]}]`, arbitraryValue: true })
      }
      
      return classes
    }

    if (parts.length === 4) {
      // pt pr pb pl
      const [top, right, bottom, left] = parts
      const classes: TailwindClass[] = []
      
      // Check for paired values
      if (top === bottom && left === right) {
        const py = this.parseSpacing(top)
        const px = this.parseSpacing(left)
        if (py) classes.push({ class: `py-${py}` })
        else if (this.config.allowArbitrary) classes.push({ class: `py-[${top}]`, arbitraryValue: true })
        if (px) classes.push({ class: `px-${px}` })
        else if (this.config.allowArbitrary) classes.push({ class: `px-[${left}]`, arbitraryValue: true })
      } else {
        const pt = this.parseSpacing(top)
        const pr = this.parseSpacing(right)
        const pb = this.parseSpacing(bottom)
        const pl = this.parseSpacing(left)
        
        if (pt) classes.push({ class: `pt-${pt}` })
        else if (this.config.allowArbitrary) classes.push({ class: `pt-[${top}]`, arbitraryValue: true })
        if (pr) classes.push({ class: `pr-${pr}` })
        else if (this.config.allowArbitrary) classes.push({ class: `pr-[${right}]`, arbitraryValue: true })
        if (pb) classes.push({ class: `pb-${pb}` })
        else if (this.config.allowArbitrary) classes.push({ class: `pb-[${bottom}]`, arbitraryValue: true })
        if (pl) classes.push({ class: `pl-${pl}` })
        else if (this.config.allowArbitrary) classes.push({ class: `pl-[${left}]`, arbitraryValue: true })
      }
      
      return classes
    }

    return null
  }

  private extractPaddingTop(value: string): string | TailwindClass | null {
    const spacing = this.parseSpacing(value)
    if (spacing) return `pt-${spacing}`
    if (this.config.allowArbitrary) {
      return { class: `pt-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractPaddingRight(value: string): string | TailwindClass | null {
    const spacing = this.parseSpacing(value)
    if (spacing) return `pr-${spacing}`
    if (this.config.allowArbitrary) {
      return { class: `pr-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractPaddingBottom(value: string): string | TailwindClass | null {
    const spacing = this.parseSpacing(value)
    if (spacing) return `pb-${spacing}`
    if (this.config.allowArbitrary) {
      return { class: `pb-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractPaddingLeft(value: string): string | TailwindClass | null {
    const spacing = this.parseSpacing(value)
    if (spacing) return `pl-${spacing}`
    if (this.config.allowArbitrary) {
      return { class: `pl-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  // ============================================
  // Margin Extractors
  // ============================================

  private extractMargin(value: string): string | TailwindClass | null {
    if (value === 'auto') return 'm-auto'
    const spacing = this.parseSpacing(value)
    if (spacing) return `m-${spacing}`
    if (this.config.allowArbitrary) {
      return { class: `m-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractMarginTop(value: string): string | TailwindClass | null {
    if (value === 'auto') return 'mt-auto'
    const spacing = this.parseSpacing(value)
    if (spacing) return `mt-${spacing}`
    if (this.config.allowArbitrary) {
      return { class: `mt-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractMarginRight(value: string): string | TailwindClass | null {
    if (value === 'auto') return 'mr-auto'
    const spacing = this.parseSpacing(value)
    if (spacing) return `mr-${spacing}`
    if (this.config.allowArbitrary) {
      return { class: `mr-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractMarginBottom(value: string): string | TailwindClass | null {
    if (value === 'auto') return 'mb-auto'
    const spacing = this.parseSpacing(value)
    if (spacing) return `mb-${spacing}`
    if (this.config.allowArbitrary) {
      return { class: `mb-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractMarginLeft(value: string): string | TailwindClass | null {
    if (value === 'auto') return 'ml-auto'
    const spacing = this.parseSpacing(value)
    if (spacing) return `ml-${spacing}`
    if (this.config.allowArbitrary) {
      return { class: `ml-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  // ============================================
  // Position Extractors
  // ============================================

  private extractPosition(value: string): string | null {
    const map: Record<string, string> = {
      'static': 'static',
      'relative': 'relative',
      'absolute': 'absolute',
      'fixed': 'fixed',
      'sticky': 'sticky',
    }
    return map[value] || null
  }

  private extractTop(value: string): string | TailwindClass | null {
    if (value === '0' || value === '0px') return 'top-0'
    if (value === 'auto') return 'top-auto'
    if (value === '50%') return 'top-1/2'
    if (value === '100%') return 'top-full'
    const spacing = this.parseSpacing(value)
    if (spacing) return `top-${spacing}`
    if (this.config.allowArbitrary) {
      return { class: `top-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractRight(value: string): string | TailwindClass | null {
    if (value === '0' || value === '0px') return 'right-0'
    if (value === 'auto') return 'right-auto'
    if (value === '50%') return 'right-1/2'
    if (value === '100%') return 'right-full'
    const spacing = this.parseSpacing(value)
    if (spacing) return `right-${spacing}`
    if (this.config.allowArbitrary) {
      return { class: `right-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractBottom(value: string): string | TailwindClass | null {
    if (value === '0' || value === '0px') return 'bottom-0'
    if (value === 'auto') return 'bottom-auto'
    if (value === '50%') return 'bottom-1/2'
    if (value === '100%') return 'bottom-full'
    const spacing = this.parseSpacing(value)
    if (spacing) return `bottom-${spacing}`
    if (this.config.allowArbitrary) {
      return { class: `bottom-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractLeft(value: string): string | TailwindClass | null {
    if (value === '0' || value === '0px') return 'left-0'
    if (value === 'auto') return 'left-auto'
    if (value === '50%') return 'left-1/2'
    if (value === '100%') return 'left-full'
    const spacing = this.parseSpacing(value)
    if (spacing) return `left-${spacing}`
    if (this.config.allowArbitrary) {
      return { class: `left-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractZIndex(value: string): string | TailwindClass | null {
    const map: Record<string, string> = {
      '0': 'z-0',
      '10': 'z-10',
      '20': 'z-20',
      '30': 'z-30',
      '40': 'z-40',
      '50': 'z-50',
      'auto': 'z-auto',
    }
    if (map[value]) return map[value]
    if (this.config.allowArbitrary) {
      return { class: `z-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  // ============================================
  // Color Extractors
  // ============================================

  private extractBackgroundColor(value: string): string | TailwindClass | null {
    // Check common colors
    const common = COMMON_COLORS[value.toLowerCase()]
    if (common) return `bg-${common}`

    // Check if it's a CSS variable
    if (value.startsWith('var(')) {
      const varName = value.match(/var\(([^)]+)\)/)?.[1]
      if (varName) {
        const mapped = this.colorMap.get(varName)
        if (mapped) return `bg-${mapped}`
        // Use arbitrary value with CSS variable
        return { class: `bg-[${value}]`, arbitraryValue: true }
      }
    }

    // Check mapped colors
    const mapped = this.colorMap.get(value)
    if (mapped) return `bg-${mapped}`

    // Arbitrary color
    if (this.config.allowArbitrary) {
      return { class: `bg-[${value.replace(/\s/g, '_')}]`, arbitraryValue: true }
    }
    return null
  }

  private extractTextColor(value: string): string | TailwindClass | null {
    const common = COMMON_COLORS[value.toLowerCase()]
    if (common) return `text-${common}`

    if (value.startsWith('var(')) {
      const varName = value.match(/var\(([^)]+)\)/)?.[1]
      if (varName) {
        const mapped = this.colorMap.get(varName)
        if (mapped) return `text-${mapped}`
        return { class: `text-[${value}]`, arbitraryValue: true }
      }
    }

    const mapped = this.colorMap.get(value)
    if (mapped) return `text-${mapped}`

    if (this.config.allowArbitrary) {
      return { class: `text-[${value.replace(/\s/g, '_')}]`, arbitraryValue: true }
    }
    return null
  }

  private extractBorderColor(value: string): string | TailwindClass | null {
    const common = COMMON_COLORS[value.toLowerCase()]
    if (common) return `border-${common}`

    if (value.startsWith('var(')) {
      const varName = value.match(/var\(([^)]+)\)/)?.[1]
      if (varName) {
        const mapped = this.colorMap.get(varName)
        if (mapped) return `border-${mapped}`
        return { class: `border-[${value}]`, arbitraryValue: true }
      }
    }

    const mapped = this.colorMap.get(value)
    if (mapped) return `border-${mapped}`

    if (this.config.allowArbitrary) {
      return { class: `border-[${value.replace(/\s/g, '_')}]`, arbitraryValue: true }
    }
    return null
  }

  // ============================================
  // Border Extractors
  // ============================================

  private extractBorderRadius(value: string): string | TailwindClass | null {
    const mapped = BORDER_RADIUS_SCALE[value]
    if (mapped) {
      return mapped === 'rounded' ? 'rounded' : `rounded-${mapped}`
    }

    if (this.config.allowArbitrary) {
      return { class: `rounded-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractBorderWidth(value: string): string | TailwindClass | null {
    const map: Record<string, string> = {
      '0': 'border-0',
      '1px': 'border',
      '2px': 'border-2',
      '4px': 'border-4',
      '8px': 'border-8',
    }
    if (map[value]) return map[value]
    if (this.config.allowArbitrary) {
      return { class: `border-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractBorder(value: string): string | null {
    if (value === 'none' || value === '0') return 'border-0'
    // Complex border values handled elsewhere
    return null
  }

  // ============================================
  // Typography Extractors
  // ============================================

  private extractFontSize(value: string): string | TailwindClass | null {
    const mapped = FONT_SIZE_SCALE[value]
    if (mapped) return `text-${mapped}`

    if (this.config.allowArbitrary) {
      return { class: `text-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractFontWeight(value: string): string | null {
    const map: Record<string, string> = {
      '100': 'font-thin',
      '200': 'font-extralight',
      '300': 'font-light',
      '400': 'font-normal',
      '500': 'font-medium',
      '600': 'font-semibold',
      '700': 'font-bold',
      '800': 'font-extrabold',
      '900': 'font-black',
      'normal': 'font-normal',
      'bold': 'font-bold',
    }
    return map[value] || null
  }

  private extractFontFamily(value: string): TailwindClass | { customProperty: { name: string; value: string } } | null {
    // Font family is usually custom - add as CSS variable
    return {
      customProperty: {
        name: '--font-family',
        value: value,
      }
    }
  }

  private extractLineHeight(value: string): string | TailwindClass | null {
    const map: Record<string, string> = {
      '1': 'leading-none',
      '1.25': 'leading-tight',
      '1.375': 'leading-snug',
      '1.5': 'leading-normal',
      '1.625': 'leading-relaxed',
      '2': 'leading-loose',
      '1em': 'leading-none',
      '1.1em': 'leading-tight',
      '1.25em': 'leading-tight',
      '1.5em': 'leading-normal',
      '2em': 'leading-loose',
    }
    if (map[value]) return map[value]

    // Check for numeric values
    const num = parseFloat(value)
    if (!isNaN(num)) {
      if (num <= 1) return 'leading-none'
      if (num <= 1.25) return 'leading-tight'
      if (num <= 1.375) return 'leading-snug'
      if (num <= 1.5) return 'leading-normal'
      if (num <= 1.625) return 'leading-relaxed'
      return 'leading-loose'
    }

    if (this.config.allowArbitrary) {
      return { class: `leading-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractLetterSpacing(value: string): string | TailwindClass | null {
    const map: Record<string, string> = {
      '-0.05em': 'tracking-tighter',
      '-0.025em': 'tracking-tight',
      '-0.04em': 'tracking-tight',
      '0': 'tracking-normal',
      '0em': 'tracking-normal',
      '0.025em': 'tracking-wide',
      '0.05em': 'tracking-wider',
      '0.1em': 'tracking-widest',
    }
    if (map[value]) return map[value]

    if (this.config.allowArbitrary) {
      return { class: `tracking-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractTextAlign(value: string): string | null {
    const map: Record<string, string> = {
      'left': 'text-left',
      'center': 'text-center',
      'right': 'text-right',
      'justify': 'text-justify',
      'start': 'text-start',
      'end': 'text-end',
    }
    return map[value] || null
  }

  private extractTextTransform(value: string): string | null {
    const map: Record<string, string> = {
      'uppercase': 'uppercase',
      'lowercase': 'lowercase',
      'capitalize': 'capitalize',
      'none': 'normal-case',
    }
    return map[value] || null
  }

  private extractTextDecoration(value: string): string | null {
    const map: Record<string, string> = {
      'underline': 'underline',
      'line-through': 'line-through',
      'none': 'no-underline',
      'overline': 'overline',
    }
    return map[value] || null
  }

  // ============================================
  // Visual Extractors
  // ============================================

  private extractOpacity(value: string): string | TailwindClass | null {
    const num = parseFloat(value)
    if (!isNaN(num)) {
      const percent = Math.round(num * 100)
      const standard = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]
      if (standard.includes(percent)) {
        return `opacity-${percent}`
      }
    }

    if (this.config.allowArbitrary) {
      return { class: `opacity-[${value}]`, arbitraryValue: true }
    }
    return null
  }

  private extractOverflow(value: string): string | null {
    const map: Record<string, string> = {
      'auto': 'overflow-auto',
      'hidden': 'overflow-hidden',
      'visible': 'overflow-visible',
      'scroll': 'overflow-scroll',
      'clip': 'overflow-clip',
    }
    return map[value] || null
  }

  private extractOverflowX(value: string): string | null {
    const map: Record<string, string> = {
      'auto': 'overflow-x-auto',
      'hidden': 'overflow-x-hidden',
      'visible': 'overflow-x-visible',
      'scroll': 'overflow-x-scroll',
      'clip': 'overflow-x-clip',
    }
    return map[value] || null
  }

  private extractOverflowY(value: string): string | null {
    const map: Record<string, string> = {
      'auto': 'overflow-y-auto',
      'hidden': 'overflow-y-hidden',
      'visible': 'overflow-y-visible',
      'scroll': 'overflow-y-scroll',
      'clip': 'overflow-y-clip',
    }
    return map[value] || null
  }

  private extractTransform(value: string): TailwindClass | null {
    if (value === 'none') return { class: 'transform-none' }
    // Complex transforms need arbitrary values
    if (this.config.allowArbitrary) {
      // Parse common transforms
      if (value.includes('translateY(-50%)')) {
        return { class: '-translate-y-1/2' }
      }
      if (value.includes('translateX(-50%)')) {
        return { class: '-translate-x-1/2' }
      }
      return { class: `[transform:${value.replace(/\s/g, '_')}]`, arbitraryValue: true }
    }
    return null
  }

  // ============================================
  // Helper Methods
  // ============================================

  private parseSpacing(value: string): string | null {
    // Exact match
    if (SPACING_SCALE[value]) {
      return SPACING_SCALE[value]
    }

    // Handle 0
    if (value === '0' || value === '0px') {
      return '0'
    }

    // Try to find closest match
    if (value.endsWith('px')) {
      const px = parseInt(value)
      if (!isNaN(px)) {
        // Find exact or closest
        const pxStr = `${px}px`
        if (SPACING_SCALE[pxStr]) {
          return SPACING_SCALE[pxStr]
        }
      }
    }

    return null
  }

  private colorPathToName(path: string): string {
    // "/Brand/Primary" -> "brand-primary"
    return path
      .replace(/^\//, '')
      .replace(/\//g, '-')
      .replace(/\s+/g, '-')
      .toLowerCase()
  }
}

/**
 * Create a style extractor instance
 */
export function createStyleExtractor(config?: Partial<StyleExtractorConfig>): StyleExtractor {
  return new StyleExtractor(config)
}

/**
 * Utility: Flatten extracted classes to a string
 */
export function classesToString(extracted: ExtractedStyles, prefix?: string): string {
  const classes = extracted.classes
    .map(c => {
      if (c.responsive && prefix) {
        const prefixMap: Record<string, string> = {
          tablet: 'md:',
          mobile: 'sm:',
          desktop: '',
        }
        return `${prefixMap[c.responsive] || ''}${c.class}`
      }
      return c.class
    })
    .filter(Boolean)

  return classes.join(' ')
}

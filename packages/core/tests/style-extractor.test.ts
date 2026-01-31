/**
 * Style Extractor Tests
 */

import { describe, it, expect } from 'vitest'
import {
  createStyleExtractor,
  classesToString,
  type ExtractedStyles,
} from '../src/transformer/style-extractor'
import type { StyleRule, StylesAST } from '../src/types/ast'

describe('StyleExtractor', () => {
  const extractor = createStyleExtractor()

  describe('Display and Flex', () => {
    it('should extract display values', () => {
      const rules: StyleRule[] = [
        { property: 'display', value: 'flex' },
      ]
      const result = extractor.extract(rules)
      expect(classesToString(result)).toBe('flex')
    })

    it('should extract flex-direction', () => {
      const rules: StyleRule[] = [
        { property: 'flex-direction', value: 'column' },
      ]
      const result = extractor.extract(rules)
      expect(classesToString(result)).toBe('flex-col')
    })

    it('should extract justify-content', () => {
      const cases = [
        { input: 'flex-start', expected: 'justify-start' },
        { input: 'center', expected: 'justify-center' },
        { input: 'space-between', expected: 'justify-between' },
      ]

      for (const { input, expected } of cases) {
        const result = extractor.extract([{ property: 'justify-content', value: input }])
        expect(classesToString(result)).toBe(expected)
      }
    })

    it('should extract align-items', () => {
      const cases = [
        { input: 'flex-start', expected: 'items-start' },
        { input: 'center', expected: 'items-center' },
        { input: 'stretch', expected: 'items-stretch' },
      ]

      for (const { input, expected } of cases) {
        const result = extractor.extract([{ property: 'align-items', value: input }])
        expect(classesToString(result)).toBe(expected)
      }
    })

    it('should extract flex-wrap', () => {
      const result = extractor.extract([{ property: 'flex-wrap', value: 'wrap' }])
      expect(classesToString(result)).toBe('flex-wrap')
    })
  })

  describe('Gap', () => {
    it('should extract standard gap values', () => {
      const cases = [
        { input: '0', expected: 'gap-0' },
        { input: '4px', expected: 'gap-1' },
        { input: '8px', expected: 'gap-2' },
        { input: '12px', expected: 'gap-3' },
        { input: '16px', expected: 'gap-4' },
        { input: '24px', expected: 'gap-6' },
        { input: '32px', expected: 'gap-8' },
      ]

      for (const { input, expected } of cases) {
        const result = extractor.extract([{ property: 'gap', value: input }])
        expect(classesToString(result)).toBe(expected)
      }
    })

    it('should use arbitrary values for non-standard gaps', () => {
      const result = extractor.extract([{ property: 'gap', value: '35px' }])
      expect(classesToString(result)).toBe('gap-[35px]')
    })
  })

  describe('Sizing', () => {
    it('should extract width values', () => {
      const cases = [
        { input: '100%', expected: 'w-full' },
        { input: 'auto', expected: 'w-auto' },
        { input: 'fit-content', expected: 'w-fit' },
        { input: '64px', expected: 'w-16' },
      ]

      for (const { input, expected } of cases) {
        const result = extractor.extract([{ property: 'width', value: input }])
        expect(classesToString(result)).toBe(expected)
      }
    })

    it('should extract height values', () => {
      const cases = [
        { input: '100%', expected: 'h-full' },
        { input: '100vh', expected: 'h-screen' },
        { input: 'fit-content', expected: 'h-fit' },
      ]

      for (const { input, expected } of cases) {
        const result = extractor.extract([{ property: 'height', value: input }])
        expect(classesToString(result)).toBe(expected)
      }
    })

    it('should use arbitrary values for custom sizes', () => {
      const result = extractor.extract([{ property: 'width', value: '1200px' }])
      expect(classesToString(result)).toBe('w-[1200px]')
    })
  })

  describe('Padding', () => {
    it('should extract single padding value', () => {
      const result = extractor.extract([{ property: 'padding', value: '16px' }])
      expect(classesToString(result)).toBe('p-4')
    })

    it('should extract two-value padding (py px)', () => {
      const result = extractor.extract([{ property: 'padding', value: '16px 24px' }])
      expect(classesToString(result)).toBe('py-4 px-6')
    })

    it('should extract four-value padding', () => {
      const result = extractor.extract([{ property: 'padding', value: '180px 40px 100px 40px' }])
      // top=180, right=40, bottom=100, left=40
      expect(classesToString(result)).toContain('pt-[180px]')
      expect(classesToString(result)).toContain('pr-10')
      expect(classesToString(result)).toContain('pb-[100px]')
      expect(classesToString(result)).toContain('pl-10')
    })

    it('should handle individual padding directions', () => {
      const rules: StyleRule[] = [
        { property: 'padding-top', value: '16px' },
        { property: 'padding-left', value: '8px' },
      ]
      const result = extractor.extract(rules)
      expect(classesToString(result)).toContain('pt-4')
      expect(classesToString(result)).toContain('pl-2')
    })
  })

  describe('Position', () => {
    it('should extract position values', () => {
      const cases = [
        { input: 'absolute', expected: 'absolute' },
        { input: 'relative', expected: 'relative' },
        { input: 'fixed', expected: 'fixed' },
        { input: 'sticky', expected: 'sticky' },
      ]

      for (const { input, expected } of cases) {
        const result = extractor.extract([{ property: 'position', value: input }])
        expect(classesToString(result)).toBe(expected)
      }
    })

    it('should extract position offsets', () => {
      const rules: StyleRule[] = [
        { property: 'top', value: '0' },
        { property: 'left', value: '50%' },
      ]
      const result = extractor.extract(rules)
      expect(classesToString(result)).toContain('top-0')
      expect(classesToString(result)).toContain('left-1/2')
    })
  })

  describe('Colors', () => {
    it('should extract common colors', () => {
      const cases = [
        { input: 'rgb(0, 0, 0)', expected: 'bg-black' },
        { input: 'rgb(255, 255, 255)', expected: 'bg-white' },
        { input: '#000000', expected: 'bg-black' },
        { input: 'transparent', expected: 'bg-transparent' },
      ]

      for (const { input, expected } of cases) {
        const result = extractor.extract([{ property: 'background-color', value: input }])
        expect(classesToString(result)).toBe(expected)
      }
    })

    it('should handle CSS variables', () => {
      const result = extractor.extract([
        { property: 'background-color', value: 'var(--color-primary)' }
      ])
      expect(classesToString(result)).toBe('bg-[var(--color-primary)]')
    })

    it('should extract text colors', () => {
      const result = extractor.extract([{ property: 'color', value: 'rgb(0, 0, 0)' }])
      expect(classesToString(result)).toBe('text-black')
    })

    it('should use color map when initialized', () => {
      const styles: StylesAST = {
        colors: [
          {
            name: 'Primary',
            path: '/Brand/Primary',
            light: 'rgb(81, 47, 235)',
            cssVariable: '--color-brand-primary',
          },
        ],
        typography: [],
        global: [],
      }

      const extWithColors = createStyleExtractor()
      extWithColors.initializeFromStyles(styles)

      const result = extWithColors.extract([
        { property: 'background-color', value: 'var(--color-brand-primary)' }
      ])
      expect(classesToString(result)).toBe('bg-brand-primary')
    })
  })

  describe('Border Radius', () => {
    it('should extract standard border radius', () => {
      const cases = [
        { input: '0', expected: 'rounded-none' },
        { input: '4px', expected: 'rounded' },
        { input: '8px', expected: 'rounded-lg' },
        { input: '16px', expected: 'rounded-2xl' },
        { input: '9999px', expected: 'rounded-full' },
      ]

      for (const { input, expected } of cases) {
        const result = extractor.extract([{ property: 'border-radius', value: input }])
        expect(classesToString(result)).toBe(expected)
      }
    })
  })

  describe('Typography', () => {
    it('should extract font size', () => {
      const cases = [
        { input: '12px', expected: 'text-xs' },
        { input: '14px', expected: 'text-sm' },
        { input: '16px', expected: 'text-base' },
        { input: '24px', expected: 'text-2xl' },
        { input: '72px', expected: 'text-7xl' },
      ]

      for (const { input, expected } of cases) {
        const result = extractor.extract([{ property: 'font-size', value: input }])
        expect(classesToString(result)).toBe(expected)
      }
    })

    it('should extract font weight', () => {
      const cases = [
        { input: '400', expected: 'font-normal' },
        { input: '500', expected: 'font-medium' },
        { input: '600', expected: 'font-semibold' },
        { input: '700', expected: 'font-bold' },
      ]

      for (const { input, expected } of cases) {
        const result = extractor.extract([{ property: 'font-weight', value: input }])
        expect(classesToString(result)).toBe(expected)
      }
    })

    it('should extract text alignment', () => {
      const cases = [
        { input: 'left', expected: 'text-left' },
        { input: 'center', expected: 'text-center' },
        { input: 'right', expected: 'text-right' },
      ]

      for (const { input, expected } of cases) {
        const result = extractor.extract([{ property: 'text-align', value: input }])
        expect(classesToString(result)).toBe(expected)
      }
    })

    it('should extract line height', () => {
      const result = extractor.extract([{ property: 'line-height', value: '1.1em' }])
      expect(classesToString(result)).toBe('leading-tight')
    })

    it('should extract letter spacing', () => {
      const result = extractor.extract([{ property: 'letter-spacing', value: '-0.04em' }])
      expect(classesToString(result)).toBe('tracking-tight')
    })

    it('should extract text transform', () => {
      const result = extractor.extract([{ property: 'text-transform', value: 'uppercase' }])
      expect(classesToString(result)).toBe('uppercase')
    })
  })

  describe('Opacity', () => {
    it('should extract standard opacity values', () => {
      const cases = [
        { input: '0', expected: 'opacity-0' },
        { input: '0.5', expected: 'opacity-50' },
        { input: '1', expected: 'opacity-100' },
      ]

      for (const { input, expected } of cases) {
        const result = extractor.extract([{ property: 'opacity', value: input }])
        expect(classesToString(result)).toBe(expected)
      }
    })
  })

  describe('Overflow', () => {
    it('should extract overflow values', () => {
      const cases = [
        { property: 'overflow', input: 'hidden', expected: 'overflow-hidden' },
        { property: 'overflow-x', input: 'auto', expected: 'overflow-x-auto' },
        { property: 'overflow-y', input: 'scroll', expected: 'overflow-y-scroll' },
      ]

      for (const { property, input, expected } of cases) {
        const result = extractor.extract([{ property, value: input }])
        expect(classesToString(result)).toBe(expected)
      }
    })
  })

  describe('Complex Styles', () => {
    it('should handle complete flex layout', () => {
      const rules: StyleRule[] = [
        { property: 'display', value: 'flex' },
        { property: 'flex-direction', value: 'column' },
        { property: 'justify-content', value: 'center' },
        { property: 'align-items', value: 'center' },
        { property: 'gap', value: '16px' },
      ]
      const result = extractor.extract(rules)
      const classes = classesToString(result)
      
      expect(classes).toContain('flex')
      expect(classes).toContain('flex-col')
      expect(classes).toContain('justify-center')
      expect(classes).toContain('items-center')
      expect(classes).toContain('gap-4')
    })

    it('should handle a real Framer hero section', () => {
      const rules: StyleRule[] = [
        { property: 'display', value: 'flex' },
        { property: 'flex-direction', value: 'column' },
        { property: 'width', value: '100%' },
        { property: 'height', value: 'fit-content' },
        { property: 'gap', value: '35px' },
        { property: 'padding', value: '180px 40px 100px 40px' },
      ]
      const result = extractor.extract(rules)
      const classes = classesToString(result)
      
      expect(classes).toContain('flex')
      expect(classes).toContain('flex-col')
      expect(classes).toContain('w-full')
      expect(classes).toContain('h-fit')
      expect(classes).toContain('gap-[35px]')
    })
  })

  describe('Warnings', () => {
    it('should track unknown properties', () => {
      const result = extractor.extract([
        { property: 'unknown-property', value: 'some-value' }
      ])
      expect(result.warnings).toContain('Unknown property: unknown-property')
    })
  })
})

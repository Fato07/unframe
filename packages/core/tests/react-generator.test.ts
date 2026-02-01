/**
 * React Generator Tests
 */

import { describe, it, expect } from 'vitest'
import { createReactGenerator } from '../src/generator/react-generator'
import type { ElementAST, ComponentAST, PageAST } from '../src/types/ast'

describe('ReactGenerator', () => {
  const generator = createReactGenerator({
    typescript: true,
    semicolons: false,
    singleQuote: true,
    imageComponent: 'next/image',
    useMotion: false,
  })

  describe('generateElement', () => {
    it('should generate a basic div', () => {
      const element: ElementAST = {
        id: 'test-1',
        type: 'div',
        name: 'Container',
        props: {},
        styles: [],
        children: [],
      }

      const generated = generator.generateComponent({
        id: 'comp-1',
        name: 'TestComponent',
        originalName: 'Test Component',
        props: [],
        variants: [],
        defaultVariant: 'default',
        element,
      })

      expect(generated.code).toContain('export function TestComponent()')
      expect(generated.code).toContain('<div>')
      expect(generated.code).toContain('</div>')
    })

    it('should generate element with Tailwind classes', () => {
      const element: ElementAST = {
        id: 'test-1',
        type: 'div',
        name: 'Container',
        props: {},
        styles: [
          { property: 'display', value: 'flex' },
          { property: 'flex-direction', value: 'column' },
          { property: 'gap', value: '16px' },
        ],
        children: [],
      }

      const generated = generator.generateComponent({
        id: 'comp-1',
        name: 'FlexBox',
        originalName: 'Flex Box',
        props: [],
        variants: [],
        defaultVariant: 'default',
        element,
      })

      expect(generated.code).toContain('className="flex flex-col gap-4"')
    })

    it('should generate nested elements', () => {
      const element: ElementAST = {
        id: 'test-1',
        type: 'div',
        name: 'Parent',
        props: {},
        styles: [],
        children: [
          {
            id: 'test-2',
            type: 'div',
            name: 'Child',
            props: {},
            styles: [{ property: 'padding', value: '16px' }],
            children: [],
          },
        ],
      }

      const generated = generator.generateComponent({
        id: 'comp-1',
        name: 'Nested',
        originalName: 'Nested',
        props: [],
        variants: [],
        defaultVariant: 'default',
        element,
      })

      expect(generated.code).toContain('<div>')
      expect(generated.code).toContain('className="p-4"')
      expect(generated.code).toContain('</div>')
    })

    it('should generate text content inline', () => {
      const element: ElementAST = {
        id: 'test-1',
        type: 'h1',
        name: 'Title',
        props: {},
        styles: [],
        children: [
          { type: 'text', content: 'Hello World' },
        ],
      }

      const generated = generator.generateComponent({
        id: 'comp-1',
        name: 'Heading',
        originalName: 'Heading',
        props: [],
        variants: [],
        defaultVariant: 'default',
        element,
      })

      expect(generated.code).toContain('<h1>Hello World</h1>')
    })

    it('should escape JSX special characters', () => {
      const element: ElementAST = {
        id: 'test-1',
        type: 'p',
        name: 'Text',
        props: {},
        styles: [],
        children: [
          { type: 'text', content: 'Price: $100 < $200' },
        ],
      }

      const generated = generator.generateComponent({
        id: 'comp-1',
        name: 'Price',
        originalName: 'Price',
        props: [],
        variants: [],
        defaultVariant: 'default',
        element,
      })

      expect(generated.code).toContain('&lt;')
    })
  })

  describe('generatePage', () => {
    it('should generate a page with default export', () => {
      const page: PageAST = {
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
              { property: 'width', value: '100%' },
            ],
            children: [],
          },
        },
      }

      const generated = generator.generatePage(page)

      expect(generated.name).toBe('HomePage')
      expect(generated.code).toContain('export default function HomePage()')
      expect(generated.code).toContain('className="w-full"')
    })

    it('should handle nested route names', () => {
      const page: PageAST = {
        id: 'page-1',
        path: '/blog/post',
        name: 'Blog Post',
        breakpoints: {
          desktop: {
            id: 'desktop-1',
            type: 'div',
            name: 'Desktop',
            props: {},
            styles: [],
            children: [],
          },
        },
      }

      const generated = generator.generatePage(page)
      expect(generated.name).toBe('BlogPostPage')
    })
  })

  describe('Links', () => {
    it('should generate links with href', () => {
      const element: ElementAST = {
        id: 'test-1',
        type: 'a',
        name: 'Link',
        props: {
          href: '/about',
        },
        styles: [],
        children: [
          { type: 'text', content: 'About Us' },
        ],
      }

      const generated = generator.generateComponent({
        id: 'comp-1',
        name: 'NavLink',
        originalName: 'Nav Link',
        props: [],
        variants: [],
        defaultVariant: 'default',
        element,
      })

      expect(generated.code).toContain('href="/about"')
      expect(generated.code).toContain('>About Us</a>')
    })

    it('should add target="_blank" for external links', () => {
      const element: ElementAST = {
        id: 'test-1',
        type: 'a',
        name: 'ExternalLink',
        props: {
          href: 'https://example.com',
          target: '_blank',
        },
        styles: [],
        children: [],
      }

      const generated = generator.generateComponent({
        id: 'comp-1',
        name: 'ExternalLink',
        originalName: 'External Link',
        props: [],
        variants: [],
        defaultVariant: 'default',
        element,
      })

      expect(generated.code).toContain('target="_blank"')
      expect(generated.code).toContain('rel="noopener noreferrer"')
    })
  })

  describe('Images', () => {
    it('should generate Next.js Image component', () => {
      const element: ElementAST = {
        id: 'test-1',
        type: 'img',
        name: 'Hero Image',
        props: {
          src: 'https://example.com/image.jpg',
        },
        styles: [],
        children: [],
      }

      const generated = generator.generateComponent({
        id: 'comp-1',
        name: 'HeroImage',
        originalName: 'Hero Image',
        props: [],
        variants: [],
        defaultVariant: 'default',
        element,
      })

      expect(generated.code).toContain('<Image')
      expect(generated.code).toContain('src="https://example.com/image.jpg"')
      expect(generated.code).toContain('alt=""')
      expect(generated.imports).toContainEqual({
        from: 'next/image',
        default: 'Image',
      })
    })

    it('should generate img tag when configured', () => {
      const imgGenerator = createReactGenerator({
        imageComponent: 'img',
      })

      const element: ElementAST = {
        id: 'test-1',
        type: 'img',
        name: 'Image',
        props: {
          src: '/image.jpg',
        },
        styles: [],
        children: [],
      }

      const generated = imgGenerator.generateComponent({
        id: 'comp-1',
        name: 'BasicImage',
        originalName: 'Basic Image',
        props: [],
        variants: [],
        defaultVariant: 'default',
        element,
      })

      expect(generated.code).toContain('<img')
      expect(generated.code).not.toContain('<Image')
    })
  })

  describe('generateFile', () => {
    it('should generate complete file with imports', () => {
      const element: ElementAST = {
        id: 'test-1',
        type: 'img',
        name: 'Image',
        props: { src: '/test.jpg' },
        styles: [],
        children: [],
      }

      const generated = generator.generateComponent({
        id: 'comp-1',
        name: 'ImageComponent',
        originalName: 'Image Component',
        props: [],
        variants: [],
        defaultVariant: 'default',
        element,
      })

      const file = generator.generateFile(generated)

      expect(file).toContain("import Image from 'next/image'")
      expect(file).toContain('export function ImageComponent()')
    })
  })

  describe('Imports', () => {
    it('should generate import statements', () => {
      const imports = generator.generateImports([
        { from: 'next/image', default: 'Image' },
        { from: 'framer-motion', named: ['motion', 'AnimatePresence'] },
        { from: '@/lib/utils', named: ['cn'] },
      ])

      expect(imports).toContain("import Image from 'next/image'")
      expect(imports).toContain("import { motion, AnimatePresence } from 'framer-motion'")
      expect(imports).toContain("import { cn } from '@/lib/utils'")
    })
  })

  describe('Complex Component', () => {
    it('should generate a complete hero section', () => {
      const element: ElementAST = {
        id: 'hero-1',
        type: 'div',
        name: 'HeroSection',
        props: {},
        styles: [
          { property: 'display', value: 'flex' },
          { property: 'flex-direction', value: 'column' },
          { property: 'align-items', value: 'center' },
          { property: 'gap', value: '24px' },
          { property: 'padding', value: '80px 40px' },
          { property: 'background-color', value: 'rgb(0, 0, 0)' },
        ],
        children: [
          {
            id: 'heading-1',
            type: 'h1',
            name: 'Heading',
            props: {},
            styles: [
              { property: 'font-size', value: '72px' },
              { property: 'font-weight', value: '700' },
              { property: 'text-align', value: 'center' },
              { property: 'color', value: 'rgb(255, 255, 255)' },
            ],
            children: [
              { type: 'text', content: 'Welcome to Our Site' },
            ],
          },
          {
            id: 'subheading-1',
            type: 'p',
            name: 'Subheading',
            props: {},
            styles: [
              { property: 'font-size', value: '18px' },
              { property: 'color', value: 'rgb(255, 255, 255)' },
              { property: 'opacity', value: '0.8' },
            ],
            children: [
              { type: 'text', content: 'Build something amazing' },
            ],
          },
        ],
      }

      const generated = generator.generateComponent({
        id: 'hero-comp',
        name: 'Hero',
        originalName: 'Hero',
        props: [],
        variants: [],
        defaultVariant: 'default',
        element,
      })

      const code = generated.code

      // Check structure
      expect(code).toContain('export function Hero()')
      expect(code).toContain('<div className="flex flex-col items-center gap-6')
      expect(code).toContain('bg-black')
      expect(code).toContain('py-20 px-10')
      
      // Check heading
      expect(code).toContain('<h1 className="text-7xl font-bold text-center text-white">')
      expect(code).toContain('Welcome to Our Site')
      
      // Check subheading
      expect(code).toContain('<p className="text-lg text-white opacity-80">')
      expect(code).toContain('Build something amazing')
    })
  })

  describe('Component Prop Name Inference', () => {
    it('should infer semantic prop names from Framer IDs', () => {
      const element: ElementAST = {
        id: 'test-1',
        type: 'component',
        name: 'BadgeComponent',
        componentRef: 'elements/badge',
        componentProps: {
          'OLBJJ2ZZ2': 'Coming soon',           // Should become 'text'
          'sVlsQOR6K': 'rgb(255, 255, 255)',    // Should become 'textColor' or 'color'
          'bWKfsW3Ha': 'rgb(13, 13, 13)',       // Should become 'backgroundColor' or similar
          'zKyvF25Hr': 0.9,                     // Should become 'opacity'
          'LZ2eCPtLx': 14,                      // Should become 'size' or 'fontSize'
        },
        props: {},
        styles: [],
        children: [],
      }

      const generated = generator.generateComponent({
        id: 'comp-1',
        name: 'Page',
        originalName: 'Page',
        props: [],
        variants: [],
        defaultVariant: 'default',
        element,
      })

      // Should NOT contain raw Framer IDs
      expect(generated.code).not.toContain('OLBJJ2ZZ2')
      expect(generated.code).not.toContain('sVlsQOR6K')
      expect(generated.code).not.toContain('bWKfsW3Ha')
      expect(generated.code).not.toContain('zKyvF25Hr')
      expect(generated.code).not.toContain('LZ2eCPtLx')

      // Should contain semantic names
      expect(generated.code).toContain('text="Coming soon"')
      expect(generated.code).toContain('textColor="rgb(255, 255, 255)"')
      expect(generated.code).toContain('color="rgb(13, 13, 13)"')
      expect(generated.code).toContain('opacity={0.9}')
      expect(generated.code).toContain('size={14}')
    })

    it('should keep already semantic prop names', () => {
      const element: ElementAST = {
        id: 'test-1',
        type: 'component',
        name: 'Button',
        componentRef: 'ui/button',
        componentProps: {
          'label': 'Click me',
          'variant': 'primary',
          'disabled': false,
        },
        props: {},
        styles: [],
        children: [],
      }

      const generated = generator.generateComponent({
        id: 'comp-1',
        name: 'Page',
        originalName: 'Page',
        props: [],
        variants: [],
        defaultVariant: 'default',
        element,
      })

      expect(generated.code).toContain('label="Click me"')
      expect(generated.code).toContain('variant="primary"')
      expect(generated.code).toContain('disabled={false}')
    })

    it('should infer href from URL values', () => {
      const element: ElementAST = {
        id: 'test-1',
        type: 'component',
        name: 'CTAButton',
        componentRef: 'cta/button',
        componentProps: {
          'NAbd17i0q': 'Learn more',
          't90xdY6CE': '/about',
        },
        props: {},
        styles: [],
        children: [],
      }

      const generated = generator.generateComponent({
        id: 'comp-1',
        name: 'Page',
        originalName: 'Page',
        props: [],
        variants: [],
        defaultVariant: 'default',
        element,
      })

      expect(generated.code).toContain('text="Learn more"')
      expect(generated.code).toContain('href="/about"')
    })

    it('should handle multiple text props with unique names', () => {
      const element: ElementAST = {
        id: 'test-1',
        type: 'component',
        name: 'Card',
        componentRef: 'ui/card',
        componentProps: {
          'ABC123': 'Title text',
          'DEF456': 'Subtitle text',
          'GHI789': 'Description text',
        },
        props: {},
        styles: [],
        children: [],
      }

      const generated = generator.generateComponent({
        id: 'comp-1',
        name: 'Page',
        originalName: 'Page',
        props: [],
        variants: [],
        defaultVariant: 'default',
        element,
      })

      // Should use unique names for each text prop (with numbered suffixes for duplicates)
      expect(generated.code).toContain('text="Title text"')
      expect(generated.code).toContain('text2="Subtitle text"')
      expect(generated.code).toContain('text3="Description text"')
    })
  })
})

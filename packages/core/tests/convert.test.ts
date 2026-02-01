/**
 * High-Level Conversion API Tests
 */

import { describe, it, expect } from 'vitest'
import { convert, convertNode, convertComponent } from '../src/convert'

describe('High-Level Conversion API', () => {
  describe('convertNode', () => {
    it('should convert a simple Frame to div with Tailwind classes', () => {
      const xml = `<Frame nodeId="test1" width="100px" height="50px">Hello</Frame>`
      const result = convertNode(xml)
      
      expect(result).toContain('div')
      expect(result).toContain('w-[100px]')
      expect(result).toContain('h-[50px]')
      expect(result).toContain('Hello')
    })

    it('should convert a Frame with flex layout', () => {
      const xml = `
        <Frame 
          nodeId="test2" 
          layout="stack" 
          stackDirection="vertical" 
          gap="16px"
        >
          <Frame nodeId="child1">Child 1</Frame>
          <Frame nodeId="child2">Child 2</Frame>
        </Frame>
      `
      const result = convertNode(xml)
      
      expect(result).toContain('flex')
      expect(result).toContain('flex-col')
      expect(result).toContain('gap-4')
    })

    it('should convert a Text node to paragraph', () => {
      const xml = `<Text nodeId="text1" font="FS;Inter-regular">Sample text</Text>`
      const result = convertNode(xml)
      
      expect(result).toContain('<p')
      expect(result).toContain('Sample text')
    })

    it('should handle component instances', () => {
      // Note: XML requires proper closing tags
      const xml = `<MyButton nodeId="btn1" componentId="comp123" label="Click me"></MyButton>`
      const result = convertNode(xml)
      
      expect(result).toContain('MyButton')
      expect(result).toContain('label="Click me"')
    })
  })

  describe('convertComponent', () => {
    it('should generate a full React component', () => {
      const xml = `
        <Frame nodeId="root" width="200px" height="100px" backgroundColor="rgb(0,0,255)">
          <Text nodeId="label">Button Text</Text>
        </Frame>
      `
      const result = convertComponent(xml, { name: 'PrimaryButton' })
      
      expect(result.name).toBe('PrimaryButton')
      expect(result.code).toContain('export function PrimaryButton')
      expect(result.code).toContain('return (')
      expect(result.code).toContain('Button Text')
    })

    it('should generate imports for Image component', () => {
      // Use proper closing tag instead of self-closing
      const xml = `<Image nodeId="img1" backgroundImage="https://example.com/photo.jpg"></Image>`
      const result = convertComponent(xml, { name: 'HeroImage' })
      
      expect(result.imports.some(i => i.from === 'next/image')).toBe(true)
    })
  })

  describe('convert (full project)', () => {
    const projectXml = `
      <Project>
        <Pages>
          <Page nodeId="page1" path="/" />
          <Page nodeId="page2" path="/about" />
        </Pages>
        <Components>
          <Component nodeId="comp1" name="UI/Button" />
        </Components>
        <ColorStyles>
          <ColorStyle path="/Primary" light="rgb(59, 130, 246)" dark="rgb(96, 165, 250)" />
          <ColorStyle path="/Background" light="rgb(255, 255, 255)" dark="rgb(17, 24, 39)" />
        </ColorStyles>
        <TextStyles>
          <TextStyle
            path="/Heading 1"
            font="GF;Inter-Bold"
            fontSize="48px"
            lineHeight="1.2"
            letterSpacing="-0.02em"
            paragraphSpacing="0"
            transform="none"
            alignment="left"
            decoration="none"
            balance="false"
            tag="h1"
          />
        </TextStyles>
      </Project>
    `

    const homePageXml = `
      <Desktop nodeId="desktop1" width="1200px" layout="stack" stackDirection="vertical">
        <Frame nodeId="hero" width="100%" height="500px" backgroundColor="/Background">
          <Text nodeId="title" inlineTextStyle="/Heading 1">Welcome</Text>
        </Frame>
      </Desktop>
    `

    const aboutPageXml = `
      <Desktop nodeId="desktop2" width="1200px" layout="stack" stackDirection="vertical">
        <Frame nodeId="content" width="100%" padding="40px">
          <Text nodeId="title">About Us</Text>
        </Frame>
      </Desktop>
    `

    it('should convert a full project with multiple pages', () => {
      const result = convert({
        projectXml,
        pageNodes: new Map([
          ['page1', homePageXml],
          ['page2', aboutPageXml],
        ]),
        options: {
          projectName: 'TestSite',
          productionUrl: 'https://example.com',
        },
      })

      // Check AST
      expect(result.ast.metadata.name).toBe('TestSite')
      expect(result.ast.pages).toHaveLength(2)
      expect(result.ast.styles.colors).toHaveLength(2)

      // Check pages
      expect(result.pages).toHaveLength(2)
      expect(result.pages[0].path).toBe('/')
      expect(result.pages[0].filename).toBe('page.tsx')
      expect(result.pages[0].code).toContain('Welcome')

      expect(result.pages[1].path).toBe('/about')
      expect(result.pages[1].filename).toBe('about/page.tsx')
      expect(result.pages[1].code).toContain('About Us')
    })

    it('should generate global CSS with color variables', () => {
      const result = convert({
        projectXml,
        pageNodes: new Map([['page1', homePageXml]]),
      })

      expect(result.globalCss).toContain(':root')
      expect(result.globalCss).toContain('--color-primary')
      expect(result.globalCss).toContain('rgb(59, 130, 246)')

      // Dark mode
      expect(result.globalCss).toContain('.dark')
      expect(result.globalCss).toContain('rgb(96, 165, 250)')
    })

    it('should generate typography CSS classes', () => {
      const result = convert({
        projectXml,
        pageNodes: new Map([['page1', homePageXml]]),
      })

      expect(result.globalCss).toContain('.text-heading-1')
      expect(result.globalCss).toContain('font-size: 48px')
      expect(result.globalCss).toContain("font-family: 'Inter'")
    })

    it('should handle dynamic routes in filenames', () => {
      const dynamicProjectXml = `
        <Project>
          <Pages>
            <Page nodeId="blog" path="/blog/:slug" />
          </Pages>
          <Components />
          <ColorStyles />
          <TextStyles />
        </Project>
      `
      const blogXml = `<Desktop nodeId="d1" width="800px"><Text nodeId="t1">Blog Post</Text></Desktop>`

      const result = convert({
        projectXml: dynamicProjectXml,
        pageNodes: new Map([['blog', blogXml]]),
      })

      // Path /blog/:slug should become blog/[slug]/page.tsx
      expect(result.pages[0].filename).toBe('blog/[slug]/page.tsx')
    })
  })
})

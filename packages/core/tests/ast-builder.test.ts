/**
 * AST Builder Tests
 */

import { describe, it, expect } from 'vitest'
import { createASTBuilder } from '../src/parser/ast-builder'
import { parseProjectXml, parseNodeXml } from '../src/parser/xml-parser'
import type { FramerProject, FramerNode } from '../src/types/framer'

describe('ASTBuilder', () => {
  const sampleProjectXml = `
<Project>
  <Pages>
    <Page nodeId="augiA20Il" path="/" />
    <Page nodeId="xEgzaVFrx" path="/blog" />
  </Pages>
  <Components>
    <Component nodeId="BpV_0Y1_B" name="Elements/Badge" />
  </Components>
  <CodeComponents />
  <CodeOverrides />
  <ColorStyles>
    <ColorStyle path="/Background" light="rgb(0, 0, 0)" dark="" />
    <ColorStyle path="/Blue" light="rgb(81, 47, 235)" dark="" />
  </ColorStyles>
  <TextStyles>
    <TextStyle
        path="/Heading 1"
        font="FS;Outfit-medium"
        fontSize="72px"
        lineHeight="1.1em"
        letterSpacing="-0.04em"
        paragraphSpacing="60"
        transform="none"
        alignment="center"
        decoration="none"
        balance="true"
        tag="h1"
     />
  </TextStyles>
</Project>
`

  const sampleNodeXml = `
<Desktop
    nodeId="WQLkyLRf1"
    position="absolute"
    width="1200px"
    height="fit-content"
    backgroundColor="/Background"
    layout="stack"
    stackDirection="vertical"
    stackDistribution="start"
    stackAlignment="center"
>
  <HeroSection
      nodeId="L9GHcLjSc"
      width="100%"
      height="fit-content"
      layout="stack"
      gap="35px"
      padding="180px 40px 100px 40px"
      stackDirection="vertical"
  >
    <HeadingText
        nodeId="CCY_YCwDe"
        width="1fr"
        height="fit-content"
        inlineTextStyle="/Heading 1"
    >
      Hello World
    </HeadingText>
  </HeroSection>
</Desktop>
`

  describe('buildStyles', () => {
    it('should build color styles with CSS variables', () => {
      const project = parseProjectXml(sampleProjectXml)
      const builder = createASTBuilder()
      const styles = builder.buildStyles(project.colorStyles, project.textStyles)
      
      expect(styles.colors).toHaveLength(2)
      expect(styles.colors[0]).toEqual({
        name: 'Background',
        path: '/Background',
        light: 'rgb(0, 0, 0)',
        dark: undefined,
        cssVariable: '--color-background',
      })
    })

    it('should build typography styles with CSS classes', () => {
      const project = parseProjectXml(sampleProjectXml)
      const builder = createASTBuilder()
      const styles = builder.buildStyles(project.colorStyles, project.textStyles)
      
      expect(styles.typography).toHaveLength(1)
      expect(styles.typography[0].name).toBe('Heading 1')
      expect(styles.typography[0].cssClass).toBe('text-heading-1')
      expect(styles.typography[0].tag).toBe('h1')
      
      // Check style rules
      const fontFamily = styles.typography[0].styles.find(s => s.property === 'font-family')
      expect(fontFamily?.value).toContain('Outfit')
      
      const fontSize = styles.typography[0].styles.find(s => s.property === 'font-size')
      expect(fontSize?.value).toBe('72px')
    })
  })

  describe('buildElement', () => {
    it('should build element from node', () => {
      const node = parseNodeXml(sampleNodeXml)
      const builder = createASTBuilder()
      const element = builder.buildElement(node)
      
      expect(element.id).toBe('WQLkyLRf1')
      expect(element.name).toBe('Desktop')
      expect(element.type).toBe('div')
    })

    it('should convert stack layout to flex styles', () => {
      const node = parseNodeXml(sampleNodeXml)
      const builder = createASTBuilder()
      const element = builder.buildElement(node)
      
      const display = element.styles.find(s => s.property === 'display')
      expect(display?.value).toBe('flex')
      
      const flexDir = element.styles.find(s => s.property === 'flex-direction')
      expect(flexDir?.value).toBe('column')
    })

    it('should handle nested children', () => {
      const node = parseNodeXml(sampleNodeXml)
      const builder = createASTBuilder()
      const element = builder.buildElement(node)
      
      expect(element.children).toHaveLength(1)
      
      const hero = element.children[0] as any
      expect(hero.name).toBe('HeroSection')
      expect(hero.children).toHaveLength(1)
      
      const heading = hero.children[0] as any
      expect(heading.name).toBe('HeadingText')
    })

    it('should preserve text content', () => {
      const node = parseNodeXml(sampleNodeXml)
      const builder = createASTBuilder()
      const element = builder.buildElement(node)
      
      const hero = element.children[0] as any
      const heading = hero.children[0] as any
      
      expect(heading.children).toHaveLength(1)
      expect(heading.children[0]).toEqual({
        type: 'text',
        content: 'Hello World',
      })
    })

    it('should convert color style paths to CSS variables', () => {
      const node = parseNodeXml(sampleNodeXml)
      const builder = createASTBuilder()
      const element = builder.buildElement(node)
      
      const bgColor = element.styles.find(s => s.property === 'background-color')
      expect(bgColor?.value).toBe('var(--color-background)')
    })
  })

  describe('buildPage', () => {
    it('should build page AST', () => {
      const node = parseNodeXml(sampleNodeXml)
      const builder = createASTBuilder()
      const page = builder.buildPage('/', node)
      
      expect(page.id).toBe('WQLkyLRf1')
      expect(page.path).toBe('/')
      expect(page.name).toBe('Home')
      expect(page.breakpoints.desktop).toBeDefined()
    })

    it('should detect CMS dynamic routes', () => {
      const node = parseNodeXml(sampleNodeXml)
      const builder = createASTBuilder()
      const page = builder.buildPage('/blog/:slug', node, [
        { id: 'coll1', name: 'blog', managedBy: 'user', readonly: false, fields: [] }
      ])
      
      expect(page.cmsCollection).toBe('coll1')
    })
  })

  describe('buildComponent', () => {
    it('should build component AST', () => {
      const node = parseNodeXml(sampleNodeXml)
      const builder = createASTBuilder()
      const component = builder.buildComponent('comp1', 'Elements/Badge', node)
      
      expect(component.id).toBe('comp1')
      expect(component.name).toBe('ElementsBadge')
      expect(component.originalName).toBe('Elements/Badge')
    })
  })
})

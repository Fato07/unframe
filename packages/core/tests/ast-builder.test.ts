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

  describe('Stack/Grid layout - absolute positioning fix', () => {
    const stackWithAbsoluteChildrenXml = `
<Container
    nodeId="container1"
    position="absolute"
    top="0"
    left="0"
    width="1200px"
    height="fit-content"
    layout="stack"
    stackDirection="horizontal"
    gap="24px"
>
  <Card1
      nodeId="card1"
      position="absolute"
      top="0"
      left="0"
      width="300px"
      height="200px"
      backgroundColor="rgb(255,255,255)"
  />
  <Card2
      nodeId="card2"
      position="absolute"
      top="0"
      left="324px"
      width="300px"
      height="200px"
      backgroundColor="rgb(255,255,255)"
  />
</Container>
`

    const gridWithAbsoluteChildrenXml = `
<GridContainer
    nodeId="grid1"
    position="absolute"
    top="0"
    left="0"
    width="1200px"
    height="fit-content"
    layout="grid"
    gridColumns="3"
    gap="24px"
>
  <GridItem1
      nodeId="item1"
      position="absolute"
      top="0"
      left="0"
      width="100%"
      height="200px"
  />
  <GridItem2
      nodeId="item2"
      position="absolute"
      top="0"
      left="0"
      width="100%"
      height="200px"
  />
</GridContainer>
`

    const nestedStackXml = `
<Outer
    nodeId="outer1"
    position="absolute"
    top="0"
    left="0"
    width="1200px"
    layout="stack"
    stackDirection="vertical"
    gap="32px"
>
  <Inner
      nodeId="inner1"
      position="absolute"
      top="0"
      left="0"
      width="100%"
      layout="stack"
      stackDirection="horizontal"
      gap="16px"
  >
    <DeepChild
        nodeId="deep1"
        position="absolute"
        top="0"
        left="0"
        width="200px"
        height="100px"
    />
  </Inner>
</Outer>
`

    it('should NOT add absolute positioning to children of stack (flex) containers', () => {
      const node = parseNodeXml(stackWithAbsoluteChildrenXml)
      const builder = createASTBuilder()
      const element = builder.buildElement(node)
      
      // The container itself should have flex layout
      const containerDisplay = element.styles.find(s => s.property === 'display')
      expect(containerDisplay?.value).toBe('flex')
      
      // The container can have absolute positioning (it's root level, no parent)
      // But that's fine since it doesn't have a flex/grid parent
      
      // The children should NOT have position: absolute
      const card1 = element.children[0] as any
      const card2 = element.children[1] as any
      
      const card1Position = card1.styles.find((s: any) => s.property === 'position')
      const card2Position = card2.styles.find((s: any) => s.property === 'position')
      
      expect(card1Position).toBeUndefined()
      expect(card2Position).toBeUndefined()
      
      // Children should NOT have top/left/right/bottom
      const card1Top = card1.styles.find((s: any) => s.property === 'top')
      const card1Left = card1.styles.find((s: any) => s.property === 'left')
      const card2Top = card2.styles.find((s: any) => s.property === 'top')
      const card2Left = card2.styles.find((s: any) => s.property === 'left')
      
      expect(card1Top).toBeUndefined()
      expect(card1Left).toBeUndefined()
      expect(card2Top).toBeUndefined()
      expect(card2Left).toBeUndefined()
      
      // Children should still have their size styles
      const card1Width = card1.styles.find((s: any) => s.property === 'width')
      expect(card1Width?.value).toBe('300px')
    })

    it('should NOT add absolute positioning to children of grid containers', () => {
      const node = parseNodeXml(gridWithAbsoluteChildrenXml)
      const builder = createASTBuilder()
      const element = builder.buildElement(node)
      
      // The container should have grid layout
      const containerDisplay = element.styles.find(s => s.property === 'display')
      expect(containerDisplay?.value).toBe('grid')
      
      // Children should NOT have position: absolute
      const item1 = element.children[0] as any
      const item2 = element.children[1] as any
      
      const item1Position = item1.styles.find((s: any) => s.property === 'position')
      const item2Position = item2.styles.find((s: any) => s.property === 'position')
      
      expect(item1Position).toBeUndefined()
      expect(item2Position).toBeUndefined()
      
      // Children should NOT have top/left
      const item1Top = item1.styles.find((s: any) => s.property === 'top')
      const item1Left = item1.styles.find((s: any) => s.property === 'left')
      
      expect(item1Top).toBeUndefined()
      expect(item1Left).toBeUndefined()
    })

    it('should handle nested stack containers correctly', () => {
      const node = parseNodeXml(nestedStackXml)
      const builder = createASTBuilder()
      const element = builder.buildElement(node)
      
      // Outer is root level (no flex parent), so it can have absolute if needed
      // But in our case, root elements don't have absolute by default
      
      // Inner is a child of Outer (which is a stack), so Inner should NOT have absolute
      const inner = element.children[0] as any
      const innerPosition = inner.styles.find((s: any) => s.property === 'position')
      expect(innerPosition).toBeUndefined()
      
      // Inner should still be a flex container
      const innerDisplay = inner.styles.find((s: any) => s.property === 'display')
      expect(innerDisplay?.value).toBe('flex')
      
      // DeepChild is a child of Inner (which is also a stack), so DeepChild should NOT have absolute
      const deepChild = inner.children[0] as any
      const deepChildPosition = deepChild.styles.find((s: any) => s.property === 'position')
      const deepChildTop = deepChild.styles.find((s: any) => s.property === 'top')
      const deepChildLeft = deepChild.styles.find((s: any) => s.property === 'left')
      
      expect(deepChildPosition).toBeUndefined()
      expect(deepChildTop).toBeUndefined()
      expect(deepChildLeft).toBeUndefined()
    })

    it('should track parentLayout on elements', () => {
      const node = parseNodeXml(stackWithAbsoluteChildrenXml)
      const builder = createASTBuilder()
      const element = builder.buildElement(node)
      
      // Root element has no parent layout (or 'none')
      expect(element.parentLayout).toBe('none')
      
      // Children of stack should have parentLayout: 'stack'
      const card1 = element.children[0] as any
      const card2 = element.children[1] as any
      
      expect(card1.parentLayout).toBe('stack')
      expect(card2.parentLayout).toBe('stack')
    })

    it('should track parentLayout for grid children', () => {
      const node = parseNodeXml(gridWithAbsoluteChildrenXml)
      const builder = createASTBuilder()
      const element = builder.buildElement(node)
      
      // Children of grid should have parentLayout: 'grid'
      const item1 = element.children[0] as any
      expect(item1.parentLayout).toBe('grid')
    })
  })
})

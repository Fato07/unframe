/**
 * Integration Tests
 *
 * These tests use real MCP data from CodesDevs.io
 * Run with: pnpm test -- integration --run
 */

import { describe, it, expect } from 'vitest'
import { parseProjectXml, parseNodeXml, extractFocusedNodeId } from '../src/parser/xml-parser'
import { createASTBuilder } from '../src/parser/ast-builder'

// Sample real data from CodesDevs.io Framer project (extracted from MCP)
const REAL_PROJECT_XML = `
<Project>
  <Pages>
    <Page nodeId="augiA20Il" path="/" />
    <Page nodeId="wAMTCD83n" path="/404" />
    <Page nodeId="z8uHZqtaL" path="/coming-soon" />
    <Page nodeId="xEgzaVFrx" path="/blog" />
    <Page nodeId="eqMtH8HH0" path="/blog/:slug" />
  </Pages>
  <Components>
    <Component nodeId="BpV_0Y1_B" name="Elements/Badge" />
    <Component nodeId="T9wkJjJeC" name="CTA Button" />
    <Component nodeId="nNwmYXZ_W" name="Pricing Plan" />
    <Component nodeId="AqeMOsAGh" name="Pricing Plan features" />
    <Component nodeId="h7wSa4hXT" name="Analyze Card" />
    <Component nodeId="S9RrCB1zs" name="Development card" />
    <Component nodeId="O9U_tuvq1" name="Footer/Footer" />
    <Component nodeId="vTxPF9bF_" name="Navigation/Navbar" />
  </Components>
  <CodeComponents />
  <CodeOverrides>
    <CodeOverride codeFileId="n9eKMvF" path="Examples.tsx" />
    <CodeOverride codeFileId="lvec8bj" path="BlogContentStyles.tsx" />
  </CodeOverrides>
  <ColorStyles>
    <ColorStyle path="/Background" light="rgb(0, 0, 0)" dark="" />
    <ColorStyle path="/Blue" light="rgb(81, 47, 235)" dark="" />
    <ColorStyle path="/Primary Text" light="rgb(255, 255, 255)" dark="" />
    <ColorStyle path="/Secondary Text" light="rgba(255, 255, 255, 0.7)" dark="" />
    <ColorStyle path="/Card background" light="rgba(255, 255, 255, 0.06)" dark="" />
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
    <TextStyle
        path="/Heading 2"
        font="FS;Outfit-medium"
        fontSize="48px"
        lineHeight="1.2em"
        letterSpacing="-0.03em"
        paragraphSpacing="40"
        transform="none"
        alignment="center"
        decoration="none"
        balance="true"
        tag="h2"
     />
    <TextStyle
        path="/Body (M)"
        font="FS;Outfit-light"
        fontSize="18px"
        lineHeight="1.4em"
        letterSpacing="-0.02em"
        paragraphSpacing="20"
        transform="none"
        alignment="center"
        decoration="none"
        balance="false"
        tag="p"
     />
  </TextStyles>
</Project>
`

const REAL_HOME_PAGE_XML = `
<Desktop
    nodeId="WQLkyLRf1"
    position="absolute"
    width="1200px"
    height="fit-content"
    top="0px"
    left="0px"
    backgroundColor="/Background"
    layout="stack"
    stackDirection="vertical"
    stackDistribution="start"
    stackAlignment="center"
>
  <NavigationNavbar
      nodeId="mbg_4ZpCC"
      position="fixed"
      width="100%"
      height="fit-content"
      top="0px"
      centerX="50%"
      componentId="vTxPF9bF_"
      variant="hDEI5y1ed"
   />
  <HeroSection
      nodeId="L9GHcLjSc"
      width="100%"
      height="fit-content"
      borderRadius="0px"
      layout="stack"
      gap="35px"
      padding="180px 40px 100px 40px"
      stackDirection="vertical"
      stackDistribution="center"
      stackAlignment="center"
  >
    <Content
        nodeId="o837tNnzk"
        width="1fr"
        height="fit-content"
        layout="stack"
        gap="15px"
        stackDirection="vertical"
        stackDistribution="center"
        stackAlignment="center"
    >
      <ElementsBadge
          nodeId="LqWnLVWtB"
          width="fit-content"
          height="fit-content"
          componentId="BpV_0Y1_B"
          OLBJJ2ZZ2="Vertical AI Agents for Business Growth"
          sVlsQOR6K="rgb(255, 255, 255)"
       />
      <Container
          nodeId="keggeu9sO"
          width="1fr"
          height="fit-content"
          layout="stack"
          gap="32px"
          stackDirection="vertical"
          stackDistribution="center"
          stackAlignment="center"
      >
        <HeadingAndSubheading
            nodeId="ckGu6hhpy"
            width="1fr"
            height="fit-content"
            layout="stack"
            gap="15px"
            stackDirection="vertical"
            stackDistribution="center"
            stackAlignment="center"
        >
          <MainHeading
              nodeId="CCY_YCwDe"
              width="1fr"
              height="fit-content"
              maxWidth="900px"
              inlineTextStyle="/Heading 1"
          >
            Replace Busywork With AI Agents That Drive Growth
          </MainHeading>
          <SubHeading
              nodeId="UC1KTo907"
              width="1fr"
              height="fit-content"
              maxWidth="500px"
              inlineTextStyle="/Body (M)"
          >
            We build secure, enterprise-grade AI systems that eliminate repetitive work.
          </SubHeading>
        </HeadingAndSubheading>
      </Container>
    </Content>
  </HeroSection>
</Desktop>
`

describe('Real CodesDevs.io Data', () => {
  describe('Project Structure', () => {
    it('should parse all pages correctly', () => {
      const project = parseProjectXml(REAL_PROJECT_XML)
      
      expect(project.pages).toHaveLength(5)
      expect(project.pages.map(p => p.path)).toEqual([
        '/',
        '/404',
        '/coming-soon',
        '/blog',
        '/blog/:slug',
      ])
    })

    it('should parse all components', () => {
      const project = parseProjectXml(REAL_PROJECT_XML)
      
      expect(project.components).toHaveLength(8)
      expect(project.components.find(c => c.name === 'Navigation/Navbar')).toBeDefined()
      expect(project.components.find(c => c.name === 'Footer/Footer')).toBeDefined()
    })

    it('should parse color styles with project paths', () => {
      const project = parseProjectXml(REAL_PROJECT_XML)
      
      expect(project.colorStyles).toHaveLength(5)
      
      const bgColor = project.colorStyles.find(c => c.path === '/Background')
      expect(bgColor).toEqual({
        path: '/Background',
        light: 'rgb(0, 0, 0)',
        dark: undefined,
      })
    })

    it('should parse text styles with all properties', () => {
      const project = parseProjectXml(REAL_PROJECT_XML)
      
      expect(project.textStyles).toHaveLength(3)
      
      const h1 = project.textStyles.find(s => s.path === '/Heading 1')
      expect(h1?.fontSize).toBe('72px')
      expect(h1?.font).toBe('FS;Outfit-medium')
      expect(h1?.tag).toBe('h1')
    })
  })

  describe('Home Page Node', () => {
    it('should parse Desktop breakpoint node', () => {
      const node = parseNodeXml(REAL_HOME_PAGE_XML)
      
      expect(node.name).toBe('Desktop')
      expect(node.nodeId).toBe('WQLkyLRf1')
      expect(node.type).toBe('Desktop')
    })

    it('should parse navbar as component instance', () => {
      const node = parseNodeXml(REAL_HOME_PAGE_XML)
      const navbar = node.children[0]
      
      expect(navbar.name).toBe('NavigationNavbar')
      expect(navbar.type).toBe('ComponentInstance')
      expect(navbar.attributes.componentId).toBe('vTxPF9bF_')
      expect(navbar.attributes.position).toBe('fixed')
    })

    it('should parse hero section with nested structure', () => {
      const node = parseNodeXml(REAL_HOME_PAGE_XML)
      const hero = node.children[1]
      
      expect(hero.name).toBe('HeroSection')
      expect(hero.attributes.layout).toBe('stack')
      expect(hero.attributes.gap).toBe('35px')
      expect(hero.attributes.padding).toBe('180px 40px 100px 40px')
    })

    it('should parse badge component instance with custom props', () => {
      const node = parseNodeXml(REAL_HOME_PAGE_XML)
      const hero = node.children[1]
      const content = hero.children[0]
      const badge = content.children[0]
      
      expect(badge.name).toBe('ElementsBadge')
      expect(badge.type).toBe('ComponentInstance')
      expect(badge.attributes.componentId).toBe('BpV_0Y1_B')
      // Custom component props
      expect(badge.attributes.OLBJJ2ZZ2).toBe('Vertical AI Agents for Business Growth')
    })

    it('should parse text with text style reference', () => {
      const node = parseNodeXml(REAL_HOME_PAGE_XML)
      const hero = node.children[1]
      const content = hero.children[0]
      const container = content.children[1]
      const headingContainer = container.children[0]
      const mainHeading = headingContainer.children[0]
      
      expect(mainHeading.name).toBe('MainHeading')
      expect(mainHeading.attributes.inlineTextStyle).toBe('/Heading 1')
      expect((mainHeading as any).textContent).toBe('Replace Busywork With AI Agents That Drive Growth')
    })
  })

  describe('Full AST Build', () => {
    it('should build complete AST from project and page', () => {
      const project = parseProjectXml(REAL_PROJECT_XML)
      const homeNode = parseNodeXml(REAL_HOME_PAGE_XML)
      
      const builder = createASTBuilder({
        projectName: 'CodesDevs',
        productionUrl: 'https://www.codesdevs.io',
      })
      
      // Build page nodes map
      const pageNodes = new Map([['augiA20Il', homeNode]])
      
      // Build AST
      const ast = builder.buildProject(project, pageNodes, new Map())
      
      // Verify metadata
      expect(ast.metadata.name).toBe('CodesDevs')
      expect(ast.metadata.productionUrl).toBe('https://www.codesdevs.io')
      
      // Verify pages
      expect(ast.pages).toHaveLength(1) // Only home page provided
      expect(ast.pages[0].path).toBe('/')
      expect(ast.pages[0].name).toBe('Home')
      
      // Verify styles
      expect(ast.styles.colors).toHaveLength(5)
      expect(ast.styles.typography).toHaveLength(3)
      
      // Verify color CSS variables
      const bgColor = ast.styles.colors.find(c => c.name === 'Background')
      expect(bgColor?.cssVariable).toBe('--color-background')
    })

    it('should generate correct flex styles from stack layout', () => {
      const homeNode = parseNodeXml(REAL_HOME_PAGE_XML)
      const builder = createASTBuilder()
      const element = builder.buildElement(homeNode)
      
      // Root Desktop node should have flex column
      expect(element.styles).toContainEqual({ property: 'display', value: 'flex' })
      expect(element.styles).toContainEqual({ property: 'flex-direction', value: 'column' })
      
      // Hero section should also have flex
      const hero = element.children[1] as any
      expect(hero.styles).toContainEqual({ property: 'display', value: 'flex' })
      expect(hero.styles).toContainEqual({ property: 'gap', value: '35px' })
    })

    it('should identify component instances correctly', () => {
      const homeNode = parseNodeXml(REAL_HOME_PAGE_XML)
      const builder = createASTBuilder()
      const element = builder.buildElement(homeNode)
      
      // Navbar should be identified as component
      const navbar = element.children[0] as any
      expect(navbar.type).toBe('component')
      expect(navbar.componentRef).toBe('vTxPF9bF_')
    })
  })
})

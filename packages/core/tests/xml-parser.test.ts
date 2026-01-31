/**
 * XML Parser Tests
 */

import { describe, it, expect } from 'vitest'
import {
  parseProjectXml,
  parseNodeXml,
  extractFocusedNodeId,
  parseColorValue,
  parseFontValue,
} from '../src/parser/xml-parser'

describe('parseProjectXml', () => {
  const sampleProjectXml = `
Some header text that should be skipped...

<Project>
  <Pages>
    <Page nodeId="augiA20Il" path="/" />
    <Page nodeId="wAMTCD83n" path="/404" />
    <Page nodeId="xEgzaVFrx" path="/blog" />
    <Page nodeId="eqMtH8HH0" path="/blog/:slug" />
  </Pages>
  <Components>
    <Component nodeId="BpV_0Y1_B" name="Elements/Badge" />
    <Component nodeId="vTxPF9bF_" name="Navigation/Navbar" />
  </Components>
  <CodeComponents />
  <CodeOverrides>
    <CodeOverride codeFileId="n9eKMvF" path="Examples.tsx" />
  </CodeOverrides>
  <ColorStyles>
    <ColorStyle path="/Background" light="rgb(0, 0, 0)" dark="" />
    <ColorStyle path="/Blue" light="rgb(81, 47, 235)" dark="" />
    <ColorStyle path="/Primary Text" light="rgb(255, 255, 255)" dark="" />
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

The currently focused page ID is: \`eqMtH8HH0\`
`

  it('should parse pages', () => {
    const result = parseProjectXml(sampleProjectXml)
    
    expect(result.pages).toHaveLength(4)
    expect(result.pages[0]).toEqual({
      nodeId: 'augiA20Il',
      path: '/',
    })
    expect(result.pages[3]).toEqual({
      nodeId: 'eqMtH8HH0',
      path: '/blog/:slug',
    })
  })

  it('should parse components', () => {
    const result = parseProjectXml(sampleProjectXml)
    
    expect(result.components).toHaveLength(2)
    expect(result.components[0]).toEqual({
      nodeId: 'BpV_0Y1_B',
      name: 'Elements/Badge',
    })
  })

  it('should parse code overrides', () => {
    const result = parseProjectXml(sampleProjectXml)
    
    expect(result.codeOverrides).toHaveLength(1)
    expect(result.codeOverrides[0]).toEqual({
      codeFileId: 'n9eKMvF',
      path: 'Examples.tsx',
    })
  })

  it('should parse color styles', () => {
    const result = parseProjectXml(sampleProjectXml)
    
    expect(result.colorStyles).toHaveLength(3)
    expect(result.colorStyles[0]).toEqual({
      path: '/Background',
      light: 'rgb(0, 0, 0)',
      dark: undefined,
    })
    expect(result.colorStyles[1]).toEqual({
      path: '/Blue',
      light: 'rgb(81, 47, 235)',
      dark: undefined,
    })
  })

  it('should parse text styles', () => {
    const result = parseProjectXml(sampleProjectXml)
    
    expect(result.textStyles).toHaveLength(2)
    expect(result.textStyles[0]).toEqual({
      path: '/Heading 1',
      font: 'FS;Outfit-medium',
      fontSize: '72px',
      lineHeight: '1.1em',
      letterSpacing: '-0.04em',
      paragraphSpacing: 60, // Parsed as number by XML parser
      transform: 'none',
      alignment: 'center',
      decoration: 'none',
      balance: true,
      tag: 'h1',
    })
  })

  it('should handle empty collections', () => {
    const result = parseProjectXml(sampleProjectXml)
    expect(result.codeFiles).toEqual([])
  })
})

describe('parseNodeXml', () => {
  const sampleNodeXml = `
Node xml:
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
    <HeadingText
        nodeId="CCY_YCwDe"
        width="1fr"
        height="fit-content"
        maxWidth="900px"
        inlineTextStyle="/Heading 1"
    >
      Replace Busywork With AI Agents That Drive Growth
    </HeadingText>
  </HeroSection>
</Desktop>
`

  it('should parse root node', () => {
    const result = parseNodeXml(sampleNodeXml)
    
    expect(result.name).toBe('Desktop')
    expect(result.nodeId).toBe('WQLkyLRf1')
    expect(result.type).toBe('Desktop')
  })

  it('should parse node attributes', () => {
    const result = parseNodeXml(sampleNodeXml)
    
    expect(result.attributes.position).toBe('absolute')
    expect(result.attributes.width).toBe('1200px')
    expect(result.attributes.layout).toBe('stack')
    expect(result.attributes.stackDirection).toBe('vertical')
  })

  it('should parse children', () => {
    const result = parseNodeXml(sampleNodeXml)
    
    expect(result.children).toHaveLength(2)
    expect(result.children[0].name).toBe('NavigationNavbar')
    expect(result.children[1].name).toBe('HeroSection')
  })

  it('should detect component instances', () => {
    const result = parseNodeXml(sampleNodeXml)
    const navbar = result.children[0]
    
    expect(navbar.type).toBe('ComponentInstance')
    expect(navbar.attributes.componentId).toBe('vTxPF9bF_')
  })

  it('should parse nested children with text content', () => {
    const result = parseNodeXml(sampleNodeXml)
    const hero = result.children[1]
    
    expect(hero.children).toHaveLength(1)
    
    const heading = hero.children[0]
    expect(heading.name).toBe('HeadingText')
    expect(heading.attributes.inlineTextStyle).toBe('/Heading 1')
    expect((heading as any).textContent).toBe('Replace Busywork With AI Agents That Drive Growth')
  })
})

describe('extractFocusedNodeId', () => {
  it('should extract focused node ID from response', () => {
    const response = 'Some text... The currently focused page ID is: `eqMtH8HH0`, call getNodeXml...'
    expect(extractFocusedNodeId(response)).toBe('eqMtH8HH0')
  })

  it('should return null if no focused ID found', () => {
    const response = 'Some response without focused ID'
    expect(extractFocusedNodeId(response)).toBeNull()
  })
})

describe('parseColorValue', () => {
  it('should detect style path references', () => {
    const result = parseColorValue('/Primary/Blue')
    expect(result.type).toBe('style')
    expect(result.value).toBe('/Primary/Blue')
  })

  it('should detect raw color values', () => {
    const result = parseColorValue('rgb(255, 0, 0)')
    expect(result.type).toBe('raw')
    expect(result.value).toBe('rgb(255, 0, 0)')
  })
})

describe('parseFontValue', () => {
  it('should parse Google Fonts', () => {
    const result = parseFontValue('GF;Inter-400')
    expect(result.source).toBe('google')
    expect(result.family).toBe('Inter')
    expect(result.weight).toBe('400')
  })

  it('should parse Framer System Fonts', () => {
    const result = parseFontValue('FS;Outfit-medium')
    expect(result.source).toBe('framer')
    expect(result.family).toBe('Outfit')
    expect(result.weight).toBe('medium')
  })

  it('should handle custom fonts', () => {
    const result = parseFontValue('CustomFont')
    expect(result.source).toBe('custom')
    expect(result.family).toBe('CustomFont')
  })
})

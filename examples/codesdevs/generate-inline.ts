/**
 * CodesDevs Generation Script (Inline)
 * 
 * Run with: npx tsx generate-inline.ts
 */

import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'

// Import from dist directly
import { parseProjectXml, parseNodeXml, createASTBuilder, scaffoldNextjsProject } from '../../packages/core/dist/index.mjs'

// Real data from CodesDevs.io
const PROJECT_XML = `
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
  <CodeOverrides />
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

const HOME_PAGE_XML = `
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
        <CTAButtons
            nodeId="xHNYhQz1t"
            width="fit-content"
            height="fit-content"
            layout="stack"
            gap="12px"
            stackDirection="horizontal"
            stackDistribution="center"
            stackAlignment="center"
        >
          <PrimaryButton
              nodeId="btn1"
              width="fit-content"
              height="fit-content"
              padding="16px 32px"
              borderRadius="8px"
              backgroundColor="/Blue"
              layout="stack"
              stackAlignment="center"
          >
            <ButtonText nodeId="btn1txt" inlineTextStyle="/Body (M)">
              Get Started
            </ButtonText>
          </PrimaryButton>
        </CTAButtons>
      </Container>
    </Content>
  </HeroSection>
  <FeaturesSection
      nodeId="features1"
      width="100%"
      height="fit-content"
      layout="stack"
      gap="48px"
      padding="100px 40px"
      stackDirection="vertical"
      stackAlignment="center"
      backgroundColor="/Background"
  >
    <SectionHeader
        nodeId="fheader1"
        width="1fr"
        height="fit-content"
        layout="stack"
        gap="16px"
        stackDirection="vertical"
        stackAlignment="center"
    >
      <SectionTitle nodeId="ftitle1" inlineTextStyle="/Heading 2">
        AI-Powered Solutions
      </SectionTitle>
      <SectionSubtitle nodeId="fsub1" inlineTextStyle="/Body (M)">
        Transform your business with intelligent automation
      </SectionSubtitle>
    </SectionHeader>
    <FeaturesGrid
        nodeId="fgrid1"
        width="100%"
        maxWidth="1200px"
        height="fit-content"
        layout="grid"
        gridColumns="3"
        gap="24px"
    >
      <FeatureCard
          nodeId="fc1"
          width="100%"
          height="fit-content"
          padding="32px"
          borderRadius="16px"
          backgroundColor="/Card background"
          layout="stack"
          gap="16px"
          stackDirection="vertical"
      >
        <FeatureTitle nodeId="fc1t" inlineTextStyle="/Heading 2">
          Smart Automation
        </FeatureTitle>
        <FeatureDesc nodeId="fc1d" inlineTextStyle="/Body (M)">
          Automate repetitive tasks with AI agents that learn and adapt.
        </FeatureDesc>
      </FeatureCard>
      <FeatureCard
          nodeId="fc2"
          width="100%"
          height="fit-content"
          padding="32px"
          borderRadius="16px"
          backgroundColor="/Card background"
          layout="stack"
          gap="16px"
          stackDirection="vertical"
      >
        <FeatureTitle nodeId="fc2t" inlineTextStyle="/Heading 2">
          Data Analysis
        </FeatureTitle>
        <FeatureDesc nodeId="fc2d" inlineTextStyle="/Body (M)">
          Get insights from your data with intelligent analysis tools.
        </FeatureDesc>
      </FeatureCard>
      <FeatureCard
          nodeId="fc3"
          width="100%"
          height="fit-content"
          padding="32px"
          borderRadius="16px"
          backgroundColor="/Card background"
          layout="stack"
          gap="16px"
          stackDirection="vertical"
      >
        <FeatureTitle nodeId="fc3t" inlineTextStyle="/Heading 2">
          Secure &amp; Private
        </FeatureTitle>
        <FeatureDesc nodeId="fc3d" inlineTextStyle="/Body (M)">
          Enterprise-grade security with your data privacy guaranteed.
        </FeatureDesc>
      </FeatureCard>
    </FeaturesGrid>
  </FeaturesSection>
</Desktop>
`

async function main() {
  console.log('🚀 Generating CodesDevs Next.js Project...\n')

  // Step 1: Parse XML
  console.log('📋 Parsing Framer XML...')
  const project = parseProjectXml(PROJECT_XML)
  const homeNode = parseNodeXml(HOME_PAGE_XML)
  console.log(`   ✓ Found ${project.pages.length} pages`)
  console.log(`   ✓ Found ${project.components.length} components`)
  console.log(`   ✓ Found ${project.colorStyles.length} colors`)
  console.log(`   ✓ Found ${project.textStyles.length} text styles\n`)

  // Step 2: Build AST
  console.log('🔧 Building AST...')
  const builder = createASTBuilder({
    projectName: 'CodesDevs',
    productionUrl: 'https://www.codesdevs.io',
  })

  const pageNodes = new Map([['augiA20Il', homeNode]])
  const ast = builder.buildProject(project, pageNodes, new Map())
  console.log(`   ✓ Built ${ast.pages.length} page AST`)
  console.log(`   ✓ Built ${ast.styles.colors.length} color styles`)
  console.log(`   ✓ Built ${ast.styles.typography.length} typography styles\n`)

  // Step 3: Scaffold Next.js project
  console.log('🏗️  Generating Next.js Project...')
  const result = scaffoldNextjsProject(ast, {
    codeStyle: {
      typescript: true,
      semicolons: false,
      singleQuote: true,
      tabWidth: 2,
    },
    features: {
      animations: false,
      cms: false,
      responsive: true,
      darkMode: false,
    },
  })

  console.log(`   ✓ Generated ${result.files.length} files`)
  console.log(`   ✓ Created ${result.directories.length} directories\n`)

  // Step 4: Write files
  console.log('📁 Writing files...')
  const outDir = join(process.cwd(), 'out')

  for (const dir of result.directories) {
    mkdirSync(join(outDir, dir), { recursive: true })
  }

  for (const file of result.files) {
    const filePath = join(outDir, file.path)
    mkdirSync(dirname(filePath), { recursive: true })
    writeFileSync(filePath, file.content)
    console.log(`   ✓ ${file.path}`)
  }

  console.log('\n✨ Generation complete!')
  console.log(`   Output: ${outDir}\n`)

  // Print sample generated code
  console.log('📝 Sample Generated Code (app/page.tsx):')
  console.log('─'.repeat(60))
  const pageFile = result.files.find(f => f.path === 'app/page.tsx')
  if (pageFile) {
    console.log(pageFile.content)
  }
}

main().catch(console.error)

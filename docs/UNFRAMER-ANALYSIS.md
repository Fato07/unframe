# Unframer Source Code Analysis

**Analyzed:** 2026-01-31  
**Repository:** https://github.com/remorses/unframer  
**Purpose:** Understand patterns for building our Framer React exporter

---

## 1. Architecture Overview

Unframer takes a fundamentally different approach than what we're building:

### Unframer's Approach
```
Framer Project → Component URLs → esbuild Bundle → JSX/CSS Output
```

- **Does NOT parse XML** - Uses Framer's export API that returns component module URLs
- **Core is bundling** - Uses esbuild to bundle component code from Framer CDN
- **Runtime wrapper** - Provides React components that wrap Framer components with context
- **Type extraction** - Runs bundled JS to extract `propertyControls` at runtime

### Our Approach (Unframe)
```
Framer MCP XML → Parse → AST → Transform → React/Tailwind Output
```

- **Parses XML directly** - Uses MCP tools: `getProjectXml`, `getNodeXml`, `getCMSCollections`
- **Full AST** - Converts XML to typed AST representation
- **Code generation** - Generates clean React components, not wrappers
- **No runtime dependency** - Output is standalone React code

---

## 2. Key Unframer Patterns Worth Adopting

### 2.1 Configuration Management

```typescript
// ~/.unframer/config.json
interface UnframerConfig {
  mcpUrl?: string;
  cachedMcpTools?: CachedMcpTools;
}
```

**Lesson:** Store MCP connection details and cache tool schemas.

### 2.2 Component Name Normalization

```typescript
// kebabCase conversion for file paths
function componentNameToPath(name: string) {
  return name
    .split('/')
    .filter(Boolean)
    .map((part) => kebabCase(part))
    .join('/') || 'component-without-name'
}
```

**Lesson:** Framer component names like "Elements/Badge" → "elements/badge"

### 2.3 Breakpoint Handling

```typescript
const defaultBreakpointSizes = {
  base: 0,
  sm: 320,
  md: 768,
  lg: 960,
  xl: 1200,
  '2xl': 1536,
}
```

**Lesson:** Match Framer's breakpoint system for responsive variants.

### 2.4 Font CSS Generation

```typescript
function getFontsStyles(fontsBundles: ComponentFontBundle[]) {
  // Generates @font-face declarations
  // Groups by file for better comments
  // Handles both old (family) and new (cssFamilyName) formats
}
```

**Lesson:** Framer uses both Google Fonts ("GF;...") and custom fonts ("FS;...").

### 2.5 CSS Reset Strategy

They import from their package:
```css
@import "unframer/styles/reset.css";
@import "unframer/styles/framer.css";
```

**Lesson:** We need minimal reset CSS that matches Framer's rendering.

---

## 3. Framer MCP XML Format

### 3.1 Project Structure XML

```xml
<Project>
  <Pages>
    <Page nodeId="augiA20Il" path="/" />
    <Page nodeId="xEgzaVFrx" path="/blog" />
    <Page nodeId="eqMtH8HH0" path="/blog/:slug" />
  </Pages>
  
  <Components>
    <Component nodeId="BpV_0Y1_B" name="Elements/Badge" />
    <Component nodeId="vTxPF9bF_" name="Navigation/Navbar" />
  </Components>
  
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
      alignment="center"
      tag="h1"
    />
  </TextStyles>
</Project>
```

### 3.2 Node XML Structure

```xml
<Desktop
    nodeId="WQLkyLRf1"
    position="absolute"
    width="1200px"
    height="fit-content"
    backgroundColor="/Background"
    layout="stack"
    stackDirection="vertical"
    stackAlignment="center"
>
  <!-- Component Instance -->
  <NavigationNavbar
      nodeId="mbg_4ZpCC"
      componentId="vTxPF9bF_"
      position="fixed"
      width="100%"
  />
  
  <!-- Frame with children -->
  <HeroSection
      nodeId="L9GHcLjSc"
      layout="stack"
      gap="35px"
      padding="180px 40px 100px 40px"
  >
    <!-- Text node -->
    <Heading
        nodeId="CCY_YCwDe"
        inlineTextStyle="/Heading 1"
    >
      Replace Busywork With AI Agents
    </Heading>
  </HeroSection>
</Desktop>
```

### 3.3 Key XML Attributes

| Category | Attributes |
|----------|------------|
| **Identity** | `nodeId`, `componentId` |
| **Position** | `position`, `top`, `right`, `bottom`, `left`, `centerX`, `centerY` |
| **Size** | `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight`, `aspectRatio` |
| **Visual** | `opacity`, `visible`, `locked`, `rotation`, `backgroundColor`, `borderRadius`, `backgroundImage` |
| **Stack Layout** | `layout="stack"`, `gap`, `padding`, `stackDirection`, `stackDistribution`, `stackAlignment`, `stackWrap` |
| **Grid Layout** | `layout="grid"`, `gridColumns`, `gridRows`, `gridAlignment`, `gridColumnWidth`, `gridRowHeight` |
| **Typography** | `font`, `inlineTextStyle` (project style path) |
| **Links** | `link`, `linkOpenInNewTab` |

### 3.4 Style References

- **Color styles:** `backgroundColor="/Primary/Blue"` (path starts with `/`)
- **Text styles:** `inlineTextStyle="/Heading xl"` 
- **Raw values:** `backgroundColor="rgb(255, 0, 0)"` (no leading `/`)

### 3.5 Font Format

- **Google Fonts:** `"GF;Inter-400"`, `"GF;Roboto-700"`
- **Framer System Fonts:** `"FS;Outfit-medium"`, `"FS;Outfit-light"`

---

## 4. CMS Collections Format

```json
{
  "collections": [
    {
      "id": "cQn535Ezv",
      "name": "Articles",
      "fields": [
        { "id": "kZ0Wm0HVj", "name": "Title", "type": "string" },
        { "id": "Hn27tIoQf", "name": "Date", "type": "date" },
        { "id": "rvZ589c0n", "name": "Image", "type": "image" },
        { "id": "QLwWOxJ5u", "name": "Content", "type": "formattedText" },
        { 
          "id": "ardpG0EUE", 
          "name": "Categories", 
          "type": "multiCollectionReference",
          "collectionId": "dlUfLvyfZ"
        }
      ]
    }
  ]
}
```

**Field Types:**
- `string`, `number`, `boolean`, `color`, `date`
- `image`, `file`, `link`
- `formattedText` (HTML content)
- `enum`
- `collectionReference`, `multiCollectionReference`

---

## 5. Differences from Unframer

| Aspect | Unframer | Unframe (Us) |
|--------|----------|--------------|
| Data Source | Component export URLs | MCP XML API |
| Output | Framer runtime wrappers | Standalone React/Tailwind |
| Styling | Framer CSS runtime | Tailwind classes |
| Dependencies | Requires `unframer` package | No runtime deps |
| Animations | Uses Framer Motion runtime | Framer Motion code-gen |
| CMS | Basic support | Full MDX export |

---

## 6. Implementation Priorities

### Phase 1 (Current)
1. ✅ MCP client wrapper with retry/timeout
2. ✅ XML parser → typed AST
3. ✅ Test against CodesDevs.io

### Phase 2
1. Style extraction → Tailwind
2. Component code generation
3. Page scaffolding

### Phase 3
1. CMS → MDX conversion
2. Animation mapping
3. Responsive breakpoints

---

## 7. Code Patterns to Implement

### MCP Client
```typescript
interface MCPClient {
  getProjectXml(): Promise<ProjectXML>;
  getNodeXml(nodeId: string): Promise<NodeXML>;
  getCMSCollections(): Promise<CMSCollection[]>;
  getCMSItems(collectionId: string): Promise<CMSItem[]>;
}
```

### XML Parser
```typescript
interface XMLParser {
  parseProject(xml: string): FramerProject;
  parseNode(xml: string): FramerNode;
  parseCMS(json: string): FramerCMSCollection[];
}
```

### AST Builder
```typescript
interface ASTBuilder {
  buildProject(framerProject: FramerProject): UnframeAST;
  buildElement(framerNode: FramerNode): ElementAST;
  buildStyles(colorStyles: ColorStyle[], textStyles: TextStyle[]): StylesAST;
}
```

---

## 8. Edge Cases Discovered

1. **Component names with slashes** - "Elements/Badge" needs path normalization
2. **Dynamic routes** - `/blog/:slug` uses CMS collection
3. **Style paths** - Leading `/` indicates project style reference
4. **Font prefixes** - "GF;" vs "FS;" for different font sources
5. **Breakpoints** - Desktop/Tablet/Mobile are separate node trees
6. **Locked nodes** - `locked="true"` for decorative elements
7. **Empty dark colors** - `dark=""` when no dark mode variant

---

*Document maintained as part of Unframe project - ~/Projects/unframe*

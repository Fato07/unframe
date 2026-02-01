# Unframe

**Use your Framer components in any React app — with full fidelity.**

Unframe lets you export Framer components and use them in Next.js, Remix, Vite, or any React framework. Your components render exactly as they do in Framer, including animations, interactions, and responsive behavior.

## Features

- ✅ **Pixel-perfect rendering** — Components look exactly like in Framer
- ✅ **Full animation support** — All Framer animations and interactions work
- ✅ **Responsive variants** — Automatic breakpoint handling
- ✅ **Dark mode support** — Respects Framer color styles
- ✅ **TypeScript types** — Generated from your component controls
- ✅ **Easy integration** — Works with any React framework

## Quick Start

### 1. Install

```bash
npm install @unframe/cli @unframe/runtime
```

### 2. Export from Framer

Install the [React Export plugin](https://www.framer.com/marketplace/plugins/react-export/) in Framer, then select which components you want to export.

### 3. Sync to your project

```bash
npx unframe sync <project-id> --outDir ./framer
```

### 4. Use in your app

```tsx
import './framer/styles.css'
import { UnframeProvider } from '@unframe/runtime'
import { MyComponent } from './framer'

export default function App() {
  return (
    <UnframeProvider>
      <MyComponent variant="Desktop" />
    </UnframeProvider>
  )
}
```

## Responsive Variants

Framer components often have different variants for Desktop, Tablet, and Mobile. Use the `Responsive` wrapper:

```tsx
import { Responsive } from '@unframe/runtime'
import { Hero } from './framer'

export default function App() {
  return (
    <Responsive
      component={Hero}
      variants={{
        lg: 'Desktop',
        md: 'Tablet', 
        base: 'Mobile',
      }}
    />
  )
}
```

## Dark Mode

Enable dark mode by passing `darkMode` to the provider:

```tsx
<UnframeProvider darkMode={true}>
  <MyComponent />
</UnframeProvider>
```

## CLI Commands

### `unframe sync`

Sync Framer components to your project.

```bash
unframe sync <project-id> [options]

Options:
  -o, --outDir <dir>  Output directory (default: ./framer)
  -w, --watch         Watch for changes
  -v, --verbose       Verbose output
```

### `unframe export` (Legacy)

Export a Framer project to standalone Next.js code. Note: This generates converted code which may require manual cleanup.

```bash
unframe export [options]

Options:
  -p, --project <id>   Framer project ID
  -o, --output <dir>   Output directory (default: ./out)
  --dry-run            Preview without writing files
```

## How It Works

Unframe uses Framer's official export system to get your components as pre-compiled JavaScript bundles. These bundles include Framer's runtime, which handles:

- Layout calculations
- Animations and transitions
- Responsive behavior
- Component state

This means your components render with 100% Framer fidelity — no conversion artifacts or layout issues.

## Requirements

- React 18+ or React 19
- Node.js 18+

## Pricing

- **Free**: Open source CLI and runtime
- **Pro** ($19/mo): Priority support, early access to features
- **Team** ($49/mo): 5 seats, dedicated support

## Links

- [Documentation](https://unframe.dev/docs)
- [GitHub](https://github.com/codesdevs/unframe)
- [Discord](https://discord.gg/unframe)

## License

MIT © [CodesDevs](https://codesdevs.io)

# Unframe

> Export Framer projects to production-ready React/Next.js code

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Status

🚧 **Under Development** - Not ready for production use.

## What is Unframe?

Unframe exports your Framer designs to clean, maintainable React code:

- **Next.js App Router** - Modern React with Server Components
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Preserved animations
- **CMS → MDX** - Content as code with Contentlayer

## Quick Start

```bash
# Install
npm install -g @unframe/cli

# Export your Framer project
unframe export --url "https://framer.com/projects/..." --output ./my-site

# Run the exported site
cd my-site && npm install && npm run dev
```

## Packages

| Package | Description |
|---------|-------------|
| `@unframe/core` | Core parsing and transformation logic (MIT) |
| `@unframe/mcp-client` | Framer MCP connection wrapper (MIT) |
| `@unframe/cli` | Command-line interface |

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Development mode
pnpm dev
```

## License

- `@unframe/core` and `@unframe/mcp-client` are MIT licensed
- `@unframe/cli` licensing TBD

---

Built by [CodesDevs](https://codesdevs.io)

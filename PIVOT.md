# Unframe Pivot: From Conversion to Integration

**Date:** 2026-02-01
**Decision:** Pivot from "Framer to clean React conversion" to "Framer component integration"

---

## What We Learned

### The Problem We Tried to Solve
Convert Framer designs to clean, maintainable React + Tailwind code.

### Why It's Hard
1. **Framer uses canvas-based positioning** — Every element has explicit (x, y, width, height)
2. **CSS uses document flow** — Elements position relative to each other
3. **No 1:1 mapping** — Converting `top: 200px` to "proper flex layout" requires understanding design intent
4. **Stack/Grid ≠ Flex/Grid** — Framer's layout concepts don't map directly to CSS

### What We Built (archived in `packages/core/`)
- XML parser for Framer project structure
- AST builder for converting Framer nodes
- React generator with Tailwind classes
- Responsive breakpoint handling
- 200+ tests

### Why It Didn't Work
Even after fixing absolute positioning bugs, the generated layouts broke because:
- Framer designs rely on explicit coordinates
- Removing coordinates causes elements to collapse
- CSS flow doesn't match Framer's canvas model

---

## The Pivot

### New Approach: Unframer-Style Integration
Instead of converting Framer to React, we'll **wrap Framer's runtime**.

### How Unframer Works
1. Uses Framer's React Export plugin to get compiled JS bundles
2. Bundles include Framer's runtime (animations, layout, rendering)
3. Components render with full Framer fidelity
4. Works in any React framework

### Our Differentiation
- **Better DX** — Cleaner CLI, better TypeScript types
- **MCP Integration** — Direct access via Framer MCP, no plugin needed
- **Premium Features** — AI-assisted code cleanup (future)

---

## New Product Positioning

### Before
"Convert Framer to clean React code"

### After
"Use your Framer components in any React app — with full fidelity"

### Value Prop
- ✅ Works immediately (no broken layouts)
- ✅ Pixel-perfect Framer fidelity
- ✅ All animations and interactions preserved
- ✅ Easy integration with Next.js, Remix, Vite
- ⚠️ Uses Framer runtime (not pure React) — trade-off for reliability

---

## Implementation Plan

### Phase 1: Core Integration (2-3 days)
- [ ] Set up Framer export via MCP or API
- [ ] Bundle Framer runtime
- [ ] Create wrapper components
- [ ] Basic CLI: `unframe sync <project-id> --outDir ./framer`

### Phase 2: DX Polish (2-3 days)
- [ ] TypeScript type generation from component controls
- [ ] Responsive variant support
- [ ] Dark mode support
- [ ] Watch mode for live updates

### Phase 3: Ship (1 day)
- [ ] Update landing page messaging
- [ ] Publish to npm
- [ ] Announce

### Phase 4: Premium Features (later)
- [ ] AI-assisted code cleanup
- [ ] Gradual migration tools
- [ ] Component refactoring suggestions

---

## Files to Archive

The conversion approach code is preserved in:
- `packages/core/src/parser/` — XML parsing (still useful)
- `packages/core/src/generator/` — React generation (archived)
- `packages/core/src/transformer/` — Style extraction (archived)
- `packages/core/src/analyzer/` — Layout analysis (archived)

---

## Lessons for Future

1. **Validate assumptions early** — We should have tested Unframer first
2. **Understand the domain deeply** — Framer's layout model is fundamentally different from CSS
3. **Ship working > ship perfect** — A working product beats a perfect prototype
4. **Know when to pivot** — Sunk cost fallacy is real; cutting losses early saves time

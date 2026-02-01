# Project Shelved

**Date:** 2026-02-01
**Status:** On hold indefinitely

## Why

1. **Conversion approach failed** — Framer's canvas-based layout doesn't map cleanly to CSS document flow. No one in the industry has solved this well.

2. **Integration approach hit paywall** — Pivoted to wrap Unframer, but Unframer requires paid subscription ($X/mo) to export. Our "free tier" wasn't actually free.

3. **Even Unframer's output needs manual work** — Components export fine, but page layout still requires manual composition.

## What We Built

- XML parser for Framer projects
- AST-based React generator
- CLI with init/export/sync commands
- Runtime package with Provider and Responsive wrappers
- 200+ tests
- Landing page

## Learnings

- Validate assumptions by testing existing solutions first
- Know when to pivot vs when to shelve
- Sometimes the hard problem is hard for a reason

## If Revisiting

The code works for component extraction. The gap is page-level layout intelligence — would need AI/LLM to interpret design intent and generate proper CSS structure.

---

*Parked, not abandoned. May revisit if the market changes.*

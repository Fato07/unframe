# Unframe Edge Cases Tracker

Track every layout/conversion failure here for regression testing and future improvements.

## Format

```
### [CASE-XXX] Short Description
- **Date:** YYYY-MM-DD
- **Status:** Open | Fixed | Won't Fix
- **Input:** Framer structure/attributes
- **Expected:** What should render
- **Actual:** What actually rendered
- **Root Cause:** Why it failed
- **Fix:** How it was fixed (if applicable)
```

---

## Known Issues

### [CASE-001] Absolute positioning on Stack children
- **Date:** 2026-02-01
- **Status:** In Progress
- **Input:** Stack container with children
- **Expected:** Children laid out by flex, no absolute positioning
- **Actual:** All children have `absolute top-0 left-0`, breaking layout
- **Root Cause:** `extractStyles` adds position properties unconditionally
- **Fix:** Track parent layout, skip absolute for Stack/Grid children

### [CASE-002] Font imports with hyphens (Inter-Bold)
- **Date:** 2026-02-01
- **Status:** Fixed
- **Input:** Font name "Inter-Bold"
- **Expected:** Valid JS import `import { Inter } from 'next/font/google'`
- **Actual:** Invalid import `import { Inter-Bold } from 'next/font/google'`
- **Root Cause:** Font names not normalized
- **Fix:** Extract base font name, remove variant suffix

### [CASE-003] Component instance name mismatch
- **Date:** 2026-02-01
- **Status:** Fixed
- **Input:** Component instance named "Elements Development Card", definition named "Development Card"
- **Expected:** Import resolves to correct file
- **Actual:** Import path doesn't match file name
- **Root Cause:** Instance name used instead of definition name
- **Fix:** Use componentRef mapping to resolve actual component names

### [CASE-004] Acronyms in component names (CTAButton)
- **Date:** 2026-02-01
- **Status:** Fixed
- **Input:** Component name "CTAButton"
- **Expected:** File name "cta-button.tsx"
- **Actual:** File name "ctabutton.tsx" (no split on acronym)
- **Root Cause:** toKebabCase didn't handle uppercase sequences
- **Fix:** Add regex to split before acronym boundaries

---

## Pending Investigation

### [CASE-005] CSS variables not defined
- **Date:** 2026-02-01
- **Status:** Open
- **Input:** Elements using `var(--color-*)`
- **Expected:** CSS variables defined in globals.css
- **Actual:** Variables may be missing, causing invisible elements
- **Root Cause:** TBD
- **Fix:** TBD

### [CASE-006] Z-index stacking order
- **Date:** 2026-02-01
- **Status:** Open
- **Input:** Overlapping elements in Framer
- **Expected:** Same stacking order as Framer
- **Actual:** May be incorrect
- **Root Cause:** TBD
- **Fix:** TBD

### [CASE-007] Responsive breakpoints
- **Date:** 2026-02-01
- **Status:** Open
- **Input:** Framer design with Desktop/Tablet/Mobile variants
- **Expected:** Tailwind responsive classes (md:, lg:)
- **Actual:** Only desktop layout generated
- **Root Cause:** Breakpoint data not mapped to Tailwind
- **Fix:** TBD

---

## Regression Tests Needed

- [ ] Stack with horizontal children
- [ ] Stack with vertical children
- [ ] Nested stacks
- [ ] Grid layout
- [ ] Mixed absolute + flex (intentional overlays)
- [ ] Font imports (various names)
- [ ] Component imports (various naming patterns)
- [ ] CSS variables (all color styles)
- [ ] Responsive layouts (all breakpoints)

---

## Contributing

When you encounter a new edge case:
1. Add it to this file with a new CASE number
2. Include minimal reproduction details
3. Update status when fixed
4. Add regression test if applicable

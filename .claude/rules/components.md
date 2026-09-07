---
paths:
  - "components/**/*.tsx"
  - "app/**/*.tsx"
---

# Components

- **Server Components by default.** `"use client"` only for real interactivity — state,
  effects, event handlers, browser APIs.
- **No sentence hard-coded in a route.** It comes from `lib/content/`.
- **No raw hex, no arbitrary `text-[13px]`.** Use a token and a scale step. Three type
  scales already exist in this codebase; this is what stops a fourth.
- Images through the `Media` component, never a bare `next/image`. Explicit dimensions.
- Every route exports `metadata`.
- **Grid and flex items default to `min-width: auto`** and will not shrink below their
  content's min-content width. Any grid child holding a card or a `truncate` element needs
  `min-w-0`, or it pushes past the page gutter on narrow screens.
- **A `.reveal-group` child and a `.lift` card must be different elements.** A
  scroll-driven animation with `both` fill holds `transform: none`, and animations outrank
  normal declarations, so the hover transform silently never applies.
- `components/ui` and `components/product-ui` came across finished and unreviewed. They
  carry the old scale and are exempt from the token rule until rebuilt. Do not copy their
  patterns into new work.

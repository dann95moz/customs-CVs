---
trigger: always_on
---

# Styling, Design Tokens & Responsive Guidelines

## 1. Design Token Architecture

All design tokens must be centralized and reused across components:
- **Tokens**: `src/styles/tokens.css` defines the primary design tokens (colors, borders, radiuses, shadows, transitions).
- **Dimensions**: `src/theme/dimensions.ts` defines standard document and canvas dimensions (e.g., `DOCUMENT_DIMENSIONS.pageHeightPx`, `pageWidthPx`, A4 aspect ratios).
- **MUI Theme**: `src/theme/theme.ts` integrates design tokens into Material UI palette, typography, and component overrides (`MuiButton`, `MuiChip`, `MuiPaper`, `MuiTab`, etc.).

## 2. Responsive Breakpoints & Toolbar Layout

Material-UI breakpoints are standardized:
- `xs`: 0px–599px (Mobile)
- `sm`: 600px–899px (Tablet)
- `md`: 900px–1199px (Small Desktop / Laptop)
- `lg`: 1200px+ (Large Desktop)

### Mobile-First Layout Rules
- **No Unintended Wrapping**: Toolbars and action rows on mobile (`xs`) must be configured with `flexWrap: 'nowrap'` or clean multi-row alignment so buttons do not break into jagged lines.
- **Icon Buttons**: Use compact paddings (`p: 0.6` to `p: 0.75`) and small icon sizes (`16px` to `18px`) on mobile viewports.
- **Hidden Text on Mobile**: For action buttons on mobile, hide long labels and display short labels or tooltips via:
  ```tsx
  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{fullLabel}</Box>
  <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>{shortLabel}</Box>
  ```

## 3. A4 Document Rendering & PDF Print Consistency

- **A4 Physical Standard**: 794px width by 1123px height per page (at 96 DPI).
- **Overflow & Page Break Marker**: Display visual page break guides when the sheet height exceeds `A4_PAGE_PX - 30px`.
- **Canvas Scaling on Mobile**: Use `zoomMode === 'fit'` with `autoScale = Math.min(1, Math.max(0.35, availableWidth / 794))` to fit the entire A4 width on mobile screens without horizontal scroll.
- **Print Stylesheet**: Always ensure `.no-print` elements are hidden in `src/styles/print.css`.

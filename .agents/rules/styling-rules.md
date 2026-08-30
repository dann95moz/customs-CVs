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

## 4. Strict Design System (DS) Component Compliance & Forbidding Ad-Hoc Overrides

All UI elements must strictly inherit and consume tokens defined in `src/theme/theme.ts` and `src/styles/tokens.css`. Creating ad-hoc or rogue styling is strictly forbidden.

### 🚫 Forbidden Practices (Zero Tolerance)
1. **Never write inline border radiuses on Buttons or Chips**:
   - ❌ `borderRadius: '6px'`, `borderRadius: '8px'`, `borderRadius: '10px'` on `<Button>`, `<IconButton>`, `<ToggleButton>`, or `<Chip>`.
   - ✅ Always allow buttons and chips to inherit `RADIUS_TOKENS.full` (pill shape) from `src/theme/theme.ts`.
2. **Never hardcode ad-hoc background colors or gradients on Buttons**:
   - ❌ `bgcolor: '#0284c7'`, `bgcolor: 'primary.main'`, `background: 'linear-gradient(...)'` in button `sx`.
   - ✅ Use standard MUI variant and color props: `<Button variant="contained" color="primary">`, `<Button variant="outlined">`, `<Button variant="text">`.
3. **Never write hardcoded chip heights or arbitrary background colors**:
   - ❌ `sx={{ height: 18, bgcolor: 'rgba(2, 132, 199, 0.15)' }}` on `<Chip>`.
   - ✅ Use `<Chip size="small" color="primary | success | warning | error" variant="filled | outlined" />`.
4. **Never stretch buttons across cards awkwardly without alignment**:
   - ❌ `width: '100%'` or `width: { xs: '100%', sm: 'auto' }` on standard action levers unless designed as a bottom-sheet block CTA.
   - ✅ Place buttons inside clean flex containers (`display: 'flex', justifyContent: 'flex-start' | 'center'`) with natural sizing.

### 📐 Standard Radius Tokens Reference
- **Buttons, Chips, Tabs, Badges**: `RADIUS_TOKENS.full` (`9999px` / Pill)
- **Dialogs & Large Modals**: `RADIUS_TOKENS.xl` (`16px`)
- **Cards, Panels & Drawers**: `RADIUS_TOKENS.lg` (`12px`)
- **Inputs & Dropdown Menus**: `RADIUS_TOKENS.md` (`8px`)


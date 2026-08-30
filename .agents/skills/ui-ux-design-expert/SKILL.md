---
name: ui-ux-design-expert
description: >-
  Use this skill when designing, building, or polishing UI components, design tokens,
  micro-interactions, responsive mobile layouts, accessibility (a11y), and user experience flows.
---

# UI/UX & Design System Specialist Skill

This skill provides comprehensive instructions, design patterns, and quality criteria for crafting premium, responsive, and accessible user interfaces in CV Studio.

---

## 1. Design Token Architecture & Theming

All visual styles must derive from the centralized design system:
- **CSS Variables & Tokens**: `src/styles/tokens.css` (Colors, borders, radiuses, shadows, transitions, backdrop blurs).
- **MUI Theme Integration**: `src/theme/theme.ts` (Palette tokens, component overrides for `MuiButton`, `MuiChip`, `MuiPaper`, `MuiTab`, `MuiDialog`, etc.).
- **A4 Physical Dimensions**: `src/theme/dimensions.ts` (A4 standard: 794px width, 1123px height at 96 DPI).

### Aesthetics Guidelines
- **Modern Polish**: Use curated color palettes (deep slates, subtle gradients, rich accents) rather than raw browser defaults.
- **Glassmorphism & Elevation**: Apply subtle glass backdrops (`backdrop-filter: blur(12px)`) with thin borders (`rgba(255, 255, 255, 0.08)`) for floating toolbars, drawers, and modal headers.
- **Micro-Interactions**: Use smooth transitions (`transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`) for hover states, scale transforms on cards (`transform: translateY(-2px)`), and active button presses.

---

## 2. UX Heuristics & User Feedback

1. **Instant Visual Feedback**:
   - Every asynchronous operation (AI tailoring, PDF export, saving version) must show clear progress indicators (progress bars, spinners, or pulsing skeleton loaders).
   - Use non-blocking snackbars (`toast` / `useSnackbar`) for completed actions or non-fatal warnings.
2. **Empty & Error States**:
   - Never render a blank screen. If a list or preview is empty, render an informative empty state with an illustrative icon, clear explanation, and primary call-to-action button.
   - For errors, provide a descriptive message and an actionable retry button.
3. **Progressive Disclosure**:
   - Keep primary actions visible and secondary/advanced settings accessible via clean menus, accordions, or drawer tabs (e.g., Template Customizer, Typography Settings, AI Provider Config).

---

## 3. Responsive & Mobile-First Best Practices

- **Mobile Viewports (`xs`: 0–599px)**:
  - Toolbars must never wrap erratically into jagged multi-line heights. Use `flexWrap: 'nowrap'`, horizontal scroll containers, or compact icon buttons (`p: 0.75`, `18px` icons).
  - Responsive label strategy:
    ```tsx
    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{fullLabel}</Box>
    <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>{shortLabel}</Box>
    ```
- **A4 Document Canvas**:
  - Maintain the A4 proportion (`794px × 1123px`).
  - On smaller screens, scale the preview sheet responsively via CSS transform `transform: scale(autoScale)` calculated from available container width.

---

## 4. Accessibility (a11y) & Usability Checklist

- [ ] **Contrast**: Text elements meet WCAG AA contrast ratio (minimum 4.5:1 for normal text).
- [ ] **Keyboard Navigation**: Interactive elements have visible `:focus-visible` outlines and support Enter/Space activation.
- [ ] **ARIA Landmarks & Tooltips**: Icon-only buttons must have descriptive `aria-label` and `<Tooltip title="...">`.
- [ ] **Semantic Markup**: Use `<header>`, `<main>`, `<nav>`, `<section>`, `<article>` appropriately instead of generic `<div>` soup.

---

## 5. Strict Design System (DS) Component Compliance Checklist

When creating or modifying components:
- [ ] **Buttons**: Must NEVER use manual `borderRadius: '6px' / '8px' / '10px'`. Must inherit `MuiButton` pill tokens (`RADIUS_TOKENS.full`).
- [ ] **Chips**: Must NEVER use manual `borderRadius` or custom inline `height: 18`. Use standard `<Chip size="small" variant="filled | outlined" color="..." />`.
- [ ] **Colors**: Use MUI palette tokens (`theme.palette.primary.main`, `theme.palette.success.main`, etc.) and `alpha(...)` instead of raw hex codes.
- [ ] **Alignment**: Action buttons inside cards must use clean flex containers (`justifyContent: 'flex-start' | 'center'`) rather than stretching full-width arbitrarily.


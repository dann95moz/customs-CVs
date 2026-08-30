---
name: qa-testing-compliance
description: >-
  Use this skill when auditing code quality, running type checks, verifying i18n synchronization
  across all 5 locales, or testing PDF generation and responsive layouts.
---

# QA, Testing & Compliance Specialist Skill

This skill provides step-by-step verification procedures, automated checks, and compliance checklists for validating code quality before landing changes.

---

## 1. Automated Verification Commands

Run these terminal commands to verify that the project is completely clean and error-free:

| Command | Purpose | Expected Result |
| :--- | :--- | :--- |
| `npm run typecheck` | Run TypeScript compiler in strict no-emit mode (`tsc --noEmit`) | Exit code 0, 0 type errors |
| `npm run build` | Validate full Vite production bundling and asset compilation | Exit code 0, generated bundle in `dist/` |
| `npm run build:cli` | Test CLI bundle generation via esbuild | Exit code 0, updated `bin/cli.mjs` |

---

## 2. Internationalization (i18n) Parity Audit

Before merging any UI changes, verify multilingual synchronization across all 5 supported locales:
- `src/i18n/locales/en/` (English - Baseline)
- `src/i18n/locales/es/` (Spanish)
- `src/i18n/locales/de/` (German)
- `src/i18n/locales/fr/` (French)
- `src/i18n/locales/it/` (Italian)

### Compliance Checklist
- [ ] Every key present in `en/<namespace>.json` exists in `es/`, `de/`, `fr/`, and `it/`.
- [ ] No raw English/Spanish user-facing strings are hardcoded in TSX files without `t('namespace:key', 'Fallback')`.
- [ ] Dynamic tokens use correct `{{variable}}` interpolation syntax across all language files.

---

## 3. Visual & Print Rendering Audit

- **A4 Dimensions**: Verify that rendered resume sheets adhere to `794px` standard width and `1123px` standard page height.
- **Page Break Guidance**: Check that visual overflow markers appear cleanly when content exceeds page boundaries.
- **Print Styles**: Ensure that navigation headers, floating action buttons, settings drawers, and control panels have `.no-print` applied and are completely hidden in print preview.
- **Mobile (`xs`) Breakpoint**: Open mobile viewport (375px–420px) to confirm toolbars do not wrap into multi-line layouts and action buttons remain fully accessible.

---
name: qa-testing-compliance
description: >-
  Use this skill when auditing code quality, running type checks, verifying i18n synchronization
  across all 5 locales, validating PDF generation, testing responsive layouts, and executing
  comprehensive edge-case test suites in CV Studio.
---

# QA, Testing & Compliance Specialist Skill

This skill provides comprehensive verification procedures, automated checks, edge-case test matrices, and compliance checklists for validating code quality, user experience, and architectural integrity across **CV Studio (mi-cv-engine)**.

---

## 1. Automated Verification Commands

Run these terminal commands to verify that the project is completely clean and error-free:

| Command | Purpose | Expected Result |
| :--- | :--- | :--- |
| `npm run typecheck` | Strict TypeScript compiler check (`tsc --noEmit`) | Exit code 0, 0 type errors |
| `npm run build` | Full Vite production bundle and asset chunking | Exit code 0, generated bundle in `dist/` |
| `npm run build:cli` | Test CLI binary compilation via esbuild | Exit code 0, updated `bin/cli.mjs` |

---

## 2. End-to-End User Flow & Edge Cases Matrix

### Milestone 1: Master Career Dossier (Step 1)
- **Scanned / Image-Only PDFs**: Verify graceful error notification when PDF contains no extractable text layer. Suggest fallback to OCR or manual Markdown paste.
- **Bi-directional Parsing Fidelity**: Verify that toggling between Guided Form and Markdown Editor preserves all sections without data loss or heading degradation.
- **Data Replacement Safety**: Confirm that uploading a file when data already exists opens a confirmation dialog with preview details.
- **Reset Workspace Scope**: Ensure workspace reset does not wipe user API keys or tracked applications from localStorage unless explicitly requested.

### Milestone 2: Target Job Vacancy & Analysis (Step 2)
- **Provider Settings Validation**: Ensure generation correctly detects whether a provider is configured (including Local AI, Gemini, OpenAI, Claude, Groq, and custom endpoints without auth).
- **Ultra-Long Job Descriptions**: Validate handling of job postings exceeding 10,000 words without token budget explosion.
- **Automatic Metadata Extraction**: Confirm employer name and target role are accurately inferred from raw posting text.

### Milestone 3: AI Synthesis & Strategy Execution (Step 3)
- **Model Compatibility**: Ensure AI model identifiers match real public provider endpoints (`gemini-2.0-flash`, `gemini-1.5-flash`, `gpt-4o`, `claude-3-7-sonnet`, `llama3.2`).
- **Anthropic Direct Browser Header**: Confirm `anthropic-dangerous-direct-browser-access: "true"` is supplied for direct Anthropic browser requests.
- **Strategy Fallback & Error Handling**: Test handling of rate limits (HTTP 429), quota exhaustion, and invalid API keys with informative user guidance.
- **XSS & Content Sanitization**: Verify all markdown parsed through `marked` is sanitized via `DOMPurify` before DOM injection.

### Milestone 4: Preview Studio & Live Editing (Step 4)
- **A4 Physical Dimension Standard**: Ensure `794px × 1123px` standard page footprint.
- **Visual Page Break Guide**: Verify page break marker appears cleanly when content exceeds page height.
- **Inline Hot Edit & Selection Bubble**: Test selection formatting (Bold `Ctrl+B`, Italic `Ctrl+I`, Highlight) and AI single-bullet regeneration popover.
- **Responsive Auto-Fit Canvas**: Test mobile viewport (375px) auto-scale and touch edit mode.

### Milestone 5: Kanban Pipeline & Version History
- **Application Tracking**: Test saving tailored versions to Kanban columns, moving cards via drag-and-drop, editing column metadata, and archiving.
- **Bulk Deletion & Protection**: Verify versions linked to active Kanban applications are protected from accidental deletion.

---

## 3. Internationalization (i18n) Parity Audit

Synchronize user-facing strings across all 5 supported locales:
- `src/i18n/locales/en/` (English - Baseline)
- `src/i18n/locales/es/` (Spanish)
- `src/i18n/locales/de/` (German)
- `src/i18n/locales/fr/` (French)
- `src/i18n/locales/it/` (Italian)

### Compliance Checklist
- [ ] Every key present in `en/<namespace>.json` exists across `es/`, `de/`, `fr/`, and `it/`.
- [ ] In JSX/TSX files, fallback strings passed as the second argument to `t()` are in **English**.
- [ ] Dynamic tokens use correct `{{variable}}` interpolation syntax across all language files.
- [ ] No raw user-facing strings or `window.confirm` / `alert` bypass the i18n system.

---

## 4. UI/UX Design System & Accessibility (a11y) Audit

- [ ] **Button & Chip Radiuses**: Never use inline `borderRadius: '6px' / '8px' / '10px'`. Always inherit `RADIUS_TOKENS.full` (pill shape).
- [ ] **No Awkward Full-Width Buttons**: Avoid `width: { xs: '100%', sm: 'auto' }` on standard action levers; use natural flex containers.
- [ ] **Contrast & Focus**: Ensure WCAG AA contrast ratio and visible keyboard focus outlines.
- [ ] **No-Print Cleanliness**: Ensure toolbars, nav rails, and drawers have `.no-print` applied during PDF generation.

---

## 5. Triad Collaboration Protocol (QA + PO + UX)

Before releasing major features:
1. **QA**: Validate functional correctness, edge cases, error states, and type safety.
2. **PO**: Assess user friction, value vs. effort (RICE score), and acceptance criteria.
3. **UX**: Review visual hierarchy, micro-interactions, responsive scaling, and a11y heuristics.

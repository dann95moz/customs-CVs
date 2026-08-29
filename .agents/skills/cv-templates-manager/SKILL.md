---
name: cv-templates-manager
description: >-
  Use this skill when adding, modifying, or debugging ATS-friendly CV templates,
  color palettes, font pairings, document dimensions, or print CSS stylesheets.
---

# CV Templates & Design System Manager

This skill provides step-by-step instructions for managing resume templates, color palettes, typography, and print styling in CV Studio.

---

## Template Architecture

Templates are registered in `src/templates/`:
- `src/templates/registry.ts`: Registry mapping each `ThemeId` to its component and metadata.
- `src/templates/metadata.ts`: Template descriptive metadata (name, description, tags, ATS score, recommended roles).
- `src/templates/components/`: Individual React template renderers (e.g., `ModernTechTemplate.tsx`, `ExecutiveTemplate.tsx`, `MinimalAtsTemplate.tsx`).

### Supported Theme IDs
- `modern-tech` — Modern Pro (2-column header, skill pills, high-density).
- `executive` — Executive Suite (Classic formal serif, centered header).
- `minimal-ats` — Minimal ATS Clean (100% text parser friendly, zero complex CSS).
- `two-column` — Tech Minimalist (Sidebar layout for skills/contact, main body for experience).
- `designer-uiux` — Designer Portfolio (Vibrant creative accent bars).
- `formal-legal` — Corporate Classic (Traditional corporate structure).
- `academic-research` — Academic & Research (Publications, grants, research history).

---

## Steps for Adding a New CV Template

1. **Define the Theme Identifier**:
   - Add the new ID to `ThemeId` in `src/types/cv.ts`.
2. **Create Template Component**:
   - Create `src/templates/components/YourNewTemplate.tsx`.
   - Ensure it receives `CVData`, `PaletteId`, `customColor`, `fontFamily`, `spacingDensity`.
   - Wrap fields in `<CvEditableField>` where editable inline.
3. **Register in Registry & Metadata**:
   - Add entry to `TEMPLATE_REGISTRY` in `src/templates/registry.ts`.
   - Add metadata entry to `TEMPLATE_METADATA` in `src/templates/metadata.ts`.
4. **Verify A4 Dimensions**:
   - Width must adhere to `794px` standard.
   - Test that margins and section spacings fit standard A4 page heights (`1123px`).
5. **Verify Print Styles**:
   - Ensure print rendering looks identical to preview by testing `src/styles/print.css`.

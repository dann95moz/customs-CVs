---
trigger: always_on
---

# Coding Rules & Architectural Standards

## 1. Core Design Principles

### SOLID
- **S — Single Responsibility**: Each component, hook, or function must have one single responsibility. If a component handles data fetching, business logic, and presentation simultaneously, decompose it into a custom hook + container + presentational UI component.
- **O — Open/Closed**: Favor composition and props/slots over modifying existing stable code. Extend behavior via props, render props, or component composition rather than adding endless boolean flags that branch internal logic.
- **L — Liskov Substitution**: Component variants (e.g., `Button`, `IconButton`, `Chip`) must be interchangeable without breaking prop contracts or consuming component expectations.
- **I — Interface Segregation**: Do not force components to receive props they do not use. Split broad interfaces into focused, granular types.
- **D — Dependency Inversion**: UI components must not depend directly on concrete infrastructure implementations (raw `fetch`, external SDKs, `localStorage`). Inject dependencies via props, Context, or abstracted hooks (e.g., `useAuthService()` instead of calling an SDK directly within a view).

### DRY (Don't Repeat Yourself)
- Before authoring new code, check if an existing utility, hook, or component already solves the problem.
- Extract repeated logic (validation, formatting, API calls, parsing) into custom hooks (`useX`) or pure functions in `utils/` or `lib/`.
- Reuse and compose types with TypeScript utility types (`Pick`, `Omit`, `Partial`, `Record`) instead of duplicating structural definitions.
- *Valid exception*: Duplicating 2–3 trivial lines is preferable to creating a premature abstraction that tightly couples distinct domains.

### KISS & YAGNI
- Prefer the simplest solution that cleanly solves the current requirement.
- Do not introduce speculative configurations, unused optional props, or unnecessary abstraction layers for hypothetical future use cases.
- Simple, explicit, and readable code is always superior to clever, dense abstractions.

---

## 2. TypeScript & React Standards

- **Strict TypeScript**: Never use `any`. If a type is genuinely unknown, use `unknown` and perform explicit type narrowing/guards.
- **Functional Components**: Use functional components with React Hooks. Do not use class components.
- **Prop Typing**: Type props using `interface` (prefer `interface` over `type` except for unions, intersections, or utility transformations).
- **Naming Conventions**:
  - **Components / Types / Interfaces**: `PascalCase` (e.g., `StepPreviewToolbar.tsx`, `CVRenderer.tsx`, `StepPreviewProps`).
  - **Hooks**: `useCamelCase` (e.g., `useCvLiveEdit.ts`, `usePrintPdf.ts`).
  - **Functions / Variables / Methods**: `camelCase` (e.g., `sanitizeFileName`, `handleDownloadPdf`).
  - **Global Constants / Enums**: `UPPER_SNAKE_CASE` (e.g., `APP_LINKS`, `DOCUMENT_DIMENSIONS`).
  - **File Names**: Match the primary export (one component per file, filename = component name).
- **State Management**:
  - Keep state as local as possible (`useState`, `useReducer`).
  - **Never store derived state in `useState`**. Calculate derived data during render or with `useMemo`.
  - Avoid prop drilling deeper than 2–3 levels; use React Context or the project's state manager (Zustand).
  - Use `useEffect` strictly for synchronizing with external systems or DOM subscriptions—never for calculating derived state or chaining multiple `setState` calls.

---

## 3. Layered Project Architecture

Maintain clean layer separation across the codebase:
- `components/atoms/` — Primitive UI elements (`MatchScoreBadge`, `StatusDot`, `ActionIconButton`, `SectionHeader`). Pure presentational.
- `components/molecules/` — Reusable interactive composites (`SearchBarWithClear`, `ColorPalettePicker`).
- `components/slots/` — Standardized CV template document rendering slots.
- `components/studio/` & `components/landing/` — Feature organisms, containers, and views.
- `hooks/` — Reusable stateful domain workflows (`useXWorkflow`), browser APIs, and lifecycle orchestration.
- `core/` / `services/` — AI engines, markdown parsers, print engines, external APIs.
- `store/` — Zustand global application stores and domain selectors.
- `constants/` — Model definitions (`models.ts`), palettes, links, and template defaults.
- `utils/` / `lib/` — Pure utility functions without side effects.
- `types/` — Shared interfaces, domain models, and prop contracts.
- `theme/` / `styles/` — Design tokens, MUI theme configurations, dimensions, and global CSS.

*Rules*:
1. Presentational components must receive data and handlers via props or custom hooks, never by importing infrastructure services directly.
2. Avoid "god object" files (keep components under 200 lines).
3. Strictly follow [anti-patterns-rules.md](file:///.agents/rules/anti-patterns-rules.md) (zero native popups, zero dummy scores, zero untyped `any`).

---

## 4. Styling, Theming & Responsiveness

- **Centralized Design System**: Centralize colors, dimensions, borders, and spacing tokens in `src/styles/tokens.css`, `src/theme/dimensions.ts`, or MUI theme overrides (`src/theme/theme.ts`).
- **Responsive Mobile-First**:
  - All views and toolbars must support mobile (`xs`), tablet (`sm`), and desktop (`md`/`lg`) viewports cleanly.
  - Group and space toolbars to prevent unintended multi-line wrapping on mobile screens.
- **Document A4 Standards**:
  - Maintain strict print and PDF dimensions (A4 height standard: 1123px at 96 DPI, width: 794px).
  - Use responsive scaling (`scale(autoScale)`) for mobile canvas viewing.

---

## 5. Internationalization & Text Guidelines

- **English Baseline**: All source code, identifiers, comments, logs, and hardcoded fallback strings must be in **English**.
- **User-Facing Strings**: All UI text presented to the user must be localized using `react-i18next` with keys stored across all supported locales (`en`, `es`, `de`, `fr`, `it`).
- When introducing or altering a localization key, maintain parity across all 5 locale files in `src/i18n/locales/`.

---

## 6. Error Handling, Quality & Accessibility (a11y)

- **Explicit Error Handling**: Always handle promises with `try/catch` or `.catch()`. Do not ignore typing errors with `// @ts-ignore` without documented justification.
- **Accessibility**: Use semantic HTML elements (`<header>`, `<main>`, `<nav>`, `<section>`), proper ARIA attributes, descriptive button tooltips, and keyboard navigation support.
- **Performance**: Memoize (`useMemo`, `useCallback`, `React.memo`) only when there is a measurable rendering or computation cost.
- **Documentation**: Update [README.md](file:///c:/Users/LeGo/Documents/customs%20CVs/README.md) whenever architectural changes, new CLI commands, or core workflows are modified.
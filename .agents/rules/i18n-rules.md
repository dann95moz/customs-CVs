---
trigger: always_on
---

# Internationalization (i18n) Rules

## 1. Supported Locales

The application supports 5 primary languages:
1. **English (`en`)** — Default / Source language
2. **Spanish (`es`)**
3. **German (`de`)**
4. **French (`fr`)**
5. **Italian (`it`)**

Location: `src/i18n/locales/{en, es, de, fr, it}/`

## 2. Namespace Organization

Translations are divided by feature domain namespaces:
- `common.json` — Global navigation, actions (save, cancel, export, edit), status badges, community links, footer.
- `landing.json` — Welcome landing hero, capabilities, master data input.
- `target.json` — Target job description input, AI synthesis options, keywords selector.
- `preview.json` — Document preview studio, templates panel, design formatting, audit drawer, toolbars.
- `history.json` — Applications tracker, version history, export options.
- `settings.json` — AI provider configuration, custom endpoints, language preferences.

## 3. Strict Synchronization Rules

- **Zero Missing Keys**: When adding, modifying, or renaming a key, you **must update all 5 locale files** in the same change.
- **English Hardcoded Fallback**: In JSX/TSX components, always provide an English fallback string as the second argument to `t()`:
  ```tsx
  {t('common:actions.save', 'Save Version')}
  ```
- **Interpolation Syntax**: Use `{{variableName}}` for dynamic values (e.g., `Step {{number}}`, `{{count}} items`).
- **Zero Hardcoded User-Facing Text**: Never render raw user-facing strings directly in components without wrapping them in `t()`.

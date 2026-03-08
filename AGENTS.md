# AGENTS.md

## Project Goal
Build a frontend app with **Vite + React + TypeScript** while learning React deeply and keeping the codebase aligned with current frontend conventions (2026).

## Stack Baseline
- Runtime/build: `vite`
- UI: `react`, `react-dom`
- Language: `typescript` (strict mode)
- Styling: modern CSS (prefer CSS Modules + design tokens)

## Agent Expectations
When making changes, optimize for:
- learning clarity (small, readable components)
- type safety first
- accessibility by default
- mobile-first responsive UI
- production-safe defaults (lint/test/build must pass)

## TypeScript Conventions (2026)
- Use `"strict": true` and keep it strict.
- Enable and preserve:
  - `noUncheckedIndexedAccess`
  - `exactOptionalPropertyTypes`
  - `noImplicitOverride`
  - `useDefineForClassFields`
  - `verbatimModuleSyntax`
  - `moduleResolution: "bundler"`
- Prefer `import type` for type-only imports.
- Prefer `unknown` over `any`; avoid `any` unless explicitly justified.
- Model domain data with explicit types/interfaces and discriminated unions.
- Use `satisfies` and `as const` where they improve inference and safety.
- Validate external/untrusted data at boundaries (API, local storage, URL params).

## React Conventions
- Use function components and hooks only.
- Do not use `React.FC` by default; type props explicitly.
- Keep components focused; extract custom hooks for reusable stateful logic.
- Co-locate tests/styles with components where practical.
- Keep side effects in `useEffect`; avoid derived state in effects when it can be computed in render.
- Prefer controlled forms for learning/debuggability.
- Use accessible HTML first (`button`, `label`, `fieldset`, etc.) before ARIA fallbacks.

## Vite Conventions
- Keep Vite defaults unless there is a clear performance/build reason.
- Use path aliases (for example `@/`) only after configuring both Vite and TypeScript.
- Use environment variables through `import.meta.env` and document each required variable.

## CSS Conventions (2026)
- Prefer CSS Modules for component-level styles.
- Use a global stylesheet only for reset, tokens, and app-wide primitives.
- Define design tokens with CSS custom properties (`:root`), including spacing, type scale, colors, radius, and motion.
- Use cascade layers (`@layer reset, tokens, base, components, utilities`).
- Prefer logical properties (`margin-inline`, `padding-block`, etc.) for i18n-friendly layouts.
- Use modern responsive patterns: `clamp()`, `min()`, `max()`, container queries where useful.
- Respect user preferences (`prefers-reduced-motion`, `prefers-contrast`, `color-scheme` when supported).
- Avoid heavy specificity and `!important`.

## Quality Gates
Before finishing significant changes, run:
- `npm run typecheck`
- `npm run lint`
- `npm test` (only when a test script exists)
- `npm run build`

Run in that order unless a task explicitly requires a different sequence.

If a gate cannot be run, state exactly why.

## Suggested Structure
- `src/app/` app shell and providers
- `src/features/` feature-first modules
- `src/components/` shared UI components
- `src/lib/` shared utilities/types/helpers
- `src/styles/` tokens, reset, global layers

## Definition of Done
A task is done when:
- behavior works as requested
- types are sound (no unsafe shortcuts)
- accessibility and responsive behavior are considered
- code is understandable for someone learning React
- quality gates pass (or failures are documented with reason)

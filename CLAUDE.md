# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm start` (serves at http://localhost:4200, auto-reloads)
- **Build:** `npm run build` (production by default, outputs to `dist/`)
- **Run all tests:** `npm test` (uses Vitest via `@angular/build:unit-test`)
- **Run single test:** `npx ng test --include=src/app/path/to/file.spec.ts`
- **Scaffold component:** `npx ng generate component component-name`

## Architecture

- **Angular 21** standalone application (no NgModules) with signal-based reactivity
- **UI framework:** PrimeNG 21 with a custom Aura-based theme (`src/app/myTheme.ts`)
- **Styling:** Tailwind CSS 4 via PostCSS plugin (`@tailwindcss/postcss`), integrated with PrimeNG via `tailwindcss-primeui`
- **Dark mode:** Uses CSS class selector `.my-app-dark` (configured in both `app.config.ts` and `src/styles.css`)
- **Testing:** Vitest (not Karma/Jasmine) with Angular TestBed; globals available via `vitest/globals` types
- **Component selector prefix:** `app`

## Key Configuration

- TypeScript strict mode is enabled with all Angular strict options (`strictTemplates`, `strictInjectionParameters`, `strictInputAccessModifiers`)
- Prettier is configured in `package.json` (100 char width, single quotes, Angular HTML parser)
- Bundle budgets: 500kB warning / 1MB error for initial bundle; 4kB warning / 8kB error per component style

## Project Conventions

- Components use standalone imports (no shared modules) — import PrimeNG modules directly in each component's `imports` array
- App bootstraps via `bootstrapApplication()` with providers in `app.config.ts`
- Routes defined in `app.routes.ts`
- Static assets go in `public/`

## Color Guidelines

The custom theme is defined in `src/app/myTheme.ts` (extending Aura). Use these semantic colors — never hardcode hex values when a PrimeNG token or Tailwind utility exists.

| Role | Light | Dark | Usage |
|---|---|---|---|
| Background | `#F9FAFB` | `#0F1115` | Page ground (`surface.50` / `surface.0`) |
| Surface/Card | `#FFFFFF` | `#18181B` | Card panels (`surface.0` / `surface.50`) |
| Border | `#E5E7EB` | `#27272A` | Prefer borders over heavy shadows (`surface.200`) |
| Primary Brand | `#4F46E5` | `#6366F1` | Buttons, links, active states (indigo) |
| Text (Main) | `#111827` | `#F9FAFB` | High-contrast body text (`surface.900`) |
| Text (Sub) | `#6B7280` | `#9CA3AF` | Labels, secondary info (`surface.500` / `surface.600`) |
| Success | `#10B981` | `#34D399` | In Stock, positive metrics (`green.500` / `green.400`) |
| Warning | `#F59E0B` | `#FBBF24` | Low Stock alerts (`amber.500` / `amber.400`) |
| Danger | `#EF4444` | `#F87171` | Out of Stock, returns (`red.500` / `red.400`) |

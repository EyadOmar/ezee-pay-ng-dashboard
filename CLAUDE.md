# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm start` (serves at http://localhost:4200, auto-reloads)
- **Build:** `npm run build` (production by default, outputs to `dist/`)
- **Run all tests:** `npm test` (uses Vitest via `@angular/build:unit-test`)
- **Run single test:** `npx ng test --include=src/app/path/to/file.spec.ts`
- **Scaffold component:** `npx ng generate component component-name`

## Architecture

Admin dashboard SPA with two layout shells and lazy-loaded pages.

- **Angular 21** standalone application (no NgModules) with signal-based reactivity
- **UI framework:** PrimeNG 21 with a custom Aura-based theme (`src/app/myTheme.ts`)
- **Styling:** Tailwind CSS 4 via PostCSS plugin (`@tailwindcss/postcss`), integrated with PrimeNG via `tailwindcss-primeui`. **Always use Tailwind utility classes — do not create component CSS files.**
- **Dark mode:** Uses CSS class selector `.my-app-dark` (configured in both `app.config.ts` and `src/styles.css`)
- **HTTP:** `HttpClient` with functional interceptor (`core/interceptors/auth.interceptor.ts`) that attaches Bearer tokens. `ApiService` provides a base-URL-aware wrapper; feature services can use it or inject `HttpClient` directly.
- **Auth:** Signal-based `AuthService` manages token/user state. Functional `authGuard` protects dashboard routes and redirects to `/login`.
- **Testing:** Vitest (not Karma/Jasmine) with Angular TestBed; globals available via `vitest/globals` types
- **Component selector prefix:** `app`

## Project Structure

```
src/app/
├── core/
│   ├── guards/          # authGuard (functional CanActivateFn)
│   ├── interceptors/    # authInterceptor (functional HttpInterceptorFn)
│   ├── models/          # shared interfaces (ApiResponse, User)
│   └── services/        # singleton services (ApiService, AuthService)
├── shared/
│   └── components/      # reusable components used across pages
├── layouts/
│   ├── auth-layout/     # centered shell for login/register/forgot-password
│   └── dashboard-layout/# sidebar + topbar + content area shell
├── pages/
│   ├── auth/            # login, register, forgot-password
│   └── dashboard/       # overview, products, orders, customers, inventory, reports, settings
├── app.routes.ts        # two layout groups: auth (public) + dashboard (guarded)
├── app.config.ts        # providers: router, HttpClient+interceptors, PrimeNG theme
└── myTheme.ts           # custom PrimeNG preset (colors defined in Color Guidelines below)
```

## Routing

- Auth pages (`/login`, `/register`, `/forgot-password`) render inside `AuthLayout` — no guard
- Dashboard pages (`/dashboard`, `/products`, `/orders`, etc.) render inside `DashboardLayout` — protected by `authGuard`
- All pages are lazy-loaded via `loadComponent` with default exports
- Wildcard `**` redirects to `/dashboard`

## Key Configuration

- TypeScript strict mode is enabled with all Angular strict options (`strictTemplates`, `strictInjectionParameters`, `strictInputAccessModifiers`)
- Prettier is configured in `package.json` (100 char width, single quotes, Angular HTML parser)
- Bundle budgets: 500kB warning / 1MB error for initial bundle; 4kB warning / 8kB error per component style

## Project Conventions

- Components use standalone imports (no shared modules) — import PrimeNG modules directly in each component's `imports` array
- Page components use **default exports** for clean lazy-load routing
- Layout and shared components use **named exports**
- App bootstraps via `bootstrapApplication()` with providers in `app.config.ts`
- Routes defined in `app.routes.ts`
- Static assets go in `public/`
- File naming follows Angular short convention: `name.ts` / `name.html` (no `.component.` infix)
- **No component CSS files** — all styling via Tailwind utility classes in templates
- **Always use Reactive Forms** (`FormGroup`, `FormControl`, `Validators` from `@angular/forms`) — never template-driven forms. Import `ReactiveFormsModule` in components that need forms.

## i18n (Internationalization)

- **Library:** `@jsverse/transloco` with runtime language switching (no separate builds)
- **Supported languages:** English (`en`) and Arabic (`ar`) with full RTL support
- **Translation files:** `public/assets/i18n/en.json` and `public/assets/i18n/ar.json` — flat keys with dot-notation grouping (e.g., `auth.errors.emailRequired`)
- **Usage in templates:** Wrap the root element with `*transloco="let t"`, then use `{{ t('key') }}` for interpolation or `[label]="t('key')"` for property binding
- **Usage in TypeScript:** Inject `TranslocoService` and call `this.transloco.translate('key')`
- **Language service:** `LanguageService` manages language/direction/PrimeNG locale/localStorage persistence. Use `langService.setLanguage('ar')` to switch.
- **RTL convention:** Always use logical CSS properties (`ps/pe/ms/me/start/end`) instead of physical (`pl/pr/ml/mr/left/right`)
- **Adding new strings:** Add to both `en.json` and `ar.json` with matching keys

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

# Angular Monorepo Template

A reference Nx 22 + Angular 21 workspace built as an interview-prep cheat-sheet. Every section below is wired up in real code — open the matching files to see how it works. The same overview is rendered on the app's home page in English and German.

## Stack at a glance

- **Framework**: Angular 21 (standalone components, signals, OnPush)
- **Monorepo**: Nx 22 with Module Federation (webpack)
- **SSR**: `@angular/ssr` on the host app, hydrated with event replay
- **State**: NgRx SignalStore (`@ngrx/signals`) + custom `withBaseStore` feature
- **Realtime**: WebSocket service with auto-reconnect
- **Tooling**: Jest, Cypress, Storybook 10, ESLint 9, Prettier, Husky, lint-staged
- **Delivery**: Docker Compose (host SSR + login remote + json-server) → Docker Hub → EC2

## Implemented techniques

### 1. Architecture & Monorepo

- Apps: `angular-monorepo-template` (host, SSR), `login` (remote), plus `*-e2e` Cypress projects.
- Libs: `core`, `orders`, `invoices`, `statistics`, `admin`.
- Module boundaries enforced by ESLint (`@nx/enforce-module-boundaries`) using tags `type:app | type:lib` + `scope:shared | scope:feature`. Feature libs can only depend on `scope:shared`; libs never import from apps.
- Public API only: each lib exports through `libs/<name>/src/index.ts` — no deep imports.
- **Module Federation (webpack)** — host consumes the `login` remote at runtime (`apps/*/module-federation.config.ts`).

### 2. Rendering & Routing

- Standalone components everywhere; `ChangeDetectionStrategy.OnPush` is the default.
- **SSR** via `provideServerRendering(withRoutes(...))` (`apps/angular-monorepo-template/src/app/app.config.server.ts`).
- **Hydration** with event replay: `provideClientHydration(withEventReplay())`.
- **Lazy loading** — feature pages via `loadComponent`, the login remote via `loadChildren: () => import('login/Routes')`.
- **Route guards**: `isAuthenticated`, `isAdmin`, `redirectIfAuthenticated` (`canActivate`), `featureFlagGuard` (`canMatch`), `unsavedChangesGuard` (`canDeactivate`).
- Wildcard route falls back to a 404 `NotFound` component.

### 3. State Management

- **NgRx SignalStore** (`@ngrx/signals`) with `providedIn: 'root'` for cross-feature stores.
- Custom `withBaseStore()` SignalStore feature (`libs/core/.../store/with-base-store.ts`) provides cache-aware `load` / `reload` / `reset` plus a derived `queryState` (`data | loading | error | loaded`).
- `rxMethod` + `tapResponse` for stream-based fetchers; `patchState` for granular updates.
- Local state via `signal()`, derived state via `computed()`, side effects via `effect()`.
- Cross-feature shared store: `OrdersDataStore` lives in core and is consumed by the orders feature.

### 4. Realtime & Observability

- **WebSocket** `RealtimeService` with auto-reconnect (3 s) and signal-backed `connected` state. Streams typed `order:created | order:updated | order:deleted` events through an RxJS `Subject`.
- **Web Vitals** — `CLS / INP / LCP / FCP / TTFB` measured via dynamic `import('web-vitals')` (browser-only), reported through the `LoggerService`.
- **Trace IDs** — `TraceService` regenerates a per-navigation ID and the `authInterceptor` propagates it as `X-Trace-Id`.
- Global `ErrorHandler` (`GlobalErrorHandler`) feeds a structured `LoggerService`.

### 5. Cross-Cutting Concerns

- HTTP interceptors: `authInterceptor` (Bearer token + trace header), `errorInterceptor` (401 → logout + redirect).
- `provideHttpClient(withFetch(), withInterceptors([...]))` — Fetch-based HTTP client.
- Fake JWT auth in `localStorage` (`demo` / `admin`) with `exp`-based `isTokenExpired()` check.
- Feature flags fetched at boot via `provideAppInitializer` from `json-server`; gated at the route layer with `canMatch`.
- Backend configuration via `InjectionToken` (`BACKEND_CONFIG`) with a per-app provider.

### 6. UI, Accessibility & i18n

- **Custom i18n** — signal-based locale (`en` / `de`), pure pipe `{{ key | t }}`, language toggle component, `documentElement.lang` synced via `effect()`.
- **Theme service** — `light | dark | system`, synchronised with `prefers-color-scheme` and `localStorage`.
- **Accessibility** — skip link, ARIA labels, `sr-only` `aria-live` announcer for auth state changes, focusable controls, AXE/WCAG-AA targeted.
- **Storybook 10** + `@storybook/addon-a11y` for UI primitives (`button`, `card`, `alert`).
- **Design tokens** (colors, spacing, typography) in SCSS — single source of truth via `--ds-*` CSS variables.

### 7. Tooling, CI & Delivery

- **Tests**: Jest unit tests (`nx run-many -t test`) and Cypress e2e for both host and login.
- **Lint / format**: ESLint 9 (flat config) with Nx boundaries, Prettier, Husky + lint-staged on commit.
- **CI**: per-app GitHub Actions pipelines — `.github/workflows/ci-host.yml`, `ci-login.yml`, `ci-json-server.yml`.
- **Docker**: multi-service Compose (`docker-compose.yml` + `*.override.yml` + `*.prod.yml`) for host SSR (port 4000), login remote (port 80) and json-server (port 3000).
- **Deploy**: Image published to Docker Hub (`mzahed23/angular-monorepo-template`) then pulled on EC2 via SSH.

## Project layout

### Apps

| App                             | Type        | Port              | Notes                                      |
| ------------------------------- | ----------- | ----------------- | ------------------------------------------ |
| `angular-monorepo-template`     | Host (MF)   | 4200 / 4000 (SSR) | SSR enabled, serves port 4000 in container |
| `angular-monorepo-template-e2e` | Cypress e2e | —                 | E2E for host app                           |
| `login`                         | Remote (MF) | 4201              | Client-side only                           |
| `login-e2e`                     | Cypress e2e | —                 | E2E for login app                          |

### Libs

| Lib          | Purpose                                                        |
| ------------ | -------------------------------------------------------------- |
| `core`       | Shared services, guards, interceptors, stores, UI, i18n, theme |
| `orders`     | Orders feature (uses `OrdersDataStore` from core)              |
| `statistics` | Statistics feature                                             |
| `invoices`   | Invoices feature                                               |
| `admin`      | Admin feature-flags page (gated by `isAdmin`)                  |

### Runtime services

- **json-server** (`/json-server/`) — feature flags fetched at app init; config in `json-server/config.json`.
- All three services orchestrated via `docker-compose.yml`.

## Run it

```sh
# Host dev server (no Docker)
npm exec nx serve angular-monorepo-template       # http://localhost:4200

# Login remote (no Docker)
npm exec nx serve login                           # http://localhost:4201

# Everything (host + login + json-server) via Docker
docker compose up

# Tests
npm exec nx run-many -t test                      # unit
npm exec nx e2e angular-monorepo-template-e2e     # e2e (host)
npm exec nx e2e login-e2e                         # e2e (login)

# Storybook for UI primitives
npm exec nx run core:storybook
```

## Demo credentials

| User    | Password | Notes                          |
| ------- | -------- | ------------------------------ |
| `demo`  | `demo`   | Standard user                  |
| `admin` | `admin`  | Unlocks `/admin/feature-flags` |

## EC2 production

- URL: <http://13.50.4.156/>
- Port mapping: host `8080 → 4000`, login `8082 → 80`, json-server `3000 → 3000`.

## Useful Nx commands

```sh
npm exec nx graph                                 # interactive dependency graph
npm exec nx show project angular-monorepo-template
npm exec nx affected -t lint test                 # only what changed
```

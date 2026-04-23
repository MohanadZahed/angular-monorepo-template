# Nx Module Boundaries

## Library Tags (enforce via ESLint `@nx/enforce-module-boundaries`)

| Project                     | Tag                       |
| --------------------------- | ------------------------- |
| `angular-monorepo-template` | `type:app`                |
| `login`                     | `type:app`                |
| `core`                      | `type:lib, scope:shared`  |
| `orders`                    | `type:lib, scope:feature` |
| `statistics`                | `type:lib, scope:feature` |
| `invoices`                  | `type:lib, scope:feature` |

## Rules

- Apps can import from any lib
- Feature libs (`scope:feature`) can import from `scope:shared` only — never from other feature libs
- Libs must never import from apps
- Always import from a lib's public API (`libs/<name>/src/index.ts`) — never deep imports

## Commands

```bash
# Check boundaries
npm exec nx lint

# Graph dependencies
npm exec nx graph
```

## Lazy Loading

- Feature routes must always be lazy-loaded via `loadComponent` or `loadChildren`
- Never eagerly import a feature lib component directly in an app module/config

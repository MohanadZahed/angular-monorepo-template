<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

## Project Philosophy

> **Proof of Concept** — keep all implementations as simple and minimal as possible. Avoid abstractions, over-engineering, and premature optimizations.

## Tech Stack

- **Framework**: Angular 21 (SSR on host app)
- **Language**: TypeScript
- **Styling**: SCSS
- **Monorepo**: Nx 22 with Module Federation (webpack)
- **Package manager**: npm
- **Testing**: Jest (unit), Cypress (e2e)

## Project Structure

### Apps

| App                             | Type        | Port              | Notes                                      |
| ------------------------------- | ----------- | ----------------- | ------------------------------------------ |
| `angular-monorepo-template`     | Host (MF)   | 4200 / 4000 (SSR) | SSR enabled, serves port 4000 in container |
| `angular-monorepo-template-e2e` | Cypress e2e | —                 | E2E for host app                           |
| `login`                         | Remote (MF) | 4201              | Client-side only, depends on host          |
| `login-e2e`                     | Cypress e2e | —                 | E2E for login app                          |

### Libs

| Lib          | Purpose                                                    |
| ------------ | ---------------------------------------------------------- |
| `core`       | Shared services, guards, components across all apps & libs |
| `orders`     | Orders feature                                             |
| `statistics` | Statistics feature                                         |
| `invoices`   | Invoices feature                                           |

## Runtime Services

- **json-server** (`/json-server/`): Provides feature flags fetched at app init. Config at `json-server/config.json` (keys: `statistics`, `invoices`, `orders`).
- All three services (`angular-monorepo-template`, `login`, `json-server`) are orchestrated via `docker-compose.yml`.

## EC2 Production Environment

- **URL**: http://13.50.4.156/
- **Port mapping (host → container)**:
  | Service | Host Port | Container Port |
  | --------------------------- | --------- | -------------- |
  | `angular-monorepo-template` | 8080 | 4000 |
  | `login` | 8082 | 80 |
  | `json-server` | 3000 | 3000 |

## CI Pipeline (`.github/workflows/ci.yml`)

Triggered on push/PR to `main`. Sequential jobs:

1. **unit-tests** — `nx run-many --target=test --all`
2. **build** — Docker buildx → tarball artifact (main branch only)
3. **e2e-tests** — load tarball, run Cypress against SSR container
4. **push** — push image to Docker Hub (`mzahed23/angular-monorepo-template`)
5. **deploy** — SSH into EC2, pull `:latest`, restart container on port 80→4000

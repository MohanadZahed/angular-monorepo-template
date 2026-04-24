# Testing Standards

## Unit Tests (Jest)

- Test files: `<name>.spec.ts` next to the source file
- Run all: `npm exec nx run-many --target=test --all`
- Run single: `npm exec nx test <project-name>`
- Keep tests simple — test behavior, not implementation details
- Use `TestBed.configureTestingModule` minimally; prefer `TestBed.inject` + real dependencies where cheap
- Mock only external boundaries (HTTP, services with side effects)

## E2E Tests (Cypress)

- Projects: `angular-monorepo-template-e2e`, `login-e2e`
- Run: `npm exec nx e2e angular-monorepo-template-e2e`
- CI runs with `--configuration=ci` against the built SSR container
- Use `cy.intercept` to stub HTTP calls in e2e tests
- Page objects live in `src/support/*.po.ts`

## Coverage

- No hard threshold set (PoC) — write tests for critical paths (services, guards, resolvers)
- Skip boilerplate tests for trivial components

## CI Behavior

- Unit tests run on every push/PR
- E2E tests only run against the built Docker image (not dev server) in CI

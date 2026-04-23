# /project:review

Run a code review of the current branch changes.

## Steps

1. Show what changed: `git diff main...HEAD --stat`
2. Lint all projects: `npm exec nx run-many --target=lint --all`
3. Run unit tests: `npm exec nx run-many --target=test --all --passWithNoTests`
4. Run e2e tests: `npm exec nx run-many --target=e2e --all`
5. Report:
   - Files changed + summary
   - Any lint errors
   - Unit test pass/fail
   - E2E test pass/fail
   - Obvious code quality issues (console.logs, `any` types, missing OnPush, etc.)

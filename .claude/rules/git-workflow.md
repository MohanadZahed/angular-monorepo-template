# Git Workflow

## Branch Naming

```
feature/<short-description>    # new feature
fix/<short-description>        # bug fix
chore/<short-description>      # tooling, config, deps
```

## Commit Style

- Format: `<type>: <short imperative message>` (max 72 chars)
- Types: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`
- Example: `feat: add login remote module federation config`

## Pull Requests

- Target branch: `main`
- All CI jobs must pass before merge (unit-tests → build → e2e → push → deploy)
- Squash-merge preferred for feature branches

## Protected Branches

- `main` triggers the full CI/CD pipeline on push — never force-push

# /project:deploy

Trigger a production deployment. **Only run on `main` after CI passes.**

## Steps

1. Confirm current branch is `main`: `git branch --show-current`
2. Confirm CI is green (check `.github/workflows/ci.yml` status or ask user)
3. The CI pipeline handles deployment automatically on push to `main` — remind the user:
   > Pushing to `main` triggers the full CI/CD pipeline: unit-tests → build → e2e → push to Docker Hub → deploy to EC2.
   > If you need a manual deploy, use the EC2 commands in `.claude/rules/deployment.md`.
4. If a manual deploy is explicitly requested, output the commands from `deployment.md` for the user to run on EC2.

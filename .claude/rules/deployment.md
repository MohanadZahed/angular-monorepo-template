# Deployment

## Local Development

```bash
# Start host + login + json-server via Docker
docker compose up

# Dev servers (no Docker)
npm exec nx serve angular-monorepo-template   # host on :4200
npm exec nx serve login                        # remote on :4201
```

## Docker

- `docker-compose.yml` — base config (all three services)
- `docker-compose.override.yml` — dev overrides (bind mounts, build args)
- `docker-compose.prod.yml` — prod overrides (EC2 volume paths)
- Main app container serves SSR on port **4000**, mapped to host port **8080** on EC2
- Login remote serves on port **8082** on EC2 (container port 80)
- json-server exposes feature flags on port **3000**
- Image: `mzahed23/angular-monorepo-template`

## CI/CD Pipeline (`.github/workflows/ci.yml`)

Triggered on push/PR to `main`:

1. `unit-tests` — Jest across all projects
2. `build` — `docker buildx` (linux/amd64 + linux/arm64) → tarball artifact
3. `e2e-tests` — load tarball, run Cypress against SSR container
4. `push` — push `:latest` + `:sha-<sha>` to Docker Hub
5. `deploy` — SSH to EC2, pull `:latest`, restart container

## EC2 Deploy (manual equivalent)

```bash
docker pull mzahed23/angular-monorepo-template:latest
docker stop angular-monorepo-template || true
docker rm   angular-monorepo-template || true
docker run -d --name angular-monorepo-template --restart unless-stopped -p 8080:4000 \
  mzahed23/angular-monorepo-template:latest
docker image prune -f
```

## Secrets (GitHub Actions)

- `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY` — SSH access
- `DOCKER_USERNAME`, `DOCKER_PASSWORD` — Docker Hub push

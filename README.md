# CollabAzure Monorepo

Hybrid app: realtime collaboration (Phoenix Channels), DMS + E-sign (.NET 8), Next.js web, shared SDK, and Azure-first infra.

## Quick start

- Prereqs: Docker, Node 18+, npm 10+, .NET 8 SDK, Elixir/OTP 26+, pnpm or npm, make
- Local stack: see docker-compose and Makefile targets

## Make targets

- make dev: install toolchains (node deps), prepare .envs, docker-compose up
- make up/down: compose up/down
- make build: docker buildx bake (or per-app)
- make test: run unit tests (web, dms-core), placeholder for chat-core
- make db-migrate/seed: apply EF migrations and seed demo data

See ARCHITECTURE.md for system overview and security notes.

> TODO: Add links to detailed app READMEs and ADRs as they are authored.

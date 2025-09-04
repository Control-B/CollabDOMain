SHELL := /bin/zsh

# TODO: verify local tools installed (docker, pnpm, dotnet, elixir)

.PHONY: dev up down build test db-migrate seed lint fmt

dev: ## Start local stack with seed data
	pnpm install -w || npm install -w || true
	docker compose up -d --build
	@echo "Local stack starting..."

up:
	docker compose up -d

down:
	docker compose down -v

build:
	docker compose build

test:
	pnpm -w turbo run test || npm run -w turbo run test

lint:
	pnpm -w turbo run lint || npm run -w turbo run lint

fmt:
	pnpm -w prettier -w . || npx prettier -w .

# .NET migrations (placeholder)
db-migrate:
	# TODO: dotnet ef database update in apps/dms-core
	@echo "TODO: implement EF migrations"

seed:
	# TODO: seed demo data via dms-core tool
	@echo "TODO: implement seed script"

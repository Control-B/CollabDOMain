# Architecture Overview

This monorepo hosts:

- apps/web: Next.js 14 App Router frontend (TS + shadcn/ui + Tailwind)
- apps/dms-core: ASP.NET Core 8 Web API for DMS/E-Sign/OS&S
- apps/chat-core: Elixir Phoenix Channels realtime core
- packages/shared: OpenAPI/JSON Schemas + generated TS SDK
- infra: Azure Bicep/Terraform and GitHub Actions workflows

Key integration flows:

- Auth: Azure AD B2C OIDC -> JWT with tenant/org/facility/role claims. TODO: exact claim schema.
- Realtime: Web connects to Phoenix over WebSocket; messages/docs/events topics tenant:{org}:{facility}:{channelId}
- Backplane: Service Bus -> dms-core -> webhook -> chat-core -> client WS
- Storage: Blob for files (immutability for finalized envelopes), Postgres for relational data
- Search: metadata + text extraction stub; optional OCR via Azure Document Intelligence (TODO: licensing, costs)
- Observability: OpenTelemetry -> Azure Monitor/App Insights

Security & compliance: Key Vault for secrets, managed identities, RBAC, tenant isolation, antivirus scanning on uploads, audit logs append-only, WAF on ingress.

> TODO: Expand component diagrams, sequence diagrams, and SLA/SLO targets with measured baselines.

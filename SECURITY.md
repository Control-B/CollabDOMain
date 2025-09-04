# Security

- Secrets: use Azure Key Vault in cloud; .env only locally and never commit.
- Auth: Azure AD B2C OIDC. JWT tokens with tenant/org/facility/role claims.
- OWASP: input validation, output encoding, allowlists, size limits.
- Uploads: virus scan before processing (TODO: ClamAV container integration).
- Audit logs: append-only. Time sync via NTP.

# Lights Off

Monorepo: `lo-backend/` (ASP.NET Core 10 API), `lo-frontend/` (Next.js 16, TypeScript, Tailwind v4), `lo-backend.Tests/` (xUnit).

Frontend rules live in `lo-frontend/CLAUDE.md`.

## Backend

- Every sleep log query is filtered by the logged-in user's id.
- Never print or commit secrets. They live in User Secrets.

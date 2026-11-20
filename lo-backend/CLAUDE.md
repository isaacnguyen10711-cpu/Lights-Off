# Backend (lo-backend)

ASP.NET Core 10 API. Tests live in `../lo-backend.Tests/` (xUnit).

- Every sleep log query is filtered by the logged-in user's id.
- Never print or commit secrets. They live in User Secrets.

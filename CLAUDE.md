# Lights Off

Monorepo: `lo-backend/` (ASP.NET Core 10 API), `lo-frontend/` (Next.js 16, TypeScript, Tailwind v4), `lo-backend.Tests/` (xUnit).


## Frontend

- Tailwind scale classes only, no arbitrary `[...]` values.
- Theme colours only, from `@theme` in `app/globals.css`. Add a new token there instead of using Tailwind's built-in colours.
- Two text colours: `text-strong` and `text-muted` (the calendar `good` / `okay` / `bad` colours are the exception).
- Set sizes for default, `md:` and `xl:`, but don't repeat a value that matches the smaller screen (`pt-6 xl:pt-0`, not `pt-6 md:pt-6 xl:pt-0`).
- No z-index unless it's really needed.
- Keep styling simple and calm, but keep the hover effects.
- Reusable pieces go in `components/`, and their prop types go in `type.ts`.
- Don't call `new Date()` while a page renders (`cacheComponents` is on). Do it in `useEffect` or after data loads.
- Fetch with `credentials: "include"`, and check `response.ok` before `.json()`.

## Backend

- Every sleep log query is filtered by the logged-in user's id.
- Never print or commit secrets. They live in User Secrets.

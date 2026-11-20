# Lights Off

A sleep tracker. Each morning users log last night (bedtime, wake time, sleep quality, plus optional caffeine after 3pm, exercise, stress, screen time before bed and afternoon nap). They see the month on a calendar coloured by quality, and get AI feedback from Claude on each night plus a review of each finished month. Built for people with irregular sleep, mainly shift workers and uni students.

Monorepo:

- `lo-backend/`: ASP.NET Core 10 API. Rules in `lo-backend/CLAUDE.md`.
- `lo-frontend/`: Next.js 16, TypeScript, Tailwind v4. Rules in `lo-frontend/CLAUDE.md`.
- `lo-backend.Tests/`: xUnit tests.

Start Claude Code from this root folder, even for backend-only or frontend-only work, so the memory and chat history stay in one place.

## Workflow

- Don't commit anything in `lo-backend.Tests/` unless Isaac names those files. "Commit all" still leaves them out.
- Update the README (features list, screenshots, Future section) when a feature changes. Screenshots live in `lo-frontend/public/images/` at 1440x900.
- Before pushing, run `npx tsc --noEmit` and `npx eslint app components` in `lo-frontend`, and `dotnet build lo-backend -c Release` (Release so the running dev server doesn't lock the files).

## Where it's up to

Done: email/Google/Facebook login, email confirmation, forgot/reset password, logging and editing nights (any past night from the calendar), home page, dashboard calendar with month review, profile with sleep goals, AI coach, GSAP animations.

Next, in order:

1. RAG for the monthly review (plan in `lo-backend/CLAUDE.md`).
2. Deploy to Azure (Docker). Needs production values for the localhost URLs and the connection string, and the secrets moved out of User Secrets.
3. Send emails from Isaac's own domain through Azure Communication Services.
4. Backend tests. `GetSleepLogs_ReturnsOk` fails with 401, most likely because the test user never confirms their email.

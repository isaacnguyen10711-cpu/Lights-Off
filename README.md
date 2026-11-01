# Lights Off

Lights Off is a sleep tracking web application that helps users find out what affects their sleep. It's built for people with irregular schedules, like shift workers and students. Users log their sleep each night along with a few daily factors, and an AI sleep coach gives them short, personal feedback based on their own data.

## Status

In Development

The backend API is built. The frontend has a working login page, and the home page is in progress.

## Features

- Register and log in with email and password
- Sign in with Google or Facebook, linked to the same account
- If a Google or Facebook login fails or gets cancelled, you're sent back to the login page with a message
- Stay logged in with a secure HttpOnly cookie
- Log a night of sleep with bedtime, wake up time and sleep quality
- Add optional daily factors: caffeine after 3pm, exercise, stress, screen time before bed and naps
- See your latest night on the home page
- Get all your sleep logs for a month (for the dashboard calendar)
- Update saved sleep logs
- Get short AI feedback on last night's sleep, compared with the week before
- Get an AI review of a whole month
- AI answers are saved, so the same feedback isn't paid for twice (last night's feedback is cleared when you edit that log)
- AI endpoints are rate limited to 5 requests per minute per user
- Only see and change your own sleep logs

## Screenshots

Screenshots will be added once the main pages are done.

## Technology Stack

### Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS

### Backend

- ASP.NET Core Web API
- C#
- Entity Framework Core
- SQL Server
- ASP.NET Core Identity (cookie authentication)
- Google and Facebook OAuth
- Rate limiting
- Swagger UI

### Testing

- xUnit

### External APIs

- Anthropic Claude API

## Getting Started

### Backend

1. Open `lo-backend` and set your connection string in `appsettings.json`.
2. Add these keys with User Secrets (`dotnet user-secrets set "<key>" "<value>"`):
   - `Authentication:Google:ClientId`
   - `Authentication:Google:ClientSecret`
   - `Authentication:Facebook:AppId`
   - `Authentication:Facebook:AppSecret`
   - `Anthropic:Api:Key`
3. Run `dotnet ef database update`, then `dotnet run`.

### Frontend

1. Open `lo-frontend` and create a `.env.local` file with:
   ```text
   NEXT_PUBLIC_API_URL=https://localhost:7152
   ```
2. Run `npm install`, then `npm run dev` and open http://localhost:3000.

## Future Implementations

### Frontend
- Finish the home page (scores and coach feedback from real data)
- Build the log a night form
- Build the dashboard with a sleep calendar and monthly stats
- Show the full details of a night when a day is selected

### Backend
- Use RAG (OpenAI embeddings) so the monthly review can compare against similar past nights
- Add password reset and email verification
- Let users set a sleep goal and update their profile
- Let users delete their account
- Deploy to AWS

## Project Structure

```text
Lights-Off/
├── lo-backend/            # ASP.NET Core Web API
│   ├── Controllers/       # API endpoints (authentication, sleep logs, sleep coach)
│   ├── Data/              # Database context
│   ├── Filters/           # Request validation filters
│   ├── Migrations/        # Database migrations
│   ├── Models/            # Database models, DTOs and enums
│   ├── Services/          # Sleep coach that calls the Claude API
│   └── Program.cs         # App setup
├── lo-backend.Tests/      # Backend tests
├── lo-frontend/           # Next.js frontend
│   ├── app/               # Pages (login, home)
│   └── components/        # Shared UI pieces and styles
└── README.md
```

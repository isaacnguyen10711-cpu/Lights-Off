# Lights Off

Lights Off is a sleep tracking web application that helps users find out what affects their sleep. Users log their sleep each night along with a few daily factors, and an AI sleep coach gives them short, personal feedback based on their own data.

## Status

In Development

The backend API is built. The Next.js frontend is next.

## Features

- Register and log in with email and password
- Sign in with Google or Facebook, linked to the same account
- Stay logged in with a secure HttpOnly cookie
- Log a night of sleep with bedtime, wake up time and sleep quality
- Add optional daily factors: caffeine after 3pm, exercise, stress, screen time before bed and naps
- View all saved sleep logs or a single log
- Update saved sleep logs
- Get short AI feedback on last night's sleep, compared with the week before
- Only see and change your own sleep logs

## Screenshots

Screenshots will be added once the frontend is built.

## Technology Stack

### Frontend

- Next.js (planned)

### Backend

- ASP.NET Core Web API
- C#
- Entity Framework Core
- SQL Server
- ASP.NET Core Identity (cookie authentication)
- Google and Facebook OAuth
- Swagger UI

### External APIs

- Anthropic Claude API

## Future Implementations

### Frontend
- Build the login, register and sleep log pages
- Add a sleep calendar that shows hours slept for each day
- Show monthly sleep stats when a month is selected
- Show the full details of a night when a day is selected

### Backend
- Add a calendar endpoint with monthly sleep stats
- Add password reset and email verification
- Add insights on what affects sleep, like caffeine or night shifts
- Allow requests from the frontend (CORS)
- Deploy to AWS

## Project Structure

```text
Lights-Off/
Controllers/     # API endpoints (authentication, sleep logs, sleep coach)
Data/            # Database context
Filters/         # Request validation filters
Migrations/      # Database migrations
Models/          # Database models, DTOs and enums
Services/        # Sleep coach that calls the Claude API
Program.cs       # App setup
README.md
```

---

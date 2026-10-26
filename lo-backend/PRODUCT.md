# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Backend: ASP.NET Core 10 Web API (this repo). Frontend: Next.js (planned, not built yet). Screens are designed in Figma first before being built.

## Users

People with irregular sleep schedules, mainly shift workers and university students (the founder works weekend night shifts). They log last night's sleep each morning, usually on their phone, and want to understand what is making their sleep better or worse.

## Product Purpose

Lights Off is a sleep tracker that helps people find out what affects their sleep. Users log bedtime, wake time, quality (1-10) and a few optional daily factors (caffeine after 3pm, exercise, stress, screen time before bed, naps). The app shows their sleep on a monthly calendar and gives short AI feedback based on their own data. Success means people keep logging and learn something real about their sleep.

## Positioning

Wearables measure sleep automatically; Lights Off focuses on explaining why, using the user's own logged habits, for people whose schedules are irregular.

## Operating Context

- Logging happens once a day, in the morning, after waking up.
- A log belongs to the day the user woke up.
- Users sign in with email and password, Google, or Facebook (one account can link several).
- The dashboard shows last night's feedback, a monthly calendar (each day shows hours slept, coloured by quality), month stats, and full details when a day is selected.
- A monthly AI review unlocks after each month ends.

## Capabilities and Constraints

- Built: login (Identity cookies, Google, Facebook), create/read/edit sleep logs (no delete), last-night AI feedback, monthly AI review (Claude API).
- Sleep logs cannot be deleted; deleting the account removes them.
- Not built yet: the frontend, the calendar/stats endpoint, password reset emails, deployment (AWS).

## Brand Commitments

- Name: Lights Off.
- The AI feedback has a short, friendly, slightly cute tone (for example "Great job! You slept 8.1 hours...").
- The user asked for a black background with dark blue and white for components (first stated for the login page).

## Evidence on Hand

No real users, testimonials, metrics or screenshots yet. Do not invent any.

## Product Principles

1. Logging must take seconds, or people stop logging.
2. Show patterns the user can act on, not just numbers.
3. Feedback is encouraging and honest, never medical advice.
4. Users only ever see their own data.

# Backend (lo-backend)

ASP.NET Core 10 API with EF Core on SQL Server, ASP.NET Identity with cookies, Google and Facebook login, a Claude sleep coach and a MailKit mailer. Tests live in `../lo-backend.Tests/` (xUnit).

## Rules

- Every sleep log query is filtered by the logged-in user's id.
- Never print or commit secrets. They live in User Secrets.
- Keep the code junior-readable, with short comments that say what the code does.

## Endpoints

- `/api/identity/*`: `MapIdentityApi<User>()` (register, login, confirmEmail, resendConfirmationEmail, forgotPassword, resetPassword).
- `/api/authentication`: `login` and `callback` (Google/Facebook), `GET/PUT/DELETE me`, `logout`.
- `/api/sleeplogs`: `GET ?year=&month=` (logs plus month averages), `GET {id}`, `GET latest-log`, `POST` (409 if that day is already logged), `PUT {id}`.
- `/api/sleepcoach`: `latest-night` and `monthly?year=&month=`. Both use the `AIFeedbackRequest` rate limit policy.

## Identity

- `RequireConfirmedEmail` is on. Google and Facebook accounts are set to `EmailConfirmed = true`.
- `/login` returns 401 with `detail` set to `Failed`, `NotAllowed` (email not confirmed) or `LockedOut`. The frontend shows a different message for each.
- `/register` returns a 400 ValidationProblem. The keys of its `errors` dictionary are Identity error codes (`DuplicateUserName`, `PasswordTooShort` and so on).
- `forgotPassword` always returns 200 and only emails confirmed users.

## Email (`Services/EmailService/Mailer.cs`)

- Implements `IEmailSender<User>`. Only `SendConfirmationLinkAsync` and `SendPasswordResetCodeAsync` are called by `MapIdentityApi`.
- Links point at the frontend (`/confirm-email`, `/reset-password`) using `Frontend:Url` from config. The confirm link keeps the query string from Identity's link (HTML-decoded).
- SMTP settings come from User Secrets.

## Sleep coach (`Services/SleepCoachService/ClaudeSleepCoach.cs`)

- Nightly feedback compares last night with the week before and mentions the user's sleep goals. It's saved on `SleepLog.LastNightFeedback`, so it only costs one call per night.
- The monthly review only works once the month is finished (400 with a message before that). It's saved in `MonthlyReviews`.
- `DescribeNight()` turns a log into the text sent to Claude.

## RAG plan for the monthly review (next feature)

Isaac's plan: a knowledge base of trusted sleep articles, searched using the month's results, so Claude's advice is based on real sources.

1. Done: 11 articles saved as `.md` files in `SleepArticles/`: line 1 `# Title`, line 2 `Source: <url>`, then the text with blank lines between paragraphs. Copyrighted sources (Sleep Foundation, Woolcock, Sleep Health Foundation) are summaries in our own words, marked under the `Source:` line. NHLBI ones are public domain and copied in full. Never paste copyrighted article text in word for word.
2. Add a `KnowledgeChunk` model (`SourceTitle`, `SourceUrl`, `Text`, `float[] Embedding` stored as JSON) and a migration.
3. Ingestion runs at startup: split each new file into paragraph-based chunks of about 1500 characters, embed each chunk with OpenAI `text-embedding-3-small` (the `OpenAI` NuGet package, key in User Secrets as `OpenAI:ApiKey`), and save it. Skip files whose `SourceUrl` is already stored.
4. During the monthly review, turn the month's patterns into a plain sentence, embed it, rank the chunks with cosine similarity in C#, and add the top 4 (with their titles) to the prompt. Tell Claude to base its advice on them and name the source.
5. Update the README Future section to match. It still says "compare against similar past nights".

## Before deploying

- CORS only allows `http://localhost:3000` (`Program.cs`).
- `appsettings.json` has a localhost `Frontend:Url`.
- The database is Azure SQL (`chef-minhh` server, `LightsOffDb`, free offer, auto-pauses). The connection string uses `Authentication=Active Directory Default`, so there's no password: locally it logs in as Isaac's `az login` account. The deployed app will need a managed identity added as a database user. New IPs need a firewall rule on the server.

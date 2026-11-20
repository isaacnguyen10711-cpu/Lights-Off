# Lights Off frontend

Next.js 16, TypeScript, Tailwind v4, TanStack Query, GSAP.

@AGENTS.md

## Pages

- `/` login, `/register`, `/confirm-email`, `/forgot-password`, `/reset-password`
- `/home`: last night's sleep and the coach's feedback
- `/log` (takes `?date=` from the dashboard), `/update-log?id=`
- `/dashboard`: month calendar, month stats, month review, details of the picked night
- `/profile`, `/change-password`

## Styling

- Tailwind scale classes only, no arbitrary `[...]` values.
- Theme colours only, from `@theme` in `app/globals.css`. Add a new token there instead of using Tailwind's built-in colours.
- Two text colours: `text-strong` and `text-muted` (the calendar `good` / `okay` / `bad` colours are the exception). Error messages use `text-red-500`.
- Set sizes for default, `md:` and `xl:`, but don't repeat a value that matches the smaller screen (`pt-6 xl:pt-0`, not `pt-6 md:pt-6 xl:pt-0`).
- No z-index unless it's really needed (the popup's `z-50` is the one exception).
- Keep styling simple and calm, but keep the hover effects. Boxes brighten their border on hover with `transition-colors duration-300 hover:border-muted`.
- Shared styles live in `components/styles.ts` (`boxStyles`, `labelStyles`, `signInInputStyles`, `primaryButtonStyles`, `secondaryButtonStyles`). Reuse them instead of copying classes.
- The button styles don't include the hover lift. Add `hover:-translate-y-1` where they're used (the profile page buttons stay flat).
- To change a size that a shared style already sets, add the `!` suffix (`h-10!`). The order of classes in `className` doesn't decide which one wins.
- A `<button>` only grows to fit its text, while a `<Link>` with the same `flex` style fills the width. Add `w-full` only if a full-width button is wanted.

## Code

- Reusable pieces go in `components/`, and their prop types go in `type.ts`.
- Don't call `new Date()` while a page renders (`cacheComponents` is on). Do it in `useEffect` or after data loads.
- Fetch with `credentials: "include"`, and check `response.ok` before `.json()`. A 401 means logged out, so send them to `/`.
- Use `PopUpDialog` for messages that need the user's attention, never `alert()`.
- Keep the code junior-readable, and keep Isaac's method and component names.
- Comments are short and only say what the code does.

## `cacheComponents` gotchas

Pages stay alive in the background after you leave them, and their `useEffect` runs again when they're shown. So old form values, errors and popups stay unless they're cleared:

- Forms with `defaultValue` get a `key` (e.g. `key={logData.sleepLogId}`) so they rebuild for each night.
- The log page calls `formRef.current?.reset()` in its effect, and `onReset` clears the error message.
- Close popups in the button that leaves the page, not when coming back, so they don't flash.
- Avoid calling `setState` straight inside `useEffect` (the `react-hooks/set-state-in-effect` lint rule). The dashboard date effect is the known exception.

## Data (TanStack Query)

- Query keys in use: `["me"]`, `["latest-log"]`, `["sleepLogs", year, month]`, `["monthly-review", year, month]`, `["coach-feedback", id]`.
- After saving, use `invalidateQueries` so the data refetches. On logout, use `queryClient.clear()`.
- The monthly review has `staleTime: Infinity`: a finished month never changes and the coach is rate limited.

## Animations (GSAP)

- Use `useGSAP` from `@gsap/react` with refs, and `gsap.registerPlugin(useGSAP)` at the top of the file.
- Only animate things appearing (popup, home boxes, calendar days, picked night). Hovers stay CSS.
- Start every animation with `if (prefersReducedMotion()) return;` from `components/motion.ts`.
- Use `revertOnUpdate: true` when the animation re-runs on a dependency change, so it never starts from a half-finished state.
- Keep it to one `gsap.from` per element with `autoAlpha`, `y` or `scale`, a duration of about 0.3–0.6s and `power2.out`.

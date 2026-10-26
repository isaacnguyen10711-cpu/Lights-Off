import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in | Lights Off",
};

// the backend, Google and Facebook login start from here
const API_URL = "https://localhost:7152";

// shared styles for the email and password boxes
const inputStyles =
  "mt-2 h-12 w-full rounded-xl border border-line bg-field px-4 text-base text-strong placeholder:text-muted focus:border-strong focus:outline-none";

const labelStyles = "text-xs font-semibold uppercase tracking-wider text-muted";

const socialStyles =
  "flex h-12 flex-1 items-center justify-center gap-3 rounded-xl border border-line bg-field font-semibold transition-colors hover:border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-strong";

export default function HomePage() {
  return (
    <main className="min-h-screen lg:flex lg:h-screen lg:overflow-hidden">
      {/* left side: logo, the clock and what the app does */}
      <section className="flex flex-col justify-between gap-6 px-4 py-8 sm:px-12 lg:flex-1 lg:px-20 lg:py-10">
        <p className="text-2xl font-bold tracking-tight">Lights Off</p>

        <div className="relative mx-auto">
          {/* soft navy glow, the clock comes after it in the code so it sits on top */}
          <div className="absolute inset-12 rounded-full bg-navy blur-3xl" />
          <Image src="/sleep-dial.svg" alt="" width={548} height={548} priority className="relative size-80 sm:size-128" />
        </div>

        <div>
          <h1 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
            Improve your sleeps instantly
          </h1>
          <p className="mt-3 text-base text-muted">Sleep tracker for your busy schedule.</p>
        </div>
      </section>

      {/* right side: the sign in form */}
      <section className="flex flex-col gap-12 px-4 pb-10 sm:px-12 lg:w-lg lg:shrink-0 lg:py-12 lg:pr-16 lg:pl-0">
        <div className="my-auto w-full max-w-sm self-center lg:self-start">
          <h2 className="text-3xl font-semibold tracking-tight">Welcome back</h2>
          <p className="mt-2 text-muted">Sign in to log last night&rsquo;s sleep.</p>

          {/* not hooked up to the backend yet, so the button doesn't submit anything */}
          <form className="mt-8 flex flex-col gap-4">
            <label className="block">
              <span className={labelStyles}>Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your email"
                className={inputStyles}
              />
            </label>

            <label className="block">
              <span className={labelStyles}>Password</span>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className={inputStyles}
              />
            </label>

            <button
              type="button"
              className="mt-2 h-12 rounded-xl bg-strong font-bold text-navy transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-strong"
            >
              Sign in
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-muted">
            <span className="h-px flex-1 bg-line-soft" />
            or
            <span className="h-px flex-1 bg-line-soft" />
          </div>

          {/* these go straight to the backend, which sends the user to Google or Facebook */}
          <div className="flex gap-3">
            <a href={`${API_URL}/api/authentication/login?provider=Google`} className={socialStyles}>
              <Image src="/icons/google.svg" alt="" width={20} height={20} />
              Google
            </a>
            <a href={`${API_URL}/api/authentication/login?provider=Facebook`} className={socialStyles}>
              <Image src="/icons/facebook.svg" alt="" width={20} height={20} />
              Facebook
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-sm text-muted lg:w-full lg:max-w-sm lg:items-end">
          <p>
            New here?{" "}
            <Link href="/register" className="font-bold text-strong underline underline-offset-4">
              Create an account
            </Link>
          </p>
          <p>
            Forgot password?{" "}
            <Link href="/reset-password" className="font-bold text-strong underline underline-offset-4">
              Reset password
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

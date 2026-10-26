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
  "mt-2 h-13 w-full rounded-xl border border-line bg-field px-4 text-base text-strong placeholder:text-placeholder focus:border-strong focus:outline-none";

const labelStyles = "text-xs font-semibold uppercase tracking-[0.06em] text-muted";

const socialStyles =
  "flex h-13 flex-1 items-center justify-center gap-3 rounded-xl border border-line bg-field font-semibold transition-colors hover:border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-strong";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1fr_minmax(420px,520px)]">
      {/* left side: logo, the clock and what the app does */}
      <section className="flex flex-col justify-between gap-8 px-4 py-8 sm:px-12 lg:min-h-screen lg:px-20 lg:py-12">
        <p className="text-[22px] font-bold tracking-tight">Lights Off</p>

        {/* the clock shrinks on short screens so the whole page fits without scrolling */}
        <div className="relative isolate mx-auto w-full max-w-[min(600px,58vh)]">
          {/* soft navy glow behind the clock */}
          <div className="absolute inset-[12%] -z-10 rounded-full bg-navy blur-[90px]" />
          <Image src="/sleep-dial.svg" alt="" width={600} height={600} priority className="h-auto w-full" />
        </div>

        <div>
          <h1 className="text-4xl leading-tight font-semibold tracking-[-0.03em] sm:text-[56px]">
            Improve your sleeps instantly
          </h1>
          <p className="mt-5 max-w-[520px] text-base leading-relaxed text-muted">
            For shift workers, students and anyone whose nights move around. Log last night in seconds and see what
            changes your sleep.
          </p>
        </div>
      </section>

      {/* right side: the sign in form */}
      <section className="flex flex-col gap-12 px-4 pb-10 sm:px-12 lg:py-12 lg:pr-16 lg:pl-0">
        <div className="my-auto w-full max-w-[420px] self-center lg:self-start">
          <h2 className="text-[32px] leading-10 font-semibold tracking-[-0.02em]">Welcome back</h2>
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
                placeholder="••••••••••"
                className={inputStyles}
              />
            </label>

            <button
              type="button"
              className="mt-2 h-13 rounded-xl bg-strong font-bold text-navy transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-strong"
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

        <div className="flex flex-col gap-3 text-sm text-muted lg:items-end">
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

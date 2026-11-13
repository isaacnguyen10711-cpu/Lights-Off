"use client";

import Image from "next/image";
import Link from "next/link";
import { labelStyles, signInInputStyles } from "../../components/styles";

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen md:flex md:h-screen md:overflow-hidden">
      {/* left side: logo, the clock and what the app does */}
      <section className="flex flex-col justify-between md:flex-1 gap-6 xl:gap-8 px-4 md:px-8 xl:px-20 py-8 xl:py-10">
        <p className="text-xl md:text-2xl font-bold tracking-tight">Lights Off</p>

        <div className="relative mx-auto">
          <div className="absolute inset-12 rounded-full bg-navy blur-3xl" />
          <Image src="/sleep-dial.svg" alt="" width={548} height={548} priority className="relative size-72 xl:size-128" />
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-3xl xl:text-4xl leading-tight font-semibold tracking-tight">
            Improve your sleeps instantly
          </h1>
          <p className="mt-2 xl:mt-3 text-base md:text-sm xl:text-base text-muted">
            Sleep tracker for your busy schedule.
          </p>
        </div>
      </section>

      {/* right side: pick a new password. the email and code come from the link in the email */}
      <section className="flex flex-col md:w-96 xl:w-lg md:shrink-0 gap-12 md:gap-8 xl:gap-12 px-4 md:pr-8 md:pl-0 xl:pr-16 pb-10 md:py-8 xl:py-12">
        <div className="my-auto w-full max-w-sm self-center md:self-start">
          <h2 className="text-3xl md:text-2xl xl:text-3xl font-semibold tracking-tight">Set a new password</h2>
          <p className="mt-2 md:mt-1 xl:mt-2 text-base md:text-sm xl:text-base text-muted">
            Pick something you haven&rsquo;t used before.
          </p>

          <form className="mt-8 md:mt-6 xl:mt-8 flex flex-col gap-4 md:gap-3 xl:gap-4">
            <label>
              <span className={labelStyles}>New password</span>
              <input
                type="password"
                name="newPassword"
                autoComplete="new-password"
                placeholder="Create a new password"
                required
                className={signInInputStyles}
              />
            </label>

            <label>
              <span className={labelStyles}>Confirm new password</span>
              <input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Enter it again"
                required
                className={signInInputStyles}
              />
            </label>

            <button
              type="submit"
              className="mt-2 h-12 md:h-11 xl:h-12 rounded-xl bg-strong text-base md:text-sm xl:text-base font-bold text-navy transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-strong"
            >
              Reset password
            </button>
          </form>
        </div>

        <div className="flex flex-col md:w-full md:max-w-sm md:items-end gap-3 md:gap-2 xl:gap-3 text-sm md:text-xs xl:text-sm text-muted">
          <p>
            Remembered it?{" "}
            <Link href="/" className="font-bold text-strong hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

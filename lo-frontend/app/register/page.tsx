"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef } from "react";
import { SignInDetails } from "../../type";
import PopUpDialog from "@/components/PopUpDialog";

// the backend address, set in .env.local
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// same styles as the login page
const inputStyles =
  "mt-2 h-12 md:h-11 xl:h-12 w-full rounded-xl border border-line bg-field px-4 md:px-3 xl:px-4 text-base md:text-sm xl:text-base text-strong placeholder:text-muted transition duration-300 hover:-translate-y-1 focus:border-strong focus:outline-none";

const labelStyles = "text-xs font-semibold uppercase tracking-wider text-muted";

export default function RegisterPage() {
  const [showEmailNotConfirmedDialog, setShowEmailNotConfirmedDialog] = useState(false);
  // what went wrong with sign up, null means there's no error popup to show
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // clear the last error so an old one doesn't appear again
    setErrorMessage(null);

    // same shape the login page sends, used for both requests below
    const details: SignInDetails = {
      email: emailRef.current?.value ?? "",
      password: passwordRef.current?.value ?? "",
    };

    // check this here so we don't bother the backend
    if (details.password !== confirmPasswordRef.current?.value) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/identity/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // the keys are identity's error codes, e.g. "DuplicateUserName"
        const errors = errorData.errors ?? {};
        if (errors) {
          setErrorMessage(Object.values(errors).flat().join("\n"));
        }
        return;
      }
      else {
        setShowEmailNotConfirmedDialog(true);
      }
    }
    catch (error) {
      console.error("Error during sign up:", error);
    }
  };

  return (
    <>
    {showEmailNotConfirmedDialog && (
      <PopUpDialog
        title="Email Confirmation required"
        message="Please confirm your email before logging in."
        firstButtonText="OK"
        onFirstButtonClick={() => { setShowEmailNotConfirmedDialog(false); router.push("/"); }}
      />
    )}

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

      {/* right side: the sign up form */}
      <section className="flex flex-col md:w-96 xl:w-lg md:shrink-0 gap-12 md:gap-8 xl:gap-12 px-4 md:pr-8 md:pl-0 xl:pr-16 pb-10 md:py-8 xl:py-12">
        <div className="my-auto w-full max-w-sm self-center md:self-start">
          <h2 className="text-3xl md:text-2xl xl:text-3xl font-semibold tracking-tight">Create an account</h2>
          <p className="mt-2 md:mt-1 xl:mt-2 text-base md:text-sm xl:text-base text-muted">
            Start tracking your sleep tonight.
          </p>
          {errorMessage && (
            <p className="mt-2 whitespace-pre-line text-sm text-red-500">
              {errorMessage}
            </p>
          )}

          <form className="mt-8 md:mt-6 xl:mt-8 flex flex-col gap-4 md:gap-3 xl:gap-4" onSubmit={handleRegister}>
            <label>
              <span className={labelStyles}>Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your email"
                required
                className={inputStyles}
                ref={emailRef}
              />
            </label>

            <label>
              <span className={labelStyles}>Password</span>
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="Create a password"
                required
                className={inputStyles}
                ref={passwordRef}
              />
            </label>

            <label>
              <span className={labelStyles}>Confirm password</span>
              <input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Enter your password again"
                required
                className={inputStyles}
                ref={confirmPasswordRef}
              />
            </label>

            <button
              type="submit"
              className="mt-2 h-12 md:h-11 xl:h-12 rounded-xl bg-strong text-base md:text-sm xl:text-base font-bold text-navy transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-strong"
            >
              Sign up
            </button>
          </form>
        </div>

        <div className="flex flex-col md:w-full md:max-w-sm md:items-end gap-3 md:gap-2 xl:gap-3 text-sm md:text-xs xl:text-sm text-muted">
          <p>
            Already have an account?{" "}
            <Link href="/" className="font-bold text-strong hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRef, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SignInDetails } from "../type";
import PopUpDialog from "@/components/PopUpDialog";

// the backend address, set in .env.local
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// shared styles for the email and password boxes
const inputStyles =
  "mt-2 h-12 md:h-11 xl:h-12 w-full rounded-xl border border-line bg-field px-4 md:px-3 xl:px-4 text-base md:text-sm xl:text-base text-strong placeholder:text-muted transition duration-300 hover:-translate-y-1 focus:border-strong focus:outline-none";

const labelStyles = "text-xs font-semibold uppercase tracking-wider text-muted";

const socialStyles =
  "flex h-12 md:h-11 xl:h-12 flex-1 items-center justify-center gap-3 md:gap-2 xl:gap-3 rounded-xl border border-line bg-field text-base md:text-sm xl:text-base font-semibold transition duration-300 hover:-translate-y-1 hover:border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-strong";

// the backend sends Google/Facebook login errors back as ?error=<code>.
// we only show our own messages, never text from the url
const errorMessages: Record<string, string> = {
  "login-cancelled": "Sign in was cancelled.",
  "login-failed": "Something went wrong signing in. Please try again.",
  "email-taken": "This email already has an account. Sign in the way you did before.",
};

export default function SignInPage() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showEmailNotConfirmedDialog, setShowEmailNotConfirmedDialog] = useState(false);
  const [showResendEmailDialog, setShowResendEmailDialog] = useState(false);

  const fetchUser = async () => {
    const response = await fetch(`${API_URL}/api/authentication/me`, {
      method: "GET",
      credentials: "include", // send the login cookie too
    });

    // not logged in is normal on this page
    if (response.status === 401) {
      return null;
    }

    // anything else means something actually broke
    if (!response.ok) {
      throw new Error("Couldn't check if the user is logged in");
    }

    return response.json();
  };

  // check if they're already logged in
  const { data: user, error } = useQuery({
    queryKey: ["me"],
    queryFn: fetchUser,
    // we want to check every time they visit the login page, so no caching and if they log out, we don't want to keep the old user data
    staleTime: 0,
    gcTime: 0,
  });

  // already logged in, so go straight to home
  useEffect(() => {
    if (user) {
      router.replace("/home");
    }
  }, [user, router]);

  useEffect(() => {
    // show a message if Google/Facebook login sent us back with an error
    const error = new URLSearchParams(window.location.search).get("error");
    if (error && errorMessages[error]) {
      // only runs once when google/facebook sends us back with ?error=, so the extra render is fine
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrorMessage(errorMessages[error]);
      // clear ?error from the url so the message doesn't pop up again on reload
      router.replace("/");
    }
  }, [router]);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // clear the last error so an old one doesn't hang around
    setErrorMessage(null);

    // what the backend needs to log them in
    const details: SignInDetails = {
      email: emailRef.current?.value ?? "",
      password: passwordRef.current?.value ?? "",
    };

    try {
      const response = await fetch(`${API_URL}/api/identity/login?useCookies=true`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(details),
          credentials: "include"
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.detail === "NotAllowed") {
            setShowEmailNotConfirmedDialog(true);
          } 
          else {
            setErrorMessage("Sign in failed. Please check your credentials.");
          }
        }
        else {
          // the cache still says "not logged in" from this page, so forget it or home won't get the user
          queryClient.removeQueries({ queryKey: ["me"] });
          router.replace("/home");
        }
      }
      catch (error) {
        console.error("Error during sign in:", error);
        setErrorMessage("We can't reach the server right now. Try again in a minute.");
      }
    };

    // sends the confirm email again, for when the first one got lost or the link expired
    const handleResendConfirmationEmail = async () => {
      // the email they just tried to log in with is still in the box
      const email = emailRef.current?.value ?? "";

      try {
        const response = await fetch(`${API_URL}/api/identity/resendConfirmationEmail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        // either way this popup's done its job, so close it
        setShowEmailNotConfirmedDialog(false);

        if (!response.ok) {
          setErrorMessage("Couldn't send the email. Try again in a minute.");
          return;
        }

        // swap to the "email sent" popup
        setShowResendEmailDialog(true);
      }
      catch (error) {
        console.error("Error resending confirmation email:", error);
        setShowEmailNotConfirmedDialog(false);
        setErrorMessage("We can't reach the server right now. Try again in a minute.");
      }
    };

    return (
      <>
        {showEmailNotConfirmedDialog && (
          <PopUpDialog
            title="Email not confirmed"
            message="Please confirm your email before logging in."
            firstButtonText="OK"
            onFirstButtonClick={() => setShowEmailNotConfirmedDialog(false)}
            secondButtonText="Resend email"
            onSecondButtonClick={handleResendConfirmationEmail}
          />
        )}
        {showResendEmailDialog && (
          <PopUpDialog
            title="Email sent"
            message="We sent you a new link. Check your inbox (and spam)."
            firstButtonText="OK"
            onFirstButtonClick={() => setShowResendEmailDialog(false)}
          />
        )}
      <main className="min-h-screen md:flex md:h-screen md:overflow-hidden">
        {/* left side: logo, the clock and what the app does */}
        <section className="flex flex-col justify-between md:flex-1 gap-6 xl:gap-8 px-4 md:px-8 xl:px-20 py-8 xl:py-10">
          <p className="text-xl md:text-2xl font-bold tracking-tight">Lights Off</p>

          <div className="relative mx-auto">
            {/* soft navy glow, the clock comes after it in the code so it sits on top */}
            <div className="absolute inset-12 rounded-full bg-navy blur-3xl" />
            <Image src="/sleep-dial.svg" alt="" width={548} height={548} priority className="relative size-72 xl:size-128" />
          </div>

          {/* centred when stacked on phones, left aligned once it's side by side */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl xl:text-4xl leading-tight font-semibold tracking-tight">
              Improve your sleeps instantly
            </h1>
            <p className="mt-2 xl:mt-3 text-base md:text-sm xl:text-base text-muted">
              Sleep tracker for your busy schedule.
            </p>
          </div>
        </section>

        {/* right side: the sign in form */}
        <section className="flex flex-col md:w-96 xl:w-lg md:shrink-0 gap-12 md:gap-8 xl:gap-12 px-4 md:pr-8 md:pl-0 xl:pr-16 pb-10 md:py-8 xl:py-12">
          <div className="my-auto w-full max-w-sm self-center md:self-start">
            <h2 className="text-3xl md:text-2xl xl:text-3xl font-semibold tracking-tight">Welcome back</h2>
            <p className="mt-2 md:mt-1 xl:mt-2 text-base md:text-sm xl:text-base text-muted">
              Sign in to log last night&rsquo;s sleep.
            </p>

            {/* wrong password, google/facebook problems, resend failing. each on its own line */}
            {errorMessage && (
              <p className="mt-2 whitespace-pre-line text-sm text-red-500">
                {errorMessage}
              </p>
            )}

            {/* the login check failed, so tell them instead of failing quietly. our own words,
                because if the server is off the browser's message is just "Failed to fetch" */}
            {error && <p className="mt-4 text-sm text-muted">We can&rsquo;t reach the server right now. Try again in a minute.</p>}

            {/* sends the email and password to the backend when they press sign in */}
            <form className="mt-8 md:mt-6 xl:mt-8 flex flex-col gap-4 md:gap-3 xl:gap-4" onSubmit={handleSignIn}>
              <label>
                <span className={labelStyles}>Email</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  className={inputStyles}
                  ref={emailRef}
                />
              </label>

              <label>
                <span className={labelStyles}>Password</span>
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={inputStyles}
                  ref={passwordRef}
                />
              </label>

              <button
                type="submit"
                className="mt-2 h-12 md:h-11 xl:h-12 rounded-xl bg-strong text-base md:text-sm xl:text-base font-bold text-navy transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-strong"
              >
                Sign in
              </button>
            </form>

            <div className="my-6 md:my-5 xl:my-6 flex items-center gap-3 text-xs text-muted">
              <span className="h-px flex-1 bg-muted" />
              or
              <span className="h-px flex-1 bg-muted" />
            </div>

            {/* these go straight to the backend, which sends the user to Google or Facebook */}
            <div className="flex gap-3 md:gap-2 xl:gap-3">
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

          <div className="flex flex-col md:w-full md:max-w-sm md:items-end gap-3 md:gap-2 xl:gap-3 text-sm md:text-xs xl:text-sm text-muted">
            <p>
              New here?{" "}
              <Link href="/register" className="font-bold text-strong hover:underline underline-offset-4">
                Create an account
              </Link>
            </p>
            <p>
              Forgot password?{" "}
              {/* forgot-password sends the email. reset-password is only opened from the link inside it */}
              <Link href="/forgot-password" className="font-bold text-strong hover:underline underline-offset-4">
                Reset password
              </Link>
            </p>
          </div>
        </section>
      </main>
      </>
    );
  }

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "../../components/LoadingScreen";
import { primaryButtonStyles } from "../../components/styles";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function ConfirmEmail() {
  // the link in the email brings these with it, e.g. /confirm-email?userId=5&code=abc
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const code = searchParams.get("code");

  // true if it worked, false if the link is bad or expired
  const confirmEmail = async () => {
    const response = await fetch(
      `${API_URL}/api/identity/confirmEmail?userId=${encodeURIComponent(userId!)}&code=${encodeURIComponent(code!)}`, {
         method: "GET", 
         credentials: "include" 
        }
    );

    // identity says 401 when the user is gone or the code doesn't match
    if (response.status === 401) {
      return false;
    }

    if (!response.ok) {
      throw new Error("Couldn't confirm the email");
    }

    return true;
  };

  const { data: confirmed, isLoading, isError } = useQuery({
    queryKey: ["confirm-email", userId, code],
    queryFn: confirmEmail,
    // only call it when the link actually has both parts
    enabled: !!userId && !!code,
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  // pick what to say
  let heading = "This link doesn't work";
  let message = "It might be old or already used. Log in and we'll send you a new one.";

  if (confirmed) {
    heading = "Email confirmed";
    message = "Thanks! Your account is all set, you can log in now.";
  }
  else if (isError) {
    heading = "Something went wrong";
    message = "We can't reach the server right now. Try the link again in a minute.";
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* top bar, same as the other pages */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 md:px-8 xl:px-20 py-4 md:py-5">
        <p className="text-xl md:text-2xl font-bold tracking-tight">Lights Off</p>
      </header>

      <div className="mx-auto flex w-full max-w-xl xl:max-w-2xl flex-1 flex-col justify-center gap-4 px-4 md:px-0 pb-20">
        <section className="rounded-2xl border border-line bg-field p-6 md:p-8 xl:p-10 text-center">
          <h1 className="text-2xl md:text-3xl leading-tight font-semibold tracking-tight">{heading}</h1>
          <p className="mt-3 text-base md:text-sm xl:text-base text-muted">{message}</p>

          <div className="mt-6 xl:mt-8 flex justify-center">
            <Link href="/" className={primaryButtonStyles}>
              Go to login
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

// useSearchParams needs a Suspense around it, so Next knows what to show before it reads the url
export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ConfirmEmail />
    </Suspense>
  );
}

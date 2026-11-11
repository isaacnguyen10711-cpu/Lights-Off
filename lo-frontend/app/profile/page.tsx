"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Choice from "../../components/Choice";
import Habit from "../../components/Habit";
import LoadingScreen from "../../components/LoadingScreen";
import { labelStyles, primaryButtonStyles, secondaryButtonStyles } from "../../components/styles";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// same box and input styles as the log page
const sectionStyles = "rounded-2xl border border-line bg-field p-4 md:p-5 xl:p-6";

const inputStyles =
  "mt-2 h-12 md:h-11 xl:h-12 w-full rounded-xl border border-line bg-night px-4 md:px-3 xl:px-4 text-base md:text-sm xl:text-base text-strong scheme-dark focus:border-strong focus:outline-none";

// same order as the SleepGoal enum in the backend (0 to 2)
const goals = ["Improve quality", "Sleep longer", "Consistent schedule"];

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // whether the profile box is open for typing
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // the logged in user, same key as home so they share the cache
  const fetchUser = async () => {
    const response = await fetch(`${API_URL}/api/authentication/me`, {
      method: "GET",
      credentials: "include",
    });

    // not logged in, send them back to the login page
    if (response.status === 401) {
      router.replace("/");
      return null;
    }

    if (!response.ok) {
      throw new Error("Couldn't get the user");
    }

    return response.json();
  };

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: fetchUser,
  });

  // handle the form submission for user details
  const handleEditProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const displayName = formData.get("displayName");
    // getAll gives every ticked box, like ["0", "2"], then Number turns them into [0, 2]
    const sleepGoals = formData.getAll("sleepGoals").map(Number);

    try {
      const response = await fetch(`${API_URL}/api/authentication/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          // an empty name box becomes null so the profile shows "-"
          displayName: displayName || null,
          sleepGoals,
        }),
      });

      if (!response.ok) {
        alert("Failed to update profile.");
        return;
      }

      // get the new details so the page doesn't show the old ones
      queryClient.invalidateQueries({ queryKey: ["me"] });
      alert("Profile updated.");
      setIsEditingProfile(false);
    }
    catch (error) {
      console.error("Error updating profile:", error);
      alert("We can't reach the server right now. Try again in a minute.");
    }
  };

  const handleDeleteAccount = async () => {
    // there's no undo, so make them say yes first
    if (!confirm("Delete your account and all your sleep logs? This can't be undone.")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/authentication/me`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        alert("Couldn't delete your account. Try again in a minute.");
        return;
      }

      alert("Your account has been deleted.");
      // same as logging out, forget everything saved for this user
      queryClient.clear();
      router.replace("/");
    }
    catch (error) {
      console.error("Error deleting account:", error);
      alert("We can't reach the server right now. Try again in a minute.");
    }
  };

  // wait for the user before showing anything
  if (!user) {
    return <LoadingScreen />;
  }

  // the goals come back as numbers like [0, 2], so goals[number] turns each one into words
  const sleepGoalsString =
    user.sleepGoals.length > 0 ? user.sleepGoals.map((goal: number) => goals[goal]).join(", ") : "-";

  return (
    <main className="flex min-h-screen flex-col">
      {/* top bar, same as the other pages */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 md:px-8 xl:px-20 py-4 md:py-5">
        <p className="text-xl md:text-2xl font-bold tracking-tight">Lights Off</p>
        <Link href="/home" className="text-sm xl:text-base font-semibold text-muted transition-colors hover:text-strong">
          Back to home
        </Link>
      </header>

      <div className="mx-auto flex w-full max-w-xl xl:max-w-2xl flex-col gap-4 xl:gap-5 px-4 md:px-0 pt-4 xl:pt-8 pb-10">
        <h1 className="mb-2 md:mb-4 text-3xl md:text-4xl leading-tight font-semibold tracking-tight">Your profile</h1>

        {/* the details, or the form once they press edit */}
        <section className={sectionStyles}>
          {isEditingProfile ? (
            <form onSubmit={handleEditProfile} className="flex flex-col gap-5">
              {/* start with what they already have, or saving would wipe whatever they didn't change */}
              <label>
                <span className={labelStyles}>Name</span>
                <input
                  type="text"
                  name="displayName"
                  defaultValue={user.displayName ?? ""}
                  placeholder="What should we call you?"
                  className={inputStyles}
                />
              </label>

              <div>
                <p className={labelStyles}>Sleep goals (pick as many as you like)</p>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                  {goals.map((label, i) => (
                    <Choice key={label} type="checkbox" name="sleepGoals" value={String(i)} label={label} defaultChecked={user.sleepGoals.includes(i)} />
                  ))}
                </div>
              </div>

              {/* buttons sit on the right, same as the change password page */}
              <div className="flex justify-end gap-3">
                <button type="button" className={secondaryButtonStyles} onClick={() => setIsEditingProfile(false)}>
                  Cancel
                </button>
                <button type="submit" className={primaryButtonStyles}>
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-5">
              <dl className="flex flex-col gap-4">
                <Habit label="Name" value={user.displayName ?? "-"} />
                <Habit label="Email" value={user.email ?? "-"} />
                <Habit label="Sleep goals" value={sleepGoalsString} />
              </dl>

              <button type="button" className={secondaryButtonStyles} onClick={() => setIsEditingProfile(true)}>
                Edit
              </button>
            </div>
          )}
        </section>

        {/* account buttons. stacked on phones so the text fits on one line, side by side from tablets up (md:flex-1 shares the row evenly) */}
        <section className={`${sectionStyles} flex flex-col md:flex-row gap-3`}>
          {/* only for people who signed up with a password. it's a link since it just goes to another page */}
          {user.hasPassword && (
            <Link href="/change-password" className={`${secondaryButtonStyles} md:flex-1 text-center`}>
              Change password
            </Link>
          )}

          {/* everyone can delete their account, google and facebook users too */}
          <button type="button" className={`${secondaryButtonStyles} bg-red-900 md:flex-1`} onClick={handleDeleteAccount}>
            Delete account
          </button>
        </section>
      </div>
    </main>
  );
}

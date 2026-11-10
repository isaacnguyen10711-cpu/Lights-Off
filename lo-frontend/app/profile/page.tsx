"use client";

import Link from "next/link";
import { useState } from "react";
import Choice from "../../components/Choice";
import Habit from "../../components/Habit";
import { labelStyles, primaryButtonStyles, secondaryButtonStyles } from "../../components/styles";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// same box and input styles as the log page
const sectionStyles = "rounded-2xl border border-line bg-field p-4 md:p-5 xl:p-6";

const inputStyles =
  "mt-2 h-12 md:h-11 xl:h-12 w-full rounded-xl border border-line bg-night px-4 md:px-3 xl:px-4 text-base md:text-sm xl:text-base text-strong scheme-dark focus:border-strong focus:outline-none";

// same order as the SleepGoal enum in the backend (0 to 2)
const goals = ["Improve quality", "Sleep longer", "Consistent schedule"];

export default function ProfilePage() {
  // which boxes are open for typing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // read what they typed, using each input's name
    const formData = new FormData(event.currentTarget);
    const oldPassword = formData.get("oldPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    // check this here so we don't bother the backend
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match.");
      return;
    }

    try {
      // identity's own endpoint, it checks the old password and hashes the new one for us
      const response = await fetch(`${API_URL}/api/identity/manage/info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (!response.ok) {
        alert("Wrong current password, or the new one is too weak.");
        return;
      }

      alert("Password changed.");
      setIsChangingPassword(false);
    }
    catch (error) {
      console.error("Error changing password:", error);
      alert("We can't reach the server right now. Try again in a minute.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col">
      {/* top bar, same as the other pages */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 md:px-8 xl:px-20 py-4 md:py-5">
        <p className="text-xl md:text-2xl font-bold tracking-tight">Lights Off</p>
        <Link href="/home" className="text-sm xl:text-base font-semibold text-muted transition-colors hover:text-strong">
          Back to home
        </Link>
      </header>

      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 md:px-0 pt-4 pb-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Your profile</h1>

        {/* the details, or the form once they press edit. "-" for now until it's hooked up */}
        <section className={sectionStyles}>
          {isEditingProfile ? (
            <form className="flex flex-col gap-5">
              <label>
                <span className={labelStyles}>Name</span>
                <input type="text" name="displayName" placeholder="What should we call you?" className={inputStyles} />
              </label>

              <div>
                <p className={labelStyles}>Sleep goal</p>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                  {goals.map((label, i) => (
                    <Choice key={label} name="sleepGoal" value={String(i)} label={label} />
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
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
                <Habit label="Name" value="-" />
                <Habit label="Email" value="-" />
                <Habit label="Sleep goal" value="-" />
              </dl>

              <button type="button" className={secondaryButtonStyles} onClick={() => setIsEditingProfile(true)}>
                Edit
              </button>
            </div>
          )}
        </section>

        {/* only for people who signed up with a password */}
        <section className={sectionStyles}>
          {isChangingPassword ? (
            <form onSubmit={handleChangePassword} className="flex flex-col gap-5">
              <label>
                <span className={labelStyles}>Current password</span>
                <input type="password" name="oldPassword" autoComplete="current-password" className={inputStyles} />
              </label>

              <label>
                <span className={labelStyles}>New password</span>
                <input type="password" name="newPassword" autoComplete="new-password" className={inputStyles} />
              </label>

              <label>
                <span className={labelStyles}>Confirm new password</span>
                <input type="password" name="confirmPassword" autoComplete="new-password" className={inputStyles} />
              </label>

              <div className="flex gap-3">
                <button type="button" className={secondaryButtonStyles} onClick={() => setIsChangingPassword(false)}>
                  Cancel
                </button>
                <button type="submit" className={primaryButtonStyles}>
                  Save password
                </button>
              </div>
            </form>
          ) : (
            <button type="button" className={`${secondaryButtonStyles} w-full`} onClick={() => setIsChangingPassword(true)}>
              Change password
            </button>
          )}
        </section>
      </div>
    </main>
  );
}

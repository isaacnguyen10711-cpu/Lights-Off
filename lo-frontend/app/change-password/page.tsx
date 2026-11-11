"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { labelStyles, primaryButtonStyles, secondaryButtonStyles } from "../../components/styles";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


const inputStyles =
  "mt-2 h-12 md:h-11 xl:h-12 w-full rounded-xl border border-line bg-night px-4 md:px-3 xl:px-4 text-base md:text-sm xl:text-base text-strong scheme-dark focus:border-strong focus:outline-none";

export default function ChangePasswordPage() {
  const router = useRouter();

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

      // not logged in, send them back to the login page
      if (response.status === 401) {
        router.replace("/");
        return;
      }

      if (!response.ok) {
        alert("Wrong current password, or the new one is too weak.");
        return;
      }

      alert("Password changed.");
      router.push("/profile");
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
        <Link href="/profile" className="text-sm xl:text-base font-semibold text-muted transition-colors hover:text-strong">
          Back to profile
        </Link>
      </header>

      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 md:px-0 pt-4 pb-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Change password</h1>

        <section className="rounded-2xl border border-line bg-field p-4 md:p-5 xl:p-6">
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
              <Link href="/profile" className={secondaryButtonStyles}>
                Cancel
              </Link>
              <button type="submit" className={primaryButtonStyles}>
                Save password
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

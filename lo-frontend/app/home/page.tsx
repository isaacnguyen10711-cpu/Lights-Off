"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SleepLogProps } from "../../type";
import ScoreBox from "../../components/ScoreBox";
import Habit from "../../components/Habit";
import { boxStyles, labelStyles, primaryButtonStyles, secondaryButtonStyles } from "../../components/styles";

const API_URL = process.env.NEXT_PUBLIC_API_URL;



export default function HomePage() {
  const [latestLog, setLatestLog] = useState<SleepLogProps | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchLatestLogData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/sleeplogs/latest-log`, {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 401) {
          // User is not authenticated, redirect to the login page
          router.replace("/");
        }

        if (response.ok) {
          setLatestLog(await response.json());
        }
      }
      catch (error) {
        console.error("Error fetching latest sleep log:", error);
      }
    };
    fetchLatestLogData();

    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_URL}/api/authentication/me`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const user = await response.json();
          // google gives the full name so we only want their first name
          setFirstName(user.displayName ? user.displayName.split(" ")[0] : null);
        }
      }
      catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();

  }, [router]);

  useEffect(() => {
    if (latestLog) {
      console.log("Latest sleep log data:", latestLog);
    }
  }, [latestLog]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/authentication/logout`, {
        method: "POST",
        credentials: "include",
      });

      alert("You have been logged out.");
    }
    catch (error) {
      console.error("Error logging out:", error);
    }
    router.replace("/");
  }

  // convert the bedtime and wakeUpTime to readable strings


  const bedTimeString = latestLog?.bedtime ? new Date(latestLog.bedtime).toLocaleTimeString("en-AU", { hour: '2-digit', minute: '2-digit' }) : '-';
  const wakeUpTimeString = latestLog?.wakeUpTime ? new Date(latestLog.wakeUpTime).toLocaleTimeString("en-AU", { hour: '2-digit', minute: '2-digit' }) : '-';
  const hoursSleptString = latestLog?.hoursSlept ? `${Math.floor(latestLog.hoursSlept)}h ${Math.round((latestLog.hoursSlept % 1) * 60)}m` : '-';
  const dateString = latestLog?.date ? new Date(`${latestLog.date}T00:00:00`).toLocaleDateString("en-AU", { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }) : '-';

  // convert the screenTimeBeforeBed and afternoonNapDuration to readable strings because they are stored as enums
  const durationLabels = ["None", "Under 30 min", "30 to 60 min", "Over 60 min"];

  // enums return the index of the enum, so we can use that to get the label from the array above
  const screenTimeBeforeBedString =
    latestLog?.screenTimeBeforeBed != null ? durationLabels[latestLog.screenTimeBeforeBed] : "-";
  const afternoonNapDurationString =
    latestLog?.afternoonNapDuration != null ? durationLabels[latestLog.afternoonNapDuration] : "-";

  return (
    <main className="flex min-h-screen flex-col md:h-screen">
      {/* top bar */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 md:px-8 xl:px-20 py-4 md:py-5 xl:py-5">
        <p className="text-xl md:text-2xl xl:text-2xl font-bold tracking-tight">Lights Off</p>
        <nav className="flex items-center gap-4 md:gap-6 xl:gap-8 text-sm md:text-sm xl:text-base">
          <Link href="/dashboard" className="font-semibold text-muted transition-colors hover:text-strong">
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            type="button"
            className="font-semibold text-muted transition-colors hover:cursor-pointer hover:text-strong"
          >
            Log out
          </button>
        </nav>
      </header>

      {/* 1 column on phones, 2 columns from tablets up */}
      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 md:grid-cols-2 content-center md:items-center gap-10 md:gap-8 xl:gap-20 px-4 md:px-8 xl:px-20 pb-8 md:pb-6 xl:pb-8">
        {/* left side: greeting and what to do next */}
        <section>
          <h1 className="text-3xl md:text-4xl xl:text-5xl leading-tight font-semibold tracking-tight">
            {/* email sign ups don't have a name, so just say "Morning." */}
            {firstName ? `Morning, ${firstName}.` : "Morning."}
          </h1>
          <p className="mt-2 md:mt-3 xl:mt-3 max-w-sm text-base md:text-sm xl:text-base text-muted">
            Here&rsquo;s how last night went.
          </p>

          {/* stacked on phones, side by side from tablets up */}
          <div className="mt-8 md:mt-8 xl:mt-10 flex flex-col md:flex-row gap-3 md:gap-3 xl:gap-4">
            <button type="button" className={primaryButtonStyles}>
              Log a night
            </button>
            <Link href="/dashboard" className={secondaryButtonStyles}>
              Open dashboard
            </Link>
          </div>
        </section>

        {/* right side: last night split into boxes */}
        <section className="mx-auto w-full max-w-lg">
          <div className="grid grid-cols-2 gap-3 md:gap-3 xl:gap-4">
            {/* the big one: how long they slept */}
            <div className={`${boxStyles} col-span-2`}>
              {/* label on the left, when they woke up on the right */}
              <div className="flex items-baseline justify-between gap-3 md:gap-3 xl:gap-4">
                <p className={labelStyles}>Total slept</p>
                <p className="text-xs md:text-xs xl:text-sm text-muted tabular-nums">{dateString}</p>
              </div>
              <p className="mt-2 md:mt-2 xl:mt-3 text-5xl md:text-5xl xl:text-6xl font-semibold tracking-tight tabular-nums">
                {hoursSleptString}
              </p>
              <p className="mt-3 md:mt-3 xl:mt-4 text-base md:text-sm xl:text-base text-muted tabular-nums">
                <span className="text-strong">{bedTimeString}</span> bed &rarr; <span className="text-strong">{wakeUpTimeString}</span> up
              </p>
            </div>

            <ScoreBox label="Quality" score={latestLog?.quality ?? 0} />
            <ScoreBox label="Stress" score={latestLog?.stressLevel ?? 0} />

            <div className={`${boxStyles} col-span-2`}>
              <p className={labelStyles}>Habits</p>
              <dl className="mt-3 md:mt-3 xl:mt-4 grid grid-cols-2 gap-x-4 md:gap-x-4 xl:gap-x-6 gap-y-3 md:gap-y-3 xl:gap-y-4">
                <Habit label="Caffeine after 3pm" value={latestLog?.caffeineAfter3pm == null ? '-' : latestLog.caffeineAfter3pm ? 'Yes' : 'No'} />
                <Habit label="Exercise" value={latestLog?.exercised == null ? '-' : latestLog.exercised ? 'Yes' : 'No'} />
                <Habit label="Screen time before bed" value={screenTimeBeforeBedString} />
                <Habit label="Nap" value={afternoonNapDurationString} />
              </dl>
            </div>

            <div className={`${boxStyles} col-span-2`}>
              <p className={labelStyles}>From your coach</p>
              <p className="mt-2 md:mt-2 xl:mt-3 text-base md:text-sm xl:text-lg leading-relaxed">
                Great job! You slept 7.5 hours, about half an hour more than usual.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

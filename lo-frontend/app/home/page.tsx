"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SleepLogProps } from "../../type";
import ScoreBox from "../../components/home/ScoreBox";
import Habit from "../../components/Habit";
import { boxStyles, labelStyles, primaryButtonStyles, secondaryButtonStyles } from "../../components/styles";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // the logged in user, same as the login page so they can share the ["me"] cache
  const fetchUser = async () => {
    const response = await fetch(`${API_URL}/api/authentication/me`, {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Couldn't get the user");
    }

    return response.json();
  };

  // what the coach says about the latest night, only called when there's nothing saved yet
  const generateLatestNightFeedback = async (): Promise<string> => {
    const response = await fetch(`${API_URL}/api/sleepcoach/latest-night`, {
      method: "GET",
      credentials: "include",
    });

    // covers the rate limit too, the fallback line shows instead
    if (!response.ok) {
      throw new Error("The coach couldn't give feedback");
    }

    const data = await response.json();
    return data.review;
  };

  // the latest sleep log, or null if they haven't logged one yet
  const fetchLatestLogData = async (): Promise<SleepLogProps | null> => {
    const response = await fetch(`${API_URL}/api/sleeplogs/latest-log`, {
      method: "GET",
      credentials: "include",
    });

    // not logged in, send them back to the login page
    if (response.status === 401) {
      router.replace("/");
      return null;
    }

    // no logs yet, that's fine, there's just nothing to show
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Couldn't get the latest sleep log");
    }

    return response.json();
  };

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: fetchUser,
  });

  const { data: latestLog, isLoading } = useQuery({
    queryKey: ["latest-log"],
    queryFn: fetchLatestLogData,
  });

  const { data: coachFeedback } = useQuery({
    // one cache per night, so editing a log gives fresh feedback
    queryKey: ["coach-feedback", latestLog?.sleepLogId],
    queryFn: generateLatestNightFeedback,
    // only ask the coach when there's a log and it has no saved feedback yet
    enabled: !!latestLog && !latestLog.lastNightFeedback,
  });

  // google gives the full name like "Isaac Nguyen", we only want "Isaac"
  const firstName = user?.displayName ? user.displayName.split(" ")[0] : null;

  // saved feedback if there is one, otherwise what the coach just said
  const feedback = latestLog?.lastNightFeedback ?? coachFeedback;

  // what to say under the greeting
  let message = feedback ?? "Here's how last night went.";
  if (isLoading) {
    message = "Loading last night...";
  }
  else if (latestLog === null) {
    message = "Log your first night of sleep to get feedback.";
  }

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
    // forget everything saved for this user, or the login page would still think they are logged in
    queryClient.clear();
    router.replace("/");
  }

  // turn bedtime and wakeUpTime into times people can read


  const bedTimeString = latestLog?.bedtime ? new Date(latestLog.bedtime).toLocaleTimeString("en-AU", { hour: '2-digit', minute: '2-digit' }) : '-';
  const wakeUpTimeString = latestLog?.wakeUpTime ? new Date(latestLog.wakeUpTime).toLocaleTimeString("en-AU", { hour: '2-digit', minute: '2-digit' }) : '-';
  const hoursSleptString = latestLog?.hoursSlept ? `${Math.floor(latestLog.hoursSlept)}h ${Math.round((latestLog.hoursSlept % 1) * 60)}m` : '-';
  const dateString = latestLog?.date ? new Date(`${latestLog.date}T00:00:00`).toLocaleDateString("en-AU", { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }) : '-';

  // screen time and nap come back as enums (just numbers), so turn them into words
  const durationLabels = ["None", "Under 30 min", "30 to 60 min", "Over 60 min"];

  // the log's date is the day they woke up, so if it's today they've already logged last night
  const loggedToday = !!latestLog && latestLog.date === new Date().toLocaleDateString("en-CA");

  // the enum number is its spot in the array above, so durationLabels[number] gives the label
  const screenTimeBeforeBedString =
    latestLog?.screenTimeBeforeBed != null ? durationLabels[latestLog.screenTimeBeforeBed] : "-";
  const afternoonNapDurationString =
    latestLog?.afternoonNapDuration != null ? durationLabels[latestLog.afternoonNapDuration] : "-";

  return (
    <main className="flex min-h-screen flex-col md:h-screen">
      {/* top bar */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 md:px-8 xl:px-20 py-4 md:py-5">
        <p className="text-xl md:text-2xl font-bold tracking-tight">Lights Off</p>
        <nav className="flex items-center gap-4 md:gap-6 xl:gap-8 text-sm xl:text-base">
          <Link href="/dashboard" className="font-semibold text-muted transition-colors hover:text-strong">
            Dashboard
          </Link>
          <Link href="/profile" className="font-semibold text-muted transition-colors hover:text-strong">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            type="button"
            className="font-semibold text-muted transition-colors hover:text-strong"
          >
            Log out
          </button>
        </nav>
      </header>

      {/* 1 column on phones, 2 columns from tablets up */}
      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 md:grid-cols-2 content-center md:items-center gap-10 md:gap-8 xl:gap-12 px-4 md:px-8 xl:px-20 pb-8 md:pb-6 xl:pb-4">
        {/* left side: greeting and what to do next */}
        <section>
          <h1 className="text-3xl md:text-4xl xl:text-5xl leading-tight font-semibold tracking-tight">
            {/* email sign ups don't have a name, so just say "Morning." */}
            {firstName ? `Morning, ${firstName}.` : "Morning."}
          </h1>

          <p className="mt-3 md:mt-4 max-w-md text-base md:text-sm xl:text-lg leading-relaxed text-muted">{message}</p>

          {/* stacked on phones, side by side from tablets up */}
          <div className="mt-8 xl:mt-10 flex flex-col md:flex-row gap-3 xl:gap-4">
            {loggedToday ? (
              <Link href={`/update-log?id=${latestLog?.sleepLogId}`} className={primaryButtonStyles}>
                Update last night
              </Link>
            ) : (
              <Link href="/log" className={primaryButtonStyles}>
                Log a night
              </Link>
            )}
            <Link href="/dashboard" className={secondaryButtonStyles}>
              Open dashboard
            </Link>
          </div>
        </section>

        {/* right side: last night split into boxes */}
        <section className="mx-auto w-full max-w-lg xl:max-w-xl">
          <div className="grid grid-cols-2 gap-3 xl:gap-4">
            {/* the big one: how long they slept */}
            <div className={`${boxStyles} col-span-2`}>
              {/* label on the left, the date on the right */}
              <div className="flex items-baseline justify-between gap-3 xl:gap-4">
                <p className={labelStyles}>Total slept</p>
                <p className="text-xs xl:text-sm text-muted tabular-nums">{dateString}</p>
              </div>
              <p className="mt-2 xl:mt-3 text-5xl xl:text-6xl font-semibold tracking-tight tabular-nums">
                {hoursSleptString}
              </p>
              <p className="mt-3 xl:mt-4 text-base md:text-sm xl:text-lg text-muted tabular-nums">
                <span className="text-strong">{bedTimeString}</span> bed &rarr; <span className="text-strong">{wakeUpTimeString}</span> up
              </p>
            </div>

            <ScoreBox label="Quality" score={latestLog?.quality ?? null} />
            <ScoreBox label="Stress" score={latestLog?.stressLevel ?? null} />

            <div className={`${boxStyles} col-span-2`}>
              <p className={labelStyles}>Habits</p>
              <dl className="mt-3 xl:mt-4 grid grid-cols-2 gap-x-4 xl:gap-x-6 gap-y-3 xl:gap-y-5">
                <Habit label="Caffeine after 3pm" value={latestLog?.caffeineAfter3pm == null ? '-' : latestLog.caffeineAfter3pm ? 'Yes' : 'No'} />
                <Habit label="Exercise" value={latestLog?.exercised == null ? '-' : latestLog.exercised ? 'Yes' : 'No'} />
                <Habit label="Screen time before bed" value={screenTimeBeforeBedString} />
                <Habit label="Nap" value={afternoonNapDurationString} />
              </dl>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

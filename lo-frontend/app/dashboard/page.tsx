"use client"; 

import Link from "next/link";
import CalendarDay from "../../components/dashboard/CalendarDay";
import StatBox from "../../components/dashboard/StatBox";
import NightDetails from "../../components/dashboard/NightDetails";
import QualityLabel from "../../components/dashboard/QualityLabel";
import { labelStyles } from "../../components/styles";
import { SleepLogProps } from "../../type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const arrowStyles = "size-10 rounded-xl border border-line bg-field text-muted transition-colors hover:border-strong hover:text-strong";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; 

const sampleLog: SleepLogProps = {
  sleepLogId: 1,
  date: "2026-10-15",
  bedtime: "22:30",
  wakeUpTime: "06:30",
  hoursSlept: 8,
  quality: 7,
  caffeineAfter3pm: null,
  exercised: null,
  stressLevel: null,
  screenTimeBeforeBed: null,
  afternoonNapDuration: null,
  lastNightFeedback: null,
};


export default function DashboardPage() {
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // Months are zero-based, so add 1
    setYear(currentYear);
    setMonth(currentMonth);
  }, []);
  
  const router = useRouter();

  const fetchAllLogsInAMonth = async () => {
    const response = await fetch(`${API_URL}/api/sleeplogs?year=${year}&month=${month}`, {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 401) {
      router.replace("/");
      return null;
    }

    if (!response.ok) {
      throw new Error("Couldn't get the sleep logs");
    }

    return response.json();
  }

  const { data: allLogsInAMonth, isLoading, isError } = useQuery({
    queryKey: ["sleepLogs", year, month],
    queryFn: fetchAllLogsInAMonth,
    // Only run the query if year and month are set
    enabled: year !== null && month !== null, 
  });

  // days in this month, 0 until the month is set
  const daysInMonth = year && month ? new Date(year, month, 0).getDate() : 0;

  // 1 to 31 so we can map over them
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  //  this returns the index of the weekday of the 1st of the month, 0-6, so we can map over it and make empty boxes
  const blanks = year && month ? new Date(year, month - 1, 1).getDay() : 0;

  // empty boxes so the 1st lands on the right weekday
  const emptySpots = Array.from({ length: blanks }, (_, i) => i);

  // finds the log for a day, or undefined if they didn't log that night
  const getLogForDay = (day: number) =>
    allLogsInAMonth?.logs.find((log: SleepLogProps) => Number(log.date.slice(8)) === day);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading sleep logs.</p>;
  }

  const qualityAverage = allLogsInAMonth?.qualityAverage ?? 0;
  const numberOfLogs = allLogsInAMonth?.numberOfLogs ?? 0;
  const hoursSleptAverage = allLogsInAMonth?.hoursSleptAverage ?? 0;

  return (
    <main className="flex min-h-screen flex-col">
      {/* top bar, same as the other pages */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 md:px-8 xl:px-20 py-4 md:py-5">
        <p className="text-xl md:text-2xl font-bold tracking-tight">Lights Off</p>
        <Link href="/home" className="text-sm xl:text-base font-semibold text-muted transition-colors hover:text-strong">
          Back to home
        </Link>
      </header>

      {/* calendar on the left, review and the picked night on the right. stacked until xl */}
      <div className="mx-auto grid w-full max-w-6xl xl:max-w-7xl flex-1 grid-cols-1 xl:grid-cols-3 content-center gap-6 md:gap-8 xl:gap-10 px-4 md:px-8 xl:px-20 pt-6 xl:pt-0 pb-10 md:pb-8 xl:pb-6">
        <section className="xl:col-span-2">
          {/* month name with arrows either side */}
          <div className="flex items-center justify-between">
            <button type="button" aria-label="Previous month" className={arrowStyles}>&larr;</button>
            <h1 className="text-2xl md:text-3xl font-semibold">{`${monthNames[month ? month - 1 : 0]} ${year}`}</h1>
            <button type="button" aria-label="Next month" className={arrowStyles}>&rarr;</button>
          </div>

          <div className="mt-4 md:mt-5 xl:mt-4 grid grid-cols-3 gap-2 md:gap-3">
            <StatBox label="Nights" value={`${numberOfLogs} / ${daysInMonth}`} />
            <StatBox label="Avg sleep" value={`${hoursSleptAverage.toFixed(1)}h`} />
            <StatBox label="Avg quality" value={qualityAverage.toFixed(1)} />
          </div>

          <div className="mt-4 md:mt-5 xl:mt-4 grid grid-cols-7 gap-1 md:gap-2 text-center text-xs md:text-sm xl:text-xs text-muted">
            {weekdays.map((name) => (
              <p key={name}>{name}</p>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1 md:gap-2">
            {/* empty spots so the 1st lands on the right weekday */}
            {emptySpots.map((spot) => (
              <div key={`empty-${spot}`} />
            ))}
            {days.map((day) => (
              <CalendarDay
                key={day}
                day={day}
                hours={getLogForDay(day)?.hoursSlept ?? null}
                quality={getLogForDay(day)?.quality ?? null}
              />
            ))}
          </div>

          {/* the colour key under the calendar */}
          <QualityLabel />
        </section>

        <section className="xl:col-span-1 flex flex-col gap-4">
          <div className="rounded-2xl border border-line bg-field p-4 md:p-5">
            <p className={labelStyles}>October review</p>
            <p className="mt-2 text-base md:text-sm xl:text-base leading-relaxed text-muted">
              You averaged 7 hours this month, a bit up on September. Your worst nights all came after
              late caffeine, so cutting it off by 3pm looks like the easiest win for November.
            </p>
          </div>

          {/* stretches on xl so the bottom lines up with the calendar */}
          <div className="xl:flex-1">
            <NightDetails log={sampleLog} />
          </div>
        </section>
      </div>
    </main>
  );
}

import Link from "next/link";
import CalendarDay from "../../components/CalendarDay";
import StatBox from "../../components/StatBox";
import NightDetails from "../../components/NightDetails";
import { labelStyles } from "../../components/styles";
import { SleepLogProps } from "../../type";

// sample data so the page has something to show, swap these for the real fetch later
const year = 2026;
const month = 10;
// day of the month -> hours slept
const sampleHours: Record<number, number> = {
  1: 7.4, 2: 7.9, 3: 5.1, 4: 6.6, 5: 7.2, 6: 8.0, 8: 6.8, 9: 7.7, 10: 5.3, 11: 6.4, 12: 7.3, 14: 7.9,
  15: 7.1, 16: 8.2, 17: 4.8, 18: 6.2, 19: 7.4, 21: 7.9, 22: 7.0, 23: 7.3, 24: 5.0, 25: 7.8, 27: 6.9, 28: 7.5,
};
// day of the month -> sleep quality out of 10
const sampleQuality: Record<number, number> = {
  1: 7, 2: 8, 3: 3, 4: 6, 5: 7, 6: 9, 8: 6, 9: 8, 10: 2, 11: 5, 12: 7, 14: 8,
  15: 7, 16: 9, 17: 3, 18: 5, 19: 7, 21: 8, 22: 6, 23: 7, 24: 3, 25: 8, 27: 6, 28: 7,
};
const selectedDay = 25;
const sampleLog: SleepLogProps = {
  sleepLogId: 1, date: "2026-10-25", bedtime: "2026-10-24T23:20:00", wakeUpTime: "2026-10-25T07:08:00",
  hoursSlept: 7.8, quality: 8, caffeineAfter3pm: false, exercised: true, stressLevel: 3,
  screenTimeBeforeBed: 1, afternoonNapDuration: null, lastNightFeedback: null,
};

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// how many days in the month (day 0 of next month is the last day of this one)
const daysInMonth = new Date(year, month, 0).getDate();
// getDay() starts on Sunday, our calendar starts on Monday, so shift it by one
const blanks = (new Date(year, month - 1, 1).getDay() + 6) % 7;

// [1, 2, 3 ... 31] so we can map over the days
const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
// one empty spot per blank, e.g. [0, 1, 2] when the 1st is a thursday
const emptySpots = Array.from({ length: blanks }, (_, i) => i);

const arrowStyles = "size-10 md:size-10 xl:size-10 rounded-xl border border-line bg-field text-muted transition-colors hover:border-strong hover:text-strong";

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* top bar, same as the other pages */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 md:px-8 xl:px-20 py-4 md:py-5 xl:py-5">
        <p className="text-xl md:text-2xl xl:text-2xl font-bold tracking-tight">Lights Off</p>
        <Link href="/home" className="text-sm md:text-sm xl:text-base font-semibold text-muted transition-colors hover:text-strong">
          Back to home
        </Link>
      </header>

      {/* calendar on the left, review and the picked night on the right. stacked until xl */}
      <div className="mx-auto grid w-full max-w-6xl xl:max-w-7xl flex-1 grid-cols-1 md:grid-cols-1 xl:grid-cols-3 content-center gap-6 md:gap-8 xl:gap-10 px-4 md:px-8 xl:px-20 pt-6 xl:pt-0 pb-10 md:pb-8 xl:pb-6">
        <section className="xl:col-span-2">
          {/* month name with arrows either side */}
          <div className="flex items-center justify-between">
            <button type="button" aria-label="Previous month" className={arrowStyles}>&larr;</button>
            <h1 className="text-2xl md:text-3xl xl:text-3xl font-semibold">October 2026</h1>
            <button type="button" aria-label="Next month" className={arrowStyles}>&rarr;</button>
          </div>

          <div className="mt-4 md:mt-5 xl:mt-4 grid grid-cols-3 gap-2 md:gap-3 xl:gap-3">
            <StatBox label="Nights" value="24 / 31" />
            <StatBox label="Avg sleep" value="7.0h" />
            <StatBox label="Avg quality" value="6.6" />
          </div>

          <div className="mt-4 md:mt-5 xl:mt-4 grid grid-cols-7 gap-1 md:gap-2 xl:gap-2 text-center text-xs md:text-sm xl:text-xs text-muted">
            {weekdays.map((name) => (
              <p key={name}>{name}</p>
            ))}
          </div>

          <div className="mt-2 md:mt-2 xl:mt-2 grid grid-cols-7 gap-1 md:gap-2 xl:gap-2">
            {/* empty spots so the 1st lands on the right weekday */}
            {emptySpots.map((spot) => (
              <div key={`empty-${spot}`} />
            ))}
            {days.map((day) => (
              <CalendarDay key={day} day={day} hours={sampleHours[day] ?? null} quality={sampleQuality[day] ?? null} selected={day === selectedDay} />
            ))}
          </div>
        </section>

        <section className="xl:col-span-1 flex flex-col gap-4 md:gap-4 xl:gap-4">
          <div className="rounded-2xl border border-line bg-field p-4 md:p-5 xl:p-5">
            <p className={labelStyles}>October review</p>
            <p className="mt-2 md:mt-2 xl:mt-2 text-base md:text-sm xl:text-base leading-relaxed text-muted">
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

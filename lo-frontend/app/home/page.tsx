import Link from "next/link";

// just the look for now, the real data gets hooked up later

// every size below is set for 3 screens: phone (default), tablet (md) and big screens (xl)

const primaryButtonStyles =
  "h-12 md:h-11 xl:h-12 rounded-xl bg-strong px-6 md:px-4 xl:px-6 text-base md:text-sm xl:text-base font-bold text-navy transition-colors hover:cursor-pointer hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-strong";

const secondaryButtonStyles =
  "flex h-12 md:h-11 xl:h-12 items-center justify-center rounded-xl border border-line bg-field px-6 md:px-4 xl:px-6 text-base md:text-sm xl:text-base font-semibold transition duration-300 hover:-translate-y-1 hover:border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-strong";

const boxStyles = "rounded-2xl border border-line bg-field p-4 md:p-4 xl:p-5";

const labelStyles = "text-xs md:text-xs xl:text-sm font-semibold uppercase tracking-wider text-muted";

type ScoreBoxProps = {
  label: string;
  score: number;
};

type HabitProps = {
  label: string;
  value: string;
};

// a score out of 10, shown as the number plus 10 little bars
const ScoreBox = ({ label, score }: ScoreBoxProps) => {
  return (
    <div className={boxStyles}>
      <p className={labelStyles}>{label}</p>
      <p className="mt-2 md:mt-2 xl:mt-3 text-2xl md:text-2xl xl:text-3xl font-semibold tabular-nums">
        {score}
        <span className="text-sm md:text-sm xl:text-base text-muted"> / 10</span>
      </p>
      <div className="mt-3 md:mt-3 xl:mt-4 flex gap-1">
        {/* filled bars up to the score, faded ones after */}
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className={`h-2 md:h-2 xl:h-2 flex-1 rounded-full ${i < score ? "bg-strong" : "bg-line/30"}`}
          />
        ))}
      </div>
    </div>
  );
}

// one habit from last night, e.g. "Exercise: Yes"
const Habit = ({ label, value }: HabitProps) => {
  return (
    <div>
      <dt className="text-sm md:text-xs xl:text-sm text-muted">{label}</dt>
      <dd className="mt-1 text-base md:text-sm xl:text-base font-semibold">{value}</dd>
    </div>
  );
}

export default function HomePage() {
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
            Morning, Isaac.
          </h1>
          <p className="mt-2 md:mt-3 xl:mt-3 max-w-sm text-base md:text-sm xl:text-base text-muted">
            Here&rsquo;s how last night went. You woke up Wednesday, 29 October.
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
              <p className={labelStyles}>Total slept</p>
              <p className="mt-2 md:mt-2 xl:mt-3 text-5xl md:text-5xl xl:text-6xl font-semibold tracking-tight tabular-nums">
                7h 30m
              </p>
              <p className="mt-3 md:mt-3 xl:mt-4 text-base md:text-sm xl:text-base text-muted tabular-nums">
                <span className="text-strong">11:10 pm</span> bed &rarr; <span className="text-strong">6:40 am</span> up
              </p>
            </div>

            <ScoreBox label="Quality" score={8} />
            <ScoreBox label="Stress" score={4} />

            <div className={`${boxStyles} col-span-2`}>
              <p className={labelStyles}>Habits</p>
              <dl className="mt-3 md:mt-3 xl:mt-4 grid grid-cols-2 gap-x-4 md:gap-x-4 xl:gap-x-6 gap-y-3 md:gap-y-3 xl:gap-y-4">
                <Habit label="Caffeine after 3pm" value="No" />
                <Habit label="Exercise" value="Yes" />
                <Habit label="Screen time before bed" value="30 to 60 min" />
                <Habit label="Nap" value="None" />
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

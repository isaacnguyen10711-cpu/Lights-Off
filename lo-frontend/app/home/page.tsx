import Link from "next/link";

// just the look for now, the real data gets hooked up later

const secondaryButtonStyles =
  "flex h-12 items-center justify-center rounded-xl border border-line bg-field px-6 font-semibold transition duration-300 hover:-translate-y-1 hover:border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-strong";

const boxStyles = "rounded-2xl border border-line bg-field p-5";

const labelStyles = "text-xs font-semibold uppercase tracking-wider text-muted";

// a score out of 10, shown as the number plus 10 little bars
function ScoreBox({ label, score }: { label: string; score: number }) {
  return (
    <div className={boxStyles}>
      <p className={labelStyles}>{label}</p>
      <p className="mt-3 text-3xl font-semibold tabular-nums">
        {score}
        <span className="text-base text-muted"> / 10</span>
      </p>
      <div className="mt-4 flex gap-1">
        {/* filled bars up to the score, faded ones after */}
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className={`h-2 flex-1 rounded-full ${i < score ? "bg-strong" : "bg-line/30"}`} />
        ))}
      </div>
    </div>
  );
}

// one habit from last night, e.g. "Exercise: Yes"
function Habit({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col lg:h-screen lg:overflow-hidden">
      {/* top bar */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-12 lg:px-20">
        <p className="text-2xl font-bold tracking-tight">Lights Off</p>
        <nav className="flex items-center gap-6 text-sm">
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

      <div className="mx-auto grid w-full max-w-6xl flex-1 content-center gap-12 px-4 pb-8 sm:px-12 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-20">
        {/* left side: greeting and what to do next */}
        <section>
          <h1 className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">Morning, Isaac.</h1>
          <p className="mt-3 max-w-sm text-muted">
            Here&rsquo;s how last night went. You woke up Wednesday, 29 October.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="h-12 rounded-xl bg-strong px-6 font-bold text-navy transition-colors hover:cursor-pointer hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-strong"
            >
              Log a night
            </button>
            <Link href="/dashboard" className={secondaryButtonStyles}>
              Open dashboard
            </Link>
          </div>
        </section>

        {/* right side: last night split into boxes */}
        <section className="mx-auto w-full max-w-lg">
          <div className="grid grid-cols-2 gap-4">
            {/* the big one: how long they slept */}
            <div className={`${boxStyles} col-span-2`}>
              <p className={labelStyles}>Total slept</p>
              <p className="mt-3 text-6xl font-semibold tracking-tight tabular-nums">7h 30m</p>
              <p className="mt-4 text-muted tabular-nums">
                <span className="text-strong">11:10 pm</span> bed &rarr; <span className="text-strong">6:40 am</span> up
              </p>
            </div>

            <ScoreBox label="Quality" score={8} />
            <ScoreBox label="Stress" score={4} />

            <div className={`${boxStyles} col-span-2`}>
              <p className={labelStyles}>Habits</p>
              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
                <Habit label="Caffeine after 3pm" value="No" />
                <Habit label="Exercise" value="Yes" />
                <Habit label="Screen time before bed" value="30 to 60 min" />
                <Habit label="Nap" value="None" />
              </dl>
            </div>

            <div className={`${boxStyles} col-span-2`}>
              <p className={labelStyles}>From your coach</p>
              <p className="mt-3 text-lg leading-relaxed">
                Great job! You slept 7.5 hours, about half an hour more than usual.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

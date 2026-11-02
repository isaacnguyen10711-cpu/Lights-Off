import Link from "next/link";
import Choice from "../../components/Choice";
import { labelStyles, primaryButtonStyles, secondaryButtonStyles } from "../../components/styles";

// the boxes, like boxStyles but without the hover lift (it's annoying on a form)
const sectionStyles = "rounded-2xl border border-line bg-field p-4 md:p-5 xl:p-6";

const inputStyles =
  "mt-2 h-12 md:h-11 xl:h-12 w-full rounded-xl border border-line bg-night px-4 md:px-3 xl:px-4 text-base md:text-sm xl:text-base text-strong tabular-nums scheme-dark focus:border-strong focus:outline-none";

// the little hint under a 1 to 10 row, e.g. "Awful ... Great"
const hintStyles = "mt-2 flex justify-between text-xs md:text-xs xl:text-xs text-muted";

const oneToTen = Array.from({ length: 10 }, (_, i) => String(i + 1));

// same order as the enums in the backend (0 to 3)
const durations = ["None", "< 30 min", "30–60 min", "60+ min"];

export default function LogPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 md:px-8 xl:px-20 py-4 md:py-5 xl:py-5">
        <p className="text-xl md:text-2xl xl:text-2xl font-bold tracking-tight">Lights Off</p>
        <Link href="/home" className="text-sm md:text-sm xl:text-base font-semibold text-muted transition-colors hover:text-strong">
          Back to home
        </Link>
      </header>

      <form className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 md:px-0 xl:px-0 pt-4 md:pt-4 xl:pt-2 pb-10 md:pb-8 xl:pb-8">
        <h1 className="text-3xl md:text-4xl xl:text-4xl leading-tight font-semibold tracking-tight">
          How did last night go?
        </h1>

        {/* the night: the only part you have to fill in */}
        <section className={`${sectionStyles} mt-6 md:mt-6 xl:mt-8`}>
          <div className="flex flex-col gap-5 md:gap-5 xl:gap-6">
            <label className="block">
              <span className={labelStyles}>Date</span>
              <input type="date" name="date" required className={inputStyles} />
            </label>

            <div className="grid grid-cols-2 gap-3 md:gap-3 xl:gap-4">
              <label className="block">
                <span className={labelStyles}>Went to bed</span>
                <input type="time" name="bedtime" required className={inputStyles} />
              </label>
              <label className="block">
                <span className={labelStyles}>Woke up</span>
                <input type="time" name="wakeUpTime" required className={inputStyles} />
              </label>
            </div>

            <div>
              <p className={labelStyles}>Sleep quality</p>
              <div className="mt-2 grid grid-cols-10 gap-1 md:gap-1 xl:gap-2">
                {oneToTen.map((n) => (
                  <Choice key={n} name="quality" value={n} label={n} />
                ))}
              </div>
              <p className={hintStyles}>
                <span>Awful</span>
                <span>Great</span>
              </p>
            </div>
          </div>
        </section>

        {/* stacked on phones, side by side on md screens or above */}
        <div className="mt-6 md:mt-6 xl:mt-8 flex flex-col-reverse md:flex-row md:justify-end gap-3 md:gap-3 xl:gap-4">
          <Link href="/home" className={secondaryButtonStyles}>
            Cancel
          </Link>
          <button type="submit" className={primaryButtonStyles}>
            Save last night
          </button>
        </div>
      </form>
    </main>
  );
}

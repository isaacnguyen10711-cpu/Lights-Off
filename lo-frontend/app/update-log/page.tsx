"use client"; 

import Link from "next/link";
import Choice from "../../components/Choice";
import { labelStyles, primaryButtonStyles, secondaryButtonStyles } from "../../components/styles";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { SleepLogProps } from "../../type";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// same as boxStyles, just without the hover lift
const sectionStyles = "rounded-2xl border border-line bg-field p-4 md:p-5 xl:p-6";

const inputStyles =
  "mt-2 h-12 md:h-11 xl:h-12 w-full rounded-xl border border-line bg-night px-4 md:px-3 xl:px-4 text-base md:text-sm xl:text-base text-strong tabular-nums scheme-dark focus:border-strong focus:outline-none";

// small text under the 1 to 10 rows, like "Awful ... Great"
const hintStyles = "mt-2 flex justify-between text-xs md:text-xs xl:text-xs text-muted";

const oneToTen = Array.from({ length: 10 }, (_, i) => String(i + 1));

// these match the backend enums, 0 to 3
const durations = ["None", "< 30 min", "30–60 min", "60+ min"];

export default function UpdateLogPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [logData, setLogData] = useState<SleepLogProps | null>(null);

  useEffect(() => {
    if (!id) {
      alert("No log ID provided.");
      return;
    }
    const fetchLogData = async () => {
      try {
        const response = await fetch(`${API_URL}/sleeplogs/${id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch log data");
        }
        const data = await response.json();
        setLogData(data);
      }
      catch (error) {
        console.error(error);
        alert("Failed to fetch log data.");
      }
    };

    fetchLogData();
  }, [id]);


return (
  <main className="flex min-h-screen flex-col">
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 md:px-8 xl:px-20 py-4 md:py-5 xl:py-5">
      <p className="text-xl md:text-2xl xl:text-2xl font-bold tracking-tight">Lights Off</p>
      <Link href="/home" className="text-sm md:text-sm xl:text-base font-semibold text-muted transition-colors hover:text-strong">
        Back to home
      </Link>
    </header>

    {/* not hooked up yet, so nothing happens on submit */}
    <form className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 md:px-0 xl:px-0 pt-4 md:pt-4 xl:pt-2 pb-10 md:pb-8 xl:pb-8">
      <h1 className="text-3xl md:text-4xl xl:text-4xl leading-tight font-semibold tracking-tight">
        Update last night
      </h1>

      {/* the night, the only bit they have to fill in */}
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

      {/* your day stays closed until they click it, <details> opens and closes by itself */}
      <details className={`${sectionStyles} mt-3 md:mt-3 xl:mt-4`}>
        <summary className="hover:cursor-pointer">
          <span className="text-base md:text-base xl:text-lg font-semibold">Add more about your day</span>
          <span className="text-sm md:text-xs xl:text-sm text-muted"> (optional)</span>
        </summary>

        <div className="mt-6 md:mt-6 xl:mt-6 flex flex-col gap-5 md:gap-5 xl:gap-6">
          {/* yes/no ones next to each other */}
          <div className="grid grid-cols-2 gap-3 md:gap-3 xl:gap-4">
            <div>
              <p className={labelStyles}>Caffeine after 3pm</p>
              <div className="mt-2 grid grid-cols-2 gap-1 md:gap-1 xl:gap-2">
                <Choice name="caffeineAfter3pm" value="true" label="Yes" />
                <Choice name="caffeineAfter3pm" value="false" label="No" />
              </div>
            </div>
            <div>
              <p className={labelStyles}>Exercised</p>
              <div className="mt-2 grid grid-cols-2 gap-1 md:gap-1 xl:gap-2">
                <Choice name="exercised" value="true" label="Yes" />
                <Choice name="exercised" value="false" label="No" />
              </div>
            </div>
          </div>

          <div>
            <p className={labelStyles}>Stress level</p>
            <div className="mt-2 grid grid-cols-10 gap-1 md:gap-1 xl:gap-2">
              {oneToTen.map((n) => (
                <Choice key={n} name="stressLevel" value={n} label={n} />
              ))}
            </div>
            <p className={hintStyles}>
              <span>Calm</span>
              <span>Very stressed</span>
            </p>
          </div>

          <div>
            <p className={labelStyles}>Screen time before bed</p>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-1 md:gap-1 xl:gap-2">
              {durations.map((label, i) => (
                <Choice key={label} name="screenTimeBeforeBed" value={String(i)} label={label} />
              ))}
            </div>
          </div>

          <div>
            <p className={labelStyles}>Afternoon nap</p>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-1 md:gap-1 xl:gap-2">
              {durations.map((label, i) => (
                <Choice key={label} name="afternoonNapDuration" value={String(i)} label={label} />
              ))}
            </div>
          </div>
        </div>
      </details>

      {/* stacked on phones, next to each other from md up */}
      <div className="mt-6 md:mt-6 xl:mt-8 flex flex-col-reverse md:flex-row md:justify-end gap-3 md:gap-3 xl:gap-4">
        <Link href="/home" className={secondaryButtonStyles}>
          Cancel
        </Link>
        <button type="submit" className={primaryButtonStyles}>
          Update
        </button>
      </div>
    </form>
  </main>
);
}

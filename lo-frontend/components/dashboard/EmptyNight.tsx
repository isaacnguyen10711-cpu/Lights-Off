import Link from "next/link";
import { EmptyNightProps } from "../../type";
import { labelStyles, primaryButtonStyles } from "../styles";

// shows when they tap a day in the calendar that has no log yet
const EmptyNight = ({ date, canLog }: EmptyNightProps) => {
  const day = new Date(`${date}T00:00:00`).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "short" });

  return (
    <div className="h-full rounded-2xl border border-line bg-field p-4 md:p-5 transition-colors duration-300 hover:border-muted">
      <p className={labelStyles}>{day}</p>

      {canLog ? (
        <>
          <p className="mt-2 text-sm xl:text-base text-muted">Nothing logged for this night yet.</p>
          {/* the log page reads ?date= and fills in this day for them */}
          <Link href={`/log?date=${date}`} className={`${primaryButtonStyles} hover:-translate-y-1 mt-4`}>
            Log this night
          </Link>
        </>
      ) : (
        <p className="mt-2 text-sm xl:text-base text-muted">This night hasn&rsquo;t happened yet.</p>
      )}
    </div>
  );
}

export default EmptyNight;

import { NightDetailsProps } from "../type";
import Habit from "./Habit";
import { labelStyles } from "./styles";

// same labels as the home page, the enum number is the spot in this list
const durationLabels = ["None", "Under 30 min", "30 to 60 min", "Over 60 min"];

// everything about the night they clicked on in the calendar
const NightDetails = ({ log }: NightDetailsProps) => {
  const date = new Date(`${log.date}T00:00:00`).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "short" });
  const bed = new Date(log.bedtime).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" });
  const up = new Date(log.wakeUpTime).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="h-full rounded-2xl border border-line bg-field p-4 md:p-5 xl:p-5">
      <p className={labelStyles}>{date}</p>
      {/* hours and quality side by side with some space between */}
      <div className="mt-2 md:mt-2 xl:mt-2 flex items-baseline gap-4 md:gap-4 xl:gap-5 tabular-nums">
        <p className="text-3xl md:text-3xl xl:text-3xl font-semibold">{log.hoursSlept}h</p>
        <p className="text-sm md:text-sm xl:text-base text-muted">Quality {log.quality}/10</p>
      </div>
      <p className="mt-3 md:mt-3 xl:mt-3 text-sm md:text-sm xl:text-sm text-muted tabular-nums">
        <span className="text-strong">{bed}</span> bed &rarr; <span className="text-strong">{up}</span> up
      </p>

      <dl className="mt-4 md:mt-4 xl:mt-4 grid grid-cols-2 gap-x-4 md:gap-x-4 xl:gap-x-4 gap-y-3 md:gap-y-3 xl:gap-y-3">
        <Habit label="Caffeine after 3pm" value={log.caffeineAfter3pm == null ? "-" : log.caffeineAfter3pm ? "Yes" : "No"} />
        <Habit label="Exercise" value={log.exercised == null ? "-" : log.exercised ? "Yes" : "No"} />
        <Habit label="Stress" value={log.stressLevel == null ? "-" : `${log.stressLevel}/10`} />
        <Habit label="Screen time" value={log.screenTimeBeforeBed == null ? "-" : durationLabels[log.screenTimeBeforeBed]} />
        <Habit label="Nap" value={log.afternoonNapDuration == null ? "-" : durationLabels[log.afternoonNapDuration]} />
      </dl>
    </div>
  );
}

export default NightDetails;

import { CalendarDayProps } from "../type";

// one day in the calendar, logged days are filled in blue
const CalendarDay = ({ day, hours, selected }: CalendarDayProps) => {
  return (
    <div
      className={`h-12 md:h-16 xl:h-16 rounded-lg border p-1 md:p-2 xl:p-2 text-xs md:text-sm xl:text-sm tabular-nums ${hours === null ? "border-line/30 text-muted" : "border-line bg-line/40 transition-colors hover:border-strong"} ${selected ? "border-strong" : ""}`}
    >
      <p>{day}</p>
      {hours !== null && <p className="font-semibold">{hours.toFixed(1)}h</p>}
    </div>
  );
}

export default CalendarDay;

import { CalendarDayProps } from "../type";

// one day in the calendar, coloured by how well they slept
const CalendarDay = ({ day, hours, quality, selected }: CalendarDayProps) => {
  // green for 8-10, yellow for 4-7, red for 1-3. background, border and text all match
  const colour =
    quality === null ? "border-line/30 text-muted"
    : quality > 7 ? "bg-good border-good-line text-good-text"
    : quality > 3 ? "bg-okay border-okay-line text-okay-text"
    : "bg-bad border-bad-line text-bad-text";

  return (
    <div
      className={`h-12 md:h-16 xl:h-16 rounded-lg border p-1 md:p-2 xl:p-2 text-xs md:text-sm xl:text-sm tabular-nums ${colour} ${hours !== null ? "transition-colors hover:border-strong" : ""} ${selected ? "ring-2 ring-line" : ""}`}
    >
      <p>{day}</p>
      {hours !== null && <p className="font-semibold">{hours.toFixed(1)}h</p>}
    </div>
  );
}

export default CalendarDay;

// same colours and ranges as CalendarDay
const levels = [
  { label: "Quality 8-10", colour: "bg-good border-good-line" },
  { label: "Quality 4-7", colour: "bg-okay border-okay-line" },
  { label: "Quality 1-3", colour: "bg-bad border-bad-line" },
];

// the colour key under the calendar
const QualityLabel = () => {
  return (
    <div className="mt-3 flex flex-wrap gap-5 md:gap-8 text-xs md:text-sm text-muted">
      {levels.map((level) => (
        <p key={level.label} className="flex items-center gap-2">
          <span className={`size-3 rounded border ${level.colour}`} />
          {level.label}
        </p>
      ))}
    </div>
  );
}

export default QualityLabel;

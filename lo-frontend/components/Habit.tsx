import { HabitProps } from "../type";

// one habit from last night, e.g. "Exercise: Yes"
const Habit = ({ label, value }: HabitProps) => {
  return (
    <div>
      <dt className="text-sm md:text-xs xl:text-sm text-muted">{label}</dt>
      <dd className="mt-1 text-base md:text-sm xl:text-base font-semibold">{value}</dd>
    </div>
  );
}

export default Habit;

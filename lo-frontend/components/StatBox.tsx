import { StatBoxProps } from "../type";
import { labelStyles } from "./styles";

// one number for the month, like "Average sleep 7.2h"
const StatBox = ({ label, value }: StatBoxProps) => {
  return (
    <div className="rounded-2xl border border-line bg-field p-3 md:p-4 xl:p-3">
      <p className={labelStyles}>{label}</p>
      <p className="mt-1 md:mt-2 xl:mt-1 text-xl md:text-2xl xl:text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export default StatBox;

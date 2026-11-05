import { StatBoxProps } from "../type";
import { labelStyles } from "./styles";

// one number for the month, like "Average sleep 7.2h"
const StatBox = ({ label, value }: StatBoxProps) => {
  return (
    <div className="rounded-2xl border border-line bg-field p-3 md:p-4 xl:p-4">
      <p className={labelStyles}>{label}</p>
      <p className="mt-1 md:mt-2 xl:mt-2 text-xl md:text-2xl xl:text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export default StatBox;

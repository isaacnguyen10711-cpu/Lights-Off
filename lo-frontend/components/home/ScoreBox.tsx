import { ScoreBoxProps } from "../../type";
import { boxStyles, labelStyles } from "../styles";

// a score out of 10, shown as the number plus 10 little bars
const ScoreBox = ({ label, score }: ScoreBoxProps) => {
  return (
    <div className={boxStyles}>
      <p className={labelStyles}>{label}</p>
      <p className="mt-2 xl:mt-3 text-2xl xl:text-3xl font-semibold tabular-nums">
        {score ?? "-"}
        <span className="text-sm xl:text-base text-muted"> / 10</span>
      </p>
      <div className="mt-3 xl:mt-4 flex gap-1">
        {/* filled bars up to the score, faded ones after */}
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className={`h-2 flex-1 rounded-full ${i < (score ?? 0) ? "bg-strong" : "bg-line/30"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default ScoreBox;

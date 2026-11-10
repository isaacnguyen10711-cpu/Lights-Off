import { ChoiceProps } from "../type";

// one option in a group, like "Yes" for caffeine. it's a real radio button (or checkbox)
// hidden inside a pill, and has-checked: lights the pill up when it's picked
const Choice = ({ name, value, label, defaultChecked, type = "radio" }: ChoiceProps) => {
  return (
    <label className="flex h-10 md:h-9 xl:h-10 items-center justify-center rounded-lg border border-line bg-night px-2 xl:px-3 text-sm md:text-xs xl:text-sm font-semibold text-muted whitespace-nowrap tabular-nums transition-colors hover:cursor-pointer hover:border-strong hover:text-strong has-checked:border-strong has-checked:bg-strong has-checked:text-navy has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-strong">
      <input type={type} name={name} value={value} className="sr-only" defaultChecked={defaultChecked} />
      {label}
    </label>
  );
}

export default Choice;

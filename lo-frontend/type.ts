
export type ScoreBoxProps = {
  label: string;
  score: number | null;
};

export type HabitProps = {

  label: string;
  value: string;
};


export type ChoiceProps = {
  name: string;
  value: string;
  label: string;
  defaultChecked?: boolean;
};

export type CalendarDayProps = {
  day: number;
  hours: number | null;
  selected?: boolean;
};

export type StatBoxProps = {
  label: string;
  value: string;
};

export type NightDetailsProps = {
  log: SleepLogProps;
};

export type SleepLogProps = {
  sleepLogId: number;
  date: string;
  bedtime: string;
  wakeUpTime: string;
  hoursSlept: number;
  quality: number;
  caffeineAfter3pm: boolean | null;
  exercised: boolean | null;
  stressLevel: number | null;
  screenTimeBeforeBed: number | null;
  afternoonNapDuration: number | null;
  lastNightFeedback: string | null;
};


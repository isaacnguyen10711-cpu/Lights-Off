import type { ReactNode } from "react";

export type QueryProviderProps = {
  children: ReactNode;
};

export type SignInDetails = {
  email: string;
  password: string;
};

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
  // "checkbox" lets them pick more than one, radio is the default
  type?: "radio" | "checkbox";
};

export type CalendarDayProps = {
  day: number;
  hours: number | null;
  quality: number | null;
  selected?: boolean;
  onClick?: () => void;
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


import type { TimerConfig, TimerMode } from "@/types/timer";

export const TIMER_CONFIG: TimerConfig = {
  work: 25 * 60,        // 1500s
  shortBreak: 5 * 60,   // 300s
  longBreak: 15 * 60,   // 900s
  longBreakInterval: 4,
};

// Labels que se muestran en la UI
export const MODE_LABELS: Record<TimerMode, string> = {
  work: "Foco",
  shortBreak: "Descanso corto",
  longBreak: "Descanso largo",
};

// Clases Tailwind por modo — las usan ModoSelector y TimerDisplay
export const MODE_COLORS: Record<TimerMode, string> = {
  work: "text-rose-500",
  shortBreak: "text-emerald-500",
  longBreak: "text-sky-500",
};

export const MODE_RING_COLORS: Record<TimerMode, string> = {
  work: "stroke-rose-500",
  shortBreak: "stroke-emerald-500",
  longBreak: "stroke-sky-500",
};

// Clave de localStorage — constante para evitar typos
export const STORAGE_KEY = "pomodoro_state";
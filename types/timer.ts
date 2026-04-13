export type TimerMode = "work" | "shortBreak" | "longBreak";

export interface TimerConfig {
  work: number;             // segundos
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number; // cada cuántos pomodoros activa el descanso largo
}

export interface PomodoroState {
  mode: TimerMode;
  secondsRemaining: number;
  isRunning: boolean;
  pomodorosCompleted: number; // persiste en localStorage (contador del día)
  pomodorosInSession: number; // para calcular cuándo toca descanso largo
  config: TimerConfig;
}

export type PomodoroAction =
  | { type: "TICK" }
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESET" }
  | { type: "CHANGE_MODE"; payload: TimerMode }
  | { type: "COMPLETE_POMODORO" }
  | { type: "LOAD_STATE"; payload: Partial<PomodoroState> };

export interface UsePomodoroTimerReturn {
  state: PomodoroState;
  formattedTime: string;
  progress: number;        // 0–1, para el anillo SVG del TimerDisplay
  isRunning: boolean;      // atajo para no hacer state.isRunning en cada componente
  start: () => void;
  pause: () => void;
  reset: () => void;
  changeMode: (mode: TimerMode) => void;
}
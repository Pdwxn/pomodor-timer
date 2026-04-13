"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { MODE_LABELS, STORAGE_KEY, TIMER_CONFIG } from "@/constants/timer";
import type { PomodoroAction, PomodoroState, TimerMode, UsePomodoroTimerReturn } from "@/types/timer";

// ── Estado inicial ────────────────────────────────────────────────────────────

const initialState: PomodoroState = {
  mode: "work",
  secondsRemaining: TIMER_CONFIG.work,
  isRunning: false,
  pomodorosCompleted: 0,
  pomodorosInSession: 0,
  config: TIMER_CONFIG,
};

// ── Reducer ───────────────────────────────────────────────────────────────────

function pomodoroReducer(state: PomodoroState, action: PomodoroAction): PomodoroState {
  switch (action.type) {
    case "TICK": {
      // Si llega a 0, el useEffect de "detectar fin" dispara COMPLETE_POMODORO.
      // El TICK nunca baja de 0.
      if (state.secondsRemaining <= 0) return state;
      return { ...state, secondsRemaining: state.secondsRemaining - 1 };
    }

    case "START":
      return { ...state, isRunning: true };

    case "PAUSE":
      return { ...state, isRunning: false };

    case "RESET":
      // Resetea solo el timer activo, no el contador del día
      return {
        ...state,
        isRunning: false,
        secondsRemaining: state.config[state.mode],
      };

    case "CHANGE_MODE":
      // Cambio manual: detiene el timer y carga el tiempo del nuevo modo
      return {
        ...state,
        mode: action.payload,
        isRunning: false,
        secondsRemaining: state.config[action.payload],
      };

    case "COMPLETE_POMODORO": {
      // Solo los bloques "work" incrementan el contador.
      // Después de longBreakInterval pomodoros → descanso largo.
      // Después de cualquier descanso → vuelve a work.
      const isWork = state.mode === "work";
      const newPomodorosInSession = isWork
        ? state.pomodorosInSession + 1
        : state.pomodorosInSession;
      const newPomodorosCompleted = isWork
        ? state.pomodorosCompleted + 1
        : state.pomodorosCompleted;

      let nextMode: TimerMode;
      if (isWork) {
        nextMode =
          newPomodorosInSession % state.config.longBreakInterval === 0
            ? "longBreak"
            : "shortBreak";
      } else {
        nextMode = "work";
      }

      return {
        ...state,
        isRunning: false, // el usuario decide si arranca el siguiente ciclo
        mode: nextMode,
        secondsRemaining: state.config[nextMode],
        pomodorosInSession: newPomodorosInSession,
        pomodorosCompleted: newPomodorosCompleted,
      };
    }

    case "LOAD_STATE":
      // Merge selectivo: nunca restauramos isRunning: true.
      // La app siempre arranca pausada, aunque se haya cerrado corriendo.
      return {
        ...state,
        ...action.payload,
        isRunning: false,
      };

    default:
      return state;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function playBeep(frequency = 880, duration = 400): void {
  try {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + duration / 1000
    );

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / 1000);
    oscillator.onended = () => ctx.close();
  } catch {
    // AudioContext bloqueado antes de un gesto del usuario → no rompe la app
    console.warn("AudioContext no disponible");
  }
}

// Formatea segundos → "MM:SS"
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ── Hook principal ────────────────────────────────────────────────────────────

export function usePomodoroTimer(): UsePomodoroTimerReturn {
  const [state, dispatch] = useReducer(pomodoroReducer, initialState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cargar desde localStorage al montar
  // Solo corre en el cliente (localStorage no existe en SSR)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const saved = JSON.parse(raw) as Partial<PomodoroState>;

      // Validación mínima para descartar datos corruptos
      if (
        typeof saved.pomodorosCompleted === "number" &&
        typeof saved.pomodorosInSession === "number"
      ) {
        dispatch({ type: "LOAD_STATE", payload: saved });
      }
    } catch {
      // JSON inválido → ignorar silenciosamente
    }
  }, []);

  // Guardar en localStorage cuando cambia algo relevante.
  // No guardamos isRunning — la app siempre arranca pausada.
  useEffect(() => {
    const toSave: Partial<PomodoroState> = {
      pomodorosCompleted: state.pomodorosCompleted,
      pomodorosInSession: state.pomodorosInSession,
      mode: state.mode,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // localStorage lleno o bloqueado (modo incógnito sin permisos)
    }
  }, [state.pomodorosCompleted, state.pomodorosInSession, state.mode]);

  // Intervalo del timer.
  // useEffect con [isRunning] como dependencia:
  //   true  → arranca el intervalo
  //   false → el cleanup del efecto anterior lo cancela
  // dispatch es estable, así que no hay closures stale.
  useEffect(() => {
    if (!state.isRunning) return;

    intervalRef.current = setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);

    // Cleanup: evita doble intervalo en React StrictMode (monta→desmonta→monta)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isRunning]);

  // Detectar fin del timer.
  // Separado del intervalo para mantener responsabilidades claras.
  useEffect(() => {
    if (state.secondsRemaining === 0 && state.isRunning) {
      playBeep();
      dispatch({ type: "COMPLETE_POMODORO" });
    }
  }, [state.secondsRemaining, state.isRunning]);

  // Título dinámico — el usuario puede ver el timer desde la pestaña del browser
  useEffect(() => {
    document.title = state.isRunning
      ? `${formatTime(state.secondsRemaining)} — ${MODE_LABELS[state.mode]}`
      : "Pomodoro Timer";
  }, [state.secondsRemaining, state.isRunning, state.mode]);

  // Acciones memorizadas — evitan re-renders innecesarios en componentes hijos
  const start = useCallback(() => dispatch({ type: "START" }), []);
  const pause = useCallback(() => dispatch({ type: "PAUSE" }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
  const changeMode = useCallback(
    (mode: TimerMode) => dispatch({ type: "CHANGE_MODE", payload: mode }),
    []
  );

  // Valores derivados — calculados aquí para que la lógica esté centralizada
  const totalTime = state.config[state.mode];
  // progress: 1 al inicio → 0 al final (el SVG lo traduce a dashoffset)
  const progress = state.secondsRemaining / totalTime;

  return {
    state,
    formattedTime: formatTime(state.secondsRemaining),
    progress,
    isRunning: state.isRunning,
    start,
    pause,
    reset,
    changeMode,
  };
}
"use client";

import { MODE_LABELS } from "@/constants/timer";
import type { TimerMode } from "@/types/timer";

interface ModeSelectorProps {
  modeActive: TimerMode;
  onChangeMode: (mode: TimerMode) => void;
}

// Los modos en el orden visual que queremos mostrarlos
const MODES: TimerMode[] = ["work", "shortBreak", "longBreak"];

// Colores del indicador activo por modo
const ACTIVE_STYLES: Record<TimerMode, string> = {
  work: "bg-rose-500 text-white",
  shortBreak: "bg-emerald-500 text-white",
  longBreak: "bg-sky-500 text-white",
};

export function ModeSelector({ modeActive, onChangeMode }: ModeSelectorProps) {
  return (
    <nav
      aria-label="Selector de modo"
      className="flex rounded-xl bg-neutral-100 p-1 dark:bg-neutral-900"
    >
      {MODES.map((mode) => {
        const isActive = mode === modeActive;
        return (
          <button
            key={mode}
            onClick={() => onChangeMode(mode)}
            aria-pressed={isActive}
            className={`
              flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
              ${isActive
                ? ACTIVE_STYLES[mode]
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
              }
            `}
          >
            {MODE_LABELS[mode]}
          </button>
        );
      })}
    </nav>
  );
}
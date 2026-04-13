"use client";

import { MODE_RING_COLORS } from "@/constants/timer";
import type { TimerMode } from "@/types/timer";

interface TimerDisplayProps {
  formattedTime: string;
  progress: number;   // 0–1
  mode: TimerMode;
  isRunning: boolean;
}

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 565.5

export function TimerDisplay({ formattedTime, progress, mode, isRunning }: TimerDisplayProps) {
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const ringColor = MODE_RING_COLORS[mode];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex items-center justify-center">
        <svg
          width="220"
          height="220"
          viewBox="0 0 220 220"
          className="-rotate-90" // El círculo SVG empieza a la derecha; rotamos para que empiece arriba
          aria-hidden="true"
        >
          {/* Pista de fondo — siempre visible */}
          <circle
            cx="110"
            cy="110"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-neutral-200 dark:text-neutral-800"
          />

          {/* Anillo de progreso */}
          <circle
            cx="110"
            cy="110"
            r={RADIUS}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className={`timer-progress ${ringColor}`}
            // timer-progress tiene transition: stroke-dashoffset 1s linear en globals.css
          />
        </svg>

        {/* Tiempo centrado sobre el SVG */}
        <div className="absolute flex flex-col items-center">
          <span
            className={`
              font-mono text-6xl font-bold tracking-tight tabular-nums
              text-neutral-900 dark:text-neutral-50
              ${isRunning ? "animate-pulse-slow" : ""}
            `}
            aria-live="polite"
            aria-label={`Tiempo restante: ${formattedTime}`}
          >
            {formattedTime}
          </span>
        </div>
      </div>
    </div>
  );
}
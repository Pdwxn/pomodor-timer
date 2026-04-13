// components/ControlButtons.tsx
"use client";

interface ControlButtonsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function ControlButtons({ isRunning, onStart, onPause, onReset }: ControlButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-4">

      {/* Botón reset — siempre visible */}
      <button
        onClick={onReset}
        aria-label="Reiniciar timer"
        className="rounded-full p-3 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
      >
        {/* Ícono de refresh */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>

      {/* Botón principal: iniciar / pausar */}
      <button
        onClick={isRunning ? onPause : onStart}
        aria-label={isRunning ? "Pausar timer" : "Iniciar timer"}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 dark:bg-neutral-50 dark:text-neutral-900"
      >
        {isRunning ? (
          // Ícono pausa
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          // Ícono play — ligeramente desplazado a la derecha para centrado óptico
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="6,3 20,12 6,21" />
          </svg>
        )}
      </button>

      {/* Espacio para simetría visual — mismo ancho que el botón reset */}
      <div className="w-[46px]" aria-hidden="true" />
    </div>
  );
}
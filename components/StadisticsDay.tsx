"use client";

interface StadisticsDayProps {
  pomodorosCompleted: number;    // total acumulado del día
  pomodorosInSession: number;    // para calcular posición dentro del ciclo actual
  longBreakInterval: number;     // cada cuántos pomodoros toca descanso largo
}

export function StadisticsDay({
  pomodorosCompleted,
  pomodorosInSession,
  longBreakInterval,
}: StadisticsDayProps) {
  // Cuántos pomodoros faltan para el próximo descanso largo
  const positionInCycle = pomodorosInSession % longBreakInterval;
  const remaining = positionInCycle === 0 && pomodorosInSession > 0
    ? 0
    : longBreakInterval - positionInCycle;

  return (
    <section
      aria-label="Estadísticas del día"
      className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Hoy
      </h2>

      <div className="flex items-center justify-between">
        {/* Contador principal */}
        <div>
          <p className="text-4xl font-bold tabular-nums text-neutral-900 dark:text-neutral-50">
            {pomodorosCompleted}
          </p>
          <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
            {pomodorosCompleted === 1 ? "pomodoro completado" : "pomodoros completados"}
          </p>
        </div>

        {/* Indicador de ciclo: círculos del 1 al longBreakInterval */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-1.5" aria-label={`Ciclo actual: ${positionInCycle} de ${longBreakInterval}`}>
            {Array.from({ length: longBreakInterval }).map((_, i) => (
              <div
                key={i}
                className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                  i < positionInCycle
                    ? "bg-rose-500"
                    : "bg-neutral-200 dark:bg-neutral-700"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            {remaining === 0
              ? "¡Toca descanso largo!"
              : `${remaining} para descanso largo`}
          </p>
        </div>
      </div>
    </section>
  );
}
"use client";

import { usePomodoroTimer } from "@/hooks/usePomodoTimer";
import { Header } from "@/components/Header";
import { ModeSelector } from "@/components/ModeSelector";
import { TimerDisplay } from "@/components/TimerDisplay";
import { ControlButtons } from "@/components/ControlButtons";
import { StadisticsDay } from "@/components/StadisticsDay";

export default function PomodoroPage() {
  const timer = usePomodoroTimer();

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <div className="mx-auto max-w-md px-4 py-8 flex flex-col gap-8">
        <Header />

        <ModeSelector
          modeActive={timer.state.mode}
          onChangeMode={timer.changeMode}
        />

        <TimerDisplay
          formattedTime={timer.formattedTime}
          progress={timer.progress}
          mode={timer.state.mode}
          isRunning={timer.isRunning}
        />

        <ControlButtons
          isRunning={timer.isRunning}
          onStart={timer.start}
          onPause={timer.pause}
          onReset={timer.reset}
        />

        <StadisticsDay
          pomodorosCompleted={timer.state.pomodorosCompleted}
          pomodorosInSession={timer.state.pomodorosInSession}
          longBreakInterval={timer.state.config.longBreakInterval}
        />
      </div>
    </main>
  );
}
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();

  // next-themes no conoce el tema hasta que monta en el cliente.
  // Sin este flag, cualquier atributo que dependa de `theme` (aria-label,
  // clases condicionales, el ícono) va a diferir entre servidor y cliente
  // → hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <svg
          width="28"
          height="28"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="16" cy="18" r="12" fill="#ef4444" />
          <path d="M16 6 C16 6 14 2 10 4 C12 4 13 6 16 6Z" fill="#22c55e" />
          <path d="M16 6 C16 6 18 2 22 4 C20 4 19 6 16 6Z" fill="#22c55e" />
          <path d="M16 6 L16 10" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Pomodoro
        </span>
      </div>

      {/* El botón completo solo se renderiza cuando ya sabemos el tema.
          Antes de montar mostramos un placeholder del mismo tamaño exacto
          para evitar layout shift — pero sin ningún atributo dinámico
          que pueda causar mismatch entre servidor y cliente. */}
      {mounted ? (
        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
        >
          {theme === "dark" ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      ) : (
        // Mismo tamaño que el botón real: p-2 (8px) + ícono 20px = 36px total
        <div className="h-9 w-9" aria-hidden="true" />
      )}
    </header>
  );
}
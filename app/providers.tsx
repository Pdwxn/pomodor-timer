"use client";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"        // Aplica dark mode con la clase "dark" en <html>
      defaultTheme="system"    // Respeta la preferencia del OS por defecto
      enableSystem             // Escucha prefers-color-scheme
      disableTransitionOnChange // Evita el flash de color al cambiar tema
    >
      {children}
    </ThemeProvider>
  );
}
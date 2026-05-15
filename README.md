# Pomodoro Timer

Una aplicación web minimalista para gestionar sesiones de enfoque con la técnica Pomodoro. Incluye modos de foco, descanso corto y descanso largo, contador de pomodoros completados, progreso visual y soporte para tema claro/oscuro.

## Demo

Puedes probar la app aquí:

[https://pomodor-timer-flame.vercel.app/](https://pomodor-timer-flame.vercel.app/)

## Características

* Temporizador Pomodoro con sesiones de **25 minutos** de foco.
* Descansos cortos de **5 minutos**.
* Descansos largos de **15 minutos** cada **4 pomodoros**.
* Selector de modo: foco, descanso corto y descanso largo.
* Controles para iniciar, pausar y reiniciar el temporizador.
* Anillo de progreso animado.
* Estadísticas del día con contador de pomodoros completados.
* Persistencia básica en `localStorage`.
* Título dinámico en la pestaña del navegador mientras el temporizador está activo.
* Sonido de aviso al completar una sesión.
* Tema claro/oscuro con detección de preferencia del sistema.
* Diseño responsive y limpio con Tailwind CSS.

## Tecnologías utilizadas

* [Next.js](https://nextjs.org/)
* [React](https://react.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [next-themes](https://github.com/pacocoursey/next-themes)


## Cómo funciona

La lógica principal del temporizador está centralizada en el hook `usePomodoTimer`. Este hook maneja:

* Estado del temporizador mediante `useReducer`.
* Inicio, pausa, reinicio y cambio de modo.
* Transición automática entre foco, descanso corto y descanso largo.
* Persistencia del progreso en `localStorage`.
* Actualización del título de la pestaña.
* Aviso sonoro al finalizar cada bloque.

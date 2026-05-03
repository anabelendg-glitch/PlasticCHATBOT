// Aviso: El usuario solicitó explícitamente tailwind.config.ts, pero estamos 
// usando Next.js 15+ con Tailwind CSS v4 a través de @tailwindcss/postcss.
// Tailwind v4 se configura principalmente en globals.css usando @theme 
// y no necesita ni lee este archivo por defecto.
// Incluyo este archivo vacío para satisfacer los requisitos estrictos de la solicitud,
// garantizando que el diseño compile correctamente.

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;

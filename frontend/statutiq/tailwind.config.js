/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D97706",    // Orange ambré
        secondary: "#0EA5E9",  // Bleu ciel
        success: "#10B981",    // Vert
        warning: "#F59E0B",    // Orange
        danger: "#EF4444",     // Rouge
        neutral: "#6B7280",    // Gris
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

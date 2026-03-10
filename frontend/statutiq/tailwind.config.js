/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {

      colors: {

        // 🎯 Couleurs principales
        primary: "#1E6BFF",      // Bleu action / CTA
        secondary: "#4FD1FF",       // Cyan pédagogique
        success: "#22C55E",      // Vert recommandé
        warning: "#F59E0B",      // Orange arbitrage
        danger: "#EF4444",

        // 🎨 Base UI
        background: "#0B0F14",   // Noir profond
        surface: "#111827",      // cartes / panels

        // 📝 Textes
        textPrimary: "#FFFFFF",
        textSecondary: "#9CA3AF",

        // Gris UI
        neutral: "#374151",
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },

      fontVariantNumeric: {
        tabular: "tabular-nums"
      }

    },
  },
  plugins: [],
};
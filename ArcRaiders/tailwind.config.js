/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "arc-orange": "#ff6b00",
        "arc-dark": "#0a0a0a",
        "arc-text": "#e0e0e0",
        "arc-muted": "#a3a3a3",
        "arc-border": "#262626",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
}

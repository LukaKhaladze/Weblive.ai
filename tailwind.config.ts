import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./widgets/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFFFFF",
        accentBlue: "#2F9BFD",
        accentMid: "#4D5CF3",
        accentPurple: "#7333F2",
        muted: "#64748B",
        border: "#E2E8F0",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

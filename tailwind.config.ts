import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0E0F13",
        shell: "#F7F5F2",
        slate: "#1E293B",
        accent: "#0EA5A4",
        accentDark: "#0B6B6A"
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 10px 30px rgba(14, 15, 19, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;

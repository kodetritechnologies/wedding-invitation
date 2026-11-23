import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "'Poppins'", "sans-serif"],
        body: ["var(--font-poppins)", "'Poppins'", "sans-serif"],
        heading: ["var(--font-poppins)", "'Poppins'", "sans-serif"],
        hindi: ["var(--font-poppins)", "'Poppins'", "sans-serif"],
        serif: ["var(--font-poppins)", "'Poppins'", "sans-serif"],
        cinzel: ["var(--font-poppins)", "'Poppins'", "sans-serif"],
        rozha: ["var(--font-poppins)", "'Poppins'", "sans-serif"],
        devanagari: ["var(--font-poppins)", "'Poppins'", "sans-serif"],
        mono: ["var(--font-poppins)", "'Poppins'", "sans-serif"],
      },
      fontSize: {
        "hero": ["clamp(2.125rem, 5vw, 3.5rem)", { lineHeight: "1.12", letterSpacing: "-0.03em", fontWeight: "700" }],
        "h1": ["clamp(1.75rem, 3.5vw, 2.75rem)", { lineHeight: "1.18", letterSpacing: "-0.025em", fontWeight: "700" }],
        "h2": ["clamp(1.375rem, 2.5vw, 2rem)", { lineHeight: "1.25", letterSpacing: "-0.02em", fontWeight: "600" }],
        "h3": ["clamp(1.125rem, 1.8vw, 1.375rem)", { lineHeight: "1.35", letterSpacing: "-0.01em", fontWeight: "600" }],
        "lead": ["clamp(1rem, 1.2vw, 1.125rem)", { lineHeight: "1.6", fontWeight: "400" }],
        "btn": ["0.9375rem", { lineHeight: "1.2", letterSpacing: "0.01em", fontWeight: "500" }],
        "badge": ["0.8125rem", { lineHeight: "1.4", fontWeight: "500" }],
      },
      maxWidth: {
        prose: "65ch",
      },
    },
  },
  plugins: [],
};

export default config;


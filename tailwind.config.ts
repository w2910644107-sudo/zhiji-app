import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f8f4ea",
        ink: "#171411",
        smoke: "#756f64",
        gold: "#c6a55a",
        "gold-soft": "#eadfbe",
        cinnabar: "#a7352a",
        "cinnabar-soft": "#f2ded9"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(36, 28, 14, 0.08)",
        card: "0 10px 30px rgba(36, 28, 14, 0.06)"
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ],
        song: [
          "var(--font-song)",
          "Songti SC",
          "STSong",
          "Noto Serif SC",
          "serif"
        ]
      }
    },
  },
  plugins: [],
};

export default config;

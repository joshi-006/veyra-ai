import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        veyra: {
          void: "#08090B",        // near-black background
          surface: "#0E1013",     // raised panel
          line: "#1C1F24",        // hairline borders
          ash: "#9A9C9F",         // muted secondary text
          paper: "#F4F3EF",       // soft white typography
          signal: "#E8D9C0",      // warm muted accent (emotion / human)
          current: "#5C7C8A",     // cool muted accent (signal / machine precision)
          ember: "#C16B4A",       // rare emphasis accent, used sparingly
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      transitionTimingFunction: {
        veyra: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

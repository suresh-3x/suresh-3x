import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Signature coral accent
        coral: {
          50: "#fff1ee",
          100: "#ffe0d9",
          200: "#ffc2b5",
          300: "#ff9b86",
          400: "#ff6f61", // signature
          500: "#f24d3d",
          600: "#d83524",
          700: "#b4271a",
          800: "#94241c",
          900: "#7a241e",
        },
        // Deep ocean / underwater
        ocean: {
          50: "#edfafa",
          100: "#d3f1f2",
          200: "#abe2e6",
          300: "#73ccd3",
          400: "#3aabb6",
          500: "#1f8c99",
          600: "#1a6f7e",
          700: "#1a5a67",
          800: "#1b4a55",
          900: "#0c2a31", // abyss
          950: "#06181d",
        },
        // Warm sand / ivory neutrals
        sand: {
          50: "#fdfbf7",
          100: "#f8f2e9",
          200: "#efe4d2",
          300: "#e2cdaf",
          400: "#d0ae83",
          500: "#c19562",
          600: "#a87b4f",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        ripple: {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
        ripple: "ripple 3s ease-out infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

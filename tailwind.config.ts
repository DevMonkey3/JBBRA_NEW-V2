import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    // All component files
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // All app pages
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // HeroUI components
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    // Ant Design components (if using tailwind with antd)
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    // Ensure all TypeScript files are included
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      animation: {
        marquee: "marquee 25s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};

export default config;

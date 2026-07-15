/** @type {import('tailwindcss').Config} */
const {heroui} = require("@heroui/react");


module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/react/node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "async-purple": "#7469e8"
      },
      fontFamily: {
        display: ["'Bebas Neue'", "sans-serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "marquee": "0 0 24px rgba(217, 38, 55, 0.4), 0 0 64px rgba(217, 38, 55, 0.15)",
        "screen-glow": "0 -12px 48px rgba(160, 190, 255, 0.25)",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: "#0b0b11",
            foreground: "#f4f1ea",
            content1: "#15151f",
            content2: "#1d1d2a",
            content3: "#262636",
            content4: "#303044",
            primary: {
              50: "#fdecee",
              100: "#fad3d8",
              200: "#f4a6b0",
              300: "#ee7787",
              400: "#e74f63",
              500: "#d92637",
              600: "#b51e2f",
              700: "#8f1826",
              800: "#75151f",
              900: "#63131c",
              DEFAULT: "#d92637",
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#eaba35",
              foreground: "#1a1405",
            },
            focus: "#d92637",
          },
        },
      },
    }),
  ],
}

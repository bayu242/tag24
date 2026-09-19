/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Mirrors docs/DESIGN.md. Keep in sync with src/theme.ts.
      colors: {
        primary: "#529fcb",
        "on-primary": "#ffffff",
        background: "#ffffff",
        surface: "#529fcb",
        line: "#d5d5d5",
        ink: "#222121",
        "ink-muted": "#000000",
        accent: "#211f54",
        success: "#2f7d5b",
        danger: "#b3261e",
        warning: "#8a5a00",
        "primary-soft": "#eaf4fa",
        "accent-soft": "#eae9f2",
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["DMSans_400Regular"],
        "body-medium": ["DMSans_500Medium"],
        "body-semibold": ["DMSans_600SemiBold"],
        "body-bold": ["DMSans_700Bold"],
      },
      // Brand radius scale (sm 2 / md 8 / lg 20 / xl 50).
      borderRadius: {
        sm: "2px",
        md: "8px",
        lg: "20px",
        xl: "50px",
      },
    },
  },
  plugins: [],
};

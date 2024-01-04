import type { Config } from 'tailwindcss'

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E3B448",
        secondary: "#3A6B35",
        normal: "#CBD18F"
      }
    },
  }
} satisfies Config

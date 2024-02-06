import type { Config } from 'tailwindcss'

export default {
  content: ["./views/*.html"],
  darkMode: "class",
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

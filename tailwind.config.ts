import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: "class",
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        primary: "#E3B448",
        secondary: "#3A6B35",
        normal: "#CBD18F"
      }
    },
  },
}
export default config

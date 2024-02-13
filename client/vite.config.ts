import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  resolve: {
    alias: {
      '@':  './src',
      '@components':  './src/components',
      '@context': './src/context'
    },
  },
  plugins: [react()],
})

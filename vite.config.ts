import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/client/components'),
      '@context': path.resolve(__dirname, './src/client/context'),
      '@hooks': path.resolve(__dirname, './src/client/hooks'),
      '@pages': path.resolve(__dirname, './src/client/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
})

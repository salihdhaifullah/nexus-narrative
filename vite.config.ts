import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
    plugins: [react()],
    build: {
        manifest: true,
        ssrManifest: true,
        ssr: true,
        ssrEmitAssets: true,
        rollupOptions: {
            input: '/src/client/entry-server.tsx',
        }
    },
    server: {
        middlewareMode: true,
    },

})

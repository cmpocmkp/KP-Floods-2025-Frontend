import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), ''); // loads .env, .env.production, and system env
  
  return defineConfig({
    plugins: [react()],
    envPrefix: 'VITE_', // only expose vars that start with VITE_
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      // Force-stringify important VITE vars so they're always inlined at build
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL ?? ''),
      'import.meta.env.VITE_OPENAI_API_KEY': JSON.stringify(env.VITE_OPENAI_API_KEY ?? ''),
    },
    optimizeDeps: {
      force: true,
      include: ['react-leaflet', 'recharts', 'leaflet'],
    },
    server: {
      hmr: {
        overlay: false
      },
      watch: {
        usePolling: true
      }
    },
    build: {
      sourcemap: false,
    },
    clearScreen: false,
  })
}
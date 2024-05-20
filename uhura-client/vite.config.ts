import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  const PORT = `${env.VITE_PORT ?? 3001}`

  return {
    plugins: [react()],
    build: {
      outDir: 'out/dist',
    },
    server: {
      port: Number(PORT),
    },
  }
})

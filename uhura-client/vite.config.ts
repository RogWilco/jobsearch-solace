import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    envPrefix: 'UHURA_',
    plugins: [react()],
    build: {
      outDir: 'out/build',
    },
    server: {
      port: Number(env.UHURA_CLIENT_PORT ?? 3001),
    },
  }
})

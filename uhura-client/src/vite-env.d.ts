/// <reference types="vite/client" />

interface ImportMetaEnv {
  UHURA_CLIENT_PORT: number
  UHURA_SERVICE_URL: string
}

interface ImportMeta {
  env: ImportMetaEnv
}

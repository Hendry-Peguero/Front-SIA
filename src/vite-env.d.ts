/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly MODE: string
    readonly DEV: boolean
    readonly PROD: boolean
    readonly SSR: boolean
    readonly VITE_API_URL?: string
    readonly VITE_FRONT_PORT?: string
    readonly VITE_DEPLOY_URL?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        host: '0.0.0.0', // Allow access from any device on the network
        port: 5176,
        proxy: {
            '/api': {
                target: 'http://localhost:5037',
                changeOrigin: true,
                secure: false,
            }
        }
    },
})

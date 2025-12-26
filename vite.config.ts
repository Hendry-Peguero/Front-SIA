import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    const env = loadEnv(mode, process.cwd(), '')
    
    // Parse port from env or use default
    const port = parseInt(env.VITE_FRONT_PORT || '5176', 10)
    
    return {
        plugins: [react()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        server: {
            host: '0.0.0.0', // Allow access from any device on the network
            port: port, // Dynamic port from .env
            proxy: {
                '/api': {
                    target: 'http://localhost:5037',
                    changeOrigin: true,
                    secure: false,
                }
            }
        },
        preview: {
            port: port,
            host: '0.0.0.0',
        },
        build: {
            outDir: 'dist',
            sourcemap: mode === 'development',
        }
    }
})

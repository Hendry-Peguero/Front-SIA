import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// ============================================
// FRONT-SIA - Configuration Logs
// ============================================
console.log('%c╔════════════════════════════════════════╗', 'color: #10b981; font-weight: bold');
console.log('%c║   FRONT-SIA - Sistema de Inventario   ║', 'color: #10b981; font-weight: bold');
console.log('%c╚════════════════════════════════════════╝', 'color: #10b981; font-weight: bold');
console.log('');
console.log('📊 Configuración del Sistema:');
console.log(`   🌍 Entorno: %c${import.meta.env.MODE}`, 'color: #3b82f6; font-weight: bold');
console.log(`   🚪 Puerto Frontend: %c${import.meta.env.VITE_FRONT_PORT || 'default (5176)'}`, 'color: #3b82f6; font-weight: bold');
console.log(`   🔌 API Backend URL: %c${import.meta.env.VITE_API_URL || 'not configured'}`, 'color: #3b82f6; font-weight: bold');
console.log(`   🌐 Deploy URL: %c${import.meta.env.VITE_DEPLOY_URL || 'not configured'}`, 'color: #3b82f6; font-weight: bold');
console.log('');
console.log('🔧 Configuración proxy de Vite:');
console.log('   ✓ Proxy configurado para "/api" → http://localhost:5037');
console.log('');
console.log('⏱️  Timestamp:', new Date().toLocaleString('es-ES'));
console.log('═══════════════════════════════════════════');
console.log('');

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

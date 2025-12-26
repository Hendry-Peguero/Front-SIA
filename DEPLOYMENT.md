# Deployment Guide - Front-SIA

> 🚀 **Guía completa para desplegar Front-SIA en producción**

---

## 📋 Tabla de Contenidos

1. [Pre-requisitos](#pre-requisitos)
2. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
3. [Build de Producción](#build-de-producción)
4. [Deployment en Vercel](#deployment-en-vercel)
5. [Deployment en Netlify](#deployment-en-netlify)
6. [Deployment en Servidor Propio](#deployment-en-servidor-propio)
7. [Verificación Post-Deploy](#verificación-post-deploy)
8. [Troubleshooting](#troubleshooting)

---

## Pre-requisitos

Antes de desplegar, asegúrate de tener:

- ✅ Node.js 18+ instalado  
- ✅ npm 9+ instalado  
- ✅ Backend API desplegado y accesible  
- ✅ Dominio configurado (opcional pero recomendado)  
- ✅ Certificado SSL para HTTPS  

---

## Configuración de Variables de Entorno

### 1. Archivo `.env.production`

Crea o edita `.env.production` con las variables de tu entorno de PRODUCCIÓN:

```bash
# Backend API URL - URL completa del backend en producción
VITE_API_URL=https://api.tudominio.com/api

# Frontend Port - No aplica en Vercel/Netlify, solo para preview local
VITE_FRONT_PORT=3000

# Deploy URL - Dominio de producción
VITE_DEPLOY_URL=https://tudominio.com

# Environment Mode
VITE_ENV_MODE=production
```

### 2. Validar Configuración

Ejecuta este comando para verificar las variables:

```bash
npm run build:prod
```

Revisa la consola del build, deberías ver los valores correctos.

---

## Build de Producción

### 1. Build Local

```bash
# Build optimizado para producción
npm run build:prod
```

Esto generará la carpeta `dist/` con los archivos optimizados.

### 2. Preview del Build

Para probar el build localmente antes de desplegar:

```bash
npm run preview:prod
```

Abre http://localhost:3000 en tu navegador.

### 3. Verificar Build

Asegúrate de que:
- ✅ No hay errores de TypeScript  
- ✅ El tamaño del bundle es razonable (\u003c 500KB gzip)  
- ✅ Las variables de entorno son correctas  
- ✅ La aplicación funciona en modo preview  

---

## Deployment en Vercel

### Método 1: Desde GitHub (Recomendado)

#### 1. Conectar Repositorio

1. Ve a [vercel.com](https://vercel.com)
2. Clic en "New Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Vite

#### 2. Configurar Variables de Entorno

En el dashboard de Vercel:

1. Ve a **Settings** → **Environment Variables**
2. Agrega las siguientes variables:

```
VITE_API_URL=https://api.tudominio.com/api
VITE_FRONT_PORT=3000
VITE_DEPLOY_URL=https://tudominio.vercel.app
VITE_ENV_MODE=production
```

#### 3. Deploy

1. Clic en "Deploy"
2. Espera a que el deploy termine
3. Vercel te dará una URL: `https://tu-proyecto.vercel.app`

#### 4. Dominio Personalizado (Opcional)

1. Ve a **Settings** → **Domains**
2. Agrega tu dominio personalizado
3. Configura los DNS records según las instrucciones

### Método 2: Desde CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy en producción
vercel --prod
```

---

## Deployment en Netlify

### Método 1: Desde GitHub

#### 1. Conectar Repositorio

1. Ve a [netlify.com](https://netlify.com)
2. Clic en "New site from Git"
3. Conecta tu repositorio de GitHub

#### 2. Configurar Build Settings

```
Build command: npm run build:prod
Publish directory: dist
```

#### 3. Configurar Variables de Entorno

En **Site settings** → **Environment variables**:

```
VITE_API_URL=https://api.tudominio.com/api
VITE_FRONT_PORT=3000
VITE_DEPLOY_URL=https://tudominio.netlify.app
VITE_ENV_MODE=production
```

#### 4. Deploy

1. Clic en "Deploy site"
2. Espera el deploy
3. Netlify te dará una URL: `https://tu-proyecto.netlify.app`

### Método 2: Desde CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build
npm run build:prod

# Deploy
netlify deploy --prod --dir=dist
```

### Configurar Redirects (SPA)

Crea `public/_redirects`:

```
/*    /index.html   200
```

Esto es CRÍTICO para que las rutas de React Router funcionen.

---

## Deployment en Servidor Propio

### Opción 1: Nginx + PM2

#### 1. Build

```bash
npm run build:prod
```

#### 2. Copiar archivos al servidor

```bash
scp -r dist/ user@tuservidor.com:/var/www/front-sia
```

#### 3. Configurar Nginx

Crea `/etc/nginx/sites-available/front-sia`:

```nginx
server {
    listen 80;
    server_name tudominio.com;

    # Redirect to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tudominio.com;

    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem;

    root /var/www/front-sia;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### 4. Activar sitio

```bash
sudo ln -s /etc/nginx/sites-available/front-sia /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Opción 2: Docker

Crea `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Crea `nginx.conf`:

```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

Build y run:

```bash
docker build -t front-sia .
docker run -p 80:80 front-sia
```

---

## Verificación Post-Deploy

### Checklist

- [ ] **URL principal funciona** (https://tudominio.com)
- [ ] **Login funciona** correctamente
- [ ] **Backend API está conectado** (revisar Network tab)
- [ ] **Logs en consola** muestran configuración correcta
- [ ] **Rutas de React Router** funcionan (refresh en /dashboard, /items, etc.)
- [ ] **HTTPS** está activo (candado verde en navegador)
- [ ] **Scanner de códigos** funciona en dispositivos móviles
- [ ] **Inputs numéricos** muestran teclado correcto en móviles
- [ ] **Toasts** aparecen correctamente en errores
- [ ] **Redirección a /login** funciona en error 401

### Pruebas de Producción

1. **Test de Login:**
   ```
   - Ir a /login
   - Ingresar credenciales
   - Verificar redirección a /dashboard
   ```

2. **Test de API:**
   ```
   - Abrir DevTools → Network
   - Navegar por la app
   - Verificar que las requests van a la API correcta
   ```

3. **Test de Scanner:**
   ```
   - Ir a Items → Nuevo Item
   - Activar scanner
   - Probar escanear código de barras
   ```

4. **Test de Responsividad:**
   ```
   - Abrir en móvil
   - Verificar layout
   - Probar inputs numéricos
   ```

---

## Troubleshooting

### Problema: "Cannot GET /dashboard" en refresh

**Solución:**  
Configurar redirects para SPA. Ver sección de Netlify o Nginx arriba.

### Problema: CORS Error

**Solución:**  
Configurar CORS en el backend:

```csharp
app.UseCors(policy => 
    policy
        .WithOrigins("https://tudominio.com")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
);
```

### Problema: Variables de entorno no se aplican

**Solución:**  
1. Verificar que las variables empiecen con `VITE_`
2. Hacer rebuild completo: `npm run build:prod`
3. Limpiar cache: `rm -rf dist node_modules && npm install`

### Problema: Build falla con errores de TypeScript

**Solución:**  
```bash
# Ver errores específicos
npx tsc --noEmit

# Arreglar errores y volver a buildear
npm run build:prod
```

### Problema: Scanner no funciona en HTTPS

**Solución:**  
El scanner requiere HTTPS. Asegurar que:
- Certificado SSL está instalado
- La URL es https://
- Los permisos de cámara están habilitados

---

## Scripts Útiles

```bash
# Development
npm run dev                 # Servidor de desarrollo

# Build
npm run build:dev           # Build para desarrollo
npm run build:prod          # Build para producción

# Preview
npm run preview:dev         # Preview build dev
npm run preview:prod        # Preview build prod

# Linting
npm run lint                # Verificar código
```

---

## Soporte

Para más información o problemas:

1. Revisar logs en la consola del navegador
2. Revisar logs del servidor
3. Verificar configuración de variables de entorno
4. Contactar al equipo de desarrollo

---

**Última actualización:** Diciembre 2024  
**Versión:** 1.0.0

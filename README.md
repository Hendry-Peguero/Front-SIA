# 📦 WebApiSIA Frontend

Frontend moderno y profesional para el sistema de inventario WebApiSIA, construido con React, TypeScript, y Tailwind CSS.

## 🌟 Características

- ✅ **CRUD Completo**: Crear, leer, actualizar y eliminar movimientos de inventario
- 🎨 **Diseño Moderno**: Interfaz limpia y profesional con Tailwind CSS
- 📱 **Responsive**: Optimizado para móviles, tablets y desktop
- ⚡ **Validación en Tiempo Real**: Formularios con validación usando Zod
- 🔔 **Notificaciones Toast**: Feedback inmediato al usuario
- 🎯 **TypeScript**: Código fuertemente tipado para mayor seguridad
- 🚀 **Rendimiento Optimizado**: Vite para desarrollo y builds rápidos
- 🎨 **Color-Coded**: Tipos de movimiento diferenciados por color (entrada=verde, salida=rojo, ajuste=amarillo)

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18.2+ | Biblioteca UI |
| **TypeScript** | 5.2+ | Lenguaje tipado |
| **Vite** | 5.0+ | Build tool & dev server |
| **Tailwind CSS** | 3.4+ | Framework CSS |
| **React Router** | 6.21+ | Enrutamiento |
| **Axios** | 1.6+ | Cliente HTTP |
| **React Hook Form** | 7.49+ | Manejo de formularios |
| **Zod** | 3.22+ | Validación de esquemas |
| **Lucide React** | 0.294+ | Íconos |
| **date-fns** | 3.0+ | Manejo de fechas |

## 📁 Estructura del Proyecto

```
frontend/
├── public/                 # Archivos estáticos
├── src/
│   ├── api/               # Configuración de API y servicios
│   │   ├── axiosConfig.ts
│   │   └── inventoryApi.ts
│   ├── components/        # Componentes React
│   │   ├── common/        # Componentes reutilizables
│   │   │   └── Layout.tsx
│   │   ├── inventory/     # Componentes específicos de inventario
│   │   │   ├── DeleteConfirmation.tsx
│   │   │   ├── MovementDetail.tsx
│   │   │   ├── MovementForm.tsx
│   │   │   └── MovementTable.tsx
│   │   └── ui/            # Componentes UI base
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── modal.tsx
│   ├── context/           # Context providers
│   │   ├── InventoryContext.tsx
│   │   └── ToastContext.tsx
│   ├── hooks/             # Custom hooks
│   │   ├── useInventoryMovements.ts
│   │   └── useToast.ts
│   ├── pages/             # Páginas de la aplicación
│   │   ├── Dashboard.tsx
│   │   ├── Movements.tsx
│   │   └── NotFound.tsx
│   ├── types/             # Definiciones TypeScript
│   │   ├── common.types.ts
│   │   └── inventory.types.ts
│   ├── utils/             # Utilidades
│   │   ├── cn.ts
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── App.tsx            # Componente raíz
│   ├── main.tsx           # Punto de entrada
│   └── index.css          # Estilos globales
├── index.html             # HTML principal
├── package.json           # Dependencias
├── tsconfig.json          # Configuración TypeScript
├── tailwind.config.js     # Configuración Tailwind
├── vite.config.ts         # Configuración Vite
└── .env                   # Variables de entorno

```

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js**: v18+ recomendado
- **npm**: v9+ recomendado

### Paso 1: Clonar e Instalar

```bash
# Navegar al directorio frontend
cd c:\Users\Aplicaciones\Desktop\WebApiSIA\frontend

# Instalar dependencias (ya realizado)
npm install
```

### Paso 2: Configurar Variables de Entorno

El archivo `.env` ya está configurado con:

```env
VITE_API_URL=http://localhost:5000/api
```

**⚠️ Importante**: Asegúrate de que esta URL coincida con la URL de tu backend WebApiSIA.

### Paso 3: Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5175**

## 📝 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo en puerto 5175 |
| `npm run build` | Compila para producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run preview` | Vista previa del build de producción |

## 🔌 Integración con Backend

### Endpoints Utilizados

La aplicación consume los siguientes endpoints del backend:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/InventoryMovements` | Obtener todos los movimientos |
| GET | `/InventoryMovements/{id}` | Obtener movimiento por ID |
| POST | `/InventoryMovements` | Crear nuevo movimiento |
| PUT | `/InventoryMovements/{id}` | Actualizar movimiento |
| DELETE | `/InventoryMovements/{id}` | Eliminar movimiento |

### DTOs

**InventoryMovementDto** (Respuesta):
```typescript
{
  movementId: number;
  itemId: number;
  movementType: string;      // "entrada" | "salida" | "ajuste"
  quantity: number;
  movementDate: string;       // ISO 8601
  reason?: string | null;
  createdBy: number;
}
```

**InventoryMovementSaveDto** (Envío):
```typescript
{
  itemId: number;
  movementType: string;
  quantity: number;
  movementDate: string;       // ISO 8601
  reason?: string | null;
  createdBy: number;
}
```

## 🎯 Funcionalidades Principales

### 1. Dashboard
- Estadísticas de movimientos por tipo
- Tarjetas con totales (entradas, salidas, ajustes)
- Lista de movimientos recientes

### 2. Gestión de Movimientos
- **Listar**: Tabla con todos los movimientos
- **Crear**: Modal con formulario validado
- **Editar**: Modificar movimientos existentes
- **Eliminar**: Confirmación antes de eliminar
- **Ver Detalle**: Visualización completa del movimiento

### 3. Validaciones

Todas las validaciones están implementadas con Zod:

- **Item ID**: Número entero positivo (requerido)
- **Tipo de Movimiento**: "entrada", "salida" o "ajuste" (requerido)
- **Cantidad**: Número positivo (requerido)
- **Fecha**: Formato datetime-local (requerido)
- **Razón**: Máximo 500 caracteres (opcional)
- **Creado Por**: Número entero positivo (requerido)

## 🎨 Características de UI/UX

### Color Coding
- 🟢 **Entrada**: Verde (#10b981)
- 🔴 **Salida**: Rojo (#ef4444)
- 🟡 **Ajuste**: Amarillo (#f59e0b)

### Estados
- **Loading**: Spinner animado
- **Empty State**: Mensaje cuando no hay datos
- **Error Handling**: Toasts con mensajes de error
- **Success Feedback**: Notificaciones de éxito

### Responsive Design
- **Mobile**: Sidebar colapsable, tabla scrollable
- **Tablet**: Diseño optimizado
- **Desktop**: Experiencia completa

## 🔧 Personalización

### Cambiar Puerto

Edita `vite.config.ts`:
```typescript
server: {
  port: 3000, // Cambiar aquí
},
```

### Cambiar URL del Backend

Edita `.env`:
```env
VITE_API_URL=http://tu-servidor:puerto/api
```

### Modificar Colores

Edita `tailwind.config.js` y `src/index.css` para personalizar la paleta de colores.

## 🐛 Solución de Problemas

### Error: "Cannot find module 'react'"
```bash
npm install
```

### Error: CORS
Asegúrate de que tu backend WebApiSIA tenga CORS configurado:
```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

### Puerto en uso
Cambia el puerto en `vite.config.ts` o mata el proceso:
```bash
npx kill-port 5175
```

## 📦 Build para Producción

```bash
# Compilar
npm run build

# Vista previa
npm run preview
```

Los archivos compilados estarán en la carpeta `dist/`.

### Deploy
Puedes desplegar la carpeta `dist` en:
- **Vercel**
- **Netlify**
- **GitHub Pages**
- **Azure Static Web Apps**
- Cualquier servidor estático

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es parte del sistema WebApiSIA.

## 👨‍💻 Autor

Desarrollado para el sistema de inventario WebApiSIA.

---

✨ **¡Disfruta gestionando tu inventario!** ✨

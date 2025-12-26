# Documentación Técnica - Front-SIA

> **Sistema de Inventario y Almacenes (SIA) - Frontend**  
> Versión: 1.0.0  
> Última actualización: Diciembre 2024

---

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Módulos Principales](#módulos-principales)
6. [API y Servicios](#api-y-servicios)
7. [Gestión de Estado](#gestión-de-estado)
8. [Tipos y Validaciones](#tipos-y-validaciones)
9. [Componentes UI](#componentes-ui)
10. [Configuración y Deployment](#configuración-y-deployment)
11. [Guía de Desarrollo](#guía-de-desarrollo)

---

## 1. Resumen Ejecutivo

### 1.1 Descripción del Proyecto

**Front-SIA** es una aplicación web moderna de gestión de inventarios construida con React 18, TypeScript y Tailwind CSS. Proporciona una interfaz completa para administrar movimientos de inventario, información de artículos, catálogos y estadísticas en tiempo real.

### 1.2 Características Principales

- ✅ CRUD completo de movimientos de inventario
- ✅ Gestión avanzada de artículos con escáner de códigos de barras
- ✅ Sistema de autenticación JWT
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Catálogos configurables (grupos, IVA, almacenes)
- ✅ Validación robusta con Zod
- ✅ Diseño responsivo mobile-first
- ✅ Notificaciones toast
- ✅ Cálculo automático de precios

### 1.3 Requisitos del Sistema

```
Node.js: v18.0.0 o superior
npm: v9.0.0 o superior
Navegadores soportados: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
```

---

## 2. Arquitectura del Sistema

### 2.1 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONT-SIA (React SPA)                  │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │ Context  │  │   Hooks  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │             │          │
│       └─────────────┴──────────────┴─────────────┘          │
│                         │                                   │
│                    ┌────▼─────┐                             │
│                    │ API Layer│                             │
│                    │ (Axios)  │                             │
│                    └────┬─────┘                             │
└─────────────────────────┼───────────────────────────────────┘
                          │ HTTP/REST
                    ┌─────▼─────┐
                    │  Backend  │
                    │  .NET API │
                    └───────────┘
```

### 2.2 Patrón de Diseño

**Arquitectura**: Component-Based Architecture con Context API
**Patrón de Estado**: Centralized State Management
**Patrón de Comunicación**: API Client Pattern con Axios
**Validación**: Schema-First con Zod

---

## 3. Stack Tecnológico

### 3.1 Core Framework

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18.2.0 | Librería UI con hooks y suspense |
| **TypeScript** | 5.2.2 | Type-safe development |
| **Vite** | 5.0.8 | Build tool y dev server ultrarrápido |
| **React Router** | 6.21.0 | Client-side routing |

### 3.2 UI/UX

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Tailwind CSS** | 3.4.0 | Utility-first CSS framework |
| **tailwind-merge** | 2.2.0 | Merge de clases Tailwind |
| **class-variance-authority** | 0.7.0 | Variantes de componentes |
| **tailwindcss-animate** | 1.0.7 | Animaciones CSS |
| **Lucide React** | 0.294.0 | Iconos SVG optimizados |

### 3.3 Formularios y Validación

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React Hook Form** | 7.49.2 | Form state management |
| **Zod** | 3.22.4 | Schema validation |
| **@hookform/resolvers** | 3.3.3 | Integración Zod + RHF |

### 3.4 HTTP y Utilidades

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Axios** | 1.6.2 | HTTP client con interceptores |
| **date-fns** | 3.0.6 | Manipulación de fechas |
| **html5-qrcode** | 2.3.8 | Escáner de códigos de barras |
| **clsx** | 2.0.0 | Construcción de classNames |

---

## 4. Estructura del Proyecto

### 4.1 Árbol de Directorios

```
Front-SIA/
├── public/                          # Assets estáticos
├── src/
│   ├── api/                         # Capa de servicios API (7 archivos)
│   │   ├── axiosConfig.ts           # Configuración Axios + interceptores
│   │   ├── authApi.ts               # Servicio de autenticación
│   │   ├── inventoryApi.ts          # CRUD de movimientos
│   │   ├── itemApi.ts               # CRUD de artículos
│   │   ├── itemGroupApi.ts          # CRUD de grupos
│   │   ├── vatApi.ts                # CRUD de IVA
│   │   └── warehouseApi.ts          # Servicio de almacenes
│   │
│   ├── components/                  # Componentes React
│   │   ├── common/                  # Componentes compartidos
│   │   │   ├── Layout.tsx           # Layout principal con sidebar
│   │   │   └── ProtectedRoute.tsx   # HOC para rutas protegidas
│   │   │
│   │   ├── inventory/               # Componentes de inventario
│   │   │   ├── DeleteConfirmation.tsx
│   │   │   ├── MovementDetail.tsx
│   │   │   ├── MovementForm.tsx
│   │   │   └── MovementTable.tsx
│   │   │
│   │   ├── items/                   # Componentes de artículos
│   │   │   ├── BarcodeScanner.tsx   # Escáner QR/Barcode
│   │   │   ├── DeleteItemConfirmation.tsx
│   │   │   ├── ItemDetail.tsx
│   │   │   ├── ItemForm.tsx         # Formulario complejo (41KB)
│   │   │   └── ItemTable.tsx
│   │   │
│   │   └── ui/                      # Componentes base UI
│   │       ├── button.tsx           # Botones con variantes
│   │       ├── card.tsx             # Cards reutilizables
│   │       ├── input.tsx            # Inputs validados
│   │       ├── label.tsx            # Labels de formularios
│   │       └── modal.tsx            # Modals personalizados
│   │
│   ├── context/                     # Context providers
│   │   ├── AuthContext.tsx          # Estado de autenticación
│   │   ├── InventoryContext.tsx     # Estado de movimientos
│   │   ├── ItemContext.tsx          # Estado de artículos
│   │   └── ToastContext.tsx         # Sistema de notificaciones
│   │
│   ├── data/
│   │   └── mockData.ts              # Datos mock para dropdowns
│   │
│   ├── hooks/                       # Custom React Hooks
│   │   ├── useInventoryMovements.ts # Hook de movimientos
│   │   └── useToast.ts              # Hook de notificaciones
│   │
│   ├── pages/                       # Páginas de la aplicación
│   │   ├── Dashboard.tsx            # Dashboard principal
│   │   ├── Items.tsx                # Página de artículos
│   │   ├── ItemGroups/              # Módulo de grupos
│   │   ├── Login.tsx                # Página de login
│   │   ├── Movements.tsx            # Página de movimientos
│   │   ├── NotFound.tsx             # Página 404
│   │   └── Vat/                     # Módulo de IVA
│   │
│   ├── types/                       # Definiciones TypeScript
│   │   ├── auth.types.ts            # Tipos de autenticación
│   │   ├── common.types.ts          # Tipos comunes
│   │   ├── inventory.types.ts       # Tipos de inventario
│   │   └── item.types.ts            # Tipos de artículos
│   │
│   ├── utils/                       # Utilidades
│   │   ├── cn.ts                    # Merge de clases CSS
│   │   ├── formatters.ts            # Formateadores
│   │   ├── validators.ts            # Validadores Zod
│   │   └── itemValidators.ts        # Validadores de items
│   │
│   ├── App.tsx                      # Componente raíz
│   ├── main.tsx                     # Entry point
│   ├── index.css                    # Estilos globales
│   └── vite-env.d.ts                # Type declarations
│
├── .env.example                     # Ejemplo de variables
├── .gitignore
├── index.html                       # HTML principal
├── package.json                     # Dependencias
├── postcss.config.js                # PostCSS config
├── tailwind.config.js               # Tailwind config
├── tsconfig.json                    # TypeScript config
├── tsconfig.node.json
├── vite.config.ts                   # Vite config
└── README.md
```

### 4.2 Convenciones de Nomenclatura

```typescript
// Archivos
- Componentes: PascalCase.tsx (ej: ItemForm.tsx)
- Utilidades: camelCase.ts (ej: validators.ts)
- Types: camelCase.types.ts (ej: item.types.ts)
- Contexts: PascalCaseContext.tsx (ej: AuthContext.tsx)
- APIs: camelCaseApi.ts (ej: itemApi.ts)

// Código
- Componentes: PascalCase
- Funciones: camelCase
- Constantes: UPPER_SNAKE_CASE
- Interfaces/Types: PascalCase
- Enums: PascalCase
```

---

## 5. Módulos Principales

### 5.1 Módulo de Autenticación

**Archivos:**
- `src/context/AuthContext.tsx`
- `src/api/authApi.ts`
- `src/pages/Login.tsx`
- `src/components/common/ProtectedRoute.tsx`

**Flujo de autenticación:**
```typescript
1. Usuario ingresa credenciales → Login.tsx
2. authApi.login() → POST /Auth/Login
3. Recibe JWT token
4. Guarda token en localStorage
5. AuthContext actualiza estado
6. Redirect a dashboard
7. ProtectedRoute valida en cada ruta
```

**Almacenamiento:**
```javascript
localStorage.setItem('token', jwtToken);
localStorage.setItem('userName', username);
```

### 5.2 Módulo de Movimientos de Inventario

**Archivos principales:**
- `src/pages/Movements.tsx` (4,438 bytes)
- `src/components/inventory/MovementForm.tsx` (17,467 bytes)
- `src/components/inventory/MovementTable.tsx` (12,195 bytes)
- `src/context/InventoryContext.tsx`
- `src/api/inventoryApi.ts`

**Operaciones CRUD:**
```typescript
GET    /InventoryMovements          // Listar todos
GET    /InventoryMovements/{id}     // Obtener uno
POST   /InventoryMovements          // Crear
PUT    /InventoryMovements/{id}     // Actualizar
DELETE /InventoryMovements/{id}     // Eliminar
```

**Tipos de movimiento:**
- ✅ **Entrada** (verde #10b981) - Ingreso de stock
- ❌ **Salida** (rojo #ef4444) - Egreso de stock
- ⚙️ **Ajuste** (amarillo #f59e0b) - Corrección de inventario

### 5.3 Módulo de Artículos (Items)

**Archivos principales:**
- `src/pages/Items.tsx` (8,463 bytes)
- `src/components/items/ItemForm.tsx` (41,318 bytes - más complejo)
- `src/components/items/ItemTable.tsx` (12,622 bytes)
- `src/components/items/BarcodeScanner.tsx` (7,403 bytes)
- `src/context/ItemContext.tsx`

**Características especiales:**
- Escáner de códigos de barras (cámara + USB)
- 3 códigos de barras por artículo
- 3 precios diferentes
- Cálculo automático de precio basado en costo + margen
- Soporte para decimales configurable
- Punto de reorden

**21 campos del formulario:**
```
itemName, unitOfMeasure, batch, groupId, 
barcode, barcode2, barcode3,
cost, price, price2, price3, margen,
reorderPoint, warehouseId, 
vatId, vatApplicable,
comment, allowDecimal, photoFileName,
autoGenerateBarcode (solo frontend)
```

### 5.4 Módulo de Dashboard

**Archivo:** `src/pages/Dashboard.tsx` (5,497 bytes)

**Características:**
- Cards de resumen con iconos
- Estadísticas por tipo de movimiento
- Lista de movimientos recientes
- Gráficos de tendencias (próxima feature)
- Responsivo mobile-first

---

## 6. API y Servicios

### 6.1 Configuración de Axios

**Archivo:** `src/api/axiosConfig.ts`

**Características:**
```typescript
// Base URL dinámica
const getApiBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    if (import.meta.env.DEV) return '/api'; // Proxy de Vite
    return `http://${window.location.hostname}:5037/api`;
};

// Configuración
baseURL: API_BASE_URL
timeout: 10000ms
headers: { 'Content-Type': 'application/json' }
```

**Interceptores:**
```typescript
// REQUEST: Agrega JWT a cada petición
config.headers.Authorization = `Bearer ${token}`;

// RESPONSE: Maneja errores 401
if (status === 401) {
    localStorage.clear();
    window.location.href = '/login';
}
```

### 6.2 Servicios API

#### authApi.ts
```typescript
login(username: string, password: string)
register(userData: RegisterDto)
logout()
```

#### inventoryApi.ts
```typescript
getMovements(): Promise<InventoryMovementDto[]>
getMovementById(id: number): Promise<InventoryMovementDto>
createMovement(data: InventoryMovementSaveDto)
updateMovement(id: number, data: InventoryMovementSaveDto)
deleteMovement(id: number)
```

#### itemApi.ts
```typescript
getItems(): Promise<ItemInformationDto[]>
getItemById(id: number): Promise<ItemInformationDto>
createItem(data: SaveItemInformationDto)
updateItem(id: number, data: SaveItemInformationDto)
deleteItem(id: number)
```

#### itemGroupApi.ts
```typescript
getGroups(): Promise<GroupDto[]>
createGroup(data: SaveGroupDto)
updateGroup(id: number, data: SaveGroupDto)
deleteGroup(id: number)
```

#### vatApi.ts
```typescript
getVats(): Promise<VatDto[]>
createVat(data: SaveVatDto)
updateVat(id: number, data: SaveVatDto)
deleteVat(id: number)
```

---

## 7. Gestión de Estado

### 7.1 AuthContext

**Proveedor:** Toda la aplicación
**Estado:**
```typescript
interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}
```

### 7.2 InventoryContext

**Proveedor:** Rutas protegidas
**Estado:**
```typescript
interface InventoryState {
    movements: InventoryMovementDto[];
    loading: boolean;
    error: string | null;
    fetchMovements: () => Promise<void>;
    createMovement: (data: InventoryMovementSaveDto) => Promise<void>;
    updateMovement: (id: number, data: InventoryMovementSaveDto) => Promise<void>;
    deleteMovement: (id: number) => Promise<void>;
}
```

### 7.3 ItemContext

**Proveedor:** Rutas protegidas
**Estado:**
```typescript
interface ItemState {
    items: ItemInformationDto[];
    loading: boolean;
    error: string | null;
    fetchItems: () => Promise<void>;
    createItem: (data: SaveItemInformationDto) => Promise<void>;
    updateItem: (id: number, data: SaveItemInformationDto) => Promise<void>;
    deleteItem: (id: number) => Promise<void>;
}
```

### 7.4 ToastContext

**Proveedor:** Toda la aplicación
**Funciones:**
```typescript
showToast(message: string, type: 'success' | 'error' | 'info' | 'warning')
```

---

## 8. Tipos y Validaciones

### 8.1 Tipos de Inventario

**Archivo:** `src/types/inventory.types.ts`

```typescript
// Tipo de movimiento
type MovementType = 'Entrada' | 'Salida';

// DTO de respuesta
interface InventoryMovementDto {
    movement_ID: number;
    iteM_ID: number;
    movement_Type: string;
    quantity: number;
    movement_Date: string; // ISO 8601
    reason?: string | null;
    createdBy: number;
}

// DTO de guardado
interface InventoryMovementSaveDto {
    iteM_ID: number;
    movement_Type: string;
    quantity: number;
    movement_Date: string;
    reason?: string | null;
    createdBy: number;
}
```

### 8.2 Tipos de Artículos

**Archivo:** `src/types/item.types.ts`

```typescript
interface ItemInformationDto {
    iteM_ID: number;
    itemName: string;
    unitOfMeasure: string;
    batch: string;
    grouP_ID: number;
    barcode: string;
    cost: number;
    price: number;
    price2: number;
    price3: number;
    reorderPoint: number;
    vaT_Applicable: string;
    warehouseID: number;
    photoFileName: string;
    barcode2: string;
    barcode3: string;
    comment: string;
    vaT_ID: number;
    allowDecimal: boolean;
    margen: number;
}
```

### 8.3 Validaciones Zod

**Archivo:** `src/utils/validators.ts`

```typescript
const movementSchema = z.object({
    itemId: z.number().positive("ID debe ser positivo"),
    movementType: z.enum(['Entrada', 'Salida']),
    quantity: z.number().positive("Cantidad debe ser positiva"),
    movementDate: z.date(),
    reason: z.string().max(500).optional(),
    createdBy: z.number().positive()
});
```

**Archivo:** `src/utils/itemValidators.ts`

```typescript
const itemSchema = z.object({
    itemName: z.string().min(1).max(200),
    unitOfMeasure: z.string().max(200).optional(),
    barcode: z.string().max(200).optional(),
    cost: z.number().min(0).optional(),
    price: z.number().min(0).optional(),
    margen: z.number().min(0).max(100).optional(),
    // ... 21 campos en total
});
```

---

## 9. Componentes UI

### 9.1 Componentes Base

**Button Component** (`src/components/ui/button.tsx`)
```typescript
Variantes: default, destructive, outline, secondary, ghost, link
Tamaños: default, sm, lg, icon
```

**Card Component** (`src/components/ui/card.tsx`)
```typescript
Subcomponentes: Card, CardHeader, CardTitle, CardDescription, 
                CardContent, CardFooter
```

**Modal Component** (`src/components/ui/modal.tsx`)
```typescript
Props: isOpen, onClose, title, children, maxWidth
Features: Overlay, animaciones, scroll interno
```

### 9.2 Layout Component

**Archivo:** `src/components/common/Layout.tsx` (7,708 bytes)

**Estructura:**
```
┌────────────────────────────────────┐
│  Header (con usuario y logout)    │
├──────────┬─────────────────────────┤
│          │                         │
│ Sidebar  │   Main Content          │
│ (Menu)   │   {children}            │
│          │                         │
└──────────┴─────────────────────────┘
```

**Menú de navegación:**
- Dashboard
- Movimientos
- Artículos
- Catálogos
  - Grupos de Artículos
  - IVA

### 9.3 Componente de Escáner

**Archivo:** `src/components/items/BarcodeScanner.tsx`

**Características:**
- Soporte para cámara del dispositivo
- Soporte para escáner USB
- Detecta QR y códigos de barras
- Preview en tiempo real
- Manejo de permisos de cámara

**Uso:**
```typescript
<BarcodeScanner
    onScanSuccess={(code) => setValue('barcode', code)}
    onClose={() => setShowScanner(false)}
/>
```

---

## 10. Configuración y Deployment

### 10.1 Variables de Entorno

**Archivo:** `.env`
```env
VITE_API_URL=http://localhost:5037/api
```

### 10.2 Configuración de Vite

**Archivo:** `vite.config.ts`

```typescript
{
    server: {
        host: '0.0.0.0',  // Red local
        port: 5176,
        proxy: {
            '/api': {
                target: 'http://localhost:5037',
                changeOrigin: true,
                secure: false
            }
        }
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    }
}
```

### 10.3 Configuración de Tailwind

**Archivo:** `tailwind.config.js`

**Colores personalizados:**
```javascript
colors: {
    entrada: '#10b981',  // Verde
    salida: '#ef4444',   // Rojo
    ajuste: '#f59e0b'    // Amarillo
}
```

**Tema extendido:**
- Sistema de diseño completo con CSS variables
- Dark mode class-based
- Animaciones personalizadas
- Responsive breakpoints

### 10.4 Scripts de npm

```bash
npm run dev      # Dev server en http://localhost:5176
npm run build    # Build producción (dist/)
npm run preview  # Preview del build
npm run lint     # ESLint
```

---

## 11. Guía de Desarrollo

### 11.1 Setup Inicial

```bash
# 1. Clonar repositorio
cd "Front-SIA"

# 2. Instalar dependencias
npm install

# 3. Configurar .env
cp .env.example .env
# Editar VITE_API_URL según tu backend

# 4. Ejecutar en desarrollo
npm run dev
```

### 11.2 Agregar un Nuevo Módulo

**Ejemplo: Módulo de Clientes**

```typescript
// 1. Crear tipos
// src/types/customer.types.ts
export interface CustomerDto {
    customerId: number;
    name: string;
    email: string;
}

// 2. Crear servicio API
// src/api/customerApi.ts
export const getCustomers = () => apiClient.get('/Customers');

// 3. Crear Context
// src/context/CustomerContext.tsx
export const CustomerProvider = ({ children }) => { ... }

// 4. Crear componentes
// src/components/customers/CustomerTable.tsx
// src/components/customers/CustomerForm.tsx

// 5. Crear página
// src/pages/Customers.tsx

// 6. Agregar ruta en App.tsx
<Route path="/customers" element={<Customers />} />

// 7. Agregar al menú en Layout.tsx
```

### 11.3 Mejores Prácticas

**TypeScript:**
```typescript
// ✅ Hacer: Tipar todo explícitamente
const fetchItems = async (): Promise<ItemDto[]> => { ... }

// ❌ Evitar: any
const data: any = await api.get(...);
```

**Componentes:**
```typescript
// ✅ Hacer: Componentes pequeños y reutilizables
const ItemCard = ({ item }: { item: ItemDto }) => { ... }

// ❌ Evitar: Componentes monolíticos
```

**Validación:**
```typescript
// ✅ Hacer: Usar Zod para validación
const schema = z.object({ ... });
const result = schema.safeParse(data);

// ❌ Evitar: Validación manual
if (data.email && data.email.includes('@')) { ... }
```

**Estado:**
```typescript
// ✅ Hacer: Usar Context para estado compartido
const { items } = useItems();

// ❌ Evitar: Prop drilling excesivo
```

### 11.4 Debugging

**React DevTools:**
- Instalar extensión de navegador
- Inspeccionar componentes y contexts
- Profiler para performance

**Network Tab:**
- Verificar requests/responses
- Validar headers (Authorization)
- Debugging de errores HTTP

**Console Logs:**
```typescript
console.log('API Response:', response.data);
console.error('Error:', error.response?.data);
```

### 11.5 Testing (Próxima implementación)

**Frameworks recomendados:**
```bash
npm install --save-dev vitest @testing-library/react
```

**Estructura de tests:**
```typescript
// ItemForm.test.tsx
describe('ItemForm', () => {
    it('should validate required fields', () => { ... });
    it('should calculate price from cost and margin', () => { ... });
});
```

---

## Apéndices

### A. Endpoints del Backend

```
Auth:
POST   /Auth/Login
POST   /Auth/Register

Inventory Movements:
GET    /InventoryMovements
GET    /InventoryMovements/{id}
POST   /InventoryMovements
PUT    /InventoryMovements/{id}
DELETE /InventoryMovements/{id}

Item Information:
GET    /ItemInformation
GET    /ItemInformation/{id}
POST   /ItemInformation
PUT    /ItemInformation/{id}
DELETE /ItemInformation/{id}

Item Groups:
GET    /Groups
POST   /Groups
PUT    /Groups/{id}
DELETE /Groups/{id}

VAT:
GET    /Vat
POST   /Vat
PUT    /Vat/{id}
DELETE /Vat/{id}
```

### B. Códigos de Estado HTTP

```
200 OK - Operación exitosa
201 Created - Recurso creado
204 No Content - Eliminado exitosamente
400 Bad Request - Datos inválidos
401 Unauthorized - No autenticado
403 Forbidden - No autorizado
404 Not Found - Recurso no encontrado
500 Internal Server Error - Error del servidor
```

### C. Troubleshooting

**Problema:** CORS Error
```
Solución: Verificar que el backend tenga CORS configurado
app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyMethod());
```

**Problema:** 401 en requests
```
Solución: Verificar token en localStorage
console.log(localStorage.getItem('token'));
```

**Problema:** Build falla
```
Solución: 
1. Eliminar node_modules y package-lock.json
2. npm install
3. npm run build
```

---

**Documentación generada el:** 24 de Diciembre de 2024  
**Versión:** 1.0.0  
**Autor:** Equipo de Desarrollo Front-SIA

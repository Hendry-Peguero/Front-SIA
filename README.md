# WebApiSIA Frontend

Frontend for the WebApiSIA inventory system, built with React, TypeScript, and Tailwind CSS.

## Features

- **CRUD Operations**: Create, read, update, and delete inventory movements.
- **Modern Design**: Clean interface using Tailwind CSS.
- **Responsive**: Optimized for mobile, tablet, and desktop devices.
- **Real-time Validation**: Form validation using Zod.
- **Notifications**: User feedback via toast notifications.
- **TypeScript**: Strongly typed codebase.
- **Optimized Performance**: Built with Vite.
- **Color-Coded**: Visual differentiation for movement types (Entry, Exit, Adjustment).

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|-----------|
| React | 18.2+ | UI Library |
| TypeScript | 5.2+ | Programming Language |
| Vite | 5.0+ | Build Tool & Dev Server |
| Tailwind CSS | 3.4+ | CSS Framework |
| React Router | 6.21+ | Routing |
| Axios | 1.6+ | HTTP Client |
| React Hook Form | 7.49+ | Form Handling |
| Zod | 3.22+ | Schema Validation |
| Lucide React | 0.294+ | Icons |
| date-fns | 3.0+ | Date Manipulation |

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── api/               # API configuration and services
│   ├── components/        # React components
│   │   ├── common/        # Reusable components
│   │   ├── inventory/     # Inventory specific components
│   │   └── ui/            # Base UI components
│   ├── context/           # Context providers
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Application pages
│   ├── types/             # TypeScript definitions
│   ├── utils/             # Utilities
│   ├── App.tsx            # Root component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # Main HTML
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind configuration
├── vite.config.ts         # Vite configuration
└── .env                   # Environment variables
```

## Installation and Setup

### Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)

### 1. Clone and Install

```bash
# Navigate to the project directory
cd frontend

# Install dependencies
npm install
```

### 2. Environment Configuration

The `.env` file is configured with:

```env
VITE_API_URL=http://localhost:5000/api
```

Ensure this URL matches your WebApiSIA backend URL.

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at: http://localhost:5175

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts development server on port 5175 |
| `npm run build` | Compiles for production |
| `npm run lint` | Runs ESLint |
| `npm run preview` | Preview production build |

## Backend Integration

### Endpoints

The application consumes the following backend endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/InventoryMovements` | Get all movements |
| GET | `/InventoryMovements/{id}` | Get movement by ID |
| POST | `/InventoryMovements` | Create new movement |
| PUT | `/InventoryMovements/{id}` | Update movement |
| DELETE | `/InventoryMovements/{id}` | Delete movement |

### Data Transfer Objects (DTOs)

**InventoryMovementDto** (Response):
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

**InventoryMovementSaveDto** (Request):
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

## Key Functionalities

### 1. Dashboard
- Movement statistics by type.
- Summary cards (entries, exits, adjustments).
- Recent movements list.

### 2. Movement Management
- **List**: Table view of all movements.
- **Create**: Modal with validated form.
- **Edit**: Modify existing movements.
- **Delete**: Confirmation before deletion.
- **View Detail**: Complete movement visualization.

### 3. Validation

Validations implemented with Zod:

- **Item ID**: Positive integer (required).
- **Movement Type**: "entrada", "salida", or "ajuste" (required).
- **Quantity**: Positive number (required).
- **Date**: datetime-local format (required).
- **Reason**: Max 500 characters (optional).
- **Created By**: Positive integer (required).

## UI/UX Features

### Color Coding
- **Entry**: Green (#10b981)
- **Exit**: Red (#ef4444)
- **Adjustment**: Yellow (#f59e0b)

### Application States
- **Loading**: Animated spinner.
- **Empty State**: Message when no data is available.
- **Error Handling**: Toast notifications for errors.
- **Success Feedback**: Success notifications.

### Responsive Design
- **Mobile**: Collapsible sidebar, card view for tables.
- **Tablet**: Optimized layout.
- **Desktop**: Full desktop experience.

## Customization

### Change Port

Edit `vite.config.ts`:
```typescript
server: {
  port: 3000,
},
```

### Change Backend URL

Edit `.env`:
```env
VITE_API_URL=http://your-server:port/api
```

## Troubleshooting

### "Cannot find module 'react'"
Run:
```bash
npm install
```

### CORS Error
Ensure WebApiSIA backend has CORS configured to allow requests from the frontend origin.

### Port in Use
Change the port in `vite.config.ts` or terminate the process using the port.

## Production Build

```bash
# Build
npm run build

# Preview
npm run preview
```

The compiled files will be in the `dist/` directory.

## License

This project is part of the WebApiSIA system.

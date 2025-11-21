# ECIWISE+ Frontend

Plataforma de aprendizaje colaborativo para la Escuela Colombiana de Ingeniería Julio Garavito. Facilita tutorías, materiales de estudio, grupos de trabajo y gestión del progreso académico.

## Stack Tecnológico

- React Router v7.9.2 (SSR, HMR)
- TypeScript 5.9.2
- Tailwind CSS v4.1.13
- Hero UI v2.8.5
- React Query v5.90.8
- Vite 7.1.7
- Biome v2.3.5 (linting/formatting)
- Framer Motion
- Lucide React v0.553.0

## Características

- Dashboards personalizados por rol: Estudiante, Tutor y Administrador
- Validación automática de código pre-commit con Husky y Biome
- Sistema de temas con colores institucionales
- Tipografía: Poppins, Nunito, IBM Plex Sans, DM Sans
- **Sistema de Notificaciones**: Panel desplegable con notificaciones en tiempo real
- **Asistente de Chat IA**: Botón flotante para interactuar con un asistente inteligente

## Estructura del Proyecto

```
app/
  components/       # Componentes reutilizables
  contexts/         # Context providers (auth-context.tsx)
  lib/              # API client, servicios, tipos, utils
  routes/
    dashboard/      # student/, tutor/, admin/
    home/           # Landing page
    login/          # Autenticación
    register/       # Registro de usuarios
  root.tsx          # Layout raíz
  providers.tsx     # React Query, temas
  hero.ts           # Configuración Hero UI
  routes.ts         # Definición de rutas
```

## Requisitos

- Node.js 18+
- pnpm 10+

## Instalación y Desarrollo

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo (http://localhost:5173)
pnpm run dev

# Construir para producción
pnpm run build

# Iniciar servidor de producción
pnpm run start
```

## Scripts Disponibles

```bash
pnpm run dev         # Servidor de desarrollo
pnpm run build       # Build de producción
pnpm run start       # Servidor de producción
pnpm run typecheck   # Verificar tipos TypeScript
pnpm run lint        # Linter con auto-fix
pnpm run lint:ci     # Linter sin modificaciones (CI/CD)
```

## Despliegue

### Docker

```bash
# Construir imagen
docker build -t eciwise-front .

# Ejecutar contenedor
docker run -p 3000:3000 eciwise-front
```

Plataformas compatibles: AWS ECS, Google Cloud Run, Azure Container Apps, Digital Ocean, Fly.io, Railway

### Manual

El servidor está listo para producción. Despliega el output de `build/`:
- `build/client/` - Activos estáticos
- `build/server/` - Código del servidor

## Convenciones de Código

- Componentes: PascalCase
- Archivos y carpetas: kebab-case
- Color primario institucional: #990000
- Pre-commit hooks validan código automáticamente

```bash
git add .
git commit -m "mensaje"  # Validación automática
```

## Rutas de la Aplicación

Públicas:
- `/` - Landing page
- `/login` - Inicio de sesión
- `/register` - Registro

Protegidas (requieren autenticación):
- `/dashboard` - Redirige según rol del usuario
- `/dashboard/student` - Dashboard de estudiante
- `/dashboard/tutor` - Dashboard de tutor
- `/dashboard/admin` - Dashboard de administrador

## Nuevas Funcionalidades

### 1. Sistema de Notificaciones

El componente `NotificationsButton` proporciona un panel de notificaciones en la esquina superior derecha del dashboard.

**Ubicación**: `app/components/notifications-button.tsx`

**Características**:
- Badge contador de notificaciones
- Panel desplegable con notificaciones
- Estructura: título, descripción, marca de tiempo
- Íconos por tipo de notificación (entregas, anuncios, calificaciones)
- Acceso rápido a "Ver todas las notificaciones"

**Uso**:
```tsx
import { NotificationsButton } from '~/components';

export default function Dashboard() {
  return (
    <div className="fixed top-4 right-4">
      <NotificationsButton />
    </div>
  );
}
```

**Datos de Ejemplo**:
```tsx
const mockNotifications = [
  {
    id: '1',
    title: 'Entrega de Proyecto – Ingeniería de Sistemas',
    description: 'Tu profesor ha publicado una nueva entrega.',
    timestamp: 'Hace 2 h',
    type: 'assignment',
    icon: 'book',
  },
];
```

### 2. Asistente de Chat IA

El componente `ChatAIButton` proporciona un botón flotante en la esquina inferior derecha que abre un panel de chat con un asistente de IA.

**Ubicación**: `app/components/chat-ai-button.tsx`

**Características**:
- Botón flotante rojo redondeado
- Panel de chat con historial de mensajes
- Área de entrada con soporte para Enter
- Indicador de "escribiendo..."
- Respuestas simuladas de IA (listo para integración backend)
- Cierre rápido del panel

**Uso**:
```tsx
import { ChatAIButton } from '~/components';

export default function Dashboard() {
  return (
    <>
      {/* Otros contenidos */}
      <ChatAIButton />
    </>
  );
}
```

**Características del Chat**:
- Envío de mensajes con Enter o clic en botón
- Historial de conversación
- Animación de estado de carga
- Timestamps en cada mensaje
- Distinción visual entre mensajes del usuario y la IA

## Integración en Dashboard

Ambos componentes se integran automáticamente en el `DashboardLayout`:
- `NotificationsButton`: Fijo en la esquina superior derecha
- `ChatAIButton`: Flotante en la esquina inferior derecha

```tsx
// app/components/dashboard-layout.tsx
import { NotificationsButton } from './notifications-button';
import { ChatAIButton } from './chat-ai-button';

export function DashboardLayout({ /* props */ }) {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar {...props} />
      <main className="flex-1">
        <div className="fixed top-4 right-4">
          <NotificationsButton />
        </div>
        <Outlet />
      </main>
      <ChatAIButton />
    </div>
  );
}
```

## Próximas Mejoras

- [ ] Conectar notificaciones a API backend en tiempo real
- [ ] Implementar WebSocket para notificaciones push
- [ ] Integración con servicio de IA (OpenAI, Gemini, etc.)
- [ ] Persistencia de historial de chat
- [ ] Sonido de notificaciones
- [ ] Filtrado y categorización de notificaciones
- [ ] Preferencias de usuario para notificaciones

## Convenciones de Código

- Componentes: PascalCase
- Archivos y carpetas: kebab-case
- Color primario institucional: #990000
- Pre-commit hooks validan código automáticamente

```bash
git add .
git commit -m "mensaje"  # Validación automática
```

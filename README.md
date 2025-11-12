# ECIWISE+ Frontend

Plataforma de aprendizaje colaborativo para la Escuela Colombiana de Ingeniería Julio Garavito. Frontend desarrollado con React Router, TypeScript, Tailwind CSS y Hero UI.

## Descripción del Proyecto

ECIWISE+ es una plataforma que facilita la colaboración académica entre estudiantes y profesores. Permite compartir tutorías, materiales de estudio, formar grupos de trabajo y gestionar el progreso académico en un único ecosistema.

## Características

- **Dashboards por Rol**: Interfaces personalizadas para Estudiantes, Tutores y Administradores
- **Pre-commit Linting**: Validación automática de código antes de cada commit (Husky + Biome)
- Server-side rendering con React Router v7
- Hot Module Replacement (HMR) para desarrollo
- TypeScript para type safety
- Tailwind CSS v4 con nuevo syntax @theme
- Hero UI v2 para componentes de interfaz
- React Query para gestión de estado
- Sistema de temas personalizado con colores institucionales (#990000)
- Tipografía personalizada (Poppins, Nunito, IBM Plex Sans, DM Sans)

## Estructura del Proyecto

```
app/
  components/          # Componentes reutilizables
    navbar.tsx         # Navegación con menús por rol
    stats-card.tsx     # Tarjetas de estadísticas
    tutoring-card.tsx  # Tarjetas de tutorías
    material-card.tsx  # Tarjetas de materiales
    empty-state.tsx    # Estado vacío
    page-header.tsx    # Encabezados con breadcrumbs
  contexts/            # Context providers
    auth-context.tsx   # Autenticación y gestión de usuarios
  routes/
    dashboard/         # Dashboards por rol
      student/         # Dashboard de estudiante
      tutor/           # Dashboard de tutor
      admin/           # Dashboard de administrador
    home/              # Landing page
    login/             # Inicio de sesión
    register/          # Registro
  root.tsx             # Layout raíz
  providers.tsx        # Providers globales (React Query, Temas)
  hero.ts              # Configuración de tema Hero UI
  app.css              # Estilos globales
  routes.ts            # Configuración de rutas
```

## Requisitos Previos

- Node.js 18+
- pnpm 10+

## Instalación

Instala las dependencias:

```bash
pnpm install
```

## Desarrollo

Inicia el servidor de desarrollo:

```bash
pnpm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Construcción para Producción

Crea una build de producción:

```bash
pnpm run build
```

## Despliegue

### Docker

Construye la imagen:

```bash
docker build -t eciwise-front .
```

Ejecuta el contenedor:

```bash
docker run -p 3000:3000 eciwise-front
```

La aplicación conteneurizada puede desplegarse en:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### Producción Manual

El servidor integrado está listo para producción. Asegúrate de desplegar el output de `pnpm run build`:

```
build/
  client/    # Activos estáticos
  server/    # Código del servidor
```

## Rutas Disponibles

### Públicas
- `/` - Landing page con información de la plataforma
- `/login` - Inicio de sesión
- `/register` - Registro de nuevos usuarios

### Protegidas (requieren autenticación)
- `/dashboard` - Dashboard principal (redirige según rol)
- `/dashboard/student` - Dashboard de estudiante (tutorías, materiales, progreso)
- `/dashboard/tutor` - Dashboard de tutor (sesiones, calificaciones, estadísticas)
- `/dashboard/admin` - Dashboard de administrador (usuarios, reportes, métricas)

## Tecnologías

### Core
- **React Router v7.9.2** - Framework con SSR
- **TypeScript 5.9.2** - Type safety
- **Vite 7.1.7** - Build tool y dev server

### UI/Styling
- **Hero UI v2.8.5** - Componentes de interfaz
- **Tailwind CSS v4.1.13** - Utility-first CSS
- **Framer Motion** - Animaciones
- **Lucide React v0.553.0** - Iconos

### State & Data
- **React Query v5.90.8** - Server state management

### Dev Tools
- **Biome v2.3.5** - Linter y formateador ultra-rápido
- **Husky v9.1.7** - Git hooks
- **lint-staged v16.2.6** - Pre-commit linting

## Convenciones de Código

- **Componentes**: PascalCase para componentes React
- **Archivos**: kebab-case para archivos y carpetas
- **Tipografía**: Poppins (logos), Nunito (encabezados), IBM Plex Sans (navegación), DM Sans (cuerpo)
- **Colores**: Tema institucional con rojo primario `#990000`
- **Linting**: Biome con reglas estrictas (ver `biome.json`)
- **Commits**: Pre-commit hooks validan código automáticamente

## Scripts Disponibles

- `pnpm run dev` - Inicia servidor de desarrollo
- `pnpm run build` - Construcción para producción
- `pnpm run start` - Inicia servidor de producción
- `pnpm run typecheck` - Verifica tipos de TypeScript
- `pnpm run lint` - Ejecuta linter con auto-fix
- `pnpm run lint:ci` - Ejecuta linter sin modificar archivos

## Linting y Pre-commit Hooks

El proyecto incluye validación automática de código antes de cada commit.

**Workflow:**
```bash
git add .
git commit -m "mensaje"  # ← Linting automático aquí
```

**Scripts manuales:**
```bash
pnpm run lint      # Auto-fix de problemas
pnpm run lint:ci   # Solo verificar (CI/CD)
pnpm run typecheck # Validar TypeScript
```

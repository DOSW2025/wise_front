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

## Convenciones de Código

- Componentes: PascalCase
- Archivos y carpetas: kebab-case
- Color primario institucional: #990000
- Pre-commit hooks validan código automáticamente

```bash
git add .
git commit -m "mensaje"  # Validación automática
```

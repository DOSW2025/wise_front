# ECIWISE+ Frontend

Plataforma de aprendizaje colaborativo para la Escuela Colombiana de Ingeniería Julio Garavito. Frontend desarrollado con React Router, TypeScript, Tailwind CSS y Hero UI.

## Descripción del Proyecto

ECIWISE+ es una plataforma que facilita la colaboración académica entre estudiantes y profesores. Permite compartir tutorías, materiales de estudio, formar grupos de trabajo y gestionar el progreso académico en un único ecosistema.

## Características

- Server-side rendering con React Router v7
- Hot Module Replacement (HMR) para desarrollo
- TypeScript para type safety
- Tailwind CSS v4 con nuevo syntax @theme
- Hero UI v2 para componentes de interfaz
- React Query para gestión de estado
- Sistema de temas personalizado con colores institucionales
- Tipografía personalizada (Poppins, Nunito, IBM Plex Sans, DM Sans)
- Autenticación de usuarios con roles (Estudiante, Profesor/Tutor)

## Estructura del Proyecto

```
app/
  routes/
    home/              # Landing page
    login/             # Página de inicio de sesión
    register/          # Página de registro
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

- `/` - Landing page
- `/login` - Inicio de sesión
- `/register` - Registro de nuevos usuarios

## Tecnologías

- React Router v7.9.5
- Hero UI v2.8.5
- Tailwind CSS v4
- React Query v5.90.8
- Lucide React v0.553.0
- Framer Motion
- TypeScript 5.9.3

## Convenciones de Código

- Tipografía: Poppins (logos), Nunito (encabezados), IBM Plex Sans (navegación), DM Sans (cuerpo)
- Colores: Tema institucional con rojo primario #990000
- Formato: ESLint y Biome configurados

## Scripts Disponibles

- `pnpm run dev` - Inicia servidor de desarrollo
- `pnpm run build` - Construcción para producción
- `pnpm run preview` - Vista previa de build
- `pnpm run lint` - Ejecuta linter

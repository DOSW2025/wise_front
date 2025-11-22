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

## Nuevas Funcionalidades

### Panel de Materiales Sugeridos

El componente `SuggestedMaterialsPanel` proporciona una sección de materiales recomendados en el Dashboard del estudiante.

**Ubicación**: `app/components/suggested-materials-panel.tsx`

**Características**:
- Panel con gradiente y diseño institucional
- Encabezado con ícono de documento
- Botón "Ver más" para acceder a todos los materiales
- Lista de materiales sugeridos con información detallada
- Cada material muestra: título, asignatura, rating
- Botón de descarga para cada material
- Indicador visual del tipo de archivo (PDF/DOC)

**Uso**:
```tsx
import { SuggestedMaterialsPanel } from '~/components';

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      {/* Otros componentes */}
      <SuggestedMaterialsPanel />
    </div>
  );
}
```

**Datos de Ejemplo**:
```tsx
interface SuggestedMaterial {
  id: string;
  title: string;
  subject: string;
  rating: number;
  type: 'PDF' | 'DOC';
  fileUrl?: string;
}

const mockSuggestedMaterials: SuggestedMaterial[] = [
  {
    id: '1',
    title: 'Guía completa de integrales',
    subject: 'Matemáticas',
    rating: 4.8,
    type: 'PDF',
  },
  {
    id: '2',
    title: 'Python para principiantes',
    subject: 'Programación',
    rating: 4.9,
    type: 'DOC',
  },
];
```

**Características del Panel**:
- Descarga de materiales (simulada, lista para integrar con API)
- Hover effects para mejor interactividad
- Respuesta hover en tarjetas de materiales
- Botones con iconos de descarga
- Rating visible con estrella (★)
- Clasificación por tipo de archivo

**Integración en Dashboard**:
El componente se integra en la parte inferior del Dashboard del estudiante:

```tsx
// app/routes/dashboard/student/index.tsx
import { SuggestedMaterialsPanel } from '~/components';

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      {/* Stats Grid */}
      {/* Quick Actions */}
      {/* Recent Materials */}
      
      {/* Suggested Materials Panel */}
      <SuggestedMaterialsPanel />
    </div>
  );
}
```

**Próximas Mejoras**:
- [ ] Conectar a API backend para obtener materiales recomendados
- [ ] Implementar sistema de recomendación basado en el progreso del estudiante
- [ ] Descargas reales de archivos PDF/DOC
- [ ] Historial de descargas del estudiante
- [ ] Filtrado de materiales por asignatura
- [ ] Ordenamiento por rating o fecha

## Convenciones de Código

- Componentes: PascalCase
- Archivos y carpetas: kebab-case
- Color primario institucional: #990000
- Pre-commit hooks validan código automáticamente

```bash
git add .
git commit -m "mensaje"  # Validación automática
```

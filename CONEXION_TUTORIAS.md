# Configuración de Conexión Backend - Microservicio de Tutorías

## 📋 Resumen

Se ha configurado la capa de comunicación con el backend para el microservicio de tutorías usando **Axios** y **React Query**.

## 🔧 Componentes Implementados

### 1. **Configuración de API** (`lib/config/api.config.ts`)
- ✅ Agregado endpoint: `TUTORIAS.TUTORES: '/wise/tutorias/tutores'`
- El cliente Axios ya estaba configurado con interceptors JWT en `lib/api/client.ts`

### 2. **Tipos TypeScript** (`lib/types/tutoria.types.ts`)
Interfaces definidas para la respuesta del backend:

```typescript
interface TutorProfile {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  semestre: number;
  rolId: number;
  estadoId: number;
  disponibilidad: DisponibilidadSemanal;
  created_at: string;
  updated_at: string;
  rol: Rol;
  estado: Estado;
}
```

### 3. **Servicio de Tutorías** (`lib/services/tutoria.service.ts`)
Función implementada:

```typescript
export async function getTutores(): Promise<TutorProfile[]>
```

- Realiza petición GET a `/wise/tutorias/tutores`
- Maneja errores automáticamente
- Tipado estricto con TypeScript

### 4. **Hook de React Query** (`lib/hooks/useTutores.ts`)
Hook personalizado para gestionar el estado:

```typescript
export function useTutores(): UseQueryResult<TutorProfile[], Error>
```

**Características:**
- ✅ Cache automático (5 minutos)
- ✅ No refetch automático en focus
- ✅ Manejo de loading y error states
- ✅ Integración con React Query DevTools

### 5. **Componente Actualizado** (`routes/dashboard/student/tutoring.tsx`)

**Cambios realizados:**
1. Importación del hook `useTutores`
2. Función de transformación de datos: `transformTutorProfileToTutor()`
3. Estados de carga y error
4. Conexión con datos reales del backend

**Uso:**
```tsx
const { data: tutoresData, isLoading, error } = useTutores();
const tutors = tutoresData ? tutoresData.map(transformTutorProfileToTutor) : [];
```

## 🔒 Seguridad

- ✅ **Token JWT**: Se adjunta automáticamente en cada petición mediante interceptor
- ✅ **Manejo 401**: Redirección automática a login si el token expira
- ✅ **HTTPS**: Forzado en producción (no localhost)
- ✅ **Timeout**: 30 segundos configurado

## 📦 Estructura de Respuesta del Backend

```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "email": "carlos.lopez@escuelaing.edu.co",
    "nombre": "Carlos",
    "apellido": "López",
    "semestre": 10,
    "rolId": 2,
    "estadoId": 1,
    "disponibilidad": {
      "monday": [
        {
          "start": "08:00",
          "end": "10:00",
          "modalidad": "VIRTUAL",
          "lugar": "https://meet.google.com/abc-defg-hij"
        }
      ],
      ...
    },
    "rol": { "id": 2, "nombre": "Tutor", "activo": true },
    "estado": { "id": 1, "nombre": "Activo", "activo": true }
  }
]
```

## 🧪 Pruebas

Para probar la conexión:

1. **Verificar variable de entorno:**
   ```
   VITE_API_GATEWAY_URL=http://localhost:3000
   ```

2. **Navegar a:**
   ```
   /dashboard/student/tutoring
   ```

3. **Verificar en DevTools:**
   - Network tab: Request a `/wise/tutorias/tutores`
   - React Query DevTools: Estado de la query `['tutores']`
   - Console: Logs de errores si los hay

## 🚀 Próximos Endpoints

Cuando necesites conectar más endpoints, sigue este patrón:

1. **Agregar a `api.config.ts`:**
   ```typescript
   TUTORIAS: {
     TUTORES: '/wise/tutorias/tutores',
     NUEVO_ENDPOINT: '/wise/tutorias/nuevo-endpoint',  // ← Agregar aquí
   }
   ```

2. **Crear función en `tutoria.service.ts`:**
   ```typescript
   export async function getNuevoEndpoint(): Promise<TipoRespuesta> {
     const response = await apiClient.get(API_ENDPOINTS.TUTORIAS.NUEVO_ENDPOINT);
     return response.data;
   }
   ```

3. **Crear hook si es necesario:**
   ```typescript
   export function useNuevoEndpoint() {
     return useQuery({
       queryKey: ['nuevoEndpoint'],
       queryFn: getNuevoEndpoint,
     });
   }
   ```

## ✅ Validación

La conexión está lista cuando:
- [x] El componente carga sin errores de compilación
- [x] El spinner aparece mientras carga
- [x] Los datos se muestran correctamente
- [x] El token JWT se envía en los headers
- [x] Los errores se manejan apropiadamente

## 📝 Notas Importantes

- **Transformación de Datos**: La función `transformTutorProfileToTutor()` adapta la respuesta del backend al formato que espera el componente UI
- **React Query**: Gestiona automáticamente el cache, refetch y estados de loading/error
- **TypeScript**: Garantiza type-safety en toda la cadena de datos
- **Axios Interceptors**: Manejan JWT y errores globalmente, no necesitas configurarlos en cada petición

# Gestor de Tickets DATRA – Frontend

Frontend del sistema **Gestor de Tickets DATRA**, desarrollado para simular la experiencia completa de un sistema de ticketing **antes de integrar el backend**. El enfoque actual está en **UI, roles, permisos y flujo de pantallas**, usando **datos mock**.

---

## 🎯 Objetivo del proyecto

* Construir un frontend funcional y bien estructurado.
* Simular **autenticación, roles y permisos**.
* Dejar la aplicación lista para conectar con el backend (NestJS + JWT).
* Evitar dependencias reales de API mientras se diseña la UX.

---

## 🧠 Alcance actual

✔ Login simulado por rol
✔ Manejo de sesión en frontend (Context API)
✔ Roles y permisos centralizados
✔ Rutas protegidas
✔ Vistas de tickets (lista, detalle, creación)
✔ Acciones visibles según rol
✔ Mock API y datos simulados

🚧 Backend **NO integrado aún** (por diseño)

---

## 👥 Roles del sistema

Los roles están alineados con el backend planeado.

| Rol           | Descripción                                                                |
| ------------- | -------------------------------------------------------------------------- |
| **ADMIN**     | Control total, métricas, gestión de usuarios, aprobar/rechazar solicitudes |
| **INGENIERO** | Gestiona tickets globales, métricas, solicita eliminación                  |
| **TECNICO**   | Gestiona solo sus tickets, solicita eliminación                            |

### Permisos por rol (Frontend)

| Acción                | ADMIN | INGENIERO | TECNICO          |
| --------------------- | ----- | --------- | ---------------- |
| Ver todos los tickets | ✅     | ✅         | ❌ (solo propios) |
| Crear ticket          | ❌     | ✅         | ✅                |
| Editar ticket         | ❌     | ✅         | ✅                |
| Cerrar ticket         | ❌     | ✅         | ✅                |
| Solicitar eliminación | ❌     | ✅         | ✅                |
| Aprobar eliminación   | ✅     | ❌         | ❌                |
| Ver métricas          | ✅     | ✅         | ❌                |
| Gestión de usuarios   | ✅     | ❌         | ❌                |

> ⚠️ El frontend **solo oculta o muestra acciones**. La validación real se hará en backend.

---

## 🧱 Arquitectura Frontend

```
src/
 ├─ auth/
 │   ├─ AuthContext.tsx
 │   └─ permissions.ts
 │
 ├─ pages/
 │   ├─ Login.tsx
 │   └─ Tickets/
 │       ├─ TicketList.tsx
 │       ├─ TicketView.tsx
 │       └─ TicketForm.tsx
 │
 ├─ components/
 │   └─ ProtectedRoute.tsx
 │
 ├─ api/
 │   └─ mockApi.ts
 │
 ├─ types/
 │   └─ Ticket.ts
 │
 ├─ App.tsx
 └─ main.tsx
```

---

## 🔐 Autenticación (Simulada)

* Login sin backend.
* Selección directa de rol (ADMIN / INGENIERO / TECNICO).
* El estado del usuario se guarda en **AuthContext**.

### AuthContext

* Guarda `user`, `role` y `permissions`.
* Expone `login()` y `logout()`.
* Centraliza toda la lógica de autenticación.

---

## 🛂 Rutas protegidas

* `/login` → acceso público.
* `/tickets` → solo usuarios autenticados.
* `/tickets/new` → bloqueado para ADMIN.

La protección se hace con el componente `ProtectedRoute`.

---

## 🎟️ Módulo de Tickets

### TicketList

* Lista de tickets desde mock API.
* Botón **Nuevo ticket** visible solo para INGENIERO y TECNICO.
* ADMIN no puede crear tickets.

### TicketForm

* Formulario con Formik.
* Geolocalización con OpenStreetMap (Nominatim).
* Bloqueo automático si el rol es ADMIN.

### TicketView

* Vista de detalle del ticket.
* Acciones visibles según permisos:

  * Solicitar eliminación
  * Aprobar eliminación (ADMIN)

---

## 🧪 Mock API

Mientras no hay backend:

* `getTickets()`
* `getTicketById(id)`
* `createTicket(data)`

Esto permite desarrollar toda la UI sin dependencia externa.

---

## 🧰 Tecnologías usadas

* React + TypeScript
* React Router
* Context API
* Formik
* React Bootstrap
* OpenStreetMap (geocoding inverso)

---

## 🚀 Ejecución local

```bash
npm install
npm run dev
```

La app corre por defecto en:

```
http://localhost:3000
```

---

## 🔮 Próximos pasos

* Filtrar tickets por propietario (TECNICO).
* Flujo completo de solicitud/aprobación de eliminación.
* Dashboard de métricas (fake).
* Integración con backend (JWT + roles reales).

---

## 📌 Notas finales

Este frontend está diseñado para **no rehacerse** al integrar backend.
Solo se reemplazará la capa `mockApi` por llamadas reales.

Proyecto desarrollado para **DATRA** con enfoque en buenas prácticas y escalabilidad.



ACTUALIZACION DEL DIA 17/12/25 

# Gestor de Tickets Datra

Sistema de gestión de tickets para el seguimiento y resolución de incidencias técnicas.

## 📋 Actualizaciones Recientes

### ✨ Nuevas Funcionalidades

#### 🎫 Modo Edición de Tickets
- Implementado sistema completo de edición de tickets existentes
- Carga automática de datos del ticket al entrar en modo edición
- URL: `/tickets/:id/edit`
- Formulario pre-poblado con toda la información del ticket
- Validación y actualización en tiempo real

#### 🔄 Selector de Estados
- Nuevo campo desplegable para cambiar el estado del servicio
- Estados disponibles:
  - Abierto
  - En Proceso
  - Pendiente
  - Resuelto
  - Cerrado
  - Cancelado
- Solo visible en modo edición
- Permite transiciones rápidas de estado

#### 📊 Selector de Nivel de Impacto
- Campo convertido a selector dropdown
- Niveles estandarizados:
  - Bajo
  - Medio
  - Alto
  - Crítico
- Badges con colores distintivos según el nivel

#### 🔐 Sistema de Permisos Actualizado
- **Ingeniero** ahora tiene permisos de eliminación directa
- Configuración de permisos por rol:
  - **Admin**: Control total (crear, editar, eliminar, gestionar usuarios)
  - **Ingeniero**: Crear, editar, eliminar tickets, ver métricas
  - **Técnico**: Crear y editar tickets propios

#### 🧭 Navegación Mejorada
- Botones "Volver" y "Cancelar" redirigen directamente a `/tickets`
- Eliminado comportamiento ambiguo de navegación histórica
- Flujo de usuario más intuitivo y predecible

## 🛠️ Cambios Técnicos

### Archivos Modificados

```
src/
├── pages/tickets/
│   ├── TicketForm.tsx      # Modo crear/editar unificado
│   ├── TicketView.tsx      # Navegación corregida
│   └── TicketList.tsx      # Selectores mejorados
├── contexts/
│   └── permissions.ts      # Permisos actualizados
├── hooks/
│   └── usePermissions.ts   # Hook de permisos
└── api/
    └── mockApi.ts          # Función updateTicket agregada
```

### Nuevas Funciones API

```typescript
// mockApi.ts
updateTicket(id: number, data: Partial<Ticket>)
```

### Hook de Permisos

```typescript
const { can } = usePermissions();

// Uso
can('createTicket')   // boolean
can('editTicket')     // boolean
can('approveDelete')  // boolean
```

## 🚀 Cómo Usar

### Crear un Ticket
1. Ir a la lista de tickets
2. Click en "+ Nuevo ticket"
3. Llenar el formulario
4. Click en "Guardar"

### Editar un Ticket
1. Abrir un ticket desde la lista
2. Click en "Editar"
3. Modificar los campos necesarios
4. Cambiar estado si es necesario
5. Click en "Actualizar"

### Cambiar Estado de un Ticket
1. Editar el ticket
2. Seleccionar nuevo estado del dropdown "Estado del servicio"
3. Guardar cambios

## 🔒 Matriz de Permisos

| Acción | Admin | Ingeniero | Técnico |
|--------|-------|-----------|---------|
| Ver todos los tickets | ✅ | ✅ | ❌ |
| Crear ticket | ✅ | ✅ | ✅ |
| Editar ticket | ✅ | ✅ | ✅* |
| Cerrar ticket | ✅ | ✅ | ❌ |
| Eliminar ticket | ✅ | ✅ | ❌ |
| Ver métricas | ✅ | ✅ | ❌ |
| Gestionar usuarios | ✅ | ❌ | ❌ |

*Técnicos solo pueden editar sus propios tickets

## 📦 Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 🔧 Tecnologías

- **React** 18
- **TypeScript**
- **React Router** v6
- **React Bootstrap**
- **Formik** (formularios)
- **Nominatim OSM** (geolocalización)

## 📝 Notas de Desarrollo

### Geolocalización
- Usa OpenStreetMap Nominatim para geocoding inverso
- Requiere permiso del navegador
- User-Agent configurado: `Gestor-De-Tickets-Datra`

### Estados de Tickets
Los estados están definidos en `src/constants/ticketStatus.ts` con sus respectivos colores:
- ABIERTO → primary (azul)
- EN_PROCESO → warning (amarillo)
- PENDIENTE → secondary (gris)
- RESUELTO → success (verde)
- CERRADO → dark (gris oscuro)
- CANCELADO → danger (rojo)

### Almacenamiento
Actualmente usa `localStorage` para persistencia (mockApi).

## 🐛 Resolución de Problemas

### Los cambios no se reflejan en edición
- Verificar que `enableReinitialize={true}` esté en el Formik
- Revisar que el `useEffect` esté cargando el ticket correctamente

### Permisos no funcionan
- Limpiar localStorage y volver a iniciar sesión
- Verificar rol del usuario en `AuthContext`
- Revisar configuración en `permissions.ts`

## 📄 Licencia

Este proyecto es propiedad de Datra.

---

**Última actualización**: Diciembre 2024  
**Versión**: 1.1.0  
**Desarrollador**: Carlos AM

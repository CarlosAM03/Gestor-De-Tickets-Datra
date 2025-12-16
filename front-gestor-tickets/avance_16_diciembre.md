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


📌 Gestor de Tickets – Datra
Actualizaciones recientes

Este documento resume las mejoras y correcciones realizadas en el frontend del Gestor de Tickets Datra, enfocadas principalmente en autenticación, permisos y edición de tickets.

✅ 1. Autenticación y Contexto (AuthContext)

Se unificó el uso del contexto de autenticación usando el hook:

useAuth()


Se corrigieron errores por:

Imports incorrectos

Intentar usar AuthContext sin exportarlo

Ahora el contexto expone correctamente:

user

login

register

logout

📌 Todos los componentes (Navbar, ProtectedRoute, Login, Register, Tickets) consumen el contexto de forma correcta.

🔐 2. Manejo de Roles (Permisos)

Los roles del sistema son:

admin

tecnico

⚠️ Importante:

Los roles se manejan en minúsculas, tal como están definidos en mockApi.

Se implementó una lógica reutilizable para permitir acciones a múltiples roles:

const allowedRoles = ['tecnico', 'admin'];


Ejemplo de uso:

allowedRoles.includes(user?.role ?? '')

✏️ 3. Botón Editar Ticket
📍 Ubicación

El botón Editar se encuentra en TicketView.tsx.

🧠 Lógica aplicada

Solo se muestra si:

El usuario tiene un rol permitido (tecnico o admin)

El ticket no está cerrado

const canEdit =
  ['tecnico', 'admin'].includes(user?.role ?? '') &&
  ticket.serviceStatus !== 'Cerrado';

{canEdit && (
  <Button
    variant="warning"
    onClick={() => nav(`/tickets/${ticket.id}/edit`)}
  >
    Editar
  </Button>
)}


✔ Se eliminaron botones duplicados
✔ Se corrigieron comparaciones incorrectas ("ADMIN" → 'admin')

🆕 4. Botón Nuevo Ticket

Visible solo para roles permitidos

Protegido tanto a nivel UI como a nivel vista (TicketForm)

{['tecnico', 'admin'].includes(user?.role ?? '') && (
  <Button onClick={() => nav('/tickets/new')}>
    Nuevo
  </Button>
)}

🛡️ 5. Protección de Rutas (ProtectedRoute)

Se corrigieron errores de TypeScript:

Property 'user' does not exist on type '{}'

Ahora el componente valida correctamente:

Usuario autenticado

Redirección a /login o /unauthorized según el caso

🧾 6. TicketView (TicketView.tsx)

Limpieza completa del componente

Eliminación de:

Lógica duplicada

Comparaciones inválidas

Se alineó completamente con los datos reales de mockApi

Estado final:

Código claro

Permisos correctos

Botón Editar funcional

🧪 7. Mock API (mockApi.ts)

Se agregó soporte para actualizar tickets:

updateTicket(id, payload)


Se corrigieron inconsistencias de estado y roles

Base sólida para simular backend real

🚀 Estado actual del proyecto

✔ App renderiza correctamente
✔ Login / Register funcionales
✔ Navbar estable
✔ Permisos por rol funcionando
✔ Vista de ticket estable
✔ Edición de tickets preparada (pendiente conectar TicketForm)

🔜 Próximo paso recomendado

👉 Conectar TicketForm para edición:

Detectar modo edición (/tickets/:id/edit)

Cargar datos del ticket

Guardar cambios con updateTicket

💙 Proyecto Datra – Frontend en progreso sólido
Cualquier mejora futura (roles avanzados, estados, backend real) ya tiene una base limpia para crecer.

## 📌 Notas finales

Este frontend está diseñado para **no rehacerse** al integrar backend.
Solo se reemplazará la capa `mockApi` por llamadas reales.

Proyecto desarrollado para **DATRA** con enfoque en buenas prácticas y escalabilidad.

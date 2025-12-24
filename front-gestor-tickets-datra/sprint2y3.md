
## 🟢 Sprint 2 — Autenticación, Ruteo y Core de Tickets (Estado Cerrado)

### 🎯 Objetivo del Sprint

Dejar el **frontend funcional y conectado al backend real**, cerrando completamente:

* Autenticación
* Persistencia de sesión
* Ruteo protegido por roles
* Dashboard funcional
* Core del sistema de tickets

Sin deuda técnica en arquitectura ni decisiones pendientes.

---

## ✅ Alcance completado

### 🔐 Autenticación y Sesión

* Login real contra backend (JWT)
* Almacenamiento de token en `localStorage`
* Restauración de sesión al refrescar
* Logout seguro con limpieza de estado
* Manejo global de sesión expirada (401)

**Estado:** ✔️ Cerrado

---

### 🧭 Ruteo y Protección de Rutas

* Ruteador centralizado (`AppRoutes`)
* Separación clara:

  * Rutas públicas (`/login`)
  * Rutas protegidas (`RequireAuth`)
* Layout principal con Navbar persistente
* Fallback de rutas no existentes
* Redirección post-login limpia y controlada

**Estado:** ✔️ Cerrado

---

### 👤 Roles y Permisos (Frontend)

* Roles soportados:

  * `ADMIN`
  * `INGENIERO`
  * `TECNICO`
* `RequireRole` definitivo:

  * Bloquea rutas no autorizadas
  * Redirección automática
* Menú dinámico según rol
* Navbar oculta opciones no permitidas por rol

> Las reglas críticas se validan **siempre en backend**, el frontend solo refleja permisos.

**Estado:** ✔️ Cerrado

---

### 📊 Dashboard (Conectado a Backend)

* Panel de bienvenida con datos del usuario autenticado
* Actividad reciente real:

  * Obtiene tickets desde backend
  * Muestra tickets de todos los usuarios (visión global)
* Navegación directa a detalle de ticket
* Estado vacío controlado
* Sin estilos inline (lint limpio)

**Estado:** ✔️ Cerrado

---

### 🎫 Tickets — Core del Sistema

Implementación completa del flujo base de tickets:

#### 📄 Listado de Tickets

* Conexión real al backend
* Filtros:

  * Búsqueda
  * Estado
* Visibilidad:

  * Todos los tickets (visión actual)
* Navegación a detalle

#### 🔍 Detalle de Ticket

* Carga por ID desde backend
* Visualización completa:

  * Estado
  * Prioridad
  * Descripción
  * Metadatos
* Acciones visibles según rol (UI)

#### ✏️ Crear / Editar Ticket

* Formulario real conectado a backend
* DTOs alineados con NestJS
* Modo crear / editar automático
* Manejo de errores y estados de carga

> ⚠️ Las restricciones de edición/cierre por rol se validan en backend.

**Estado:** ✔️ Implementado / 🔧 Ajustes menores documentados

---

## ⚠️ Observaciones Técnicas (Intencionalmente Diferidas)

Estos puntos **NO bloquean Sprint 2** y quedan documentados para Sprint 3:

- Ajustar scope de tickets:
  - La pestaña **Tickets** debe mostrar únicamente tickets personales
  - Aplica de igual forma para los 3 roles
- Revisar errores detectados al actualizar y crear tickets
- Ajustes finos en validaciones de UI (disabled vs hidden)
- Mensajería de errores más granular
- Paginación de listados
- Métricas avanzadas en dashboard

---

## 🧠 Estado General del Sistema

| Área                   | Estado                     |
|------------------------|----------------------------|
| Autenticación          | ✅ Cerrado                  |
| Persistencia de sesión | ✅ Cerrado                  |
| Ruteo                  | ✅ Cerrado                  |
| Roles y permisos       | ✅ Cerrado                  |
| Dashboard              | ✅ Cerrado                  |
| Tickets (core)         | ✅ Funcional (sin edición) |
| Deuda técnica          | ❌ Ninguna crítica          |

### ✔️ Aprobado

## 🚀 Conclusión del Sprint 2

> El sistema se encuentra en un **estado sólido, estable y profesional**.
> El frontend ya consume backend real, respeta autenticación, roles y ruteo, y el core del negocio (tickets) está operativo.

Sprint 2 se da por **FINALIZADO** ✅

---

# 🚀 Sprint 3 — Core de Tickets + Administración Inicial

## 📌 Contexto General

Tras el **cierre satisfactorio del Sprint 2**, el sistema cuenta ya con:

* Autenticación real con JWT
* Persistencia de sesión
* Ruteo protegido
* Roles y permisos funcionales
* Conexión real Frontend ↔ Backend
* Dashboard operativo con actividad global
* Core de tickets conectado al backend

El **Sprint 3** tiene como objetivo **consolidar el core del sistema de tickets**, alinearlo completamente con el **contrato del backend**, y preparar la base para la **administración completa del sistema en producción**, priorizando estabilidad, consistencia y experiencia de usuario.

---

## ✅ Validación de Sprint 2 (Estado Base)

Sprint 2 se considera **cerrado**, con las siguientes validaciones confirmadas:

| Área                   | Estado      |
| ---------------------- | ----------- |
| Autenticación          | ✅ Cerrado   |
| Persistencia de sesión | ✅ Cerrado   |
| Ruteo protegido        | ✅ Cerrado   |
| Roles y permisos       | ✅ Cerrado   |
| Dashboard (actividad)  | ✅ Cerrado   |
| Tickets (lectura)      | ✅ Funcional |
| Conexión Backend       | ✅ Real      |
| Deuda crítica          | ❌ Ninguna   |

### Observaciones técnicas documentadas (heredadas a Sprint 3)

Estas observaciones **no bloquean Sprint 2** y pasan a Sprint 3 como trabajo planificado:

* Ajustar scope de tickets:

  * La **lista de tickets debe ser personal (`scope=mine`) para los 3 roles**
* Resolver errores en:

  * Crear ticket
  * Actualizar ticket
* Ajustes finos de UX:

  * `disabled` vs `hidden`
* Mensajería de errores más granular
* Paginación (postergada)
* Métricas avanzadas de dashboard (postergadas)

---

## 🎯 Objetivo Principal del Sprint 3

> **Consolidar el core de tickets para uso real**, asegurando que:
>
> * El frontend respete estrictamente el contrato del backend
> * Las reglas de negocio vivan en el backend
> * El frontend refleje permisos sin duplicar lógica
> * El sistema sea estable y predecible para producción

---

## 🔐 Reglas Funcionales Clave (Contrato Backend)

Estas reglas **YA están implementadas en el backend** y el frontend debe **reflejarlas**, no re-implementarlas:

### Roles

| Rol       | Alcance                     |
| --------- | --------------------------- |
| ADMIN     | Control total del sistema   |
| TECNICO   | Tickets propios             |
| INGENIERO | Tickets globales + métricas |

### Scopes

| Vista            | Scope                          |
| ---------------- | ------------------------------ |
| Dashboard        | `scope=all`                    |
| Lista de Tickets | `scope=mine` (TODOS los roles) |

---

## 🔄 Mapa Frontend ↔ Backend (Contrato Oficial)

### Tickets

| Acción                  | Endpoint                    |
| ----------------------- | --------------------------- |
| Listar tickets propios  | `GET /tickets?scope=mine`   |
| Listar tickets globales | `GET /tickets?scope=all`    |
| Ver detalle             | `GET /tickets/:id`          |
| Crear ticket            | `POST /tickets`             |
| Editar ticket           | `PATCH /tickets/:id`        |
| Cambiar estatus         | `PATCH /tickets/:id/status` |
| Solicitar eliminación   | `DELETE /tickets/:id`       |

### Administración (ADMIN)

| Acción                         | Endpoint                                  |
| ------------------------------ | ----------------------------------------- |
| Ver solicitudes de eliminación | `GET /tickets/admin/delete-requests`      |
| Aprobar eliminación            | `PATCH /tickets/admin/:id/approve-delete` |
| Rechazar eliminación           | `PATCH /tickets/admin/:id/reject-delete`  |
| Ver historial                  | `GET /tickets/:id/history`                |

---

## 📋 Checklist Técnico — Sprint 3

### 🎫 Tickets (CORE)

* [ ] Ajustar `TicketsList` para usar siempre `scope=mine`
* [ ] Validar filtros (`status`, `search`)
* [ ] Implementar vista de detalle completa
* [ ] Corregir creación de ticket (DTO alineado al backend)
* [ ] Corregir edición de ticket
* [ ] Implementar cambio de estatus
* [ ] Solicitud de eliminación (soft delete)
* [ ] Manejo correcto de `403` (permisos)

---

### 🧹 Eliminación Controlada (ADMIN)

* [ ] Listado de solicitudes de eliminación
* [ ] Aprobación
* [ ] Rechazo
* [ ] Confirmaciones UI
* [ ] Feedback visual claro

---

### 📊 Dashboard

* [ ] Conectar a `GET /tickets?scope=all`
* [ ] Mostrar actividad reciente global
* [ ] Sin edición desde dashboard
* [ ] Preparado para métricas futuras

---

### 👤 Perfil

* [ ] Pantalla de perfil
* [ ] Información del usuario
* [ ] Sin edición (Sprint futuro)

---

### 👥 Usuarios (ADMIN – Preparación)

* [ ] Conectar listado real de usuarios
* [ ] Mostrar acciones (editar / activar / desactivar)
* [ ] Acciones deshabilitadas (documentadas como Sprint futuro)

---

## 🧭 Orden Exacto de Implementación

Para evitar saturación y mantener estabilidad:

1. **TicketsList (scope correcto)**
2. **TicketDetail (lectura + permisos UI)**
3. **TicketForm (crear / editar sin errores)**
4. **Soft Delete + flujo ADMIN**
5. **Dashboard final**
6. **Perfil**
7. **Preparación Usuarios ADMIN**

---

## 🧠 Criterios de Aceptación del Sprint 3

El Sprint 3 se considera **cerrado** cuando:

* El core de tickets funciona sin errores
* El frontend respeta completamente el contrato backend
* Los permisos se reflejan correctamente por rol
* No hay validaciones duplicadas innecesarias
* El sistema es usable de extremo a extremo

---

## 🏁 Estado Esperado al Final del Sprint 3

| Área                | Estado        |
| ------------------- | ------------- |
| Core de tickets     | ✅ Cerrado     |
| Dashboard           | ✅ Consolidado |
| Soft delete         | ✅ Operativo   |
| Administración base | 🟡 Preparada  |
| UX base             | ✅ Profesional |
| Producción-ready    | 🟡 Parcial    |

---

## 🔜 Lo que queda para Sprint 4

* Paginación
* Métricas avanzadas
* Edición de perfil
* Gestión completa de usuarios
* Normalización de respuestas
* Auditoría avanzada

---

### ✅ Conclusión

Sprint 3 es el **sprint de consolidación técnica**.
No se agregan features innecesarias, se **fortalece lo ya construido**, alineado a reglas reales de negocio y preparado para escalar.


# 📄 Checklist técnico por archivo frontend (Sprint 3)

Este checklist **no es teórico**: cada punto existe porque el backend **ya lo soporta**.

---

## 🔐 Autenticación / Contexto (SOLO REFERENCIA)

### `/auth/AuthProvider.tsx`

* [ ] **NO tocar lógica base**
* [ ] Mantener token en `localStorage`
* [ ] User restaurado desde login (Sprint 2 ya OK)
* [ ] Preparar para `/auth/me` (Sprint futuro)

---

### `/auth/RequireAuth.tsx`

* [ ] Proteger TODAS las rutas privadas
* [ ] Redirección correcta a `/login`
* [ ] Mantener `state.from`

---

### `/auth/RequireRole.tsx`

* [ ] Usar solo para:

  * Admin sections
* [ ] **NO usar para reglas finas de tickets**
* [ ] Backend manda `403` → frontend refleja

---

## 🎫 Tickets — CORE DEL SPRINT 3

---

### `/api/tickets.api.ts`

* [ ] `getTickets({ scope })`
* [ ] `getTicketById(id)`
* [ ] `createTicket(payload)`
* [ ] `updateTicket(id, payload)`
* [ ] `updateTicketStatus(id, status)`
* [ ] `requestTicketDeletion(id)`

⚠️ **NO agregar lógica aquí**
Solo transporte HTTP.

---

### `/pages/Tickets/TicketsList.tsx`

* [ ] `scope = 'mine'` **SIEMPRE**
* [ ] Eliminar excepciones por rol
* [ ] Mostrar solo tickets del usuario
* [ ] Filtros:

  * status
  * search
* [ ] Navegar a:

  * `/tickets/:id`
  * `/tickets/new`

---

### `/pages/Tickets/TicketDetail.tsx` *(si no existe → crear)*

* [ ] `getTicketById(id)`
* [ ] Mostrar info completa
* [ ] Botones:

  * Editar
  * Cambiar estatus
  * Solicitar eliminación
* [ ] Deshabilitar botones según rol
* [ ] Manejar `403` del backend

---

### `/pages/Tickets/TicketForm.tsx`

* [ ] Alinear DTO **REAL del backend**
* [ ] Usar SOLO campos Sprint 3
* [ ] Crear y editar sin errores
* [ ] Manejo correcto de loading / error
* [ ] Redirecciones limpias

---

## 🧹 Eliminación Controlada

### `/pages/Tickets/DeleteRequests.tsx` (ADMIN)

* [ ] `GET /tickets/admin/delete-requests`
* [ ] Listado claro
* [ ] Acciones:

  * Approve
  * Reject
* [ ] Confirmaciones UI

---

## 📊 Dashboard

### `/pages/Dashboard/Dashboard.tsx`

* [ ] `getTickets({ scope: 'all' })`
* [ ] Mostrar últimos N tickets
* [ ] No editar desde dashboard
* [ ] No paginación aún

---

## 👤 Perfil

### `/pages/Profile/Profile.tsx`

* [ ] Mostrar info del usuario
* [ ] Sin edición
* [ ] Acceso todos los roles

---

## 👥 Usuarios (ADMIN – PREPARACIÓN)

### `/pages/Users/Users.tsx`

* [ ] Conectar lista real
* [ ] Acciones visibles pero deshabilitadas
* [ ] Tooltip “Sprint futuro”

---

# 🔄 2️⃣ Mapa Exacto Front ↔ Backend (Contrato Real)

---

## 🔐 Auth

| Front            | Backend            |
| ---------------- | ------------------ |
| Login            | `POST /auth/login` |
| Token persistido | JWT                |
| Usuario          | JWT payload        |

---

## 🎫 Tickets

### Listar

```http
GET /tickets?scope=mine
GET /tickets?scope=all
```

| Vista     | Scope |
| --------- | ----- |
| Dashboard | all   |
| Tickets   | mine  |

---

### Detalle

```http
GET /tickets/:id
```

---

### Crear

```http
POST /tickets
```

**Payload Sprint 3**

```ts
{
  requestedBy: string
  contact: string
  serviceAffected: string
  problemDesc: string
  impactLevel: 'LOW' | 'MEDIUM' | 'HIGH'
}
```

---

### Editar

```http
PATCH /tickets/:id
```

---

### Cambiar estatus

```http
PATCH /tickets/:id/status
```

---

### Solicitar eliminación

```http
DELETE /tickets/:id
```

---

## 🧹 Admin

### Solicitudes

```http
GET /tickets/admin/delete-requests
```

### Aprobar

```http
PATCH /tickets/admin/:id/approve-delete
```

### Rechazar

```http
PATCH /tickets/admin/:id/reject-delete
```

---

## 📜 Historial

```http
GET /tickets/:id/history
```

(Admin only)

---

# 🧭 Flujo de Trabajo Recomendado — Sprint 3

Esto es **clave para no saturarte**.

 **spoiler** me sature

---

# ✅ Sprint 3 — Día 4 FINALIZADO / Parcialmente

**Estado actualizado del checklist y flujo real**

---

## 📌 Estado Real al Cierre del Día 4

> En **2 días efectivos de trabajo**, el sistema avanzó **hasta el alcance planteado para Día 4**, incluyendo:
>
> * Soft delete funcional desde TicketEdit falta ajustar opciones en TicketList
> * Flujo ADMIN integrado en lista de tickets pendiente terminar implementacion de soft delete
> * TicketView estructuralmente completo y con diseño prodesional brandeado
> * Edición y cambio de estatus operativos
>
> Quedan **ajustes de permisos UI y refinamiento visual**, no bloqueantes.

---

## 🧩 Estado por Día — Ajustado a la Realidad

---

### ✅ Día 1 — COMPLETADO

**Objetivo:** Ajustar lectura base sin romper nada

✔️ `TicketsList` usa `scope=mine`
✔️ Lectura estable sin errores
✔️ Navegación correcta a detalle
✔️ Backend respetado sin lógica duplicada

**Estado:** 🟢 Cerrado

---

### ✅ Día 2 — COMPLETADO

**Objetivo:** Vista de ticket sólida

✔️ `TicketView.tsx` creado
✔️ Carga por ID desde backend
✔️ Visualización completa del ticket
⚠️ Pendiente: Acciones estructuradas (estatus / eliminar)
⚠️ Pendiente: ocultar / deshabilitar botones por rol (UI)

**Estado:** 🟢 Funcional / 🔧 Ajustes UI pendientes

---

### ✅ Día 3 — COMPLETADO

**Objetivo:** Crear y editar tickets sin romper contrato

✔️ `TicketForm` operativo en create / edit
✔️ Integración de **cliente embebido** en ticket
✔️ DTO alineado al backend
✔️ Validaciones mínimas funcionales
✔️ Redirecciones limpias

⚠️ Pendiente:

* Bloqueo de opciones por rol (frontend)
* Refinar UX de formularios 

**Estado:** 🟢 Funcional / 🔧 Refinamiento pendiente

---

### ✅ Día 4 — COMPLETADO (con criterio ajustado)

**Objetivo:** Soft delete + flujo ADMIN

✔️ Solicitud de eliminación (`DELETE /tickets/:id`)
✔️ Flag `deleteRequested` reflejado en UI
✔️ Opciones de eliminación visibles en lista
🟡 Flujo ADMIN funcional desde **formulario de edicion** pendiente en **ticketlist**
✔️ Aprobación / rechazo operativos desde backend

🟡 **Decisión técnica correcta aplicada:**

> ❗ **NO se creó aún una vista separada de DeleteRequests**,
> porque el backend permite que el ADMIN vea todas las solicitudes directamente en su lista.

✔️ Esto es **válido**, **eficiente** y **alineado al contrato backend**.

⚠️ Pendiente:

* Limitar visualización estricta por rol (ADMIN)
* Refinar etiquetas visuales de estado (verificar con estilos actuales)

---

## ⚠️ Incidencia Conocida — Documentada

### 🧩 `TicketEditStatus.tsx`

* VS Code muestra error de tipos / lint
* **NO afecta ejecución**
* Cambio de estatus funciona correctamente
* Payload enviado y procesado sin errores
* UI estable

📌 **Decisión correcta:**

> El error se documenta y se corrige en fase de limpieza, **no bloquea Sprint 3**.

---

## 📋 Checklist Sprint 3 — Estado Actualizado

### 🎫 Tickets (CORE)

| Tarea                                | Estado |
| ------------------------------------ | ------ |
| Ajustar `TicketsList` (`scope=mine`) | ✅      |
| Filtros (`status`, `search`)         | 🟡     |
| `TicketView` completa                | 🟡     |
| Crear ticket (DTO real)              | ✅      |
| Editar ticket                        | ✅      |
| Cambio de estatus                    | ✅      |
| Soft delete                          | 🟡     |
| Manejo `403`                         | 🟡     |

---

### 🧹 Eliminación Controlada (ADMIN)

| Tarea                 | Estado |
| --------------------- | ------ |
| Solicitud eliminación | ✅     |
| Aprobación            | 🟡 pendiente en ticketlist |
| Rechazo               | 🟡 pendiente en ticketlist |
| Visibilidad por rol   | 🟡     |
| Feedback visual       | 🟡     |

---

### 📊 Dashboard

| Tarea              | Estado |
| ------------------ | ------ |
| `scope=all`        | ✅     |
| Actividad reciente | 🟡      |
| Sin edición        | ⏳      |

---

## 🧭 Plan Ajustado — Día 5

### 🎯 Día 5 — Dashboard Final + Limpieza

**Objetivos claros:**

* Dashboard final con `scope=all`
* Actividad reciente limpia
* Filtros finos
* Ajustes visuales:

  * Formularios
  * TicketView
  * TicketsList
* Resolver:

  * Error de `TicketEditStatus.tsx`
  * Ocultamiento de acciones por rol
* Limpieza general (nombres, warnings, UX)

📌 **NO se agregan features nuevas**

---

## 🧠 Estado General del Sprint 3 (Hoy)

| Área            | Estado       |
| --------------- | ------------ |
| Core de tickets | 🟢 Operativo |
| Soft delete     | 🟢 Funcional |
| Flujo ADMIN     | 🟢 Funcional |
| Permisos UI     | 🟡 Pendiente |
| Dashboard       | ⏳            |
| UX final        | ⏳            |

---

## ✅ Conclusión

> El avance real **supera lo esperado para Día 4**.
> El sistema **ya es usable de extremo a extremo** para creación, edición, estatus y eliminación de tickets.
>
> Lo que queda es **pulido**, no arquitectura ni lógica crítica.

Sprint 3 está **bien encaminado**, sin deuda peligrosa y con un **Día 5 ahora dia 3 perfectamente claro y controlado**.


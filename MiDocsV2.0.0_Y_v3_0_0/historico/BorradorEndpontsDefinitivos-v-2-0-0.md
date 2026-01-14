**Validación Prisma (1 oración):**
✅ **Está bien**: el esquema ahora cumple estrictamente la regla de *NO DELETE*, usa desactivación por estado (`active` + `deactivatedAt`) de forma consistente y es coherente con auditoría y dominio v2.0.0.

---

# 📐 Endpoints v2.0.0 Definitivos (Contratos de Dominio)

> Estos endpoints **reemplazan o refactorizan** los actuales y son los **únicos permitidos** para migrar el esquema Prisma v2.0.0.
> No existen deletes, no existen cambios genéricos de estado, no existen atajos administrativos.

---

## 🔐 Autenticación (sin cambios)

### `POST /auth/login`

* Autenticación JWT
* **Sin impacto en dominio**
* **Se mantiene igual**

---

## 👤 Usuarios (User Aggregate)

### `POST /users`

**Crear usuario**

* Crea usuario con `active=true`
* Registra `createdAt`
* No existe delete

---

### `GET /users`

**Listar usuarios activos**

* Devuelve solo `active=true`
* Filtro opcional por rol

---

### `GET /users/:id`

**Detalle de usuario**

* Lectura pura
* Incluye estado (`active`, `deactivatedAt`)

---

### `PATCH /users/:id`

**Actualizar datos del usuario**

* Campos permitidos: `name`, `role`
* No modifica estado

---

### `PATCH /users/:id/deactivate`

**Desactivar usuario**

* Setea `active=false`
* Setea `deactivatedAt`
* No elimina registros
* Acción auditable

---

### 🚫 Eliminado definitivamente

* `DELETE /users/:id`

---

## 🏢 Clientes (Client Aggregate)

### `POST /clients`

**Crear cliente**

* `active=true` por defecto

---

### `GET /clients`

**Listar clientes activos**

* No muestra clientes desactivados

---

### `GET /clients/:rfc`

**Detalle de cliente**

---

### `PATCH /clients/:rfc`

**Actualizar datos del cliente**

* Campos informativos únicamente

---

### `PATCH /clients/:rfc/deactivate`

**Desactivar cliente**

* Setea `active=false`
* Setea `deactivatedAt`
* Impacta visibilidad, no borra tickets históricos

---

## 📄 Contratos de Servicio (ServiceContract Aggregate)

### `POST /service-contracts`

**Crear contrato**

* Asociado a cliente activo

---

### `GET /service-contracts`

**Listar contratos activos**

---

### `PATCH /service-contracts/:id`

**Actualizar SLA / prioridad**

* No permite cambiar cliente

---

### `PATCH /service-contracts/:id/deactivate`

**Desactivar contrato**

* No elimina
* Tickets históricos permanecen válidos

---

## 🎫 Tickets (Ticket Aggregate – Core)

### `POST /tickets`

**Crear ticket**

* Estado inicial: `OPEN`
* Genera evento `CREATED`
* Registra `openedAt`

---

### `GET /tickets`

**Listar tickets**

* Filtros por:

  * estado
  * cliente
  * contrato
  * rango de fechas

---

### `GET /tickets/:id`

**Detalle de ticket**

* Incluye estado actual + metadatos

---

### `PATCH /tickets/:id`

**Actualizar información no estructural**

* Permitido:

  * `problemDescription`
  * `eventLocation`
* Genera evento `UPDATED`
* ❌ No cambia estado

---

### `POST /tickets/:id/resolve`

**Resolver ticket**

* `OPEN → RESOLVED`
* Setea `resolvedAt`
* Genera evento `STATUS_CHANGED`

---

### `POST /tickets/:id/close`

**Cerrar ticket**

* `RESOLVED → CLOSED`
* Setea `closedAt`
* Requiere usuario
* Genera evento `CLOSED`

---

### `POST /tickets/:id/cancel`

**Cancelar ticket**

* `OPEN → CANCELLED`
* Setea `cancelledAt`
* Genera evento `CANCELLED`

---

### 🚫 Eliminado definitivamente

* `PATCH /tickets/:id/status`
* `DELETE /tickets/:id`
* Todo flujo admin de delete

---

## 📜 Historial / Auditoría (TicketHistory)

### `GET /tickets/:id/history`

**Historial completo del ticket**

* Fuente única de verdad
* No modificable
* Base de KPIs y auditoría

---


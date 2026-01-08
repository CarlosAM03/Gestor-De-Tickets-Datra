
---

# 📎 APÉNDICE — CONTRATO DE INTEGRACIÓN FRONTEND 1:1

**Gestor de Tickets DATRA — v2.0.0**

> Este apéndice define **exactamente** cómo el frontend debe integrarse con el backend.
> No amplía reglas de dominio.
> No permite interpretación.
> No habilita shortcuts.

---

## 0️⃣ Principio rector de integración

> **El frontend es un consumidor pasivo y declarativo.**

El frontend:

* ❌ No decide estados
* ❌ No valida reglas de dominio
* ❌ No reconstruye lógica
* ❌ No corrige respuestas
* ✅ Solicita acciones explícitas
* ✅ Renderiza datos **tal como vienen**
* ✅ Maneja errores **sin reinterpretarlos**

📌 Cualquier inconsistencia → bug de frontend
📌 Cualquier rechazo → comportamiento esperado del backend

---

## 1️⃣ Autenticación (obligatoria)

### Header requerido

```http
Authorization: Bearer <JWT>
```

📌 Obligatorio en **todos los endpoints**, excepto `/auth/login`
📌 Tokens inválidos o ausentes → `401 Unauthorized`

---

## 2️⃣ Convenciones de respuesta (NO NEGOCIABLES)

### Éxito

```json
{
  "data": {},
  "meta": {
    "timestamp": "2026-01-07T01:30:00Z"
  }
}
```

### Error

```json
{
  "error": {
    "code": "InvalidTicketState",
    "message": "El ticket no puede resolverse en su estado actual"
  }
}
```

📌 El frontend **NO traduce** códigos de error
📌 El frontend **NO asume estados futuros**

---

## 3️⃣ Mapeo oficial Dominio → HTTP

| Error de Dominio        | HTTP |
| ----------------------- | ---- |
| Unauthorized            | 401  |
| ForbiddenAction         | 403  |
| NotFound                | 404  |
| InvalidTicketState      | 409  |
| TicketImmutable         | 409  |
| ValidationError         | 422  |
| ServiceContractInactive | 422  |

📌 El frontend **solo consume** este mapeo
📌 El dominio **no conoce HTTP**

---

## 🔐 4️⃣ Autenticación

### `POST /auth/login`

✔️ **Endpoint único de inicio de sesión**
✔️ No existe registro público

**Response**

```json
{
  "data": {
    "accessToken": "jwt-token",
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "role": "TECNICO"
    }
  }
}
```

📌 El frontend **no infiere permisos**
📌 El rol solo se usa para UI condicional

---

## 👤 5️⃣ Usuarios (ADMIN-only)

📌 El frontend **no asume** que puede crear usuarios
📌 La UI debe ocultar acciones no autorizadas

Endpoints permitidos:

* `POST /users`
* `GET /users`
* `GET /users/:id`
* `PATCH /users/:id`
* `PATCH /users/:id/deactivate`

📌 **No existe DELETE**

---

## 🏢 6️⃣ Clientes

Endpoints soportados:

* `POST /clients`
* `GET /clients`
* `GET /clients/:rfc`
* `PATCH /clients/:rfc`
* `PATCH /clients/:rfc/deactivate`

📌 `rfc` es **ID canónico**
📌 Clientes desactivados **no se eliminan**

---

## 📄 7️⃣ Contratos de Servicio

Endpoints:

* `POST /service-contracts`
* `GET /service-contracts`
* `PATCH /service-contracts/:id`
* `PATCH /service-contracts/:id/deactivate`

📌 `name` es un **enum cerrado**
📌 El frontend **no puede enviar strings libres**

---

## 🎫 8️⃣ Tickets (CORE — integración estricta)

### Crear ticket

`POST /tickets`

📌 El frontend **NO envía estado**
📌 El backend asigna:

* `status = OPEN`
* `openedAt`
* Evento `CREATED`

---

### Actualizar ticket (NO cambia estado)

`PATCH /tickets/:id`

Campos permitidos:

* `problemDescription`
* `eventLocation`
* `impactLevel`

📌 Si el estado es terminal → `TicketImmutable`

---

### Resolver ticket

`POST /tickets/:id/resolve`

📌 El frontend **solicita acción**, no transición
📌 Estado válido: `OPEN`

---

### Cerrar ticket

`POST /tickets/:id/close`

📌 Estado requerido: `RESOLVED`

---

### Cancelar ticket

`POST /tickets/:id/cancel`

📌 Motivo obligatorio
📌 Estado ≠ `CLOSED`

---

## 📜 9️⃣ Historial (solo lectura)

`GET /tickets/:id/history`

📌 El frontend:

* No edita
* No recalcula
* No agrupa
* No corrige

📌 El historial **es la verdad**

---

## 🚫 🔒 10️⃣ Endpoints que NO EXISTEN

El frontend **NO debe asumir ni simular**:

* `DELETE /tickets/*`
* `PATCH /tickets/:id/status`
* Reapertura de tickets
* Corrección de timestamps
* Edición de historial

---

## 🧩 11️⃣ Relación directa con Prisma

| Concepto API | Prisma                     |
| ------------ | -------------------------- |
| `status`     | `Ticket.status`            |
| Historial    | `TicketHistory`            |
| Rol          | `User.role`                |
| Cliente      | `Client.rfc`               |
| SLA          | `ServiceContract.slaHours` |

📌 El frontend **no deriva** datos no expuestos
📌 El backend **no expone** campos innecesarios

---

## 🔒 Estado del Apéndice

✔️ Alineado con Contrato Backend v2.0.0
✔️ Alineado con Prisma Schema v2.0.0
✔️ Endpoints cerrados
✔️ Payloads definidos
✔️ Sin ambigüedad funcional

📌 Cambios → **v3.0.0**

---


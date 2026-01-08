Perfecto. A continuación te entrego el **CONTRATO DE ENDPOINTS COMPLETO, DEPURADO Y 100 % ALINEADO** con:

* Dominio v2.0.0
* Contrato Backend v2.0.0
* Apéndice Frontend 1:1
* Prisma Schema v2.0.0

👉 **Este documento ya no es borrador**.
👉 Es **copiable, publicable y congelable**.

---

# 🌐 CONTRATO DE ENDPOINTS — GESTOR DE TICKETS DATRA

**Versión:** v2.0.0
**Estado:** 🔒 CONGELADO
**Autoridad:** Backend
**Frontend:** Consumidor pasivo
**Ámbito:** Integración Frontend 1:1

---

## 0️⃣ Convenciones Globales (OBLIGATORIAS)

### 🔐 Autenticación

Header requerido en **todos** los endpoints, excepto `/auth/login`:

```http
Authorization: Bearer <JWT>
```

---

### 📦 Formato de respuesta estándar

#### ✅ Éxito

```json
{
  "data": {},
  "meta": {
    "timestamp": "2026-01-07T01:30:00Z"
  }
}
```

#### ❌ Error

```json
{
  "error": {
    "code": "InvalidTicketState",
    "message": "El ticket no puede resolverse en su estado actual"
  }
}
```

📌 El frontend **NO traduce** códigos
📌 El frontend **NO asume lógica**

---

### 🔁 Mapeo Error Dominio → HTTP

| Error Dominio           | HTTP |
| ----------------------- | ---- |
| Unauthorized            | 401  |
| ForbiddenAction         | 403  |
| NotFound                | 404  |
| InvalidTicketState      | 409  |
| TicketImmutable         | 409  |
| ValidationError         | 422  |
| ServiceContractInactive | 422  |

📌 El dominio **no conoce HTTP**

---

## 🔐 1️⃣ Autenticación

### `POST /auth/login`

**Request**

```json
{
  "email": "user@datra.com",
  "password": "string"
}
```

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

📌 No existe registro público
📌 Login es **solo inicio de sesión**

---

## 👤 2️⃣ Usuarios (ADMIN)

> Gestión **administrativa**, no operativa

### `POST /users` (ADMIN)

```json
{
  "name": "Ana López",
  "email": "ana@datra.com",
  "password": "string",
  "role": "TECNICO"
}
```

**Efectos**

* `active = true`
* Registro auditable

---

### `GET /users`

```http
GET /users?role=TECNICO
```

---

### `GET /users/:id`

---

### `PATCH /users/:id`

```json
{
  "name": "Ana López García",
  "role": "INGENIERO"
}
```

---

### `PATCH /users/:id/deactivate`

```json
{
  "reason": "Baja administrativa"
}
```

**Efectos**

* `active = false`
* `deactivatedAt = now()`

❌ No existe DELETE

---

## 🏢 3️⃣ Clientes

### `POST /clients` (ADMIN)

```json
{
  "rfc": "DAT123456789",
  "clientNumber": "CL-0001",
  "companyName": "Datra SA de CV",
  "location": "CDMX"
}
```

---

### `GET /clients`

---

### `GET /clients/:rfc`

---

### `PATCH /clients/:rfc`

```json
{
  "companyName": "Datra Telecom"
}
```

---

### `PATCH /clients/:rfc/deactivate`

```json
{
  "reason": "Cliente inactivo"
}
```

📌 Clientes **no se eliminan**

---

## 📄 4️⃣ Contratos de Servicio

### `POST /service-contracts` (ADMIN)

```json
{
  "clientRfc": "DAT123456789",
  "name": "INTERNET_DEDICADO_1_GB",
  "priorityLevel": 1,
  "slaHours": 4
}
```

📌 `name` es enum cerrado

---

### `GET /service-contracts`

---

### `PATCH /service-contracts/:id`

```json
{
  "priorityLevel": 2,
  "slaHours": 8
}
```

---

### `PATCH /service-contracts/:id/deactivate`

```json
{
  "reason": "Contrato vencido"
}
```

---

## 🎫 5️⃣ Tickets (CORE)

### `POST /tickets`

```json
{
  "clientRfc": "DAT123456789",
  "serviceContractId": 3,
  "impactLevel": "HIGH",
  "problemDescription": "Intermitencia en enlace",
  "eventLocation": "Sucursal Norte"
}
```

**Efectos**

* `status = OPEN`
* `openedAt = now()`
* Evento `CREATED`

📌 El frontend **no envía estado**

---

### `GET /tickets`

```http
GET /tickets?status=OPEN&clientRfc=DAT123456789
```

---

### `GET /tickets/:id`

---

### `PATCH /tickets/:id`

**Permitido solo si estado ≠ `CLOSED`, `CANCELLED`**

```json
{
  "problemDescription": "Intermitencia total",
  "eventLocation": "Sucursal Norte",
  "impactLevel": "CRITICAL"
}
```

**Evento**

* `UPDATED`

📌 ❌ No cambia estado

---

### `POST /tickets/:id/resolve`

```json
{
  "initialFindings": "Falla en CPE",
  "actionsTaken": "Equipo reiniciado"
}
```

**Transición**

```
OPEN → RESOLVED
```

**Evento**

* `STATUS_CHANGED`

---

### `POST /tickets/:id/close`

```json
{
  "additionalNotes": "Validado con cliente"
}
```

**Transición**

```
RESOLVED → CLOSED
```

**Evento**

* `CLOSED`

---

### `POST /tickets/:id/cancel` (ADMIN)

```json
{
  "reason": "Ticket duplicado"
}
```

**Transiciones**

```
OPEN → CANCELLED
RESOLVED → CANCELLED
```

**Evento**

* `CANCELLED`

---

## 📜 6️⃣ Historial (READ-ONLY)

### `GET /tickets/:id/history`

```json
{
  "data": [
    {
      "eventType": "CREATED",
      "fromStatus": null,
      "toStatus": "OPEN",
      "performedById": 3,
      "metadata": {},
      "createdAt": "2026-01-07T01:00:00Z"
    }
  ]
}
```

📌 El frontend **no modifica ni recalcula**

---

## 🚫 7️⃣ Endpoints que NO EXISTEN

❌ `DELETE /users/*`
❌ `DELETE /clients/*`
❌ `DELETE /tickets/*`
❌ `PATCH /tickets/:id/status`
❌ Reapertura de tickets
❌ Edición de historial

---

## 🔗 8️⃣ Alineación directa con Prisma

| API           | Prisma                     |
| ------------- | -------------------------- |
| Ticket.status | `TicketStatus`             |
| Historial     | `TicketHistory`            |
| SLA           | `ServiceContract.slaHours` |
| Rol           | `User.role`                |
| Cliente       | `Client.rfc`               |

📌 No hay campos “fantasma”
📌 No hay lógica duplicada

---

## 🔒 Estado del Contrato

✔️ Endpoints cerrados
✔️ Payloads alineados a dominio
✔️ Estados protegidos
✔️ Historial obligatorio
✔️ Compatible con auditoría y KPIs reales
✔️ Preparado para frontend productivo

📌 **CONTRATO DE ENDPOINTS CONGELADO — v2.0.0**
📌 Cambios → **v3.0.0**

---

##Estado de implementacion actual
---
| Componente             | Estado      |
| ---------------------- | ----------- |
| Prisma Schema v2.0.0   | ✅ Cerrado   |
| Contratos de Dominio   | ✅ Cerrados  |
| Contratos de Endpoints | ✅ Cerrados  |
| Servicios principales  | 🟡 Parcial   |
| Controladores          | ⏳ Pendiente |
| TicketHistory          | ⏳ Pendiente |
| ServiceContracts       | ⏳ Pendiente |
| AdminImportClients     | ⏳ Pendiente |
| Módulos NestJS         | ⏳ Pendiente |

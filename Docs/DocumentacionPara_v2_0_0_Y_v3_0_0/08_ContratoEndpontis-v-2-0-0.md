
---

## 0️⃣ Convenciones Globales (OBLIGATORIAS)

### Autenticación

* Header requerido en todos los endpoints (excepto login):

```http
Authorization: Bearer <JWT>
```

---

### Formato de respuesta estándar

#### Éxito

```json
{
  "data": {},
  "meta": {
    "timestamp": "2026-01-07T01:30:00Z"
  }
}
```

#### Error

```json
{
  "error": {
    "code": "InvalidTicketState",
    "message": "El ticket no puede resolverse en su estado actual"
  }
}
```

---

### Mapeo de errores de dominio → HTTP

| Error de Dominio        | HTTP |
| ----------------------- | ---- |
| Unauthorized            | 401  |
| ForbiddenAction         | 403  |
| NotFound                | 404  |
| InvalidTicketState      | 409  |
| TicketImmutable         | 409  |
| ValidationError         | 422  |
| ServiceContractInactive | 422  |

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

---

## 👤 2️⃣ Usuarios

### `POST /users`

**Request**

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

**Query params**

```
?role=TECNICO
```

**Response**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Ana López",
      "email": "ana@datra.com",
      "role": "TECNICO",
      "active": true
    }
  ]
}
```

---

### `GET /users/:id`

**Response**

```json
{
  "data": {
    "id": 1,
    "name": "Ana López",
    "email": "ana@datra.com",
    "role": "TECNICO",
    "active": true,
    "deactivatedAt": null
  }
}
```

---

### `PATCH /users/:id`

**Request**

```json
{
  "name": "Ana López García",
  "role": "INGENIERO"
}
```

---

### `PATCH /users/:id/deactivate`

**Request**

```json
{
  "reason": "Baja administrativa"
}
```

**Efectos**

* `active = false`
* `deactivatedAt = now()`

---

## 🏢 3️⃣ Clientes

### `POST /clients`

**Request**

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

**Response**

```json
{
  "data": [
    {
      "rfc": "DAT123456789",
      "companyName": "Datra SA de CV",
      "active": true
    }
  ]
}
```

---

### `GET /clients/:rfc`

---

### `PATCH /clients/:rfc`

**Request**

```json
{
  "companyName": "Datra Telecom"
}
```

---

### `PATCH /clients/:rfc/deactivate`

**Request**

```json
{
  "reason": "Cliente inactivo"
}
```

---

## 📄 4️⃣ Contratos de Servicio

### `POST /service-contracts`

**Request**

```json
{
  "clientRfc": "DAT123456789",
  "name": "INTERNET_DEDICADO_1_GB",
  "priorityLevel": 1,
  "slaHours": 4
}
```

---

### `GET /service-contracts`

---

### `PATCH /service-contracts/:id`

**Request**

```json
{
  "priorityLevel": 2,
  "slaHours": 8
}
```

---

### `PATCH /service-contracts/:id/deactivate`

**Request**

```json
{
  "reason": "Contrato vencido"
}
```

---

## 🎫 5️⃣ Tickets (CORE)

### `POST /tickets`

**Request**

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
* Evento `CREATED`

---

### `GET /tickets`

**Query params**

```
?status=OPEN&clientRfc=DAT123456789
```

---

### `GET /tickets/:id`

---

### `PATCH /tickets/:id`

**Permitido solo si estado ≠ CLOSED, CANCELLED**

**Request**

```json
{
  "problemDescription": "Intermitencia total",
  "eventLocation": "Sucursal Norte"
}
```

**Evento:** `UPDATED`

---

### `POST /tickets/:id/resolve`

**Request**

```json
{
  "diagnosis": "Falla en CPE",
  "resolutionNotes": "Equipo reiniciado"
}
```

**Transición**

```
OPEN → RESOLVED
```

---

### `POST /tickets/:id/close`

**Request**

```json
{
  "closureNotes": "Validado con cliente"
}
```

**Transición**

```
RESOLVED → CLOSED
```

---

### `POST /tickets/:id/cancel`

**Request**

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

---

## 📜 6️⃣ Historial

### `GET /tickets/:id/history`

**Response**

```json
{
  "data": [
    {
      "eventType": "CREATED",
      "fromStatus": null,
      "toStatus": "OPEN",
      "createdAt": "2026-01-07T01:00:00Z"
    }
  ]
}
```

---

## 🚫 7️⃣ Endpoints prohibidos (NO EXISTEN)

* `DELETE /users/*`
* `DELETE /clients/*`
* `DELETE /tickets/*`
* `PATCH /tickets/:id/status`
* Cualquier cambio directo de estado

---

## 🔒 Estado del contrato

✔️ Endpoints cerrados
✔️ Payloads definidos
✔️ Errores mapeados
✔️ Alineado con Prisma v2.0.0
✔️ Compatible con auditoría, KPIs y operación real

---


---

# 📎 APÉNDICE — CONTRATO DE INTEGRACIÓN FRONTEND 1:1

**Gestor de Tickets DATRA — v2.0.0 (FINAL / CONGELADO)**

> Este apéndice define **exactamente** cómo el frontend se integra con el backend.
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
📌 Token inválido o ausente → `401 Unauthorized`

---

## 2️⃣ Convenciones de respuesta (ALINEADAS A IMPLEMENTACIÓN REAL)

📌 **NO existe un wrapper universal obligatorio (`data/meta`) en v2.0.0**
📌 El contrato válido es **el payload real de cada endpoint**

### Respuestas exitosas

El frontend debe **consumir exactamente** el payload retornado por el backend.

Ejemplo (`/auth/login`):

```json
{
  "message": "Login exitoso",
  "access_token": "jwt-token",
  "expires_in": "3600s",
  "user": {
    "id": "uuid",
    "name": "Juan Pérez",
    "email": "admin@datra.mx",
    "role": "ADMIN"
  }
}
```

### Errores de dominio

```json
{
  "message": "El ticket no puede resolverse en su estado actual",
  "code": "InvalidTicketState"
}
```

📌 El frontend **NO traduce códigos de error**
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

✔️ Endpoint único de inicio de sesión
✔️ No existe registro público

📌 El frontend **no infiere permisos**
📌 El rol solo se usa para **UI condicional**, nunca para lógica

---

## 👤 5️⃣ Usuarios (ADMIN-only)

📌 El frontend **no asume** que puede crear usuarios
📌 La UI debe ocultar acciones no autorizadas

Endpoints existentes:

* `POST /users`
* `GET /users`
* `GET /users/:id`
* `PATCH /users/me`
* `PATCH /users/:id`
* `PATCH /users/:id/deactivate`

📌 **No existe DELETE**

---

## 🏢 6️⃣ Clientes

Endpoints existentes:

* `GET /clients`
* `GET /clients/:rfc`
* `PATCH /clients/:rfc/activate`
* `PATCH /clients/:rfc/deactivate`

📌 `rfc` es **ID canónico**
📌 Clientes desactivados **no se eliminan**

📌 Aunque existen endpoints administrativos, el frontend operativo solo los expone bajo flujos explícitos autorizados.

---

## 📄 7️⃣ Contratos de Servicio

Endpoints:

* `POST /service-contracts`
* `GET /service-contracts`
* `GET /service-contracts/client/:rfc`
* `GET /service-contracts/:id`
* `PATCH /service-contracts/:id`
* `PATCH /service-contracts/:id/deactivate`

📌 `name` es un **enum cerrado**
📌 El frontend **NO envía strings libres**

---

## 🎫 8️⃣ Tickets (CORE — integración estricta)

### Crear ticket

```http
POST /tickets
```

📌 El frontend **NO envía estado**
📌 El backend asigna:

* `status = OPEN`
* `openedAt`
* Evento `CREATED`

---

### Actualizar ticket (NO cambia estado)

```http
PATCH /tickets/:id
```

Campos permitidos:

* `problemDescription`
* `eventLocation`
* `impactLevel`

📌 Si el estado es terminal → `TicketImmutable`

---

### Acciones de dominio (no transiciones manuales)

📌 El verbo HTTP **no forma parte del dominio**
📌 La acción está definida por la **ruta**

```http
PATCH /tickets/:id/resolve   (estado requerido: OPEN)
PATCH /tickets/:id/close     (estado requerido: RESOLVED)
PATCH /tickets/:id/cancel    (motivo obligatorio, estado ≠ CLOSED)
```

---

## 📜 9️⃣ Historial (solo lectura)

```http
GET /tickets/:ticketId/history
```

El frontend:

* ❌ No edita
* ❌ No recalcula
* ❌ No corrige
* ❌ No infiere métricas

📌 Puede ordenar o paginar **solo para visualización**
📌 El historial **es la verdad del sistema**

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

✔️ Alineado con Contrato de Dominio
✔️ Alineado con Contrato de Aplicación
✔️ Alineado con implementación NestJS real
✔️ Seguridad validada
✔️ Endpoints cerrados
✔️ Sin ambigüedad funcional

📌 **Cambios → v3.0.0**

---

## 📊 Estado de Implementación Actual

| Componente              | Estado      |
| ----------------------- | ----------- |
| Prisma Schema v2.0.0    | ✅ Cerrado   |
| Contratos de Dominio    | ✅ Cerrados  |
| Contratos de Aplicación | ✅ Cerrados  |
| Endpoints               | ✅ Cerrados  |
| Seguridad (JWT + Roles) | ✅ Operativa |
| TicketHistory           | ✅ Cerrado   |
| Importación Clientes    | ✅ Cerrada   |

---

## 🧠 Nota Final para Frontend

* No reinventar lógica
* No “arreglar” respuestas
* No inferir estados
* Confiar en el backend
* El frontend **consume y representa**
* El backend **decide**

---

# 📐 Contratos de Backend — Estados y Transiciones de Ticket

**Gestor de Tickets DATRA — v2.0.0**
**Estado:** DEFINITIVO (derivado de reglas congeladas)

Este documento traduce **las reglas de estados y transiciones** a **contratos explícitos de backend**.

📌 Define **qué endpoints existen**, **qué validan**, **qué permiten**, **qué rechazan** y **qué eventos generan**.
📌 No es implementación (no Prisma, no NestJS), es **contrato de dominio**.

---

## 1️⃣ Principios del contrato

1. El backend **es la autoridad del estado**
2. Ningún endpoint permite estados inválidos
3. Toda mutación genera historial
4. Los estados terminales son inmutables
5. El frontend solo solicita acciones, **no define estados**

---

## 2️⃣ Modelo mental del backend

El backend **no expone un endpoint genérico para cambiar estado**.

👉 Expone **acciones de dominio**, cada una con reglas claras:

* Crear ticket
* Resolver ticket
* Cerrar ticket
* Cancelar ticket
* Actualizar información

Cada acción:

* Valida estado actual
* Valida rol
* Ejecuta transición (si aplica)
* Registra evento en `TicketHistory`

---

## 3️⃣ Contratos de acciones (endpoints conceptuales)

> Los nombres son ilustrativos. La semántica es obligatoria.

---

### 🟢 Crear Ticket

**Acción de dominio:** `createTicket`

**Entrada mínima:**

* clientRfc
* serviceContractId
* impactLevel
* problemDescription

**Precondiciones:**

* Cliente existe
* Contrato de servicio activo

**Resultado garantizado:**

* status = `OPEN`
* openedAt definido
* createdAt persistido
* Evento `CREATED`

**Errores:**

* Cliente inexistente
* Servicio inactivo

---

### 🔵 Resolver Ticket

**Acción de dominio:** `resolveTicket`

**Transición:** `OPEN → RESOLVED`

**Precondiciones:**

* Ticket existe
* status actual = `OPEN`
* Usuario autorizado

**Efectos:**

* status = `RESOLVED`
* Timestamp de resolución
* Evento `STATUS_CHANGED`

**Errores:**

* Ticket no encontrado
* Estado distinto de `OPEN`
* Usuario no autorizado

---

### 🟣 Cerrar Ticket

**Acción de dominio:** `closeTicket`

**Transición:** `RESOLVED → CLOSED`

**Precondiciones:**

* status actual = `RESOLVED`
* Usuario autorizado

**Efectos:**

* status = `CLOSED`
* closedAt definido
* Evento `CLOSED`

**Errores:**

* Estado inválido
* Intento de cierre directo desde `OPEN`

---

### 🔴 Cancelar Ticket

**Acción de dominio:** `cancelTicket`

**Transiciones válidas:**

* `OPEN → CANCELLED`
* `RESOLVED → CANCELLED`

**Precondiciones:**

* status != `CLOSED`
* Justificación obligatoria
* Usuario autorizado

**Efectos:**

* status = `CANCELLED`
* cancelledAt definido
* Evento `CANCELLED`

**Errores:**

* Ticket cerrado
* Falta de justificación

---

### ✏️ Actualizar información del Ticket

**Acción de dominio:** `updateTicket`

**Permitido si:**

* Ticket NO está en `CLOSED` ni `CANCELLED`

**Campos permitidos:**

* problemDescription
* eventLocation
* impactLevel

**Efectos:**

* No cambia estado
* Evento `UPDATED`

**Errores:**

* Ticket en estado terminal

---

## 4️⃣ Contrato de validación de estado

Toda acción que muta un ticket debe validar:

```
Estado actual ∈ Estados permitidos para la acción
```

Si no se cumple:

* HTTP 409 / 422 (conceptual)
* Mensaje explícito

---

## 5️⃣ Contrato de auditoría (obligatorio)

Cada acción genera **exactamente un evento** en `TicketHistory`:

| Acción     | Evento         |
| ---------- | -------------- |
| Crear      | CREATED        |
| Resolver   | STATUS_CHANGED |
| Cerrar     | CLOSED         |
| Cancelar   | CANCELLED      |
| Actualizar | UPDATED        |

📌 El historial es append-only
📌 No existen actualizaciones ni deletes

---

## 6️⃣ Contrato de estados terminales

Si `status ∈ {CLOSED, CANCELLED}`:

* ❌ No se permite cambiar estado
* ❌ No se permite cancelar
* ❌ No se permite resolver
* ❌ No se permite editar campos críticos

📌 Solo lectura + auditoría

---

## 7️⃣ Errores de dominio estándar

El backend debe distinguir **errores de dominio** de errores técnicos:

* Estado inválido para la acción
* Transición prohibida
* Rol no autorizado
* Ticket terminal

📌 Estos errores **no son bugs**, son reglas de negocio.

---

## 8️⃣ Lo que el backend NO hará

* No acepta estados desde frontend
* No permite cambios arbitrarios
* No reabre tickets
* No borra historial
* No corrige errores mutando estados

---

## 🔒 Estado del contrato

📌 Contratos de backend **CONGELADOS**
📌 Directamente trazables a reglas de dominio
📌 Base segura para implementación técnica (Prisma / NestJS)

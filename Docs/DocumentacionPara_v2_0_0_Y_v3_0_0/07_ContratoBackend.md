
---
# 🧩 Contratos de Backend — Gestor de Tickets DATRA

**Versión:** v2.0.0  
**Nivel:** Dominio / Aplicación  
**Estado:** 🔒 CONGELADO  
**Autoridad:** Backend  
**Frontend:** Consumidor pasivo (no decide)

---

## 1️⃣ Principio rector del backend

> **El backend es la autoridad absoluta del sistema.**

- El frontend **no valida reglas críticas**
- El frontend **no decide estados**
- El backend **rechaza cualquier acción inválida**
- Toda mutación relevante:
  - cambia estado **y/o**
  - genera historial

📌 **Sin historial → rollback total**  
📌 No existen excepciones en producción

---

## 2️⃣ Modelo mental del backend

❌ No existe endpoint genérico para cambiar estado  
❌ No se aceptan estados enviados desde frontend  

✅ El backend expone **acciones de dominio explícitas**:

- Crear ticket
- Resolver ticket
- Cerrar ticket
- Cancelar ticket
- Actualizar información no estructural

Cada acción:

1. Valida estado actual
2. Valida rol
3. Ejecuta transición (si aplica)
4. Registra evento en `TicketHistory`
5. Confirma transacción

---

## 3️⃣ Estados y transiciones válidas

```

OPEN → RESOLVED → CLOSED
OPEN → CANCELLED
RESOLVED → CANCELLED

````

📌 `CLOSED` y `CANCELLED` son **estados terminales**  
📌 Cualquier otra transición es **error de dominio**

---

## 4️⃣ Casos de uso oficiales  
### (ÚNICOS mutadores del dominio Ticket)

---

### 🟢 `createTicket`

**Intención:** Crear un nuevo ticket

**Resultado garantizado:**
- `status = OPEN`
- `openedAt = now()`
- Evento `CREATED`

**Validaciones:**
- Cliente existente y activo
- Contrato de servicio activo

**Errores de dominio:**
- `ClientNotFound`
- `ServiceContractInactive`
- `ForbiddenAction`

---

### 🔵 `resolveTicket`

**Transición:** `OPEN → RESOLVED`

**Requisitos:**
- Estado actual = `OPEN`
- Rol: `TECNICO` | `INGENIERO`

**Efectos:**
- Evento `STATUS_CHANGED`
- Metadata con diagnóstico técnico
- Seteo de `resolvedAt`

**Errores:**
- `InvalidTicketState`
- `ForbiddenAction`

---

### 🟣 `closeTicket`

**Transición:** `RESOLVED → CLOSED`

**Requisitos:**
- Estado actual = `RESOLVED`
- Rol autorizado (`TECNICO` | `ADMIN`)

**Efectos:**
- `closedAt = now()`
- Evento `CLOSED`

**Errores:**
- `InvalidTicketState`
- `ForbiddenAction`

---

### 🔴 `cancelTicket`

**Transiciones válidas:**
- `OPEN → CANCELLED`
- `RESOLVED → CANCELLED`

**Requisitos:**
- Estado ≠ `CLOSED`
- Motivo obligatorio
- Rol autorizado (`ADMIN`)

**Efectos:**
- `cancelledAt = now()`
- Evento `CANCELLED`

**Errores:**
- `InvalidTicketState`
- `ForbiddenAction`

---

### ✏️ `updateTicket`

**Permitido solo si:**
- Estado ∉ `{CLOSED, CANCELLED}`

**Campos permitidos:**
- `problemDescription`
- `eventLocation`
- `impactLevel`

**Efectos:**
- Evento `UPDATED`
- ❌ No cambia estado

**Errores:**
- `TicketImmutable`
- `ForbiddenFieldUpdate`

---

## 5️⃣ Guards obligatorios (hard rules)

### 🛡️ TicketStateGuard

```ts
assertTransition(currentState, action)
````

* Lanza `InvalidTicketState`

---

### 🛡️ RoleGuard

* Valida rol según acción
* Lanza `ForbiddenAction`

---

### 🛡️ FinalStateGuard

Bloquea toda mutación si:

```
status ∈ {CLOSED, CANCELLED}
```

* Lanza `TicketImmutable`

---

## 6️⃣ Contrato de historial (TicketHistory)

📌 **Obligatorio, append-only, inmutable**

Toda acción válida genera **exactamente un evento**:

| Acción     | EventType      |
| ---------- | -------------- |
| Crear      | CREATED        |
| Resolver   | STATUS_CHANGED |
| Cerrar     | CLOSED         |
| Cancelar   | CANCELLED      |
| Actualizar | UPDATED        |

* No se edita
* No se elimina
* No se corrige
* Si falla → rollback total

---

## 7️⃣ Errores de dominio (no HTTP genéricos)

| Error                   | Significado                    |
| ----------------------- | ------------------------------ |
| InvalidTicketState      | Transición inválida            |
| TicketImmutable         | Estado terminal                |
| ForbiddenAction         | Rol no autorizado              |
| ClientNotFound          | Cliente inexistente o inactivo |
| ServiceContractInactive | Contrato desactivado           |
| ForbiddenFieldUpdate    | Campo no editable              |

📌 Se mapean luego a HTTP (`403`, `409`, `422`)
📌 El dominio **no conoce HTTP**

---

## 8️⃣ Reglas no negociables

El backend **NUNCA**:

* Reabre tickets
* Acepta estados desde frontend
* Corrige timestamps
* Edita historial
* Elimina registros (NO DELETE)
* Salta `RESOLVED`
* Aplica lógica “administrativa” fuera del dominio

---

## 🔒 Estado del contrato

📌 **CONTRATO CONGELADO — v2.0.0**
📌 Fuente única de verdad del backend
📌 Alineado con:

* Modelo Prisma v2.0.0
* Estados y transiciones oficiales
* Endpoints definitivos
* Auditoría, KPIs y operación real

📌 Cualquier cambio → **nueva versión mayor**

---
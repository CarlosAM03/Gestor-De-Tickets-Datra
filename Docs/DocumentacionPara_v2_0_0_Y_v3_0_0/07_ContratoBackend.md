
---

# 🧩 Contratos de Backend — Gestor de Tickets DATRA

**Versión:** v2.0.0  
**Nivel:** Dominio / Aplicación  
**Estado:** 🔒 CONTRATO CONGELADO (Implementación en desarrollo controlado)  
**Autoridad:** Backend  
**Frontend:** Consumidor pasivo (no decide)

---

## ⚠️ Declaración de Estado Real

Este documento define **contratos de dominio y aplicación** que:

- ✔️ **NO cambian durante v2.0.0**
- ✔️ Son válidos para integración frontend
- ✔️ Están diseñados pensando ya en v3.0.0
- ⏳ Se encuentran **en fase de implementación y endurecimiento**

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
📌 No existen atajos ni excepciones por capa

---

## 2️⃣ Modelo mental del backend

❌ No existe endpoint genérico para cambiar estado  
❌ No se aceptan estados enviados desde frontend  

✅ El backend expone **acciones de dominio explícitas**, estables y versionadas:

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

📌 Este flujo **no depende del frontend**

---

## 3️⃣ Estados y transiciones válidas (CONTRATO DE DOMINIO)

```

OPEN → RESOLVED → CLOSED
OPEN → CANCELLED
RESOLVED → CANCELLED

````

📌 `CLOSED` y `CANCELLED` son **estados terminales**  
📌 Cualquier otra transición es **error de dominio**

❌ No existe reapertura  
❌ No existe bypass de `RESOLVED`

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
- Cliente existente
- Cliente activo
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

📌 El historial:

* No se edita
* No se elimina
* No se corrige
* No se “recalcula”

❌ Si falla → rollback total

---

## 7️⃣ Errores de dominio (agnósticos a HTTP)

| Error                   | Significado                    |
| ----------------------- | ------------------------------ |
| InvalidTicketState      | Transición inválida            |
| TicketImmutable         | Estado terminal                |
| ForbiddenAction         | Rol no autorizado              |
| ClientNotFound          | Cliente inexistente o inactivo |
| ServiceContractInactive | Contrato desactivado           |
| ForbiddenFieldUpdate    | Campo no editable              |

📌 El dominio **no conoce HTTP**
📌 El mapeo a `403 / 409 / 422` es responsabilidad de la capa API

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
📌 Implementación en desarrollo controlado
📌 Alineado con:

* Modelo Prisma v2.0.0
* Estados y transiciones oficiales
* Endpoints congelados
* Auditoría y KPIs reales
* Roadmap enero–febrero 2026

📌 Cualquier cambio estructural → **v3.0.0**

---

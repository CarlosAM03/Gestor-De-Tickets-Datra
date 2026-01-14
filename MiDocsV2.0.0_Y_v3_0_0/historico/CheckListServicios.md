
---

# 📋 CHECKLIST — SERVICIOS EXISTENTES (ESTADO REAL)

**Gestor de Tickets DATRA — Backend v2.0.0**
📅 Corte: **8 de enero — 1:30 PM**

---

## 🟢 SELLADOS (NO SE TOCAN)

### 🔐 `AuthService`

📁 `src/auth/auth.service.ts`
➡️ **✔ DONE / SELLADO**

**Estado técnico**

* ✔ Flujo de login correcto
* ✔ Hash con bcrypt
* ✔ Validación de usuario activo
* ✔ JWT correcto
* ✔ Uso correcto de `ConfigService`

**Reglas**

* ❌ No emite historial (correcto)
* ❌ No toca Prisma directamente
* ❌ No lógica de dominio

📌 **Decisión**

> 🔒 **Auth queda cerrado definitivamente**
> Solo se reabre si hay error en ejecución real.

---

## 🟢 SELLADOS (CORE)

### 🧠 `TicketHistoryService`

📁 `src/tickethistory/ticket-history.service.ts`
➡️ **✔ DONE / SELLADO**

**Estado técnico**

* ✔ Append-only
* ✔ Prisma solo aquí
* ✔ Sin update / delete
* ✔ Firma simple y estable

```ts
async create(data: Prisma.TicketHistoryCreateInput): Promise<void>
```

**Observación**

* ✔ Correcto que devuelva `void`
* ✔ Metadata JSON delegada al caller

📌 **Decisión**

> 🔒 Servicio **cerrado**
> No se le agrega lógica ni validaciones

---

## 🟡 EXISTE PERO REQUIERE REVISIÓN (BLOQUE 3)

### 🎫 `TicketService`

📁 `src/ticket/ticket.service.ts`
➡️ **⏳ EXISTENTE / REQUIERE AJUSTE CONTROLADO**

**Lo que YA está bien**

* ✔ Reglas de estado (OPEN / RESOLVED / CLOSED)
* ✔ Validaciones de cliente y contrato
* ✔ Uso correcto de transacciones
* ✔ Metadata tipada (`Ticket*MetadataDto`)
* ✔ Historial correctamente generado
* ✔ No controllers inflados

**Problemas / Deuda técnica**

* ⚠ Usa Prisma **directamente** para historial
  → debe migrar a `recordHistoryEvent`
* ⚠ `toJson()` es workaround temporal
* ⚠ Mezcla lógica de dominio + persistencia
* ⚠ `code: 'TEMP'` es hack aceptado, pero no ideal
* ⚠ No hay cancelación todavía
* ⚠ No hay RESOLVE explícito

📌 **Acción en Bloque 3**

* [ ] Reemplazar `prisma.ticketHistory.create` por helper
* [ ] Centralizar emisión de historial
* [ ] Separar reglas de transición
* [ ] Cerrar contrato del service
* [ ] NO tocar controller aún

---

## 🟡 EXISTE PARCIALMENTE

### 👥 `ClientsService`

📁 `src/clients/clients.service.ts`
➡️ **⏳ EXISTENTE / INCOMPLETO**

**Lo que YA está bien**

* ✔ `findByRfc` seguro
* ✔ `search` optimizado para frontend
* ✔ Filtro de activos correcto
* ✔ `upsert` interno bien delimitado

**Faltantes**

* ❌ No DTOs
* ❌ No reglas de negocio
* ❌ No historial
* ❌ No soft-delete explícito
* ❌ No módulo

📌 **Acción en Bloque 3**

* [ ] Definir DTOs v2
* [ ] Definir reglas de activación/desactivación
* [ ] Emitir historial
* [ ] Crear módulo
* [ ] NO controller aún

---

## 🟡 EXISTE Y FUNCIONA, PERO NO SELLADO

### 👤 `UserService`

📁 `src/user/user.service.ts`
➡️ **⏳ EXISTENTE / REQUIERE AUDITORÍA FINAL**

**Lo que YA está bien**

* ✔ Hash de password
* ✔ Roles
* ✔ Activación / desactivación
* ✔ Separación admin vs self
* ✔ Usado correctamente por Auth

**Faltantes**

* ❌ No historial (activación / rol)
* ❌ No reglas explícitas de negocio
* ❌ No DTOs versionados v2 para lectura
* ❌ Prisma usado directamente (esperado en esta etapa)

📌 **Acción en Bloque 3**

* [ ] Definir eventos de historial
* [ ] Emitir historial
* [ ] Cerrar contrato del service
* [ ] NO tocar AuthService

---

## 🔴 NO EXISTE AÚN

### 📄 `ServiceContractsService`

➡️ **⛔ NO EXISTE**

📌 **Bloque 3**

* [ ] Crear service
* [ ] Reglas de activación
* [ ] Emisión de historial
* [ ] DTOs v2

---

### 🧾 `AdminImportClientsService`

➡️ **⛔ NO EXISTE**

📌 **Bloque 3**

* [ ] Crear service
* [ ] Validaciones
* [ ] Dedupe
* [ ] Emisión de historial
* [ ] Sin controller

---

# 🧾 RESUMEN EJECUTIVO — SERVICIOS

| Servicio                  | Estado                |
| ------------------------- | --------------------- |
| AuthService               | 🔒 SELLADO            |
| TicketHistoryService      | 🔒 SELLADO            |
| TicketService             | ⏳ Ajuste Bloque 3     |
| ClientsService            | ⏳ Incompleto          |
| UserService               | ⏳ Auditoría pendiente |
| ServiceContractsService   | ⛔ No existe           |
| AdminImportClientsService | ⛔ No existe           |

---

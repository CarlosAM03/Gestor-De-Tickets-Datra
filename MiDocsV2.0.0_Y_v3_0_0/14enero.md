
---

# ✅ CHECKLIST OPERATIVO — MIÉRCOLES 14 DE ENERO

**Inicio:** 3:00 PM
**Meta del día:** **Build limpio + Front alineado 1:1 al backend**

---

## 🧭 REGLAS DEL DÍA (NO NEGOCIABLES)

1. ❌ No se crean endpoints nuevos
2. ❌ No se exportan tipos “para callar TS”
3. ❌ No se reintroducen campos muertos (`deleteRequested`, `assignedTo`, etc.)
4. ✅ Si el backend no lo tiene → el front se adapta
5. ✅ TS es juez final
6. 🎯 Un solo objetivo: **build**

---

# 🕒 BLOQUE 1 — 3:00 a 3:25 PM

## 🔍 LECTURA Y CLASIFICACIÓN (SIN TOCAR CÓDIGO)

**Objetivo:** bajar carga cognitiva antes de tocar nada.

### ✔️ Acción

* Leer el error log completo (ya hecho)
* Confirmar estos **5 grupos reales de errores**

### 🧱 GRUPOS IDENTIFICADOS

1. **APIs inexistentes**

   * `updateTicketStatus`
   * `getTicketHistory`
   * `approveDeleteTicket`
   * `rejectTicketDeletion`
   * `requestTicketDeletion`
   * `createUser`
   * `deleteUser`

2. **Tipos no exportados / mal definidos**

   * `TicketStatus`
   * `ImpactLevel`
   * `TicketFormValues`
   * `TicketHistory`
   * `UserRole`

3. **Campos que YA NO EXISTEN en Ticket**

   * `deleteRequested`
   * `assignedTo`
   * `contact`
   * `clientType`
   * `serviceAffected`
   * `problemDesc`
   * `updatedAt`

4. **Estados ilegales**

   * `IN_PROGRESS`
   * `ON_HOLD`

5. **Null safety real**

   * `ticket.createdBy` posiblemente null

📌 **Nada más. No hay errores “raros”.**

---

## ☕ MICRO DESCANSO — 3:25 a 3:30 PM

Respira. Agua.
Aquí **no se programa**.

---

# 🕒 BLOQUE 2 — 3:30 a 4:30 PM

## 🧱 LIMPIEZA DE CONTRATO (LA MÁS IMPORTANTE)

### 🎯 Objetivo

Eliminar TODO lo que el backend **no expone**.

---

### ✅ Checklist exacto

#### 🔧 APIs

* [ ] En `tickets.api.ts`
  → **Buscar y eliminar imports** de:

  * `updateTicketStatus` → usar `updateTicket`
  * delete workflows completos

* [ ] En `users.api.ts`

  * Quitar referencias a `createUser`, `deleteUser` si no existen

📌 **Regla:**
El frontend **NO simula workflows administrativos**.

---

#### 🔧 Tipos

En `ticket.types.ts` y `user.types.ts`:

* [ ] Exportar **solo** enums oficiales:

  * `TicketStatus` → **solo**:

    * `OPEN`
    * `RESOLVED`
    * `CLOSED`
    * `CANCELLED`
* [ ] Eliminar referencias a:

  * `ImpactLevel` si no está cerrado en backend
  * `TicketFormValues` → redefinir localmente si es solo UI
* [ ] `TicketHistory` → usar tipo UI, no dominio

📌 **No reexportes para “callar errores”.**

---

## ☕ MICRO DESCANSO — 4:30 a 4:35 PM

Pantalla lejos.
Nada de Slack / GitHub.

---

# 🕒 BLOQUE 3 — 4:35 a 5:30 PM

## 🧹 LIMPIEZA DE UI (ARCHIVOS BLOQUEADORES)

### 🎯 Objetivo

Quitar TODA lógica basada en un modelo viejo.

---

### 📂 Orden exacto (NO improvisar)

#### 1️⃣ `TicketEdit.tsx`

* [ ] Eliminar:

  * `deleteRequested`
  * campos inexistentes
* [ ] Reducir formulario **solo a lo que backend acepta**
* [ ] Quitar botones admin inexistentes

---

#### 2️⃣ `TicketsList.tsx`

* [ ] Eliminar:

  * delete flows
  * owner checks basados en campos muertos
* [ ] Ajustar render solo por `TicketStatus` válido
* [ ] Null-check `createdBy`

---

#### 3️⃣ `TicketView.tsx`

* [ ] Quitar:

  * info extendida no soportada
* [ ] Proteger:

  * `ticket.createdBy?.name ?? '-'`
* [ ] Ajustar fechas solo si existen

---

📌 **No intentes “salvar” vistas.
Si algo no existe → se quita.**

---

## ☕ DESCANSO REAL — 5:30 a 5:45 PM

Levántate.
Nada de código.
Este descanso **evita errores tontos**.

---

# 🕒 BLOQUE 4 — 5:45 a 6:30 PM

## 📊 DASHBOARD + HISTORIAL (NEUTRALIZACIÓN)

### 🎯 Objetivo

Que **NO ROMPAN BUILD**, no que queden “bonitos”.

---

### ✔️ Checklist

* [ ] `Dashboard.tsx`

  * Eliminar métricas por estados ilegales
  * Usar solo `OPEN | RESOLVED | CLOSED | CANCELLED`

* [ ] `TicketsAnalyticsDashboard.tsx`

  * Quitar `IN_PROGRESS`, `ON_HOLD`
  * Quitar `assignedTo`
  * Null-check `createdBy`

* [ ] `History.tsx`

  * Si `getTicketHistory` no existe:

    * deshabilitar vista
    * placeholder “No disponible”

📌 **Dashboard puede quedar básico hoy.**

---

# 🕒 BLOQUE 5 — 6:30 PM

## 🧪 BUILD FINAL

### ✔️ Checklist final

* [ ] `npm run build`
* [ ] Sin `any`
* [ ] Sin `@ts-ignore`
* [ ] Sin warnings críticos

---


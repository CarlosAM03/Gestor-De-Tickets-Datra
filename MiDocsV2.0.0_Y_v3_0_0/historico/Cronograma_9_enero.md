
---

# 🚀 DÍA 2 — PLAN DE TRABAJO

📅 **9 de enero**
⏰ **Inicio:** 3:00 PM
🎯 **Bloque activo:** **BLOQUE 3 — Services + DTOs (SIN controllers)**

---

## 🧠 REGLAS DURAS DEL DÍA (NO SE ROMPEN)

Antes de entrar a tareas:

### ❌ Prohibido hoy

* ❌ Controllers
* ❌ Endpoints HTTP
* ❌ Prisma fuera del service
* ❌ Refactors cosméticos
* ❌ Optimización prematura
* ❌ “Ya que estamos…” 😄

### ✅ Obligatorio hoy

* ✔ Reglas explícitas de dominio
* ✔ DTOs v2 claros
* ✔ Emisión de historial **solo vía `recordHistoryEvent`**
* ✔ Contratos de service cerrados
* ✔ Código legible > código corto

---

# 🕒 AGENDA EXACTA — 3:00 A 6:00 PM

## ⏱️ 3:00 – 3:15 PM

### 🔎 Alineación inicial (rápida)

Objetivo:

* Tener **clarísimo** qué se cierra hoy.

Acción:

* Confirmar alcance del primer dominio:
  👉 **ServiceContracts**

📌 Resultado esperado:

> *“Hoy dejamos ServiceContracts completamente cerrado a nivel service + DTOs”*

---

## ⏱️ 3:15 – 4:15 PM

## 🔹 BLOQUE 3.1 — `ServiceContractsService` (CREACIÓN)

### 📦 A implementar

**Archivos nuevos**

* `service-contracts.service.ts`
* `dto/create-service-contract.dto.ts`
* `dto/update-service-contract.dto.ts`
* `types/service-contract-name.enum.ts`

### 🔐 Reglas de dominio

* No delete
* Activar / desactivar
* Nombre único
* Inactivo ≠ inválido históricamente

### 📜 Historial

Eventos mínimos:

* `SERVICE_CONTRACT_CREATED`
* `SERVICE_CONTRACT_UPDATED`
* `SERVICE_CONTRACT_DEACTIVATED`

✔ Usando **`recordHistoryEvent`**

📌 **Criterio DONE**

* El service puede usarse mañana por Tickets **sin cambios**
* El contrato no requiere controller para validarse

---

## ⏱️ 4:15 – 5:00 PM

## 🔹 BLOQUE 3.2 — Auditoría ligera de `ClientsService`

Objetivo:

* **No terminarlo**, solo **dejarlo listo para cierre mañana**

### Acciones concretas

* Definir **qué eventos de historial tendrá**
* Definir **qué DTOs faltan**
* Decidir reglas de activación/desactivación
* Marcar puntos donde **NO se toca Prisma mañana**

📌 Resultado esperado:

* TODOs claros
* Sin escribir código innecesario

---

## ⏱️ 5:00 – 5:45 PM

## 🔹 BLOQUE 3.3 — Auditoría ligera de `UserService`

Objetivo:

* Mismo enfoque que Clients

### Acciones

* Definir eventos de historial:

  * USER_CREATED
  * USER_UPDATED
  * USER_DEACTIVATED
  * ROLE_CHANGED
* Decidir **qué metadata se emite**
* Confirmar que **Auth no se toca**

📌 Resultado esperado:

* Plan claro para mañana
* Sin refactor aún

---

## ⏱️ 5:45 – 6:00 PM

## 🧾 CIERRE DEL DÍA

### Checklist de cierre

* [ ] ServiceContractsService cerrado
* [ ] DTOs definidos
* [ ] Historial emitiéndose
* [ ] Clients y Users con plan claro
* [ ] Ningún controller tocado
* [ ] Sin deuda técnica nueva

📌 Se documenta el estado como:

> **Día 2 — progreso limpio y controlado**

---

# 🎯 OBJETIVO REAL DEL DÍA 9

✔ 1 dominio **completamente cerrado**
✔ 2 dominios **listos para cerrar mañana**
✔ 0 deuda técnica
✔ 0 decisiones improvisadas

---

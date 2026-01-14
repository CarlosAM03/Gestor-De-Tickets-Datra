
---

# 🗓️ PLAN AJUSTADO — SEMANA 6 → 11 DE ENERO (v2.0.0)

Este plan **sí es realista**, **sí es ejecutable** y **no rompe contratos**.

---

## 🟢 MIÉRCOLES 6 — CIERRE FORMAL (HOY)

### Estado

👉 **HOY NO SE TOCA BACKEND**

### Qué se hace (YA HECHO)

* [x] Contratos cerrados (Backend + Endpoints)
* [x] Arquitectura definida
* [x] Modelo Prisma v2.0.0 aprobado
* [x] Regla NO DELETE validada
* [x] Seed validada
* [x] Estrategia de migración limpia definida

### Qué NO se hace

* ❌ `.service.ts`
* ❌ `.controller.ts`
* ❌ Endpoints
* ❌ Refactors

📌 **Hoy se congela el diseño. Punto final.**

---

## 🟢 JUEVES 7 — MIGRACIÓN PRISMA (SOLO PRISMA)

### Objetivo

👉 **Base de datos v2.0.0 lista, estable y auditable**

### Pasos exactos (orden obligatorio)

```bash
npx prisma migrate reset
npx prisma migrate dev --name v2_0_0_initial
npx prisma generate
npx prisma db seed
```

### Checklist obligatorio

* [ ] Migración aplicada sin errores
* [ ] Enums correctos
* [ ] Relaciones válidas
* [ ] Usuarios base creados
* [ ] CERO deletes físicos
* [ ] `TicketHistory` append-only

📌 **NO tocar backend aún**
📌 Commit recomendado:
`chore(prisma): migrate schema v2.0.0 initial`

---

## 🟡 VIERNES 8 — HARDENING DE DOMINIO (SERVICES)

### Objetivo

👉 **La lógica interna cumple el contrato v2.0.0**

### Qué SÍ se toca

* `ticket.service.ts`
* `client.service.ts`
* `user.service.ts`

### Qué se hace

* [ ] Validación estricta de estados
* [ ] Estados terminales bloqueados
* [ ] Eliminación de lógica tipo `update status`
* [ ] Errores de dominio explícitos
* [ ] Historial obligatorio en cada acción

📌 Controllers **NO se tocan todavía**

📌 Commit recomendado:
`refactor(domain): enforce ticket lifecycle rules v2.0.0`

---

## 🟡 SÁBADO 9 — HARDENING DE API (CONTROLLERS)

### Objetivo

👉 **La API refleja exactamente el contrato congelado**

### Qué SÍ se toca

* `ticket.controller.ts`
* `user.controller.ts`
* `client.controller.ts`

### Qué se hace

* [ ] Eliminar DELETE definitivamente
* [ ] Eliminar endpoints genéricos de estado
* [ ] Ajustar URLs finales (`/resolve`, `/close`, `/cancel`)
* [ ] DTOs alineados al contrato
* [ ] Guards activos en todos los mutadores

📌 Aquí el backend **ya ES v2.0.0 real**

📌 Commit recomendado:
`feat(api): align controllers with domain contract v2.0.0`

---

## 🟢 DOMINGO 10 — PRUEBAS DE DOMINIO (MANUAL / CRÍTICAS)

### Objetivo

👉 **Intentar romper el sistema**

### Pruebas mínimas obligatorias

* [ ] Resolver ticket CLOSED → ❌ falla
* [ ] Cancelar ticket CLOSED → ❌ falla
* [ ] Update en CANCELLED → ❌ falla
* [ ] Historial siempre se genera
* [ ] Roles bloquean correctamente
* [ ] Ningún endpoint permite DELETE

📌 Si algo falla:

* Se corrige **SIN cambiar contrato**
* Solo bugfix de implementación

📌 Commit recomendado (si aplica):
`fix(domain): enforce terminal state immutability`

---

## 🔒 LUNES 11 — CONGELAMIENTO DEFINITIVO

### Objetivo

👉 **Backend listo para frontend**

### Qué se hace

* [ ] Crear rama `release/v2.0.0`
* [ ] Congelar Prisma schema
* [ ] Congelar contratos
* [ ] Backend solo acepta bugfixes
* [ ] Documentación marcada como baseline

📌 A partir de aquí:

> **El frontend se adapta.
> El backend no se negocia.**

---

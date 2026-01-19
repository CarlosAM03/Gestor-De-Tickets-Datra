
---

# 🎫 Gestor de Tickets Datra — Backend (NestJS)

Backend oficial del sistema **Gestor de Tickets Datra**, desarrollado con **NestJS + Prisma**, diseñado como un **sistema empresarial con reglas de dominio estrictas**, **auditoría obligatoria** y **contratos congelados para frontend productivo**.

📌 Este backend es la **fuente única de verdad del sistema**  
📌 El frontend es un **consumidor pasivo de contratos**  

---

## 🚀 Objetivo del Backend

Construir y consolidar un backend que:

- Centralice todas las reglas de negocio
- Controle estrictamente estados y transiciones
- Garantice auditoría y trazabilidad completa
- Permita métricas reales basadas en historial
- Sea **estable para v2.0.0**
- Esté **preparado estructuralmente para v3.0.0**
- Pueda migrarse a infraestructura on-prem sin refactor crítico

---

## ⚠️ Estado Actual del Sistema

> **🟡 EN DESARROLLO CONTROLADO · v2.0.0 (Preparado para v3.0.0)**

### Situación real (enero, semana 1)

- El **modelo de dominio está definido**
- Los **contratos están congelados**
- El backend **no está aún desplegado en producción**
- Se encuentra en **fase de cierre técnico del core**
- Se trabaja con visión directa a:
  - Migración on-prem
  - Integración frontend 1:1
  - Operación real

📌 Este estado es **intencional y planificado**  
📌 No representa inestabilidad, sino **ejecución por fases**

---

## 🔐 1. Autenticación y Seguridad

| Funcionalidad                | Estado |
| ---------------------------- | ------ |
| Login con JWT                | ✅ Implementado |
| Expiración de token          | ✅ |
| `JwtAuthGuard`               | ✅ |
| Usuario inyectado en request | ✅ |
| Logout forzado por 401       | ✅ |

📌 El backend controla completamente la sesión  
📌 El frontend **no replica ni infiere lógica de seguridad**

---

## 👤 2. Roles y Permisos

### Roles definidos

| Rol | Responsabilidad |
|----|----------------|
| **ADMIN** | Control total, auditoría, cancelaciones, importaciones |
| **INGENIERO** | Gestión operativa global |
| **TECNICO** | Operación diaria de tickets |

### Implementación

| Componente | Estado |
|-----------|--------|
| Enum `UserRole` | ✅ |
| Decorador `@Roles()` | ✅ |
| `RolesGuard` | ✅ |
| Validación en services | ✅ |

📌 Guards controlan acceso  
📌 Services aplican reglas de dominio  

---

## 🎫 3. Tickets — Core del Sistema

### Capacidades actuales

| Funcionalidad | Estado |
|--------------|--------|
| Crear ticket | ✅ |
| Código autogenerado (`TT-000001`) | ✅ |
| Asignación automática de creador | ✅ |
| Listado propio / global | ✅ |
| Detalle de ticket | ✅ |
| Actualización controlada | ✅ |
| Resolución | ✅ |
| Cierre | ✅ |
| Cancelación | ✅ |

📌 El ciclo de vida **está completamente definido y validado**

---

## 🔁 4. Estados y Transiciones (Contrato de Dominio)

### Estados válidos

```

OPEN → RESOLVED → CLOSED
OPEN → CANCELLED
RESOLVED → CANCELLED

````

❌ Cualquier otra transición es **error de dominio**

📌 No existen endpoints genéricos de cambio de estado  
📌 Solo existen **acciones explícitas de dominio**

---

## 🧠 5. Acciones de Dominio Oficiales

| Acción | Transición | Evento |
|------|-----------|--------|
| `createTicket` | — → OPEN | CREATED |
| `resolveTicket` | OPEN → RESOLVED | STATUS_CHANGED |
| `closeTicket` | RESOLVED → CLOSED | CLOSED |
| `cancelTicket` | OPEN / RESOLVED → CANCELLED | CANCELLED |
| `updateTicket` | — | UPDATED |

📌 Todas:
- Validan estado
- Validan rol
- Ejecutan reglas
- Generan historial obligatorio

---

## 🧹 6. Estados Terminales

Si `status ∈ { CLOSED, CANCELLED }`:

- ❌ No se permite cambiar estado
- ❌ No se permite reabrir
- ❌ No se permite eliminar
- ✔️ Solo lectura
- ✔️ Correcciones administrativas limitadas y auditadas

---

## 📜 7. Auditoría / Historial (CORE)

`TicketHistory` es **append-only**:

- Inmutable
- No editable
- No eliminable
- Una entrada por acción válida

```ts
createHistory({
  ticketId,
  eventType,
  fromStatus,
  toStatus,
  performedById,
  metadata
})
````

❌ Si el historial falla → rollback total

---

## 🧠 8. Reglas de Negocio No Negociables

| Regla                        | Nivel   |
| ---------------------------- | ------- |
| Backend es árbitro absoluto  | Sistema |
| No reabrir tickets           | Dominio |
| No DELETE físico             | Global  |
| No cambio directo de estados | Dominio |
| Historial obligatorio        | Dominio |

---

## 👥 9. Modelo Cliente (Real y Definitivo)

Principios:

* El cliente **debe existir**
* El cliente **debe estar activo**
* El contrato **debe estar activo**
* El backend **no crea clientes implícitos**

📌 Alta / baja / importación:

* Rol **ADMIN**
* Procesos controlados
* Fuera del frontend

---

## 🔄 10. Flujo al Crear Ticket

1. Validar RFC
2. Validar cliente activo
3. Validar contrato activo
4. Crear ticket
5. Registrar historial

📌 El frontend **no decide ni crea entidades**

---

## 📡 11. Endpoints Congelados (v2.0.0)

### Auth

* `POST /auth/login`

### Tickets

* `GET /tickets?scope=mine`
* `GET /tickets?scope=all`
* `GET /tickets/:id`
* `POST /tickets`
* `PATCH /tickets/:id`
* `PATCH /tickets/:id/resolve`
* `PATCH /tickets/:id/close`
* `PATCH /tickets/:id/cancel`

### Clientes

* `GET /clients/:rfc`

📌 Estos endpoints **no cambiarán en v2.0.0**

---

## 🔒 Estado del Artefacto

* 🟡 En desarrollo controlado
* ✔️ Contratos congelados
* ✔️ Dominio alineado a Prisma
* ✔️ Auditoría definida
* ✔️ Preparado para v3.0.0
* ⏳ Pendiente despliegue on-prem

---

## 🏁 Nota Final

Este backend:

* **No es un prototipo**
* **No es aún producción**
* Es un **core empresarial en cierre técnico**
* Avanza según **cronograma explícito**
* Está diseñado para **no romperse al crecer**

📌 **Backend v2.0.0 — Desarrollo Controlado**



---

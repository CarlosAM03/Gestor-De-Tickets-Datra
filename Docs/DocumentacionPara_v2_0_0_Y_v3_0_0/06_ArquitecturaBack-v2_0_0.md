
---
# 🎫 Gestor de Tickets Datra — Backend (NestJS)

Backend oficial del sistema **Gestor de Tickets Datra**, desarrollado con **NestJS + Prisma**, diseñado como un **sistema empresarial con reglas de dominio estrictas**, **auditoría obligatoria** y **contratos congelados para frontend productivo**.

📌 Este backend es la **fuente única de verdad del sistema**.  
📌 El frontend es un **consumidor pasivo de contratos**.

---

## 🚀 Objetivo del Backend

Proveer una API robusta y segura que garantice:

- Autenticación real con JWT
- Control estricto de acceso por roles
- Gestión completa del ciclo de vida de tickets
- Estados controlados por dominio (no por frontend)
- **No eliminación de datos (desactivación / cancelación por estado)**
- Auditoría completa y trazabilidad
- Contratos estables y congelados
- Escalabilidad sin refactor crítico

---

## ✅ Estado Actual del Sistema

> **🟢 FUNCIONAL · 🟢 ESTABLE · 🟢 CONGELADO (v2.0.0)**

Listo para:

- Integración frontend real
- Demo funcional
- Producción controlada
- Auditoría de negocio

---

## 🔐 1. Autenticación y Seguridad

| Funcionalidad                | Estado |
| ---------------------------- | ------ |
| Login con JWT                | ✅ |
| Expiración de token          | ✅ |
| `JwtAuthGuard`               | ✅ |
| Usuario inyectado en request | ✅ |
| Logout forzado por 401       | ✅ |

📌 El backend controla completamente la sesión  
📌 El frontend **no replica lógica crítica**

---

## 👤 2. Roles y Permisos

### Roles definidos

| Rol | Capacidades |
|----|------------|
| **ADMIN** | Control total, auditoría, aprobación de cancelaciones |
| **INGENIERO** | Gestión global de tickets |
| **TECNICO** | Gestión de tickets propios |

### Implementación

| Componente | Estado |
|-----------|--------|
| Enum `UserRole` | ✅ |
| Decorador `@Roles()` | ✅ |
| `RolesGuard` | ✅ |
| Validación en Services | ✅ |

📌 Guards = acceso  
📌 Services = reglas de negocio  

---

## 🎫 3. Tickets — Core del Sistema

### Funcionalidades implementadas

| Funcionalidad | Estado |
|--------------|--------|
| Crear ticket | ✅ |
| Código autogenerado (`TT-000001`) | ✅ |
| Asignación automática de creador | ✅ |
| Ver tickets propios / globales | ✅ |
| Ver detalle | ✅ |
| Actualizar información | ✅ |
| Resolver ticket | ✅ |
| Cerrar ticket | ✅ |
| Cancelar ticket | ✅ |

🟢 **Ciclo de vida completo implementado**

---

## 🔁 4. Estados y Transiciones (Contrato de Dominio)

### Estados válidos

```

OPEN → RESOLVED → CLOSED
OPEN → CANCELLED
RESOLVED → CANCELLED

````

❌ Cualquier otra transición es **error de dominio**

📌 El backend **NO expone endpoints genéricos de cambio de estado**  
📌 Solo existen **acciones de dominio**

---

## 🧠 5. Acciones de Dominio (Use Cases Oficiales)

| Acción | Transición | Evento |
|------|-----------|--------|
| `createTicket` | — → OPEN | CREATED |
| `resolveTicket` | OPEN → RESOLVED | STATUS_CHANGED |
| `closeTicket` | RESOLVED → CLOSED | CLOSED |
| `cancelTicket` | OPEN/RESOLVED → CANCELLED | CANCELLED |
| `updateTicket` | — | UPDATED |

📌 Todas las acciones validan:
- Estado actual
- Rol del usuario
- Reglas de negocio

📌 Todas generan historial obligatorio

---

## 🧹 6. Estados Terminales

Si `status ∈ { CLOSED, CANCELLED }`:

- ❌ No se permite cambiar estado
- ❌ No se permite editar información
- ❌ No se permite cancelar / resolver
- ✔️ Solo lectura + auditoría

---

## 📜 7. Auditoría / Historial (Obligatoria)

Modelo `TicketHistory`:

- Append-only
- Una entrada por acción válida
- No editable
- No eliminable

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

❌ Si falla el historial → rollback completo

---

## 🧠 8. Reglas de Negocio Críticas

| Regla                       | Aplicación |
| --------------------------- | ---------- |
| Backend es árbitro absoluto | Global     |
| No reabrir tickets          | Dominio    |
| No eliminación física       | Global     |
| No cambiar estados directo  | Dominio    |
| Historial obligatorio       | Dominio    |

🟢 Reglas aplicadas donde corresponde

---

## 👥 9. Modelo Cliente (Definitivo)

### Modelo `Client`

```prisma
model Client {
  rfc String @id
  companyName  String
  businessName String?
  location     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  tickets Ticket[]
}
```

### Relación con Ticket

```prisma
clientRfc String?
client    Client? @relation(fields: [clientRfc], references: [rfc])
```

✔️ RFC como identificador único
✔️ No destructivo
✔️ Escalable

---

## 🔄 10. Flujo Cliente al Crear Ticket

* Si RFC existe → se reutiliza
* Si no existe → se crea automáticamente
* El frontend **no decide**

---

## 📡 11. Endpoints Principales (Congelados)

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

📌 Contrato congelado v2.0.0

---

## 🌍 12. Variables de Entorno

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=
JWT_EXPIRES=8h
DATABASE_URL=
CORS_ORIGIN=
```

📌 Nunca subir `.env` reales
📌 JWT_SECRET debe rotarse en producción

---

## 🛠️ 13. Instalación y Ejecución

```bash
npm install
npm run start:dev
```

Producción:

```bash
npm run build
npm run start:prod
```

---

## 🔒 Estado del Artefacto

✔️ Contratos congelados
✔️ Modelo de dominio definido
✔️ Auditoría obligatoria
✔️ Backend listo para frontend real

---

## 🏁 Conclusión

Este backend **no es un prototipo**.

Es un **sistema empresarial real**, diseñado para:

* crecer
* auditarse
* integrarse
* mantenerse sin deuda técnica

📌 **Backend v2.0.0 — CONGELADO**

---

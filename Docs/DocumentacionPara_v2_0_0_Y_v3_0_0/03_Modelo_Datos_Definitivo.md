
---

# 📄 Modelo de Datos Definitivo — Gestor de Tickets DATRA (v2.0.0)

**Estado:** CONGELADO (Core del sistema)
**Responsable técnico:** Carlos Armenta
**Fecha:** Enero 2026

---

## 🎯 Propósito del documento

Este documento define el **modelo de datos definitivo** del sistema **Gestor de Tickets DATRA**, alineado **estrictamente** al schema Prisma v2.0.0 congelado.

📌 Este documento:

* Es la **fuente única de verdad del dominio**
* Describe **exactamente** lo que existe en base de datos
* No introduce abstracciones externas
* No define reglas que no estén respaldadas por el modelo
* Es válido para auditoría, operación y métricas reales

Cualquier implementación (backend, frontend, integraciones) **debe ajustarse a este modelo**, no al revés.

---

## 🧠 Principios rectores del modelo

1. El **backend y la base de datos representan el sistema**
2. Ninguna decisión crítica vive solo en frontend
3. No existen eliminaciones físicas
4. Todo cambio relevante queda registrado
5. Auditoría y métricas comparten la misma fuente
6. La trazabilidad tiene prioridad sobre la flexibilidad

---

## 👤 Entidad: User

### Descripción

Representa a los **usuarios internos del sistema** que interactúan con tickets y eventos.

Los usuarios se mantienen como **referencias históricas**, incluso cuando dejan de operar.

---

### Campos

* `id` (PK): Identificador interno
* `name`: Nombre del usuario
* `email` (unique): Identificador de autenticación
* `password`: Credencial cifrada
* `role`: Rol operativo (`ADMIN`, `TECNICO`, `INGENIERO`)
* `active`: Indica si el usuario puede operar
* `deactivatedAt`: Fecha de desactivación (si aplica)
* `createdAt`: Fecha de creación
* `updatedAt`: Última actualización

---

### Relaciones

* **User 1:N Ticket (createdBy)**
* **User 1:N Ticket (closedBy)**
* **User 1:N Ticket (cancelledBy)**
* **User 1:N TicketHistory**

---

### Reglas de dominio

* Un usuario **no se elimina físicamente**
* La desactivación **no rompe referencias históricas**
* Los eventos históricos conservan al usuario que los ejecutó

---

## 🏢 Entidad: Client

### Descripción

Representa a los **clientes reales de DATRA**, identificados fiscal y operativamente.

Es una entidad **estable**, diseñada para agrupar contratos de servicio y tickets, preservando trazabilidad histórica.

---

### Campos

* `rfc` (PK): Identificador fiscal único del cliente
* `clientNumber` (unique): Identificador interno de cliente
* `companyName`: Razón social
* `businessName`: Nombre comercial
* `location`: Ubicación principal
* `active`: Estado operativo del cliente
* `deactivatedAt`: Fecha de desactivación (si aplica)
* `createdAt`: Fecha de creación
* `updatedAt`: Última actualización

---

### Relaciones

* **Client 1:N ServiceContract**
* **Client 1:N Ticket**

---

### Reglas de dominio

* El RFC es **inmutable**
* Un cliente **no se elimina**
* Un cliente puede desactivarse sin perder historial
* La desactivación **no elimina contratos ni tickets**

---

## 🧾 Entidad: ServiceContract

### Descripción

Representa un **servicio contratado específico** por un cliente.

Define el **contexto contractual** que afecta la operación del ticket: prioridad y SLA.

---

### Campos

* `id` (PK): Identificador único
* `name`: Tipo de servicio (ENUM `ServiceContractName`)
* `priorityLevel`: Prioridad contractual (entero, menor = más prioridad)
* `slaHours`: SLA comprometido en horas
* `active`: Indica si el contrato está vigente
* `deactivatedAt`: Fecha de desactivación
* `clientRfc` (FK): Cliente propietario
* `createdAt`: Fecha de creación
* `updatedAt`: Última actualización

---

### Relaciones

* **ServiceContract N:1 Client**
* **ServiceContract 1:N Ticket**

---

### Reglas de dominio

* Un contrato **no se elimina**
* Puede desactivarse sin afectar historial
* La prioridad contractual **no sustituye** el impacto del ticket

---

## 🎫 Entidad: Ticket

### Descripción

Entidad central del sistema. Representa un **incidente operativo real** que atraviesa un ciclo de vida controlado.

Un ticket **nunca se elimina** y su estado siempre es explícito.

---

### Estados oficiales (`TicketStatus`)

* `OPEN`
* `RESOLVED`
* `CLOSED`
* `CANCELLED`

📌 Estados visuales, semáforos o clasificaciones **no forman parte del modelo**.

---

### Campos principales

* `id` (PK): Identificador interno
* `code` (unique): Código legible del ticket
* `status`: Estado actual
* `source`: Origen del ticket (`MANUAL`, `LIBRENMS`, `IMPORTED`)

---

### Timestamps del ciclo de vida

* `createdAt`: Persistencia del registro
* `openedAt`: Apertura efectiva
* `resolvedAt`: Paso a estado `RESOLVED`
* `closedAt`: Cierre definitivo
* `cancelledAt`: Cancelación

📌 Un ticket puede estar **RESOLVED sin estar CLOSED**.

---

### Contexto de negocio

* `clientRfc` (FK): Cliente afectado
* `serviceContractId` (FK): Servicio afectado
* `impactLevel`: Impacto del incidente
* `problemDescription`: Descripción del problema
* `eventLocation`: Ubicación del evento
* `estimatedStart`: Inicio estimado del incidente

---

### Información auditable

* `requestedBy`: Solicitante declarado
* `contactInfo`: Información de contacto
* `initialFindings`: Hallazgos iniciales
* `probableRootCause`: Causa probable
* `actionsTaken`: Acciones realizadas
* `serviceStatus`: Estado del servicio al cierre
* `additionalNotes`: Notas adicionales
* `correctiveAction`: Indica si hubo acción correctiva

---

### Responsabilidad de usuarios

* `createdById`
* `closedById`
* `cancelledById`

---

### Reglas de dominio

* Un ticket **no se elimina**
* Cancelar ≠ borrar
* Los estados `CLOSED` y `CANCELLED` son terminales
* Los tickets terminales no cambian de estado

---

## 📜 Entidad: TicketHistory (CORE DEL SISTEMA)

### Descripción

Registra **todos los eventos relevantes** ocurridos sobre un ticket.

Es la **fuente única de verdad** para auditoría, métricas y reconstrucción histórica.

---

### Campos

* `id` (PK): Identificador del evento
* `ticketId` (FK): Ticket afectado
* `eventType`: Tipo de evento
* `fromStatus`: Estado anterior (si aplica)
* `toStatus`: Estado resultante (si aplica)
* `performedById`: Usuario que ejecutó la acción
* `metadata`: Información adicional (JSON)
* `createdAt`: Fecha y hora del evento

📌 `performedById` puede ser **null** para eventos del sistema.

---

### Tipos de evento (`TicketEventType`)

* `CREATED`
* `STATUS_CHANGED`
* `UPDATED`
* `CLOSED`
* `CANCELLED`
* `COMMENT_ADDED`
* `IMPORTED_FROM_LIBRENMS`

📌 `RESOLVED` es un **estado**, no un evento.

---

### Reglas de dominio

* El historial es **append-only**
* No se edita ni se borra
* Cada cambio relevante genera un evento
* Toda auditoría se basa exclusivamente en este registro

---

## 📊 KPIs y métricas

Todas las métricas se derivan **exclusivamente** de:

* `Ticket`
* `TicketHistory`

No existen tablas de métricas ni estados calculados persistidos.

---

## 🔒 Estado del modelo

📌 Modelo **definitivo congelado en v2.0.0**
📌 Compatible con v3.0.0 sin cambios estructurales
📌 Cualquier modificación requiere revisión de arquitectura

---

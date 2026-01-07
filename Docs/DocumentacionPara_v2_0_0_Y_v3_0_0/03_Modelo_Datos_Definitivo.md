# 📄 Modelo de Datos Definitivo — Gestor de Tickets DATRA (v2.0.0)

**Estado:** CONGELADO (Core del sistema)

**Responsable técnico:** Carlos Armenta
**Fecha:** Enero 2026

---

## 🎯 Propósito del documento

Este documento define el **modelo de datos definitivo** del sistema **Gestor de Tickets DATRA**, a nivel **conceptual y de dominio**, independiente de cualquier implementación técnica (Prisma, SQL, NestJS, etc.).

📌 Este modelo:

* Es la **fuente de verdad del core del sistema**
* No debe reinterpretarse desde frontend
* No depende de herramientas específicas
* Está diseñado para **operación real**, auditoría y métricas

Cualquier implementación técnica **debe ajustarse a este documento**, no al revés.

---

## 🧠 Principios rectores del modelo

1. **El backend y la base de datos son el sistema**
2. **Nada crítico vive solo en frontend**
3. **Cancelar ≠ borrar**
4. **Todo cambio relevante genera historial**
5. **Auditoría y métricas comparten la misma fuente**
6. **El modelo prioriza integridad y trazabilidad sobre comodidad**

---

## 🏢 Entidad: Client

### Descripción

Representa a los **clientes reales de DATRA**, identificados legal y operativamente.

Es una entidad **estable**, diseñada para agrupar tickets, contratos de servicio y permitir auditoría histórica.

### Campos

* `rfc` (PK): Identificador fiscal único del cliente
* `clientNumber` (unique): Identificador interno de cliente
* `companyName`: Razón social
* `businessName`: Nombre comercial
* `location`: Ubicación principal del cliente
* `createdAt`: Fecha de creación del registro
* `updatedAt`: Última actualización

### Relaciones

* **Client 1:N ServiceContract**
* **Client 1:N Ticket**

### Reglas importantes

* Un cliente **no se elimina** si tiene tickets asociados
* El RFC se considera **dato estable e inmutable**

---

## 🧾 Entidad: ServiceContract

### Descripción

Representa un **servicio contratado específico** por un cliente.

Esta entidad define el **contexto operativo real** del ticket: prioridad, SLA y criticidad.

### Campos

* `id` (PK): Identificador único del contrato
* `name`: Nombre del servicio (ej. Enlace dedicado, VPN, Monitoreo)
* `priorityLevel`: Nivel de prioridad operativa
* `slaHours`: Horas de SLA comprometidas
* `clientRfc` (FK): Cliente al que pertenece el contrato
* `active`: Indica si el contrato está vigente

### Relaciones

* **ServiceContract N:1 Client**
* **ServiceContract 1:N Ticket**

### Reglas importantes

* Un contrato puede desactivarse sin perder historial
* La prioridad del contrato **no sustituye** el impacto del ticket

---

## 🎫 Entidad: Ticket

### Descripción

Entidad central del sistema. Representa un **incidente operativo real** que debe ser atendido, resuelto, cerrado o cancelado.

Un ticket tiene un **ciclo de vida finito**, nunca se borra y todo su historial debe poder reconstruirse.

### Estados oficiales

* `OPEN`
* `RESOLVED`
* `CLOSED`
* `CANCELLED`

📌 El semáforo o estados intermedios **no son estados del sistema**, son reglas operativas externas.

### Campos

* `id` (PK): Identificador interno
* `code`: Código legible del ticket
* `status`: Estado actual del ticket

#### Timestamps

* `createdAt`: Persistencia del registro
* `openedAt`: Inicio efectivo del ticket
* `closedAt`: Fecha de cierre (si aplica)
* `cancelledAt`: Fecha de cancelación (si aplica)

#### Contexto de negocio

* `clientRfc` (FK): Cliente asociado
* `serviceContractId` (FK): Servicio afectado
* `impactLevel`: Impacto real del incidente
* `problemDescription`: Descripción del problema
* `eventLocation`: Ubicación del evento

#### Responsabilidad

* `createdById`: Usuario que crea el ticket
* `closedById`: Usuario que cierra el ticket
* `cancelledById`: Usuario que cancela el ticket

### Reglas importantes

* Un ticket **nunca se elimina**
* Cancelar un ticket **no borra información**
* El estado final siempre es **CLOSED o CANCELLED**
* Cambios relevantes generan historial

---

## 📜 Entidad: TicketHistory (CORE DEL SISTEMA)

### Descripción

Registra **todas las acciones relevantes** realizadas sobre un ticket.

Es la **fuente única de verdad** para:

* Auditoría
* KPIs
* Métricas
* Reconstrucción histórica

### Campos

* `id` (PK): Identificador del evento
* `ticketId` (FK): Ticket afectado
* `eventType`: Tipo de evento ocurrido
* `fromStatus`: Estado anterior (si aplica)
* `toStatus`: Estado nuevo (si aplica)
* `performedById`: Usuario que realizó la acción
* `metadata`: Información adicional en formato JSON
* `createdAt`: Fecha y hora del evento

### Tipos de evento (eventType)

* `CREATED`
* `STATUS_CHANGED`
* `CANCEL_REQUESTED`
* `CANCELLED`
* `CLOSED`
* `UPDATED`
* `COMMENT_ADDED`
* `IMPORTED_FROM_LIBRENMS` (v3.0.0)

📌 **RESOLVED es un estado, no un evento**.

### Reglas importantes

* El historial es **append-only** (no se edita ni se borra)
* Cada cambio relevante del ticket genera un evento
* Auditoría y métricas se calculan desde aquí

---

## 👤 Entidad: User (referencia)

### Regla de dominio

Los usuarios:

* **No se eliminan físicamente**
* Se desactivan cuando dejan de operar
* Permanecen referenciables para auditoría

---

## 📊 KPIs y métricas

Todos los KPIs del sistema se derivan **exclusivamente** de:

* `Ticket`
* `TicketHistory`

Ejemplos:

* Tiempo OPEN → RESOLVED
* Tiempo RESOLVED → CLOSED
* Tiempo total del ticket
* Tiempo por estado
* Volumen por cliente
* Volumen por servicio
* Tickets cancelados vs cerrados

📌 No existen tablas de métricas separadas.

---

## 🔒 Estado del modelo

📌 **Modelo definitivo congelado para v2.0.0**
📌 Cualquier cambio estructural requiere revisión de arquitectura
📌 Prisma y la base de datos deben implementarse conforme a este documento

---

> “Primero un sistema que funcione todos los días.
> Después, uno que se automatice.”

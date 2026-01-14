# 🚀 Plan de Migración — Sprint 3 → v2.0.0

**Proyecto:** Gestor de Tickets DATRA
**Responsable técnico:** Carlos Armenta
**Estado:** PLAN DEFINITIVO (previo a ejecución)

Este documento define el **plan de migración controlada** desde el esquema **Sprint 3 (producción actual)** hacia el **modelo definitivo v2.0.0**, garantizando:

* Cero pérdida de información
* Preservación total de historial y auditoría
* Continuidad operativa
* Eliminación de deuda técnica

📌 Este plan **debe ejecutarse antes de cualquier cambio funcional** en backend o frontend.

---

## 1️⃣ Objetivo de la migración

Migrar el sistema desde un modelo:

* Con estados redundantes (`IN_PROGRESS`, `ON_HOLD`)
* Con soft delete
* Con cliente incompleto
* Con historial genérico

Hacia un modelo:

* Con **estados oficiales congelados**
* Sin soft delete
* Con **ServiceContract** explícito
* Con **TicketHistory** como core de auditoría y KPIs

---

## 2️⃣ Principios de migración (no negociables)

1. **Nunca borrar datos históricos**
2. **Todo dato migrado debe ser trazable**
3. **Los estados legacy se traducen, no se pierden**
4. **La migración es determinística y repetible**
5. **Primero estructura, luego lógica**

---

## 3️⃣ Estrategia general

La migración se realiza en **4 fases controladas**:

1. Congelación del sistema
2. Migración estructural
3. Migración de datos
4. Validación y corte

📌 Cada fase debe completarse y validarse antes de pasar a la siguiente.

---

## 4️⃣ Fase 0 — Preparación

### Acciones

* Backup completo de base de datos
* Backup del repositorio backend
* Congelar despliegues durante la migración
* Verificar que no existan migraciones pendientes

📌 **No continuar sin backup verificado**

---

## 5️⃣ Fase 1 — Migración estructural (Prisma)

### 5.1 Introducción de nuevas entidades

* Crear tabla `ServiceContract`
* Agregar campos definitivos a `Client`:

  * `clientNumber`
* Crear nuevos enums:

  * `TicketEventType`

### 5.2 Ajustes en Ticket

* Eliminar campos:

  * `deleteRequested`
  * `deletedAt`
  * `deletedById`

* Eliminar relaciones legacy:

  * `ticketsPreliminar`

* Agregar campos:

  * `serviceContractId`
  * `cancelledAt`
  * `cancelledById`

### 5.3 Estados

* Mantener enum `TicketStatus` temporalmente
* Marcar `IN_PROGRESS` y `ON_HOLD` como **legacy**

📌 **No eliminar estados aún**

---

## 6️⃣ Fase 2 — Migración de datos

### 6.1 Clientes

* Asignar `clientNumber` a clientes existentes
* Validar unicidad

---

### 6.2 Contratos de servicio

* Crear al menos un `ServiceContract` por cliente existente
* Marcar como `active = true`
* Asignar prioridad y SLA por defecto

📌 Permite enlazar tickets legacy sin pérdida

---

### 6.3 Tickets — Estados legacy

Traducción de estados:

| Estado Sprint 3 | Estado v2.0.0 |
| --------------- | ------------- |
| `OPEN`          | `OPEN`        |
| `IN_PROGRESS`   | `OPEN`        |
| `ON_HOLD`       | `OPEN`        |
| `RESOLVED`      | `RESOLVED`    |
| `CLOSED`        | `CLOSED`      |

📌 La semántica operativa se conserva
📌 No se pierde información

---

### 6.4 Tickets — Cancelaciones

* Tickets con `deleteRequested = true`:

  * `status → CANCELLED`
  * `cancelledAt = deletedAt`
  * `cancelledById = deletedById`

📌 Soft delete se transforma en cancelación explícita

---

### 6.5 Tickets — ServiceContract

* Asignar `serviceContractId` a todos los tickets
* Usar contrato por defecto del cliente

---

### 6.6 Historial

* Transformar `TicketHistory.action` → `eventType`
* Mapear:

  * Cambios de estado → `STATUS_CHANGED`
  * Eliminaciones → `CANCELLED`

📌 El historial se mantiene íntegro

---

## 7️⃣ Fase 3 — Limpieza estructural

### Acciones

* Eliminar estados legacy del enum:

  * `IN_PROGRESS`
  * `ON_HOLD`

* Eliminar campos legacy ya migrados

📌 Esta fase **solo ocurre cuando no quedan datos legacy**

---

## 8️⃣ Fase 4 — Validación

### Validaciones obligatorias

* Todos los tickets tienen:

  * Cliente
  * ServiceContract
  * Estado válido

* No existen tickets con estados legacy

* Historial consistente

* Conteos antes vs después coinciden

📌 Si algo falla, **rollback completo**

---

## 9️⃣ Corte final

* Desplegar backend v2.0.0
* Habilitar frontend compatible
* Reanudar operación

📌 No hay operación mixta

---

## 🔒 Estado del plan

📌 Plan de migración **APROBADO**
📌 Seguro, auditable y reversible
📌 Preparado para ejecución on-prem

---

> “Una migración bien hecha no se nota. Una mal hecha se paga durante años.”

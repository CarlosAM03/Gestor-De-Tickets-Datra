
---

# 📊 Historial, Auditoría y Métricas

**Gestor de Tickets DATRA — v2.0.0**

**Estado:** CONGELADO (Core del sistema)

**Dependencias:**
✔ Modelo de Datos v2.0.0
✔ Estados y Transiciones v2.0.0

📌 Este documento **no describe implementación**, describe **contratos de dominio**.
📌 Prisma, backend, reportes y BI **deben obedecerlo**.

---

## 1️⃣ Principio fundamental (no negociable)

> **El historial es el sistema.**
> El ticket es solo el estado actual.
> La auditoría y las métricas se calculan **exclusivamente** desde el historial.

No existen:

* Métricas precalculadas
* Tablas paralelas de KPIs
* Correcciones manuales de tiempos
* Reinterpretaciones desde frontend

📌 Si no está en `TicketHistory`, **no ocurrió**.

---

## 2️⃣ Entidad núcleo: TicketHistory

### 🎯 Propósito

`TicketHistory` registra **cada evento relevante y auditable** ocurrido sobre un ticket, de forma:

* Inmutable
* Ordenada cronológicamente
* Reconstruible en cualquier punto del tiempo
* Legal y operativamente auditable

📌 Es la **única fuente válida** para:

* Auditoría
* KPIs
* Métricas operativas
* Reconstrucción histórica
* Análisis post-mortem

---

### 🧱 Contrato lógico de TicketHistory

| Campo           | Descripción                                |
| --------------- | ------------------------------------------ |
| `id`            | Identificador único del evento             |
| `ticketId`      | Ticket afectado                            |
| `eventType`     | Tipo de evento ocurrido                    |
| `fromStatus`    | Estado anterior (si aplica)                |
| `toStatus`      | Estado nuevo (si aplica)                   |
| `performedById` | Usuario que ejecutó la acción (nullable)   |
| `metadata`      | Información contextual estructurada (JSON) |
| `createdAt`     | Timestamp exacto del evento                |

📌 **`createdAt` es la verdad absoluta del tiempo**
📌 `performedById` puede ser `null` en eventos automáticos o importados

---

## 3️⃣ Tipos oficiales de evento (`TicketEventType`)

### 🎫 Eventos de ciclo de vida

| EventType        | Cuándo ocurre                                      |
| ---------------- | -------------------------------------------------- |
| `CREATED`        | Creación inicial del ticket                        |
| `STATUS_CHANGED` | Transiciones `OPEN → RESOLVED`                     |
| `CLOSED`         | Transición `RESOLVED → CLOSED`                     |
| `CANCELLED`      | Transición a `CANCELLED` desde `OPEN` o `RESOLVED` |

📌 `RESOLVED` **no es evento**, es estado
📌 El evento describe el **cambio**, no el estado final

---

### 🛠️ Eventos operativos

| EventType       | Uso                                                |
| --------------- | -------------------------------------------------- |
| `UPDATED`       | Cambios relevantes de información del ticket       |
| `COMMENT_ADDED` | Comentarios técnicos, operativos o administrativos |

📌 **Toda variación informativa vive en `UPDATED + metadata`**
📌 No se crean nuevos eventos para cada caso de negocio

---

### 🔁 Eventos de sistema

| EventType                | Uso                                            |
| ------------------------ | ---------------------------------------------- |
| `IMPORTED_FROM_LIBRENMS` | Tickets creados automáticamente desde LibreNMS |

📌 Representa eventos **no humanos**
📌 Siempre documentados vía `metadata`

---

## 4️⃣ Reglas duras del historial (backend)

### ❌ Prohibido (sin excepción)

* Editar eventos existentes
* Eliminar eventos
* Reordenar eventos
* Modificar `createdAt`
* Alterar `performedById`
* Corregir métricas manualmente

---

### ✅ Permitido (único camino)

* Agregar nuevos eventos
* Documentar correcciones vía `UPDATED`
* Usar `metadata` para aclaraciones
* Registrar errores humanos sin borrar evidencia

📌 **Append-only o nada**

---

## 5️⃣ Reglas de auditoría (nivel sistema)

### 🔍 Qué debe poder reconstruirse

Desde `TicketHistory` debe poder conocerse **sin ambigüedad**:

* Quién creó el ticket
* Cuándo se creó
* Quién lo resolvió
* Quién lo cerró o canceló
* Cuánto tiempo estuvo en cada estado
* Qué campos cambiaron y cuándo
* Qué decisiones se tomaron y por qué

📌 Auditoría ≠ logging
📌 Auditoría = reconstrucción objetiva del pasado

---

### 🔐 Inmutabilidad garantizada

| Elemento        | Editable |
| --------------- | -------- |
| TicketHistory   | ❌        |
| Estados finales | ❌        |
| `createdAt`     | ❌        |
| `performedById` | ❌        |

📌 Un error **se documenta**, nunca se borra

---

## 6️⃣ Métricas oficiales del sistema (KPIs)

📌 **Todas las métricas se derivan de eventos + estados**

---

### ⏱️ Métricas de tiempo

#### Tiempo total del ticket

```
CREATED.createdAt → CLOSED.createdAt | CANCELLED.createdAt
```

---

#### Tiempo OPEN → RESOLVED

```
STATUS_CHANGED (OPEN → RESOLVED).createdAt
```

---

#### Tiempo RESOLVED → CLOSED

```
CLOSED.createdAt - STATUS_CHANGED (OPEN → RESOLVED).createdAt
```

---

### 📊 Métricas de volumen

* Tickets creados por periodo
* Tickets cerrados por periodo
* Tickets cancelados por periodo
* Tickets por cliente
* Tickets por contrato de servicio
* Tickets por impacto (`ImpactLevel`)

📌 Tickets `CANCELLED` **no cuentan como resueltos**

---

### ⚠️ Exclusiones explícitas

| Métrica           | Excluye                 |
| ----------------- | ----------------------- |
| SLA               | Tickets `CANCELLED`     |
| Tiempo resolución | Tickets sin `RESOLVED`  |
| Performance tech  | Eventos administrativos |

---

## 7️⃣ Reglas para tickets cancelados

* Permanecen en métricas de volumen
* Se excluyen de métricas de SLA
* Conservan historial completo
* Nunca se reabren
* Son parte del análisis histórico

📌 Cancelado ≠ inexistente
📌 Cancelado = decisión documentada

---

## 8️⃣ Compatibilidad futura (v3.0.0)

📌 Este contrato **permanece válido en v3.0.0** bajo estas reglas:

* No se agregan nuevos estados al ciclo de vida
* No se modifican eventos existentes
* Nuevas necesidades se expresan con:

  * `UPDATED` + metadata estructurada
  * Nuevos reportes, no nuevos eventos

📌 El historial **no se versiona**, se preserva

---

## 9️⃣ Principios finales (core del core)

1. Sin historial no hay sistema
2. Sin eventos no hay métricas
3. Sin reglas no hay auditoría
4. Backend valida todo
5. El tiempo no se discute

---

## 🔒 Estado del artefacto

📌 Documento **CONGELADO v2.0.0**
📌 Totalmente alineado con Prisma Schema real
📌 Apto para auditoría formal
📌 Apto para KPIs reales
📌 Seguro para evolución futura (v3.0.0)

---

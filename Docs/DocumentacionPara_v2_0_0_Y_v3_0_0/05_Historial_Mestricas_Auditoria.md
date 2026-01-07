Perfecto.
A partir de aquí entramos en **territorio core definitivo**.
Te entrego el **artefacto formal**, con criterio **senior, auditable y productivo**, listo para compartir con tu compañero y para usar como **fuente de verdad** en backend.

---

# 📊 Historial, Auditoría y Métricas

**Gestor de Tickets DATRA — v2.0.0**

**Estado:** CONGELADO
**Dependencias:**
✔ Modelo de Datos v2.0.0
✔ Estados y Transiciones v2.0.0

📌 Este documento **no describe implementación**, describe **contratos de dominio**.
📌 Prisma, backend y reportes **deben obedecerlo**.

---

## 1️⃣ Principio fundamental (no negociable)

> **El historial es el sistema.**
> Los tickets son el estado actual.
> Las métricas y la auditoría se calculan **exclusivamente** desde el historial.

No existen:

* Métricas “precalculadas”
* Tablas paralelas de KPIs
* Ajustes manuales de tiempos

---

## 2️⃣ Entidad núcleo: TicketHistory

### 🎯 Propósito

`TicketHistory` registra **cada evento relevante** ocurrido sobre un ticket, de forma:

* Inmutable
* Ordenada en el tiempo
* Reconstruible
* Auditable

📌 Es la **única fuente válida** para:

* Auditoría
* KPIs
* Métricas operativas
* Análisis histórico

---

### 🧱 Contrato lógico de TicketHistory

| Campo           | Descripción                    |
| --------------- | ------------------------------ |
| `id`            | Identificador único del evento |
| `ticketId`      | Ticket afectado                |
| `eventType`     | Tipo de evento ocurrido        |
| `fromStatus`    | Estado anterior (si aplica)    |
| `toStatus`      | Estado nuevo (si aplica)       |
| `performedById` | Usuario que ejecutó la acción  |
| `metadata`      | Información contextual (JSON)  |
| `createdAt`     | Timestamp exacto del evento    |

📌 **createdAt es la verdad absoluta del tiempo**

---

## 3️⃣ Tipos oficiales de evento (eventType)

### 🎫 Eventos de ciclo de vida

| EventType        | Cuándo ocurre                  |
| ---------------- | ------------------------------ |
| `CREATED`        | Al crear el ticket             |
| `STATUS_CHANGED` | En cualquier transición válida |
| `CLOSED`         | Al cerrar el ticket            |
| `CANCELLED`      | Al cancelar el ticket          |

📌 `RESOLVED` **no es evento**, es estado.

---

### 🛠️ Eventos operativos

| EventType          | Uso                          |
| ------------------ | ---------------------------- |
| `UPDATED`          | Cambios relevantes de campos |
| `COMMENT_ADDED`    | Comentarios técnicos         |
| `CANCEL_REQUESTED` | Solicitud previa a cancelar  |

---

### 🔁 Eventos de sistema / migración

| EventType              | Uso                                |
| ---------------------- | ---------------------------------- |
| `IMPORTED_FROM_LEGACY` | Migración Sprint 3                 |
| `SYSTEM_FIX`           | Correcciones técnicas documentadas |

📌 Estos eventos **no representan acciones humanas directas**

---

## 4️⃣ Reglas duras del historial (backend)

### ❌ Prohibido

* Editar eventos existentes
* Eliminar eventos
* Reordenar eventos
* Reescribir timestamps
* Corregir métricas “a mano”

### ✅ Permitido

* Agregar nuevos eventos
* Agregar metadata
* Generar eventos correctivos
* Documentar errores humanos

📌 **Append-only o nada**

---

## 5️⃣ Reglas de auditoría (nivel sistema)

### 🔍 Qué es auditable

Todo lo siguiente **debe poder reconstruirse**:

* Quién creó un ticket
* Quién lo resolvió
* Quién lo cerró o canceló
* Cuánto tiempo estuvo en cada estado
* Qué campos se modificaron
* Cuándo y por quién

---

### 🔐 Inmutabilidad

| Elemento        | Editable |
| --------------- | -------- |
| TicketHistory   | ❌        |
| Estados finales | ❌        |
| createdAt       | ❌        |
| performedBy     | ❌        |

📌 Cualquier “error” se **documenta**, no se borra.

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
STATUS_CHANGED (OPEN → RESOLVED)
```

---

#### Tiempo RESOLVED → CLOSED

```
STATUS_CHANGED (RESOLVED → CLOSED)
```

---

### 📊 Métricas de volumen

* Tickets creados por periodo
* Tickets cerrados por periodo
* Tickets cancelados por periodo
* Tickets por cliente
* Tickets por servicio

📌 Cancelados **NO cuentan** como resueltos

---

### ⚠️ Exclusiones

| Métrica             | Excluye                 |
| ------------------- | ----------------------- |
| SLA cumplimiento    | Tickets CANCELLED       |
| Tiempo resolución   | Tickets sin RESOLVED    |
| Performance técnico | Tickets administrativos |

---

## 7️⃣ Reglas para tickets cancelados

* Permanecen en métricas de volumen
* Se excluyen de métricas de SLA
* Conservan historial completo
* Nunca se reabren

📌 Cancelado ≠ inexistente

---

## 8️⃣ Migración desde Sprint 3 (historial legacy)

Durante la migración:

* Cada ticket existente genera:

  * `IMPORTED_FROM_LEGACY`
  * Estado inicial consistente
* Fechas originales se preservan
* Métricas previas **no se recalculan**

📌 Lo legacy se **documenta**, no se “maquilla”

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
📌 Apto para auditoría
📌 Apto para KPIs reales
📌 Apto para crecimiento futuro (v3.0.0)

---

### 🧠 Nota arquitectónica final

> *Un sistema sin historial confiable no es software,
> es una hoja de Excel con API.*

---

## 👉 Siguiente paso lógico (ya sí)

Ahora sí, con todo el core cerrado:

1️⃣ **Traducir contratos a backend (servicios / guards)**
2️⃣ **Traducir contratos a Prisma definitivo**
3️⃣ **Diseñar scripts de migración (Opción A)**

Cuando quieras, dime:
👉 **“Pasemos a los contratos de backend”**
y seguimos sin improvisar.


---

# 🗂️ HISTÓRICO CONSOLIDADO — 6 y 7 de enero 2026

**Gestor de Tickets DATRA — Diseño y cierre arquitectura v2.0.0**

---

## 📅 6 de enero — Cierre de arquitectura y dominio

### 1. Congelación definitiva del modelo de datos v2.0.0

**Decisión**

* Se congela Prisma Schema v2.0.0 como **fuente única de verdad**.

**Impacto**

* Backend, frontend e integraciones se alinean estrictamente.
* No se aceptan cambios estructurales en v2.x / v3.x.

---

### 2. TicketHistory elevado a CORE del sistema

**Decisión**

* `TicketHistory` es **append-only**, no editable ni borrable.
* Toda acción relevante genera evento.

**Impacto**

* Auditoría, KPIs y trazabilidad dependen solo de Ticket + TicketHistory.
* No se persisten métricas derivadas.

---

### 3. Estados de Ticket explícitos y terminales

**Decisión**

* Estados finitos:

  ```
  OPEN → RESOLVED → CLOSED
  OPEN → CANCELLED
  ```
* `CLOSED` y `CANCELLED` son terminales.

**Impacto**

* Se prohíben endpoints genéricos de cambio de estado.
* El frontend no controla el ciclo de vida.

---

### 4. Separación dominio tipado vs JSON persistido

**Decisión**

* Metadata de TicketHistory se define con DTOs tipados,
  pero se persiste como `Json` vía conversión explícita.

**Impacto**

* Flexibilidad futura sin migraciones.
* Aparecen warnings TS controlados (cast `unknown → InputJsonValue`).

---

### 5. ServiceContract como entidad real (no catálogo blando)

**Decisión**

* SLA y prioridad **se persisten por contrato**, no por ticket ni por cliente global.

**Impacto**

* SLA se calcula dinámicamente.
* Cambios contractuales no rompen historial.

---

## 📅 7 de enero — Contratos, integración y ejecución

### 6. Contrato de Endpoints declarado “CERRADO”

**Decisión**

* El contrato de endpoints v2.0.0 se considera **final**, aunque la implementación esté pendiente.

**Impacto**

* El frontend se desarrolla como consumidor pasivo.
* Cambios → solo en v3.0.0.

---

### 7. Frontend–Backend integración 1:1

**Decisión**

* No existen endpoints “de conveniencia”.
* No hay lógica duplicada en frontend.

**Impacto**

* Más control en backend.
* Menos flexibilidad inmediata en UI (riesgo aceptado).

---

### 8. Integración LibreNMS por Push HTTP (no polling)

**Decisión**

* LibreNMS **solo notifica eventos**, no gestiona tickets.

Endpoints:

* `POST /integrations/librenms/tickets`
* `POST /integrations/librenms/tickets/alert-clear`

**Impacto**

* LibreNMS no puede resolver, cerrar ni cancelar tickets.
* Auditoría completa de eventos externos.

---

### 9. Alert clear NO cambia estado del ticket

**Decisión**

* `alert clear` solo genera evento de historial (`UPDATED`).
* No hay resolución automática.

**Impacto**

* Se prioriza validación humana.
* Evita cierres falsos por intermitencia.

---

### 10. Módulo AdminImportClients

**Decisión**

* Se crea módulo exclusivo ADMIN para:

  * altas
  * ediciones
  * activaciones/desactivaciones
  * importaciones unitarias o pequeñas

**Impacto**

* Evita scripts manuales.
* No modifica Prisma.

---

### 11. CSV de importación 1:1 con modelo

**Decisión**

* CSV refleja directamente el modelo:

  * 1 fila = 1 ServiceContract
  * ENUMs estrictos
  * RFC repetible

**Impacto**

* Menor tolerancia a error.
* Mayor trazabilidad.

---

### 12. Plan de ejecución realista (8–11 enero)

**Decisión**

* Semana 1: implementación backend
* Semana 2: pruebas + hardening + integración frontend
* Semana 3: hardening frontend
* Semana 4: migración a app de escritorio

**Impacto**

* El backend **no puede ser el cuello de botella**.
* Única excusa válida de retraso: infraestructura on-prem.

---

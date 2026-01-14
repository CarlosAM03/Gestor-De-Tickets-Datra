
---

# 🔒 BOOTSTRAP — CONTEXTO OFICIAL PROYECTO DATRA

Estoy trabajando en el **Gestor de Tickets DATRA**.
Todo lo siguiente está **DISEÑADO, CONGELADO y NO ES DEBATIBLE** salvo que yo lo indique explícitamente.

---

## 📦 Contexto General

- Proyecto: Gestor de Tickets DATRA
- Backend: NestJS + Prisma + PostgreSQL (on-prem)
- Frontend: Consumidor pasivo (contrato 1:1)
- Versión activa: **v2.0.0**
- Próxima versión: v3.0.0 (sin romper v2)
- Estado actual: **Diseño cerrado, implementación en curso**
- Periodo crítico: **8–11 de enero (backend completo)**

---

## 🔒 Principios No Negociables

1. Auditoría completa
2. Historial inmutable (append-only)
3. Estados explícitos y finitos
4. No reapertura de tickets
5. Backend manda, frontend obedece
6. Nada de lógica implícita o “conveniente”

---

## 🎫 Tickets — Estados Congelados

Estados únicos:

```

OPEN → RESOLVED → CLOSED
OPEN → CANCELLED

```

- `CLOSED` y `CANCELLED` son terminales
- No existen estados intermedios
- No existe reapertura
- Errores se corrigen creando un nuevo ticket

---

## 📜 TicketHistory — Core del Sistema

- Fuente única de verdad
- Append-only
- No update / no delete
- Toda acción relevante genera evento
- Metadata JSON tipada → serializada

Eventos clave:
- CREATED
- UPDATED
- STATUS_CHANGED
- CLOSED
- CANCELLED
- IMPORTED_FROM_LIBRENMS

---

## 🧩 Modelo de Datos (Prisma v2.0.0)

Entidades congeladas:
- Ticket
- TicketHistory
- User
- Client
- ServiceContract

Reglas clave:
- Client: PK = RFC, no delete
- User: no delete, solo deactivate
- ServiceContract: múltiples por cliente
- SLA se calcula dinámicamente (no persistir semáforo)

---

## 🌐 Contrato de Endpoints

- Contrato HTTP **cerrado**
- Frontend consume 1:1
- No existen endpoints fuera del contrato
- No existe PATCH genérico de estado
- Errores de dominio → HTTP vía filtro global

---

## 🔐 Auth y Roles

- Auth existente (v1) **NO se modifica**
- Solo auditoría y validación
- Roles:
  - ADMIN
  - TECNICO
  - INGENIERO
- Guards globales obligatorios

---

## 🧠 Decisiones Técnicas

Existe un documento **Anexo — Decisiones Técnicas y Riesgos Aceptados** que:
- Congela arquitectura v2.x / v3.x
- Define riesgos aceptados
- Prohíbe cambios no documentados

👉 **Nada puede cambiar backend sin pasar por ese anexo**

---

## 🔌 Integración LibreNMS

- LibreNMS no controla el dominio
- Solo dispara solicitudes controladas
- No modifica tickets existentes
- Dedupe por `alert_id`
- Alert clear NO cambia estado

---

## 📥 Importación Administrativa

Existe un módulo ADMIN exclusivo:
- AdminImportClients
- Altas masivas (CSV)
- Ediciones controladas
- Sin cambiar modelo Prisma

---

## 🗓️ Plan de Implementación

Orden obligatorio:

1. Infraestructura base
2. TicketHistory
3. ServiceContracts
4. Tickets
5. Integración LibreNMS
6. Users
7. Clients
8. AdminImportClients
9. Hardening + pruebas

---

## 🎯 Objetivo Final v2.0.0

- Backend funcional y estable
- Auditoría completa
- KPIs futuros garantizados
- Frontend sin workarounds
- Cero cambios estructurales post-release

---

## 🚫 Prohibido

- Cambiar Prisma
- Crear estados nuevos
- Reabrir tickets
- Editar historial
- “Soluciones rápidas”

---

A partir de este punto:
👉 Responde **asumiendo TODO este contexto**
👉 No propongas rediseños
👉 Ayuda solo a **implementar correctamente**
```

---

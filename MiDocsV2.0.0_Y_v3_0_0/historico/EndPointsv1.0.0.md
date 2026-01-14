# 🧭 Inventario Oficial de Endpoints Actuales
**Gestor de Tickets DATRA — Backend**

**Versión del análisis:** Pre–v2.0.0  
**Estado:** DOCUMENTACIÓN DE REALIDAD  
**Fuente:** NestJS Route Explorer (07/01/2026)  

📌 Este documento **describe exactamente lo que existe en el código hoy**.  
📌 No define contratos futuros ni implementación deseada.  
📌 Es el insumo obligatorio previo a la migración de Prisma y cierre de arquitectura v2.0.0.

---

## 🎯 Objetivo del documento

1. Inventariar **endpoint por endpoint** existente
2. Clasificar cada uno como:
   - ✅ Mantener
   - ⚠️ Refactorizar
   - ❌ Eliminar
3. Detectar **incompatibilidades con v2.0.0**
4. Servir como checklist previo a:
   - Migración de esquema Prisma
   - Congelamiento definitivo de contratos
   - Alineación con frontend

---

## 🔐 1. Autenticación

### `POST /auth/login`

**Descripción:**  
Autenticación de usuario y emisión de JWT.

**Estado actual:**  
✔️ Implementado  
✔️ Estable  

**Decisión v2.0.0:**  
✅ **MANTENER**

**Observaciones:**  
- No muta dominio
- No viola reglas de auditoría
- Compatible con contratos congelados

---

## 👤 2. Usuarios

### `POST /users`

**Descripción:**  
Creación de usuario.

**Estado actual:**  
✔️ Implementado  

**Decisión v2.0.0:**  
⚠️ **REFACTORIZAR**

**Motivo:**  
- Debe alinearse a modelo sin delete
- Reglas de rol y activación deben endurecerse

---

### `GET /users`

**Descripción:**  
Listado de usuarios.

**Estado actual:**  
✔️ Implementado  

**Decisión v2.0.0:**  
⚠️ **REFACTORIZAR**

**Motivo:**  
- Debe filtrar usuarios activos (`active=true`)
- No debe exponer usuarios desactivados por defecto

---

### `GET /users/:id`

**Descripción:**  
Detalle de usuario.

**Estado actual:**  
✔️ Implementado  

**Decisión v2.0.0:**  
⚠️ **REFACTORIZAR**

**Motivo:**  
- Solo lectura
- Debe respetar estado activo / inactivo

---

### `DELETE /users/:id`

**Descripción:**  
Eliminación de usuario.

**Estado actual:**  
🚨 Implementado  

**Decisión v2.0.0:**  
❌ **ELIMINAR**

**Motivo:**  
- Viola regla fundamental: **NO DELETE JAMÁS**
- Usuarios deben desactivarse, no eliminarse
- Riesgo crítico de auditoría

---

## 🎫 3. Tickets (Core del sistema)

### `POST /tickets`

**Descripción:**  
Creación de ticket.

**Estado actual:**  
✔️ Implementado  

**Decisión v2.0.0:**  
✅ **MANTENER**

**Motivo:**  
- Compatible con modelo v2
- Genera ticket inicial
- Base del historial

---

### `GET /tickets`

**Descripción:**  
Listado de tickets (scope mine / all).

**Estado actual:**  
✔️ Implementado  

**Decisión v2.0.0:**  
✅ **MANTENER**

**Motivo:**  
- Operación de solo lectura
- No muta dominio

---

### `GET /tickets/:id`

**Descripción:**  
Detalle de ticket.

**Estado actual:**  
✔️ Implementado  

**Decisión v2.0.0:**  
✅ **MANTENER**

---

### `PATCH /tickets/:id`

**Descripción:**  
Actualización genérica de ticket.

**Estado actual:**  
⚠️ Implementado  

**Decisión v2.0.0:**  
⚠️ **REFACTORIZAR**

**Motivo:**  
- Debe limitarse a campos no estructurales
- No puede modificar estado ni timestamps críticos
- Debe generar evento `UPDATED`

---

### `PATCH /tickets/:id/status`

**Descripción:**  
Cambio genérico de estado.

**Estado actual:**  
🚨 Implementado  

**Decisión v2.0.0:**  
❌ **ELIMINAR**

**Motivo:**  
- El backend no expone cambios genéricos de estado
- Los estados solo cambian mediante acciones de dominio
- Viola contrato de transiciones explícitas

---

### `DELETE /tickets/:id`

**Descripción:**  
Solicitud de eliminación de ticket.

**Estado actual:**  
🚨 Implementado  

**Decisión v2.0.0:**  
❌ **ELIMINAR**

**Motivo:**  
- El sistema **no permite delete**
- Los tickets se cancelan por estado
- Riesgo crítico de auditoría y métricas

---

## 🧹 4. Flujos administrativos de eliminación

### `GET /tickets/admin/delete-requests`

### `PATCH /tickets/admin/:id/approve-delete`

### `PATCH /tickets/admin/:id/reject-delete`

**Descripción:**  
Flujo de solicitud y aprobación de eliminación.

**Estado actual:**  
🚨 Implementados  

**Decisión v2.0.0:**  
❌ **ELIMINAR TODO EL BLOQUE**

**Motivo:**  
- El concepto de delete no existe en v2.0.0
- Cancelación reemplaza completamente este flujo
- Incompatible con auditoría y KPIs

---

## 📜 5. Historial / Auditoría

### `GET /tickets/:id/history`

**Descripción:**  
Consulta del historial completo del ticket.

**Estado actual:**  
✔️ Implementado  

**Decisión v2.0.0:**  
✅ **MANTENER**

**Motivo:**  
- Es núcleo del sistema
- Fuente única de auditoría y métricas

---

## 📊 6. Resumen Ejecutivo

### ✅ Endpoints a MANTENER
- `POST /auth/login`
- `POST /tickets`
- `GET /tickets`
- `GET /tickets/:id`
- `GET /tickets/:id/history`

### ⚠️ Endpoints a REFACTORIZAR
- `POST /users`
- `GET /users`
- `GET /users/:id`
- `PATCH /tickets/:id`

### ❌ Endpoints a ELIMINAR
- `DELETE /users/:id`
- `PATCH /tickets/:id/status`
- `DELETE /tickets/:id`
- Todo el bloque `/tickets/admin/*delete*`

---

## 🔒 Estado del documento

📌 Documento de **realidad técnica**
📌 Previo a migración Prisma
📌 Base para arquitectura v2.0.0
📌 Apto para revisión técnica y auditoría

---

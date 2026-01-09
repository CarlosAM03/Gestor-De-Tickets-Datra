
---

# 🛣️ Roadmap Operativo Unificado

## Gestor de Tickets DATRA — v2.0.0 → v3.0.0

**Versión:** Operativa con roles definidos
**Periodo:** 05 de enero – 01 de febrero de 2026
**Estado:** Plan de ejecución oficial

---

## 📌 Propósito del Documento

Este documento define el **plan de trabajo único y alineado** para la entrega de **v2.0.0** del Gestor de Tickets DATRA, incluyendo:

* Dirección técnica del proyecto
* Responsabilidades claras por persona
* Límites explícitos de decisión
* Coordinación backend–frontend
* Preparación para operación real en infraestructura local

📌 **Este documento rige el trabajo de Carlos y Javier.**

---

## 🧭 Principio Rector del Proyecto

> **El backend y la base de datos son el sistema.**
> El frontend es una **interfaz de consumo**, no una fuente de reglas.

Por lo tanto:

* El core se diseña **una sola vez**
* Las reglas viven en backend y DB
* El frontend **se adapta**, no define
* El apoyo **ejecuta**, no decide arquitectura

---

## 👥 Roles Oficiales

### 👤 Carlos — Responsable Técnico / Arquitecto / Director del Proyecto

* Diseña el sistema
* Define reglas, modelos y contratos
* Decide arquitectura
* Aprueba cambios
* Ejecuta migración on-prem
* Responsable final ante la empresa

---

### 👤 Javier — Apoyo Técnico Frontend (Delegado)

* Implementa frontend **según contrato**
* Diseña visualizaciones
* Consume endpoints definidos
* No toma decisiones estructurales
* No modifica backend ni DB

📌 **Javier no es responsable del sistema**, es responsable de **su correcta implementación visual**.

---

# 🗓️ PLAN DE TRABAJO — v2.0.0

---

## 🟢 SEMANA 1 — Cierre del CORE Definitivo

**Periodo:** 05 – 11 de enero

### 🎯 Objetivo de la semana

Cerrar **de forma definitiva** el diseño del sistema pensando ya en v3.0.0, sin cambios estructurales posteriores.

---

### 👤 Carlos — Responsable Técnico (CORE)

#### ✅ Qué hacer

**Base de datos**

* Cerrar entidades definitivas:

  * Tickets
  * TicketHistory (eventos completos)
  * Clientes (RFC único)
  * Servicios (prioridad)
* Definir relaciones finales (1:N, índices, restricciones)
* Eliminar delete → usar estado `CANCELLED`

**Estados**

* Definir estados oficiales:

  * OPEN
  * RESOLVED
  * CLOSED
  * CANCELLED
* Definir transiciones válidas
* El semáforo es **regla operativa**, no estado

**Historial, métricas y auditoría**

* Definir estructura final de `ticket_history`
* Definir eventos registrados
* Definir datos necesarios para KPIs

**Backend**

* Endurecer seguridad
* Definir contratos finales (endpoints + DTOs)
* Documentar decisiones y límites

#### ❌ NO hacer

* No agregar features nuevas
* No tocar frontend
* No iniciar migración on-prem
* No dejar decisiones “para después”

---

### 👤 Javier — Apoyo Frontend (Lectura / Preparación)

#### ✅ Qué hacer

* Leer documentación del backend (solo lectura)
* Entender:

  * estados
  * flujos
  * endpoints
* Diseñar visualizaciones **sin lógica**:

  * historial
  * timelines
  * métricas
* Preparar mockups / wireframes
* Prepararse para implementar vistas de lectura

#### ❌ NO hacer

* No modificar DB
* No tocar Prisma
* No crear endpoints
* No definir reglas de negocio
* No asumir comportamientos no documentados

---

## 🟡 SEMANA 2 — Endurecimiento + KPIs

**Periodo:** 12 – 18 de enero

### 🎯 Objetivo de la semana

Congelar el backend y dejarlo **estable, medible y auditable**.

---

### 👤 Carlos — Responsable Técnico

#### ✅ Qué hacer

* Validar y congelar backend
* Aprobar queries de métricas:

  * duración total
  * tiempo por estado
  * métricas por cliente / servicio
* Cerrar endpoints definitivos
* Preparar backend para despliegue on-prem

#### ❌ NO hacer

* No reestructurar modelos
* No cambiar contratos
* No improvisar métricas
* No tocar frontend

---

### 👤 Javier — Apoyo Frontend / Implementación Guiada

#### ✅ Qué hacer

* Implementar endpoints **ya definidos** de:

  * historial (lectura)
  * métricas (lectura)
  * auditoría (lectura)
* Preparar DTOs de respuesta
* Ajustar queries bajo revisión de Carlos

#### ❌ NO hacer

* No tocar autenticación
* No crear endpoints de escritura
* No modificar reglas de estado
* No redefinir estructuras

---

## 🔵 SEMANA 3 — Integración Frontend + Desktop

**Periodo:** 19 – 25 de enero

### 🎯 Objetivo de la semana

Entregar un sistema usable y estable, alineado al core.

---

### 👤 Carlos — Responsable Técnico

#### ✅ Qué hacer

* Integrar frontend con backend real
* Validar flujos completos:

  * creación
  * cambios de estado
  * cancelación
  * historial
* Iniciar app de escritorio (Electron / Tauri)
* Freeze funcional del sistema

#### ❌ NO hacer

* No cambiar backend
* No agregar reglas nuevas
* No iniciar automatizaciones
* No “mejorar” sin justificar

---

### 👤 Javier — Apoyo Frontend

#### ✅ Qué hacer

* Implementar vistas de:

  * historial
  * métricas
  * auditoría
* Ajustes UI / UX
* Consumir endpoints existentes

#### ❌ NO hacer

* No crear lógica de negocio
* No alterar flujos
* No modificar contratos

---

## 🟣 SEMANA 4 — Operación Local y Cierre v2.0.0

**Periodo:** 26 de enero – 01 de febrero

### 🎯 Objetivo de la semana

Cerrar v2.0.0 **100% operativa en infraestructura local**.

---

### 👤 Carlos — Responsable Técnico

#### ✅ Qué hacer

* Migrar base de datos a servidor local
* Desplegar backend on-prem
* Configurar seguridad e infraestructura
* Preparar empaquetado e instalación desktop
* Pruebas de operación real
* Cierre formal de v2.0.0

#### ❌ NO hacer

* No agregar nuevas funcionalidades
* No cambiar reglas del sistema

---

### 👤 Javier — Apoyo Frontend

#### ✅ Qué hacer

* Ajustes finales de UI / UX
* Corrección de detalles visuales
* Validación visual del sistema

#### ❌ NO hacer

* No tocar lógica
* No modificar flujos
* No alterar backend

---

## ✅ Resultado Esperado al 01 de Febrero de 2026

✔ Backend y DB definitivos
✔ Operación real habilitada
✔ Infraestructura local funcional
✔ Frontend desktop estable
✔ Base sólida para v3.0.0

---

## 🧭 Nota Final (Regla de Oro)

* Toda duda → se pregunta antes
* Todo cambio → se valida primero
* La velocidad no justifica romper el core
* La documentación es parte del trabajo

---

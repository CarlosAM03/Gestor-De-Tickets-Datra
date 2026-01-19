
---

# 🚀 DOCUMENTO DE ARRANQUE OFICIAL — **SEMANA 3**

## Gestor de Tickets DATRA — v2.0.0

📅 **Periodo:** 19 – 25 de enero de 2026
📌 **Estado al arranque:** Backend estable y congelado / Frontend en alineación final

---

## 🎯 Objetivo General de la Semana 3

> **Lograr la alineación 100% funcional entre frontend y backend**, cerrando todos los módulos operativos del sistema **uno por uno**, dejando únicamente **pendiente la integración con LibreNMS**, idealmente limitada al frontend mientras se prepara su módulo backend final.

Al finalizar la semana, el sistema debe estar:

✔ Operativo de punta a punta
✔ Sin flujos rotos
✔ Sin contratos ambiguos
✔ Con backend estable
✔ Listo para cierre de v2.0.0

---

## 🧭 Principio Rector de la Semana

> **No se modifica el core.**
> Todo el trabajo consiste en **alinear, consumir y validar** lo ya definido.

Por lo tanto:

* ❌ No se crean reglas nuevas
* ❌ No se cambian modelos
* ❌ No se improvisan endpoints
* ❌ No se parchean flujos incompletos
* ✅ Se documenta todo ajuste necesario
* ✅ Se valida cada módulo antes de avanzar

---

## 🧱 Estado inicial al arranque de Semana 3

### ✅ Backend

* Estable
* Congelado
* Módulos cerrados:

  * Auth
  * Users
  * Clients
  * Service Contracts
* Pendiente **únicamente**:

  * Integración LibreNMS (contrato ya definido)

### 🖥️ Frontend

* Build limpio
* Autenticación funcional
* Navegación estable
* Módulos cerrados:

  * Auth
  * Users
  * Clients
  * Service Contracts
* Módulos **NO alineados aún (esperado)**:

  * Tickets
  * TicketHistory
  * Dashboard
  * Analytics
  * Import CSV

---

## 🗂️ ALCANCE EXACTO DE LA SEMANA 3

---

## 1️⃣ MÓDULO **TICKETS** (PRIORIDAD MÁXIMA)

### 🎯 Objetivo

Cerrar **flujo completo de tickets**, sin errores HTTP y con contrato estable:

* Crear ticket
* Ver ticket
* Cambiar estado
* Validar reglas
* Registrar historial

---

### Backend (referencia, NO rediseño)

Contrato existente:

* Estados válidos
* Transiciones definidas
* Validaciones activas

📌 **Regla:**
Si el frontend envía mal → se corrige frontend
Si falta dato documentado → se documenta, no se improvisa

---

### Frontend — Trabajo requerido

* Ajustar payload de creación de ticket
* Corregir `400 Bad Request`
* Alinear DTO con backend
* Validar:

  * cliente
  * contrato
  * prioridad
  * estado inicial
* Cerrar vistas:

  * TicketCreate
  * TicketView
  * TicketEdit

📌 **No se permite**:

* Hardcodear estados
* Inferir reglas
* Ignorar validaciones

---

### Resultado esperado

✔ Crear ticket sin errores
✔ Flujo completo funcional
✔ Contrato sellado

---

## 2️⃣ MÓDULO **TICKET HISTORY**

### 🎯 Objetivo

Garantizar **auditoría completa y confiable** del ciclo de vida del ticket.

---

### Backend

* Módulo existente
* Eventos definidos
* Sin cambios estructurales

---

### Frontend — Trabajo requerido

* Consumir historial en modo lectura
* Renderizar:

  * línea de tiempo
  * eventos
  * cambios de estado
* Sin lógica de negocio
* Sin escrituras directas

---

### Resultado esperado

✔ Historial visible y coherente
✔ Auditoría completa
✔ Base sólida para métricas

---

## 3️⃣ DASHBOARD — **LISTA GLOBAL DE TICKETS**

📌 **Definición clara**

> El **Dashboard** es la **vista operativa global del sistema**, no analítica.

---

### 🎯 Objetivo

Cerrar el dashboard como **lista maestra de tickets**:

* Todos los tickets
* Filtros por:

  * estado
  * cliente
  * prioridad
* Acceso por rol

---

### Backend

* Endpoint existente
* Sin modificaciones

---

### Frontend — Trabajo requerido

* Conectar al endpoint real
* Eliminar mocks
* Validar paginación / filtros
* Acciones permitidas según rol

---

### Resultado esperado

✔ Vista operativa usable
✔ Datos reales
✔ Navegación estable

---

## 4️⃣ DASHBOARD ANALYTICS — **MÉTRICAS**

📌 **Definición clara**

> Dashboard Analytics **NO lista tickets**, muestra **KPIs**.

---

### 🎯 Objetivo

Visualizar métricas **ya definidas por backend**, sin reinterpretarlas:

* Tiempo por estado
* Tickets por cliente
* Tickets por servicio
* Duración promedio
* Tendencias

---

### Backend

* Queries ya aprobadas
* Sin cambios de reglas

---

### Frontend — Trabajo requerido

* Consumir endpoints de métricas
* Renderizar gráficos
* No recalcular datos
* No inferir métricas

---

### Resultado esperado

✔ Métricas correctas
✔ Datos consistentes
✔ Base para v3.0.0

---

## 5️⃣ IMPORTACIÓN CSV — **CLIENTES**

📌 **Orden correcto**

> Solo se integra **después** de Tickets + History.

---

### 🎯 Objetivo

Habilitar alta masiva **real y segura** de clientes.

---

### Backend

* Módulo existente
* Sin cambios

---

### Frontend — Trabajo requerido

* Integrar flujo completo
* Preview
* Validaciones
* Manejo de errores

---

### Resultado esperado

✔ Importación funcional
✔ Validaciones visibles
✔ Sin romper clientes existentes

---

## 6️⃣ INTEGRACIÓN **LIBRENMS** (EXCEPCIÓN CONTROLADA)

### 📌 Regla especial

Este es el **único módulo nuevo permitido**.

---

### Backend — Alcance

* Crear módulo aislado
* Contrato ya definido
* Sin impacto en core
* Preparado para consumo frontend

---

### Frontend — Alcance ideal

* Integración solo visual (si da tiempo)
* Placeholder documentado si no

---

### Resultado esperado

✔ Módulo backend listo
✔ Contrato documentado
✔ Integración preparada

---

## 🧪 Testing y Validación — Semana 3

* Pruebas manuales completas
* Validación de flujos reales
* Revisión de permisos
* Verificación de métricas
* Confirmación de estabilidad

---

## 🚦 Criterio de CIERRE DE SEMANA 3

La semana se considera **cerrada** si:

✔ Tickets alineados 1:1
✔ History funcional
✔ Dashboard operativo
✔ Dashboard Analytics alimentado
✔ Frontend y backend sincronizados
✔ Solo LibreNMS pendiente (aislado)

---

## ❌ Lo que NO se hace en Semana 3

* No refactors
* No nuevas reglas
* No cambios de dominio
* No hacks visuales
* No “mejoras” no documentadas

---

## 🟢 ESTADO ESPERADO AL 25/01/2026

✔ Sistema usable end-to-end
✔ Backend congelado
✔ Frontend alineado
✔ Base sólida para cierre v2.0.0
✔ LibreNMS listo o en integración final

---

## 📌 ESTADO OFICIAL

**SEMANA 3: AUTORIZADA**
**Plan de trabajo: DEFINIDO**
**Riesgo técnico: CONTROLADO**
**Arquitectura: PROTEGIDA**

---


Perfecto. A continuación te entrego el **CHECKLIST DE VALIDACIÓN DIARIA — SEMANA 3**, diseñado **para uso operativo real**, alineado **día por día** (19 → 24/25 de enero), con criterios **objetivos de validación**, puntos de control claros y **sin adelantos irreales**.

Este documento está pensado para:

* marcar progreso diario,
* detectar bloqueos temprano,
* y justificar formalmente el cierre de la semana.

---

# ✅ CHECKLIST DE VALIDACIÓN DIARIA

## SEMANA 3 — Alineación Frontend ↔ Backend (1:1)

**Proyecto:** Gestor de Tickets DATRA
**Versión:** v2.0.0
**Periodo:** 19 – 25 de enero de 2026
**Estado base:** Backend congelado / Frontend en alineación final

---

## 🟢 DÍA 1 — LUNES 19 DE ENERO

### 🎫 **TICKETS — CREACIÓN (FOCO ABSOLUTO)**

### 🎯 Objetivo del día

Eliminar el `400 Bad Request` en la creación de tickets y sellar el **contrato real frontend ↔ backend**.

---

### ✅ Checklist Backend (solo referencia)

* [ ] Confirmar DTO real de creación de ticket
* [ ] Confirmar campos obligatorios:

  * cliente
  * serviceContract
  * prioridad
  * descripción
  * estado inicial
* [ ] Confirmar validaciones activas
* [ ] Confirmar error esperado ante payload inválido

📌 **Regla:** Backend NO se modifica.

---

### 🖥️ Checklist Frontend

**Archivos clave**

* `TicketForm.tsx`

* `TicketCreate.tsx`

* `TicketForm.css`

* [ ] Eliminar payload incompleto / incorrecto

* [ ] Ajustar DTO 1:1 con backend

* [ ] Validar selects:

  * cliente activo
  * contrato activo

* [ ] Validar estado inicial permitido

* [ ] Manejar errores 400 con feedback visible

* [ ] Confirmar que NO hay valores hardcodeados

* [ ] Confirmar que no se envían campos extra

---

### 🧪 Validación manual obligatoria

* [ ] Crear ticket válido → **201 / 200 OK**
* [ ] Crear ticket inválido → **400 esperado**
* [ ] Ticket aparece en lista
* [ ] No hay warnings en consola
* [ ] No hay errores silenciosos

---

### ✅ Criterio de cierre del día

✔ El formulario de creación de tickets funciona
✔ El contrato queda explícito
✔ El error 400 desaparece solo cuando el payload es correcto

---

## 🟢 DÍA 2 — MARTES 20 DE ENERO

### 🎫 **TICKETS — VISTA + CAMBIO DE ESTADO**

### 🎯 Objetivo del día

Cerrar el **flujo operativo del ticket** después de creado.

---

### 🖥️ Checklist Frontend

**Archivos clave**

* `TicketView.tsx`

* `TicketEdit.tsx`

* `TicketEditStatus.tsx`

* [ ] Cargar ticket por ID correctamente

* [ ] Renderizar:

  * estado
  * prioridad
  * cliente
  * contrato

* [ ] Validar acciones permitidas por rol

* [ ] Cambio de estado:

  * solo transiciones válidas
  * feedback visual

* [ ] Manejo correcto de errores 403 / 409

* [ ] Sin lógica de negocio en frontend

---

### 🧪 Validación manual

* [ ] Ver ticket recién creado
* [ ] Cambiar estado permitido → OK
* [ ] Intentar transición inválida → error esperado
* [ ] El estado se actualiza correctamente
* [ ] El ticket mantiene consistencia visual

---

### ✅ Criterio de cierre del día

✔ Flujo de ticket completo
✔ Estados alineados al backend
✔ Sin reglas duplicadas

---

## 🟢 DÍA 3 — MIÉRCOLES 21 DE ENERO

### 📜 **TICKET HISTORY — AUDITORÍA**

### 🎯 Objetivo del día

Cerrar **historial de ticket** como auditoría confiable.

---

### 🖥️ Checklist Frontend

**Archivos clave**

* `History.tsx`

* `History.css`

* [ ] Consumir endpoint real de historial

* [ ] Renderizar eventos cronológicos

* [ ] Mostrar:

  * cambios de estado
  * fechas
  * usuario

* [ ] Sin lógica de cálculo

* [ ] Sin escritura directa

* [ ] Manejo correcto de tickets sin historial

---

### 🧪 Validación manual

* [ ] Crear ticket → historial inicial
* [ ] Cambiar estado → evento registrado
* [ ] Historial coincide con acciones reales
* [ ] No hay duplicados
* [ ] No hay eventos “fantasma”

---

### ✅ Criterio de cierre del día

✔ Auditoría confiable
✔ Base sólida para métricas
✔ Sin acoplamiento indebido

---

## 🟢 DÍA 4 — JUEVES 22 DE ENERO

### 📊 **DASHBOARD — LISTA GLOBAL DE TICKETS**

### 🎯 Objetivo del día

Cerrar el **dashboard operativo** como vista principal del sistema.

---

### 🖥️ Checklist Frontend

**Archivos clave**

* `Dashboard.tsx`

* `Dashboard.css`

* `TicketsList.tsx`

* `TicketList.css`

* [ ] Eliminar mocks

* [ ] Conectar a endpoint real

* [ ] Listar TODOS los tickets

* [ ] Filtros funcionales:

  * estado
  * cliente
  * prioridad

* [ ] Acciones visibles según rol

* [ ] Navegación estable a TicketView

---

### 🧪 Validación manual

* [ ] Ver tickets creados
* [ ] Filtrar correctamente
* [ ] Cambiar estado desde vista operativa
* [ ] Sin recargas innecesarias
* [ ] Sin errores de permisos

---

### ✅ Criterio de cierre del día

✔ Dashboard usable
✔ Vista operativa real
✔ Flujo continuo tickets → detalle

---

## 🟢 DÍA 5 — VIERNES 23 DE ENERO

### 📈 **DASHBOARD ANALYTICS — MÉTRICAS**

### 🎯 Objetivo del día

Cerrar **visualización de KPIs**, sin reinterpretar datos.

---

### 🖥️ Checklist Frontend

**Archivos clave**

* `TicketsAnalyticsDashboard.tsx`

* `TicketsAnalyticsDashboard.css`

* [ ] Consumir endpoints reales

* [ ] Renderizar métricas:

  * tiempo por estado
  * tickets por cliente
  * tickets por servicio

* [ ] No recalcular datos

* [ ] No inferir métricas

* [ ] Manejo de datos vacíos

---

### 🧪 Validación manual

* [ ] Métricas coherentes con historial
* [ ] Cambios de estado reflejados
* [ ] Sin errores visuales
* [ ] Sin cálculos en frontend

---

### ✅ Criterio de cierre del día

✔ Analytics alineado
✔ KPIs confiables
✔ Base lista para v3

---

## 🟡 DÍA 6 — SÁBADO 24 / DOMINGO 25 DE ENERO

### 📥 **IMPORT CSV + CIERRE FINAL**

### 🎯 Objetivo del día

Cerrar importación CSV y validar sistema completo.

---

### 🖥️ Checklist Import CSV

* [ ] Integrar flujo completo frontend
* [ ] Preview funcional
* [ ] Validaciones visibles
* [ ] Manejo de errores
* [ ] No duplicar clientes
* [ ] No romper clientes existentes

---

### 🧪 Checklist final del sistema

* [ ] Crear ticket → ver → cambiar estado → ver historial
* [ ] Dashboard refleja cambios
* [ ] Analytics refleja métricas
* [ ] No hay errores críticos
* [ ] Build limpio
* [ ] Backend sin cambios no documentados

---

### ✅ Criterio de CIERRE DE SEMANA 3

✔ Frontend y backend alineados 1:1
✔ Sistema usable end-to-end
✔ LibreNMS único pendiente
✔ Backend estable y congelado

---

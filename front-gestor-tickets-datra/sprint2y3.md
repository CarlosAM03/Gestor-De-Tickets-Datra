
---

# ✅ Criterios de Aceptación — Sprint 3 (Definitivos)

> **Sprint 3 se considera CERRADO** cuando **TODOS** los puntos siguientes se cumplen.
>
> No se agregan features nuevas fuera de este alcance.

---

## 🎯 1. Core del Sistema de Tickets (OBLIGATORIO)

### El sistema debe permitir, sin errores:

* ✔️ Crear tickets (con cliente embebido)
* ✔️ Editar tickets
* ✔️ Cambiar estatus
* ✔️ Visualizar detalle completo
* ✔️ Solicitar eliminación
* ✔️ Aprobar / rechazar eliminación (ADMIN)
* ✔️ Ver historial (ADMIN)

### Condiciones de aceptación

* No hay errores silenciosos
* No hay validaciones duplicadas frontend/backend
* El backend es la fuente de verdad
* El frontend **solo refleja permisos**

🟢 **Estado esperado:** COMPLETAMENTE FUNCIONAL

---

## 👤 2. Permisos por Rol (UI Reflejada)

### El frontend debe:

| Rol       | Comportamiento esperado   |
| --------- | ------------------------- |
| ADMIN     | Ve todo, actúa sobre todo |
| TECNICO   | Solo tickets propios      |
| INGENIERO | Tickets globales          |

### Aceptación

* Botones ocultos o deshabilitados según rol
* `403` backend → mensaje claro
* **NUNCA** lógica de negocio en frontend

🟢 **Estado esperado:** CLARO, PREDECIBLE, SIN HACKS

---

## 🧹 3. Eliminación Controlada (Soft Delete)

### El sistema debe:

* Permitir solicitar eliminación
* Marcar tickets pendientes
* Permitir ADMIN aprobar / rechazar **desde lista**
* Reflejar estado visualmente

### Decisión confirmada

> ✔️ **NO es obligatorio** crear vista separada `DeleteRequests`
>
> ✔️ ADMIN puede gestionarlo desde `TicketsList`

🟢 **Estado esperado:** OPERATIVO Y PROFESIONAL

---

## 📊 4. Dashboard Final

### Debe cumplir:

* `scope=all`
* Actividad reciente real
* Sin edición
* Preparado para métricas futuras
* Sin errores de carga

🟢 **Estado esperado:** ESTABLE Y LIMPIO

---

## 👥 5. Gestión Básica de Usuarios (NUEVO — OBLIGATORIO)

Este punto **ES REQUISITO para cerrar Sprint 3**.

### Funcionalidades mínimas requeridas

#### 📄 Lista de Usuarios (ADMIN)

* Listado global
* Filtros:

  * Nombre de usuario
  * Rol
* Estado vacío controlado

#### 👁️ Vista de Usuario

* Datos del usuario
* Rol
* Información básica (solo lectura por ahora)

#### ➕ Crear Usuario

* Botón visible solo para ADMIN
* Redirección a formulario
* Formulario funcional (mínimo):

  * Usuario
  * Email
  * Rol
  * Password
* Validación backend

#### 🗑️ Eliminar Usuario

* Acción visible solo para ADMIN
* Confirmación
* Soft delete o desactivación (según backend actual)

🟢 **Estado esperado:** FUNCIONAL, AUNQUE SIMPLE

---

## 🧩 6. Calidad Técnica y UX

### Reglas de aceptación

* No errores críticos en consola
* Warnings documentados (ej. `TicketEditStatus.tsx`)
* Navegación fluida
* Mensajes claros
* UX coherente

🟡 **Errores no bloqueantes permitidos**, pero documentados.

---

# 🗓️ Plan de Trabajo — Próximos 3 Días (Ajustado)

📅 **Hoy:** 23 de diciembre de 2025
📅 **Presentación:** 5 de enero de 2026
📅 **Objetivo:** Sprint 3 cerrado antes del 28–29 de diciembre

---

## 🟢 Día 3 (24/12/2025) — Dashboard + Permisos UI

### Objetivo del día

> Cerrar **experiencia del usuario final**

### Checklist

* [ ] Dashboard final (`scope=all`)
* [ ] Actividad reciente
* [ ] Quitar cualquier acción editable
* [ ] Ocultar / deshabilitar botones por rol
* [ ] Documentar warning de `TicketEditStatus.tsx`
* [ ] Ajustes visuales y de funcionamiento finales:
  * TicketsList opciones de softdelete en las solicitudes (visible solo para admin)

🟢 **Resultado esperado:** Sistema usable por los 3 roles

---

## 🟢 Día 4 — Usuarios (ADMIN)

### Objetivo del día

> Completar **gestión del sistema**

### Checklist

* [ ] `UsersList.tsx`:

  * Listado real
  * Filtro por rol
  * Filtro por nombre
* [ ] `UserDetail.tsx`
* [ ] Botón crear usuario
* [ ] Formulario de creación funcional
* [ ] Acción eliminar usuario
* [ ] Permisos UI correctos

🟢 **Resultado esperado:** Admin controla el sistema completo

---

## 🟢 Día 5 — Limpieza Final + Validación

### Objetivo del día

> Dejar el sistema **listo para pruebas y demo**

### Checklist

* [ ] Revisión completa de flujos
* [ ] Limpieza de warnings
* [ ] Validación de errores
* [ ] Pruebas manuales por rol
* [ ] Ajustes menores UX
* [ ] Congelar features

🟢 **Resultado esperado:** **SPRINT 3 CERRADO**

---

# 🏁 Estado Esperado al Cerrar Sprint 3

| Área             | Estado Final          |
| ---------------- | --------------------- |
| Tickets          | ✅ Cerrado             |
| Soft Delete      | ✅ Cerrado             |
| Dashboard        | ✅ Cerrado             |
| Usuarios (ADMIN) | ✅ Básico              |
| Permisos         | ✅ Reflejados          |
| UX               | ✅ Profesional         |
| Producción       | 🟡 Lista para pruebas |

---

# 🧠 Conclusión Final

> Sprint 3 **ya no es experimental**.
>
> Con la gestión básica de usuarios:
>
> * El sistema es **realmente usable**
> * El ADMIN controla todo
> * Los otros roles trabajan sin fricción
>
> A partir de aquí:
>
> 👉 **Solo pruebas, pulido y preparación de demo**
>
> ❌ **No más features nuevas**

---

# 📘 Cierre de Día 3 

**Cierre de Módulos Principales**

📅 **Fecha:** 24 de diciembre de 2025
📦 **Sprint:** 3
🎯 **Objetivo del día:** Cerrar módulos clave para producción y dejar documentadas las consideraciones pendientes sin bloquear el avance.

---

## ✅ Módulos Cerrados para Producción

Durante el Día 3 se dio cierre funcional a los siguientes módulos, cumpliendo criterios de aceptación definidos para Sprint 3.

---

## 📊 Dashboard

### Estado

🟢 **CERRADO PARA PRODUCCIÓN**

### Funcionalidad validada

* Visualización de información global (`scope=all`)
* Actividad reciente real
* Acceso de solo lectura
* Sin acciones destructivas o de edición
* Carga estable sin errores críticos

### Consideraciones pendientes (no bloqueantes)

* 🔹 **Paginación**

  * Actualmente **NO implementada en backend**
  * Puede implementarse temporalmente en frontend:

    * 10 tickets por página
    * Orden:

      * Más reciente → más antiguo (default)
      * Invertible en el futuro
  * La implementación **NO debe romper contrato backend**
  * Se deja documentado para Sprint futuro

---

## 📋 TicketList

### Estado

🟢 **CERRADO PARA PRODUCCIÓN**

### Funcionalidad validada

* Listado de tickets según rol:

  * ADMIN → tickets globales
  * INGENIERO → tickets globales
  * TECNICO → tickets propios
* Filtros operativos:

  * Código
  * RFC
  * Estado
  * Impacto
* Indicadores visuales:

  * Impacto
  * Solicitudes de eliminación
* Acciones:

  * Ver ticket
  * Crear ticket
  * Aprobar / rechazar eliminación (solo ADMIN)

### Control de permisos

* UI refleja correctamente permisos
* Acciones administrativas ocultas para roles no autorizados
* Backend sigue siendo la fuente de verdad

### UX

* Estados vacíos controlados
* Carga con spinner
* Mensajes de éxito visibles
* Tabla clara y consistente

---

## 🎫 TicketView

### Estado

🟢 **CERRADO PARA PRODUCCIÓN**

### Funcionalidad validada

* Visualización completa del ticket:

  * Información general
  * Cliente
  * Incidente
  * Diagnóstico
  * Cierre
  * Auditoría
* Branding corporativo correcto
* Acciones según permisos:

  * Volver
  * Editar (según rol)
  * Exportar PDF

### Exportación PDF

* Se utiliza `window.print()`
* Se imprime **solo la card principal**
* Estilos de impresión definidos vía CSS

#### Consideración pendiente (no bloqueante)

* Algunos campos vacíos generan espacio en blanco en impresión
* Solución posible a futuro:

  * Ocultar secciones sin contenido en `@media print`
* **No prioritario**
* No afecta funcionalidad ni demo

---

## 🧩 TicketEditStatus

### Estado

🟡 **FUNCIONAL CON WARNING DOCUMENTADO**

* Flujo operativo
* No bloquea el sistema
* Warning conocido y documentado
* Corrección pendiente para fase de pulido

---

## 👥 Gestión de Usuarios

### Estado

🔴 **PENDIENTE — REQUERIDO PARA CIERRE FINAL DEL SPRINT**

Se deja documentado como **alcance obligatorio restante** para cerrar Sprint 3:

* Lista de usuarios (ADMIN)
* Filtros por rol y nombre
* Vista de usuario
* Crear usuario
* Eliminar / desactivar usuario

> ⚠️ Este módulo **NO se trabajó en Día 3**, pero queda oficialmente identificado como requisito pendiente.

---

## 🧪 Calidad Técnica

### Estado general

* Sin errores críticos en consola
* Flujos principales estables
* Permisos reflejados correctamente en UI
* Backend mantiene control de negocio
* Frontend actúa como capa de presentación

### Errores permitidos

* Warnings no incapacitantes documentados
* Ningún error bloquea demo o pruebas manuales

---

## 🏁 Conclusión del Día 3

> Con el cierre de **Dashboard**, **TicketList** y **TicketView**,
> el sistema ya es **usable de extremo a extremo** para:
>
> * ADMIN
> * INGENIERO
> * TECNICO
>
> El enfoque ahora pasa de **construcción** a **gestión y pulido**.

### Próximo paso inmediato

👉 Implementar **gestión básica de usuarios** para cerrar Sprint 3 oficialmente.

---
definamos la estructura esperada, el flujo de trabajo recomendado y la checklist para cerrar el modulo de usuario completamente el dia 4 del sprint 3 de manera profesional y estable para produccion  

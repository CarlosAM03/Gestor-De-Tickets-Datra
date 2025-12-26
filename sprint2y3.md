
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


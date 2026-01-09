
---

# 📘 Auditoría Técnica — Backend en Producción

**Proyecto:** Gestor de Tickets Datra
**Fecha:** 02 de enero de 2026
**Hora:** 5:45 pm – 7:03 pm
**Entorno:** Producción (Railway)
**Responsable:** Ingeniería Backend

---

## 🎯 Objetivo de la auditoría

Verificar el **estado real del backend en producción**, confirmando que:

* No existen errores críticos o silenciosos
* La autenticación y autorización funcionan correctamente
* Los códigos de respuesta HTTP son coherentes con el diseño
* No hay riesgos ocultos que afecten la demo o la estabilidad

---

## 🔍 Alcance

Se revisaron logs de los **últimos 3–5 días** para los siguientes flujos:

* Autenticación (`/auth/login`)
* Gestión de tickets (`/tickets`, `/tickets/:id`)
* Gestión de usuarios (`/users`, `/users/:id`)
* Control de sesión y autorización por token

📌 *No se realizaron cambios en el código backend durante esta auditoría.*

---

## 📊 Hallazgos

### 1️⃣ Respuestas HTTP 304 (Not Modified)

**Endpoints involucrados:**

* `/tickets`
* `/tickets/:id`
* `/users`
* `/users/:id`

**Análisis:**

* Respuesta generada por mecanismos estándar de cache HTTP
* El cliente envía validadores (`If-None-Match`, `If-Modified-Since`)
* El servidor responde correctamente evitando payload innecesario

**Conclusión:**

✔ Comportamiento esperado
✔ No representa error ni riesgo
✔ Backend responde de forma eficiente

---

### 2️⃣ Respuestas HTTP 401 (Unauthorized)

**Contexto observado:**

* Se generan únicamente cuando:

  * Las credenciales son inválidas
  * El request no cumple con autenticación esperada

**Validación manual:**

* Se forzó credencial incorrecta desde frontend en producción
* El backend respondió correctamente con `401`

**Conclusión:**

✔ Autenticación correctamente implementada
✔ No se detectaron falsos positivos
✔ No hay fallas de seguridad evidentes

---

### 3️⃣ Logout y tráfico backend

**Observación:**

* No se detectan requests backend asociados al logout

**Análisis:**

* El logout actual es **frontend-only**
* Limpia token / estado local
* No existe endpoint `/auth/logout` (por diseño)

**Conclusión:**

✔ Comportamiento esperado
✔ No es error backend
✔ Cualquier ajuste de logout pertenece al frontend

---

### 4️⃣ Respuestas exitosas

Se confirmaron respuestas consistentes con códigos:

* `200 OK`
* `201 Created`
* `202 Accepted`
* `204 No Content`

**Conclusión:**

✔ Flujo normal
✔ Sin excepciones ni errores inesperados

---

## 🗄️ Observaciones sobre la base de datos (no bloqueantes)

### Tabla `tickets`

Campos que actualmente pueden permanecer en `null` o vacío:

* `serviceStatus`
* `closingTechnicianId`
* `preliminaryById`
* `deletedById`
* `estimatedStart`

**Evaluación:**

* Campos asociados a etapas futuras del ciclo de vida del ticket
* No afectan integridad, queries ni flujos actuales
* No generan errores en producción

📌 *Estado aceptado para Sprint 4.5.*

---

### Tabla `TicketHistory`

**Observaciones:**

* Inconsistencias en:

  * `fromValue`
  * `toValue`
  * `clientRFC`
* No refleja aún un historial completo y auditable del ticket

**Evaluación:**

* Deuda técnica conocida
* No rompe producción
* No impacta la demo

📌 *Requiere rediseño estructural → se agenda para sprint posterior.*

---

## ✅ Conclusión General

> **El backend en producción se encuentra estable, seguro y sin errores desconocidos.**

* No se detectaron fallos críticos
* La autenticación y autorización funcionan correctamente
* Los códigos HTTP observados son coherentes con el diseño
* No se requieren cambios backend para la demo

📌 **Decisión técnica:**
Backend **congelado** durante estabilización silenciosa.

---

## 🧭 Acciones derivadas

* ❌ No tocar backend
* ✔ Documentar observaciones
* ✔ Continuar estabilización en frontend
* ✔ Mantener control estricto de cambios

---

## 🛑 Cierre de auditoría

**Estado:** COMPLETADA
**Nivel de riesgo:** BAJO
**Impacto en demo:** NULO

---

# 📄 Auditoría Técnica — Frontend en Producción (PRE-FIX)

**Sistema:** Gestor de Tickets DATRA
**Entorno:** Producción
**Fecha:** 02 de enero de 2026
**Fase:** Estabilización silenciosa — Sprint 4.5
**Estado:** Auditoría completada · Sin cambios aplicados aún

---

## 🎯 Objetivo de la auditoría

Evaluar el comportamiento del **frontend en producción** ante:

* Logout
* Refresh de rutas
* Carga de assets estáticos
* Integración con backend ya validado

El objetivo es **identificar riesgos reales de demo**, determinar el **origen del fallo** y **decidir con criterio** si el ajuste entra en esta fase o se pospone.

---

## 🧱 Contexto previo

* El **backend ya fue auditado** y validado en producción.
* Los endpoints críticos (`auth`, `tickets`, `users`) responden correctamente.
* No existen errores desconocidos ni excepciones silenciosas en backend.
* El problema se manifiesta **exclusivamente desde la UI en producción**.

---

## 🔍 Evidencia observada en producción (Vercel)

### 1️⃣ Comportamiento tras logout y refresh

Al realizar **logout** o **refrescar manualmente** cualquier ruta distinta de `/`, se presenta el siguiente error:

```text
404: NOT_FOUND
Code: NOT_FOUND
ID: sfo1::wktmz-1767412960715-c7d18d403374
```

Referencia oficial:
[https://vercel.com/docs/errors/NOT_FOUND](https://vercel.com/docs/errors/NOT_FOUND)

📌 Este error **no aparece durante navegación interna** mientras la sesión está activa.

---

### 2️⃣ Errores de carga de assets estáticos

Se detectan errores `404` en recursos estáticos:

```text
GET /src/assets/vacio.png        → 404 (Not Found)
GET /src/assets/datra-logo.png   → 404 (Not Found)
```

**Observación clave:**

* Estas rutas funcionan en entorno local
* No existen en el bundle final de producción
* Vercel intenta resolverlas como rutas reales

---

## 📊 Evaluación funcional del Logout

| Componente evaluado        | Resultado  | Evidencia                       |
| -------------------------- | ---------- | ------------------------------- |
| Eliminación de token       | ✅ Correcto | Token eliminado del storage     |
| Limpieza de estado de auth | ✅ Correcto | Contexto `useAuth` vacío        |
| Redirección post-logout    | ⚠️ Parcial | Ocurre, pero falla al refrescar |
| Persistencia tras refresh  | ❌ No       | 404 en rutas protegidas         |
| Expiración de token        | ✅ Correcto | Acceso bloqueado                |

📌 **No se detecta comportamiento incorrecto en autenticación**.

---

## 🧠 Análisis técnico

### ❌ Lo que NO es el problema

* Autenticación (JWT)
* Expiración de sesión
* CORS
* Backend
* Base de datos

### ✅ Lo que SÍ es el problema

1. **Routing SPA no configurado para producción**

   * Vercel resuelve rutas como archivos físicos
   * Rutas internas (`/dashboard`, `/tickets/:id`) no existen como archivos
   * El refresh provoca `404 NOT_FOUND`

2. **Uso incorrecto de rutas de assets**

   * `/src/assets/*` solo existe en desarrollo
   * En producción los assets deben resolverse desde el bundle

📌 Ambos puntos corresponden a **configuración de frontend**, no a lógica de negocio.

---

## 📌 Decisión técnica documentada

### ✔ El ajuste **es candidato a corrección inmediata** porque:

* Bug **determinista**
* Alcance **local al frontend**
* No impacta backend
* No impacta autenticación
* Riesgo bajo
* Impacto directo en demo y UX

### ❌ No se pospone porque:

* No implica refactor
* No implica arquitectura
* No compromete flujos críticos

📌 Se autoriza **un único commit correctivo**, limitado estrictamente a:

* Routing SPA en Vercel
* Resolución correcta de assets estáticos

---

## 🚫 Alcance excluido (documentado para hardening posterior)

Quedan **fuera de este fix**:

* Reestructuración de `TicketHistory`
* Auditoría histórica de acciones
* Corrección de datos legacy
* Cascadas y soft-delete auditables
* Campos no expuestos en UI (`estimatedStart`, etc.)

📌 Estos puntos se documentan como **mejoras post-demo**.

---

## 🧭 Estado al cierre de la auditoría

* Frontend auditado en producción
* Backend previamente validado
* Origen del fallo identificado
* Riesgo acotado
* Decisión tomada con evidencia
* **Sin cambios aplicados aún**

---

# 📄 DOCUMENTACIÓN DE CIERRE — ESTABILIZACIÓN SILENCIOSA (02 DE ENERO)

## 1️⃣ Estado final del sistema

**Resultado del ajuste:**

✔ Login funcional
✔ Dashboard estable
✔ Refresh en rutas protegidas sin 404
✔ Logout correcto
✔ Assets cargan correctamente en producción
✔ Sin errores en consola
✔ Sin tráfico indebido a backend tras logout

👉 **El sistema queda congelado y listo para demo.**

---

## 2️⃣ Incidente identificado (Frontend)

### 📌 Síntoma observado

* Error `404 NOT_FOUND` en Vercel al:

  * refrescar rutas internas (`/dashboard`)
  * ejecutar logout
* Assets (`vacio.png`, `datra-logo.png`) no cargaban en producción

---

### 📌 Root Cause (confirmado)

**Configuración incompleta de SPA en Vercel:**

* Vercel no redirigía rutas internas a `index.html`
* Assets eran referenciados con paths inválidos en runtime (`/src/assets/*`)

👉 **No era un problema de backend, auth ni base de datos.**

---

## 3️⃣ Corrección aplicada (Scope controlado)

### ✔ Cambios realizados

* Se agregó configuración de **SPA routing** (`vercel.json`)
* Se corrigió la resolución de assets usando imports de Vite

### ✔ Características del fix

* Frontend-only
* Determinista
* Riesgo bajo
* Sin refactor
* Sin tocar backend ni auth
* Un solo commit

---

## 4️⃣ Validación post-fix (Producción)

### Checklist ejecutado y aprobado

| Prueba                     | Resultado |
| -------------------------- | --------- |
| Login                      | ✔ OK      |
| Dashboard                  | ✔ OK      |
| Refresh `/dashboard`       | ✔ OK      |
| Logout                     | ✔ OK      |
| Refresh `/login`           | ✔ OK      |
| Assets (`vacio.png`, logo) | ✔ OK      |
| Network / Console          | ✔ Limpio  |

👉 **Fix validado en producción.**

---

## 5️⃣ Riesgos conocidos (Aceptados conscientemente)

### ⚠️ Caso detectado (NO bloqueante para demo)

**Escenario:**
Si un usuario es eliminado manualmente (o por inconsistencia histórica) y existen tickets relacionados:

* Dashboard:

  * Campo `createdBy` puede aparecer vacío → **NO rompe**
* TicketView:

  * Puede romper si `createdBy === null`

📌 **Estado actual:**

* No hay tickets conflictivos en producción (limpieza manual realizada)
* El demo NO cubre eliminación de usuarios ni historial avanzado

---

## 6️⃣ Decisión técnica sobre el riesgo

### ❌ No corregido en este sprint porque:

* Requiere:

  * reestructuración de ticket history
  * eliminación en cascada
  * soft delete en usuarios
  * Cambios de backend con riesgo
  * Fuera del alcance del demo

👉 **Decisión consciente, documentada y justificada.**

---

## 7️⃣ Acción futura planificada (Sprint Hardening)

### 🔧 Acciones pendientes (documentadas)

* Aplicar `softDelete` en usuarios
* Reestructurar `ticket history`
* Definir reglas claras de eliminación en cascada
* Blindar `TicketView` contra `null` defensivamente (frontend)
* Normalizar consistencia entre Dashboard y TicketView

📌 **Se retomará después del demo.**

---

## 8️⃣ Conclusión ejecutiva

> El sistema se encuentra **estable, controlado y validado en producción**.
> Los riesgos conocidos están **identificados, documentados y aceptados conscientemente**.
> No existen fallos que comprometan la demo ni la presentación a inversionistas.

---

## ✅ Estado final del día

```bash
fix: spa routing and asset resolution in production
```

✔ Sistema congelado
✔ Producción estable
✔ Riesgos claros
✔ Demo protegida

---

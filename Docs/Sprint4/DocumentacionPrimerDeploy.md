
---

# 📘 CIERRE OFICIAL — DÍA 3 · SPRINT 4

**Proyecto:** Gestor de Tickets DATRA
**Fecha:** 01 de enero de 2026
**Sprint:** Sprint 4 — Producción y Validación
**Responsable técnico:** Carlos Armenta
**Estado del día:** ✅ **COMPLETADO**

---

## 🎯 Objetivo del Día 3

> **Desplegar el frontend en producción real y conectarlo correctamente al backend productivo**, validando el flujo completo de autenticación, autorización y operación básica del sistema.

### Declaración de cierre

> **Al finalizar el Día 3, el sistema se encuentra accesible públicamente, operativo y conectado a infraestructura productiva real.**

---

## 🧠 Contexto previo

* Sprint 3 cerrado y congelado
* Backend desplegado en producción (Railway)
* Base de datos PostgreSQL productiva activa
* Migraciones aplicadas correctamente
* API validada vía cliente REST
* Variables de entorno definidas y aisladas

📌 **No existía deuda técnica crítica bloqueante al inicio del Día 3.**

---

## 🌐 Infraestructura efectiva (confirmada)

| Componente    | Plataforma            | Estado     |
| ------------- | --------------------- | ---------- |
| Frontend      | Vercel                | Producción |
| Backend       | Railway               | Producción |
| Base de Datos | PostgreSQL gestionado | Producción |
| ORM           | Prisma 5.16.1         | Congelado  |
| Auth          | JWT                   | Activo     |

---

## 🧱 BLOQUE 1 — Build del Frontend

**Estado:** ✅ Completado

### Validaciones realizadas

* Build productivo ejecutado con éxito
* Sin errores de TypeScript bloqueantes
* Sin referencias a `localhost` en producción
* Variables de entorno correctamente leídas

### Incidencia detectada

* Error de runtime por acceso a propiedades `null` en tickets históricos

### Causa raíz

* Eliminación de usuario ADMIN base con tickets asociados
* Campos relacionales (`createdBy`) quedaron en `null`

### Resolución aplicada

* Defensa explícita contra `null` en frontend
* Uso de optional chaining y valores por defecto
* Fix aplicado y **commiteado para producción**

📌 *El sistema ahora es resiliente ante datos históricos incompletos.*

---

## 🔌 BLOQUE 2 — Configuración en Vercel

**Estado:** ✅ Completado

* Proyecto importado correctamente
* Framework detectado automáticamente
* Build y output configurados
* HTTPS activo por defecto
* Dominio público accesible

📌 **Infraestructura frontend establecida correctamente.**

---

## 🔑 BLOQUE 3 — Variables de Entorno Frontend

**Estado:** ✅ Completado

### Variables productivas configuradas

* `VITE_API_URL` → Backend Railway productivo
* `APP_ENV=production`

### Observación importante

Durante el día se detectaron **deploys previos con variables inconsistentes**, lo que generó confusión temporal.
Se realizó **limpieza conceptual y estabilización final**, quedando un flujo único y correcto.

📌 *Configuración final validada.*

---

## 🚀 BLOQUE 4 — Deploy del Frontend

**Estado:** ✅ Completado

### Validaciones

* Deploy exitoso
* HTTPS activo
* Dominio accesible públicamente
* UI visible y navegable

### Incidencia menor (no bloqueante)

* Asset `vacio.png` retorna 404

**Causa:**
Ruta absoluta incorrecta (`/src/assets/...`) en entorno productivo.

**Impacto:**
❌ No afecta lógica ni flujo
📌 Se documenta como deuda técnica menor.

---

## 🔗 BLOQUE 5 — Integración Frontend ↔ Backend

**Estado:** ✅ Completado (con incidencias documentadas)

### Flujos verificados desde UI

| Flujo                               | Resultado |
| ----------------------------------- | --------- |
| Login con credenciales válidas      | ✅         |
| JWT recibido y persistido           | ✅         |
| Roles (ADMIN / INGENIERO / TECNICO) | ✅         |
| Rutas protegidas                    | ✅         |
| CRUD de tickets                     | ✅         |
| CRUD de usuarios                    | ✅         |

### Incidencia crítica detectada y resuelta

#### Eliminación de usuario ADMIN base

* Tickets históricos quedaron con relaciones nulas
* Provocó crash inicial del dashboard en producción

#### Acción tomada

* Eliminación manual de tickets históricos afectados
* Fix defensivo en frontend
* Commit aplicado

📌 *No se corrige hoy la política de eliminación en cascada; se documenta para hardening posterior.*

---

## 🧪 BLOQUE 6 — Validación final y seguridad

**Estado:** ✅ Completado

### Checklist cumplido

* HTTPS activo
* CORS restringido al dominio real
* JWT con expiración
* Backend validado vía Thunder Client
* UI estable post-fix

📌 **Sistema usable por terceros.**

---

## ⚠️ Deuda técnica identificada (no bloqueante)

### 1️⃣ Eliminación de usuarios con relaciones activas

* Relaciones quedan en `null`
* Falta definir:

  * Soft delete
  * Restricción
  * Reasignación automática

📌 *Pendiente para Sprint 5.*

---

### 2️⃣ Logout redirige a Not Found

* Ruta no manejada correctamente en frontend

📌 *Pendiente para Sprint 5.*

---

### 3️⃣ Assets estáticos en producción

* `vacio.png` no cargado correctamente

📌 *Pendiente para hardening UX.*

---

## 🗄️ Estado actual de la Base de Datos

| Campo                     | Estado |
| ------------------------- | ------ |
| `serviceStatus`           | `null` |
| `closingTechnicianId`     | `null` |
| `ticketHistory.formValue` | `null` |

📌 *Estados válidos según reglas actuales del dominio.*

---

## 📄 Documentación generada

* Arquitectura productiva
* Variables requeridas (sin valores)
* Flujo de deploy frontend y backend
* Decisiones técnicas críticas
* Riesgos y deuda técnica

---

## ✅ Declaración de cierre del Día 3

✔ Frontend desplegado en producción
✔ Backend operativo
✔ Integración completa validada
✔ Roles y seguridad funcionales
✔ Sistema accesible públicamente
✔ Incidencias reales entendidas y controladas

> **Sprint 4 — Día 3 cerrado conforme a lo planeado.**

---

## 🧠 Evaluación técnica final

Lo ocurrido durante el día **no fue un error**, fue el comportamiento esperado de un sistema al:

* Salir de entorno controlado
* Operar con datos reales
* Exponer relaciones reales de negocio


---

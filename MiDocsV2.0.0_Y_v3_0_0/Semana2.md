
---

# 🛣️ CRONOGRAMA REAL Y SEGURO

**Gestor de Tickets DATRA — v2.0.0**
**Corte de planeación:** 14–19 de enero de 2026

---

## 🧭 PRINCIPIO DEL CRONOGRAMA

* 🔒 **El contrato backend está congelado**
* 🧠 **El frontend ya fue auditado**
* ⚠️ **No se aceptan avances “a ciegas”**
* ✅ Build limpio = permiso para pruebas en ejecución
* ❌ Sin build limpio → no se avanza de fase

Este cronograma **protege**:

* la calidad
* a tu compañero
* Semana 3
* el despliegue on-prem

---

# 🗓️ MIÉRCOLES 14 DE ENERO

**Inicio real:** ~3:00 PM
**Objetivo del día:** **BUILD LIMPIO + FRONT 1:1 EJECUTABLE**

---

## 🎯 OBJETIVO ÚNICO (NO NEGOCIABLE)

> **Conseguir build limpio con frontend 100% alineado al backend**
> y dejar el sistema **ejecutable para pruebas reales el jueves**.

No métricas.
No features.
No mejoras visuales.

---

## ⏱️ BLOQUES DE TRABAJO — 14 ENERO

### 🕒 3:00 – 4:30 PM

### 🔧 FIXES CORE UI (bloqueador)

**Responsabilidad:** Carlos (liderando), Javier ejecuta si está disponible.

* Ajustar `TicketsList`
* Ajustar `TicketView`
* Eliminar:

  * estados ilegales
  * botones inválidos
  * campos inexistentes
* Render condicionado **solo por estado real**

📌 **Regla:**
Si TS marca error → se corrige, no se ignora.

---

### 🕓 4:30 – 5:30 PM

### 🧑 USERS + DASHBOARD

* Users:

  * delete → deactivate
  * permisos UI por rol
* Dashboard:

  * quitar métricas ilegales
  * o desacoplar temporalmente

📌 Dashboard **no bloquea build**.

---

### 🕔 5:30 – 6:30 PM

### 🧪 BUILD + SANITY CHECK

Checklist mínimo:

* [ ] Build pasa
* [ ] Login
* [ ] Refresh mantiene sesión
* [ ] Listado tickets
* [ ] Vista ticket
* [ ] Acciones permitidas funcionan
* [ ] Errores 401 / 403 / 409 no rompen UI

---

### 🟢 ESTADO ESPERADO AL CIERRE DEL 14

| Área       | Estado     |
| ---------- | ---------- |
| Build      | 🟢         |
| Types      | 🟢         |
| API        | 🟢         |
| Auth       | 🟢         |
| Router     | 🟢         |
| Tickets UI | 🟢         |
| Dashboard  | 🟡 neutral |

📌 **Este es el punto de no retorno.**

---

# 🗓️ JUEVES 15 DE ENERO (OFICINA)

**Inicio:** ~9:10 AM
**Objetivo:** **PRUEBAS EN EJECUCIÓN + BASE FORMAL PARA JAVIER**

---

## 🎯 OBJETIVO DEL DÍA

> Que el frontend:
>
> * se ejecute sin sorpresas
> * tenga flujos reales completos
> * esté documentado para que Javier construya sin inventar

---

## ⏱️ BLOQUES — 15 ENERO

### 🕘 9:10 – 11:30 AM

### 🧪 PRUEBAS EN EJECUCIÓN (contigo presente)

* Flujos completos:

  * crear ticket
  * resolve
  * close
  * cancel
* Accesos por rol
* Historial visible
* Errores reales (409 / 422)

📌 Aquí **NO se arregla arquitectura**, solo bugs reales.

---

### 🕦 11:30 – 1:00 PM

### 📄 DOCUMENTACIÓN OPERATIVA FRONTEND

Entregable **para Javier**:

* Qué módulos existen
* Qué **NO se puede tocar**
* Cómo consumir endpoints
* Qué estados existen
* Qué errores esperar
* Qué hacer cuando el backend rechaza

👉 Esto es **la base para que no se desalineé**.

---

### 🟢 ESTADO ESPERADO JUEVES MEDIODÍA

✔ Front ejecutable
✔ Flujos reales probados
✔ Build estable
✔ Documentación base cerrada
✔ Javier puede avanzar **sin inventar**

---

# 🗓️ VIERNES 16 DE ENERO (CASA)

**Inicio:** ~3:00 PM
**Objetivo:** **HARDENING FINAL + DESPLIEGUE EN RAILWAY**

---

## 🎯 OBJETIVO

> Validar estabilidad en entorno real antes de on-prem.

---

## ⏱️ BLOQUES — 16 ENERO

### 🕒 3:00 – 4:30 PM

### 🔒 HARDENING FINAL

* Revisar:

  * guards
  * errores
  * edge cases
* Confirmar que frontend **no hace supuestos**
* Revisión rápida de seguridad visual

---

### 🕟 4:30 – 6:00 PM

### 🚀 DESPLIEGUE EN RAILWAY y Versel(PROD TEMPORAL)

* Backend - railway
* Frontend - Versel si ya es estable en desarrollo
* Variables reales
* Pruebas básicas post-deploy

📌 Railway y versel aquí es **campo de pruebas**, no cierre.

---

# 🗓️ SÁBADO O DOMINGO (3:00 PM)

### 🎯 OBJETIVO VARIABLE (según estado del servidor local)

---

## 🟢 ESCENARIO A — SERVIDOR LOCAL LISTO

* Iniciar preparación on-prem
* Documentar pasos
* Validar dependencias
* Ensayar despliegue

---

## 🟡 ESCENARIO B — SERVIDOR NO LISTO

* Ayudar a Javier a cerrar frontend
* Refuerzo de documentación
* Preparar:

  * app desktop (Electron / Tauri)
  * checklist de empaquetado
  * flujos offline/online

---

# 🧭 SEMANA 3 (19–25 ENERO) — CIERRE DEFINITIVO

Independientemente del escenario:

✔ v2.0.0 funcional
✔ Contrato intacto
✔ Sin cambios estructurales
✔ Preparado para v3.0.0 (features menores)
✔ Base sólida para on-prem

---

# 🟣 SEMANA 4 (FEBRERO) — ON-PREM

* Despliegue local
* Seguridad
* Infraestructura
* Operación real

---

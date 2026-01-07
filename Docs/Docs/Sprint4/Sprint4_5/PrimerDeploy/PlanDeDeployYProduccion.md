# 🚀 Sprint 4 — Plan Profesional de Deploy y Producción

## Gestor de Tickets DATRA

**Fase:** Producción y Validación
**Responsable técnico:** Ingeniería de Software
**Objetivo:** Deploy profesional, controlado y defendible del sistema para demo ejecutivo y futura producción.

---

## 🎯 Propósito de este documento

Este documento **formaliza toda la planeación técnica y operativa** realizada para el deploy del sistema **Gestor de Tickets DATRA**, asegurando:

* Cero improvisación
* Control total del entorno
* Seguridad y estabilidad
* Capacidad de defensa técnica ante jefatura e inversionistas

Este plan se ejecuta **paso a paso**, siguiendo prácticas reales de **ingeniería de software empresarial**.

---

## 🧠 Principios Rectores (No negociables)

* 🔒 Sistema congelado (Sprint 3 cerrado)
* 🧪 Producción ≠ Desarrollo
* 🔐 Variables sensibles fuera del código
* 📦 Versiones tecnológicas fijadas
* 📄 Todo cambio debe estar documentado

---

# 🗂️ Arquitectura Final del Sistema

| Capa          | Tecnología            | Estado     |
| ------------- | --------------------- | ---------- |
| Frontend      | SPA (Vercel)          | Producción |
| Backend       | NestJS 11             | Producción |
| ORM           | Prisma 5.16.1         | Congelado  |
| Base de Datos | PostgreSQL Gestionado | Producción |
| Auth          | JWT                   | Activo     |

---

# 🔹 DÍA 1 — Preparación de Producción

## 1. Variables de Entorno Definitivas

### Backend

Variables requeridas (sin valores en repositorio):

* DATABASE_URL
* JWT_SECRET
* JWT_EXPIRES_IN
* NODE_ENV=production
* PORT
* CORS_ORIGIN
* LOG_LEVEL

📌 **Reglas:**

* Nunca en código
* Nunca en git
* Exclusivas por entorno

---

### Frontend

* API_URL
* APP_ENV=production

📌 No contienen secretos, pero sí controlan comportamiento.

---

## 2. Congelamiento Tecnológico

* Prisma ORM: **5.16.1 (fijo)**
* NestJS: **11.0.1 (fijo)**
* Node.js: **18 LTS / 20 LTS**

📌 No se permiten upgrades durante Sprint 4.

---

# 🔹 DÍA 2 — Backend + Base de Datos en Producción

## 1. Proveedor de Backend (Demo)

**Seleccionado:** Railway (PaaS)

### Justificación:

* Costo $0 para demo
* HTTPS automático
* Soporte Prisma + PostgreSQL
* Logs visibles
* Variables seguras

---

## 2. Base de Datos

**Tipo:** PostgreSQL gestionado

### Reglas:

* Usuario exclusivo de producción
* Backups automáticos
* No usar DB local

---

## 3. Flujo de Deploy Backend

1. Crear proyecto backend
2. Crear base PostgreSQL
3. Configurar variables de entorno
4. Ejecutar migraciones:

   ```bash
   npx prisma migrate deploy
   ```
5. Deploy backend
6. Validar endpoints críticos

---

## 4. Validación Backend

Debe funcionar:

* Login
* Creación de tickets
* Cambio de estado
* Auditoría
* Control por roles

---

# 🔹 DÍA 3 — Frontend en Producción

## 1. Proveedor Frontend

**Seleccionado:** Vercel

### Justificación:

* Deploy inmediato
* Integración GitHub
* HTTPS
* Ideal para demos ejecutivos

---

## 2. Flujo de Deploy Frontend

1. Importar repo en Vercel
2. Configurar build
3. Configurar variables de entorno
4. Deploy
5. Validación visual
6. Integración real con backend

---

## 3. Checklist de Integración

* Login funcional
* Token persistente
* Rutas protegidas
* CRUD de tickets
* Servicios afectados normalizados

---

# 🔐 Seguridad Mínima Validada

* HTTPS activo
* CORS restringido
* JWT con expiración
* Logout efectivo
* Roles respetados

---

# 📄 Documentación Obligatoria Final

Debe existir:

* URL Frontend
* URL Backend
* Variables requeridas (sin valores)
* Stack tecnológico
* Fecha y commit de deploy

---

# 🧪 Criterio de Éxito Sprint 4

✔ Sistema accesible públicamente
✔ Flujo completo funcional
✔ Sin errores visibles
✔ Sin cambios de backend improvisados
✔ Demo estable

---

# 🧭 Declaración Profesional

> Este despliegue no es experimental. Es una liberación controlada diseñada bajo criterios reales de ingeniería de software, preparada para validación ejecutiva y evolución futura.

---

🔒 **Sprint 4 inicia con control, criterio y responsabilidad técnica total.**

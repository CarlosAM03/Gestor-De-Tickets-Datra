
---

# 📄 ONE-PAGER EJECUTIVO

## Gestor de Tickets DATRA

### 📌 Resumen Ejecutivo

**Gestor de Tickets DATRA** es una plataforma interna diseñada para **centralizar, priorizar y auditar incidencias técnicas** relacionadas con servicios de conectividad e infraestructura ofrecidos por DATRA.

El sistema reemplaza flujos informales (mensajes, correos, hojas sueltas) por un **proceso estructurado, seguro y trazable**, reduciendo tiempos de atención, errores operativos y dependencia de personas clave.

---

## 🎯 Problema que resuelve

Antes del sistema:

* Incidencias dispersas (WhatsApp, llamadas, correos)
* Falta de visibilidad del estado real de los tickets
* Prioridades poco claras
* Difícil auditoría de quién hizo qué y cuándo
* Riesgo operativo al depender de conocimiento informal

**Impacto:**
Retrasos, pérdida de información, mala experiencia para clientes y equipos técnicos.

---

## ✅ Solución propuesta

Una **plataforma web centralizada** con:

* Control de accesos por rol
* Flujo claro de vida del ticket
* Prioridad por impacto
* Historial auditable
* Operación 100% online y segura

---

## 🧩 Funcionalidades Clave (Alcance actual)

### 👥 Gestión de usuarios

* Roles definidos:

  * **ADMIN**: control total
  * **INGENIERO**: visión global
  * **TÉCNICO**: atención operativa
* Creación, edición y desactivación controlada

---

### 🎫 Gestión de tickets

* Crear incidencias con:

  * Cliente (RFC)
  * Servicio afectado
  * Impacto (LOW → CRITICAL)
* Estados:

  * OPEN → IN_PROGRESS → ON_HOLD → RESOLVED → CLOSED
* Cancelación y eliminación controlada
* Trazabilidad completa

---

### 📊 Dashboard operativo

* Actividad reciente
* Filtros por estado, impacto, fechas
* Acceso según rol
* Datos defensivos (no crashes por datos incompletos)

---

## 🔐 Seguridad y control

* Autenticación con JWT
* HTTPS obligatorio
* CORS restringido al dominio autorizado
* Backend valida permisos (no depende del frontend)
* Variables sensibles fuera del código
* Base de datos protegida

---

## 🏗️ Arquitectura (producción)

| Componente    | Tecnología           | Ubicación  |
| ------------- | -------------------- | ---------- |
| Frontend      | React + Vite         | Vercel     |
| Backend       | Node.js + TypeScript | Railway    |
| Base de datos | PostgreSQL           | Gestionada |
| ORM           | Prisma               | —          |

Arquitectura modular, escalable y preparada para crecimiento.

---

## 🧠 Decisiones técnicas clave

* **Backend manda siempre** (seguridad primero)
* **Frontend defensivo** ante datos incompletos
* **Sin lógica crítica en cliente**
* **Sin dependencias innecesarias**
* **Cambios reversibles** (rollback posible)

Estas decisiones reducen riesgo operativo y técnico.

---

## 🚧 Qué NO hace (aún)

Para evitar falsas expectativas:

* ❌ No tiene SLA automáticos
* ❌ No tiene notificaciones externas (email / SMS)
* ❌ No tiene reportes avanzados
* ❌ No integra sistemas externos

📌 *Estas funciones están identificadas y planificadas, pero no incluidas en esta fase.*

---

## 📈 Valor para DATRA

* Menor tiempo de atención
* Mejor priorización de incidentes críticos
* Información confiable para toma de decisiones
* Menor dependencia de personas clave
* Base sólida para escalar operación

---

## 🛡️ Estado actual del sistema

* ✔ Desplegado en producción
* ✔ Probado con usuarios reales
* ✔ Flujos críticos validados
* ✔ Backups definidos
* ✔ Plan de rollback existente
* ✔ Sistema congelado (freeze)

👉 **Listo para operación y demo.**

---

## 👤 Responsabilidad técnica

El sistema cuenta con:

* Un responsable técnico claro
* Documentación de decisiones
* Proceso de despliegue controlado
* Gestión consciente de riesgos

---

## 🎯 Mensaje final

> *No presentamos solo una aplicación.*
> Presentamos **un sistema operable, seguro y pensado para crecer**, construido con criterio técnico y enfoque empresarial.


---

# 📄 ONE-PAGER EJECUTIVO

## Gestor de Tickets DATRA

---

## 📌 Resumen Ejecutivo

**Gestor de Tickets DATRA** es una plataforma interna diseñada para **estandarizar la operación de soporte técnico**, centralizar incidencias y **reducir el riesgo operativo** asociado a los servicios de conectividad e infraestructura ofrecidos por DATRA.

El sistema reemplaza flujos informales (mensajes, correos, hojas sueltas) por un **proceso estructurado, seguro y trazable**, reduciendo tiempos de atención, errores operativos y la dependencia de personas clave.

---

## 🎯 Problema que resuelve

Antes del sistema:

* Incidencias dispersas (WhatsApp, llamadas, correos)
* Falta de visibilidad del estado real de los tickets
* Prioridades poco claras
* Difícil auditoría de quién hizo qué y cuándo
* Riesgo operativo al depender de conocimiento informal

**Impacto:**
Operación reactiva, pérdida de información, mala experiencia para clientes y equipos técnicos, y dificultad para escalar sin aumentar riesgo.

---

## ✅ Solución propuesta

Una **plataforma web centralizada** que proporciona:

* Control de accesos por rol
* Flujo claro del ciclo de vida del ticket
* Priorización por impacto operativo
* Historial completo y auditable
* Operación 100% online, segura y controlada

---

## 🧩 Funcionalidades Clave (Alcance actual)

### 👥 Gestión de usuarios

* Roles definidos:

  * **ADMIN**: control total del sistema
  * **INGENIERO**: visión global y supervisión
  * **TÉCNICO**: atención operativa
* Creación, edición y desactivación controlada de usuarios

---

### 🎫 Gestión de tickets

* Creación de incidencias con:

  * Cliente (RFC)
  * Servicio afectado
  * Impacto (LOW → CRITICAL)
* Estados definidos:

  * OPEN → IN_PROGRESS → ON_HOLD → RESOLVED → CLOSED
* Cancelación y eliminación controlada
* Cada ticket mantiene **historial completo y auditable** desde su creación hasta el cierre

---

### 📊 Dashboard operativo

* Visualización de actividad reciente
* Filtros por estado, impacto y fechas
* Acceso según rol
* Frontend defensivo (no se rompe ante datos incompletos)

---

## 🔐 Seguridad y control

* Autenticación mediante JWT
* HTTPS obligatorio
* CORS restringido al dominio autorizado
* Validación de permisos en backend (no dependiente del frontend)
* Variables sensibles fuera del código
* Base de datos protegida

---

## 🏗️ Arquitectura (producción)

| Componente    | Tecnología           | Ubicación  |
| ------------- | -------------------- | ---------- |
| Frontend      | React + Vite         | Vercel free    |
| Backend       | Node.js + TypeScript | Railway free   |
| Base de datos | PostgreSQL           | Gestionada |
| ORM           | Prisma               | —          |

La arquitectura fue seleccionada para **maximizar estabilidad en fases tempranas** y permitir **migraciones controladas** conforme el sistema evoluciona.

---

## 🧠 Decisiones técnicas clave

* **Backend manda siempre** (seguridad primero)
* **Frontend defensivo** ante datos incompletos
* **Sin lógica crítica en el cliente**
* **Sin dependencias innecesarias**
* **Cambios reversibles** mediante plan de rollback definido

Estas decisiones reducen el riesgo operativo y técnico en producción.

---

## 🚧 Qué NO hace (aún)

Para evitar falsas expectativas:

* ❌ No gestiona SLA automáticos
* ❌ No envía notificaciones externas (email / SMS)
* ❌ No genera reportes avanzados
* ❌ No integra sistemas externos

📌 *Estas funcionalidades están identificadas y planificadas, pero conscientemente no incluidas en esta fase.*

---

## 📈 Valor para DATRA

* Reducción de tiempos de atención
* Mejor priorización de incidentes críticos
* Información confiable para la toma de decisiones
* Menor dependencia de personas clave
* Base sólida y segura para escalar operación

---

## 🛡️ Estado actual del sistema

* ✔ Desplegado en producción
* ✔ Probado con usuarios reales
* ✔ Flujos críticos validados
* ✔ Backups definidos
* ✔ Plan de rollback documentado
* ✔ Sistema congelado (freeze)

👉 **Listo para operación demo**, sin dependencias críticas pendientes para su uso actual.

---

## 👤 Responsabilidad técnica

El sistema cuenta con:

* Responsable técnico definido
* Documentación de decisiones clave
* Proceso de despliegue controlado
* Gestión consciente y documentada de riesgos

**Responsable técnico:**
Carlos Armenta

---

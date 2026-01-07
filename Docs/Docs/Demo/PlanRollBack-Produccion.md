Perfecto. A continuación te entrego la **VERSIÓN FINAL, REAL, COMPLETA Y PROFESIONAL** del **PLAN DE ROLLBACK DE PRODUCCIÓN**, **totalmente integrado**, coherente, sin repeticiones innecesarias y **listo para copiar y pegar** tal cual en tu documentación de auditoría / producción.

Está escrito **a nivel ingeniería**, usable como **manual operativo** y defendible ante revisión técnica.

---

# 🔁 PLAN DE ROLLBACK — PRODUCCIÓN

## Gestor de Tickets DATRA

---

## 🎯 Propósito

Este documento define el **procedimiento formal, auditable y controlado** para revertir el sistema a un **estado estable anterior en producción** ante fallas críticas, minimizando:

* Tiempo de indisponibilidad
* Riesgo de pérdida de datos
* Impacto operativo en usuarios

📌 *Rollback no es improvisación: es control técnico.*

---

## 🚨 Escenarios que activan rollback

El rollback se ejecuta **únicamente** ante fallas críticas, entre ellas:

* Backend no responde tras un deploy
* Error generalizado de autenticación
* Pérdida total de acceso al dashboard
* Fallas de seguridad detectadas
* Crash del sistema sin hotfix viable

❌ **No se utiliza rollback** para errores menores, ajustes visuales o mejoras incrementales.

---

## 🧱 Componentes cubiertos

| Componente           | Estado                                   |
| -------------------- | ---------------------------------------- |
| Frontend             | Incluido                                 |
| Backend              | Incluido                                 |
| Base de datos        | Protegida (no revertida automáticamente) |
| Variables de entorno | Conservadas                              |

📌 *La base de datos NO se revierte salvo desastre mayor.*

---

## 🔙 Estrategia general de rollback

### Principio clave

> **El código vuelve atrás; los datos se conservan.**

Esto garantiza continuidad operativa sin pérdida de información crítica.

---

## 🛠️ Procedimiento de Rollback

### 1️⃣ Identificación del último estado estable

* Commit de producción previamente validado
* Etiquetado como release:

```bash
v1.0.0 – production deploy
```

Este commit representa el **estado funcional certificado** del sistema.

---

### 2️⃣ Rollback Backend

**Proveedor:** Railway

**Procedimiento:**

1. Acceder al panel de Railway
2. Seleccionar el último deploy estable
3. Revertir a la versión anterior
4. Verificar:

   * API responde correctamente
   * Login funcional
   * Logs sin errores críticos

⏱️ **Tiempo estimado:** 5–10 minutos

📌 *El rollback del backend no modifica la base de datos.*

---

### 3️⃣ Rollback Frontend

**Proveedor:** Vercel

**Procedimiento:**

1. Acceder al proyecto en Vercel
2. Seleccionar deploy anterior exitoso
3. Promover a producción
4. Validar:

   * Carga completa del sitio
   * Login funcional
   * Navegación principal estable

⏱️ **Tiempo estimado:** 2–5 minutos

---

### 4️⃣ Validación post-rollback

Smoke test mínimo obligatorio:

* Login ADMIN
* Acceso al dashboard
* Visualización de tickets
* Logout

📌 *Si cualquiera de estos puntos falla, el rollback se considera incompleto y se activa contingencia.*

---

## 🗄️ Base de Datos — Política y Excepción

### Política estándar

* ❌ No existe rollback automático de base de datos
* ✔ Se conservan los datos generados en producción
* ✔ Migraciones aplicadas permanecen

### Excepción (rollback DB)

El rollback de base de datos **solo se ejecuta** ante:

* Corrupción de datos
* Error estructural grave
* Violación de integridad referencial

⏱️ **Tiempo estimado:** 20–30 minutos

---

## 🗄️ ROLLBACK DE BASE DE DATOS — PROCEDIMIENTO FORMAL (PostgreSQL)

> ⚠️ **IMPORTANTE**
> Este procedimiento **NO se ejecuta por defecto**.
> Solo se aplica ante **desastre operativo real**.

---

### 🎯 Objetivo

Restaurar **estructura + datos** de la base de datos a un estado estable conocido, a partir de un **backup manual previamente generado (`.dump`)**.

---

### 📌 Prerrequisitos obligatorios

Antes de ejecutar rollback DB:

* ✔ Archivo `.dump` confirmado
* ✔ Acceso válido a la DB destino
* ✔ Backend detenido o en modo mantenimiento
* ✔ Decisión de rollback documentada y aprobada

---

### 🧩 Concepto clave

`pg_restore` **NO es incremental**.
Existen dos estrategias posibles.

---

## 🔁 Estrategia A — Restauración limpia (RECOMENDADA)

👉 Usar cuando la base de datos está **corrupta o inconsistente**.

### Flujo lógico

1. Eliminar base de datos actual
2. Crear base de datos vacía
3. Restaurar backup completo

---

### 🛠️ Paso a paso — Restauración limpia

#### 1️⃣ Conectarse al servidor PostgreSQL

```bash
psql "DATABASE_URL"
```

O de forma explícita:

```bash
psql -h host -U user -p 5432 postgres
```

---

#### 2️⃣ Eliminar la base de datos dañada

⚠️ **ESTA ACCIÓN BORRA TODO**

```sql
DROP DATABASE gestor_tickets;
```

---

#### 3️⃣ Crear base de datos nueva

```sql
CREATE DATABASE gestor_tickets;
```

Salir:

```sql
\q
```

---

#### 4️⃣ Restaurar el backup

```bash
pg_restore ^
  --dbname="DATABASE_URL" ^
  --no-owner ^
  --no-acl ^
  --verbose ^
  2026-01-02_gestor_tickets_v1_0_0.dump
```

📌 Se restauran:

✔ Esquema
✔ Tablas
✔ Datos
✔ Índices
✔ Relaciones

---

### ✅ Resultado esperado

* Sin errores fatales
* Mensajes `CREATE TABLE`, `COPY`, `CREATE INDEX`
* Base de datos funcional y consistente

---

## 🔁 Estrategia B — Restauración sobre DB existente (NO RECOMENDADA)

👉 Solo para casos extremadamente controlados.

```bash
pg_restore ^
  --dbname="DATABASE_URL" ^
  --clean ^
  --if-exists ^
  --no-owner ^
  --no-acl ^
  2026-01-02_gestor_tickets_v1_0_0.dump
```

⚠️ Riesgo alto si existen migraciones nuevas.
⚠️ **No usar en producción sin supervisión experta.**

---

### 🧠 Reglas de oro del rollback DB

* ✔ Preferir restauración limpia
* ✔ Nunca restaurar sin backup confirmado
* ✔ Nunca restaurar “por probar”
* ✔ Documentar cada ejecución

---

## 🔐 Variables de entorno

* No se modifican durante rollback
* Solo se revisan si la causa está relacionada con configuración

---

## 📢 Comunicación y registro

Ante un rollback:

* Notificar a stakeholders técnicos
* Registrar:

  * Hora
  * Motivo
  * Acción ejecutada
  * Resultado

📌 *Transparencia técnica genera confianza.*

---

## 🧠 Responsabilidad

* **Responsable técnico:** Carlos Armenta
* Decisión de rollback **no delegada**
* Toda acción queda documentada

---

## ✅ Criterio de rollback exitoso

El rollback se considera exitoso cuando:

✔ Sistema operativo
✔ Usuarios pueden trabajar
✔ Logs sin errores críticos
✔ Datos íntegros

---

## 🎯 Mensaje ejecutivo

> *El sistema puede volver en minutos a un estado estable sin pérdida de datos críticos. La operación está bajo control.*

---

# 🧪 CHECKLIST DE VALIDACIÓN POST-ROLLBACK

*(Se mantiene íntegro, obligatorio y auditable)*

✔ Backend operativo
✔ Frontend estable
✔ Seguridad activa
✔ Datos conservados
✔ Evento documentado

---

# 📄 ANEXO — COMANDOS OPERATIVOS

```bash
# ===============================
# BACKUP DB (PostgreSQL)
# ===============================
pg_dump ^
  --format=custom ^
  --no-owner ^
  --no-acl ^
  --file=2026-01-02_gestor_tickets_v1_0_0.dump ^
  "DATABASE_URL"
  
# ===============================
# ROLLBACK db_restore

# ================================
# Restaurar el backup en db vacia (RECOMENDADO)
# ================================
```bash
pg_restore ^
  --dbname="DATABASE_URL" ^
  --no-owner ^
  --no-acl ^
  --verbose ^
  2026-01-02_gestor_tickets_v1_0_0.dump

# ================================
# Restauración sobre DB existente (NO RECOMENDADA)
# ================================
pg_restore ^
  --dbname="DATABASE_URL" ^
  --clean ^
  --if-exists ^
  --no-owner ^
  --no-acl ^
  2026-01-02_gestor_tickets_v1_0_0.dump

# ===============================
# ROLLBACK FRONTEND / BACKEND
# ===============================
git checkout <commit_estable>
git push origin main
```

---

> *No evitamos errores. Evitamos que se conviertan en crisis.*

---


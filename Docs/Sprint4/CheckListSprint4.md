
---

# 🚀 Sprint 4 — Checklist de Producción y Deploy

**Gestor de Tickets DATRA**

> Objetivo del Sprint 4
> **Poner el sistema en producción controlada, validarlo con usuarios reales y dejarlo operable sin depender de improvisación.**

---

## 🧠 0. PRINCIPIO RECTOR DEL SPRINT 4

> **En producción, el sistema ya no te pertenece solo a ti.**
> Le pertenece a la empresa, a los usuarios y a los datos.

Por lo tanto:

* Cada decisión debe ser **explicable**
* Cada cambio debe ser **reversible**
* Cada fallo debe ser **detectable**
* Cada dato debe ser **recuperable**

---

# 🧱 1. DEFINICIÓN FORMAL DEL ENTORNO DE PRODUCCIÓN

### 1.1 Entornos (OBLIGATORIO)

Debes tener **explícitamente definidos**:

| Entorno        | Propósito      | Acceso           |
| -------------- | -------------- | ---------------- |
| Local          | Desarrollo     | Solo dev         |
| Staging / Demo | Validación     | Equipo interno   |
| Producción     | Operación real | Usuarios finales |

📌 **Regla de oro**

> Nunca pruebas en producción lo que no probaste en staging.

---

### 1.2 Infraestructura decidida (NO ambigua)

Debes dejar **por escrito**:

* ¿Frontend dónde vive?
* ¿Backend dónde vive?
* ¿Base de datos dónde vive?
* ¿Quién administra cada cosa?

Ejemplo correcto:

| Componente | Ubicación             | Responsable    |
| ---------- | --------------------- | -------------- |
| Frontend   | Vercel                | Carlos         |
| Backend    | Render / Server local | Carlos         |
| DB         | PostgreSQL gestionado | Carlos / Infra |

📌 Si esto no está claro → **riesgo operativo**.

---

# 🔐 2. SEGURIDAD DE PRODUCCIÓN (RESPONSABILIDAD DIRECTA)

## 2.1 Variables de entorno (NO negociable)

### Backend `.env.production`

* `DATABASE_URL`
* `JWT_SECRET` (único, fuerte)
* `JWT_EXPIRES_IN`
* `PORT`
* `CORS_ORIGIN`
* `NODE_ENV=production`
* `LOG_LEVEL`

❌ Nunca:

* subir `.env` a git
* usar valores de desarrollo

---

### Frontend `.env.production`

* `VITE_API_URL` / `REACT_APP_API_URL`
* `APP_ENV=production`

---

## 2.2 HTTPS obligatorio

* Certificado válido
* Redirección HTTP → HTTPS
* Cookies / tokens solo sobre HTTPS

📌 **JWT sin HTTPS = sistema vulnerable**

---

## 2.3 CORS restringido

Debes poder responder:

> “¿Quién puede llamar a mi API?”

✔ Dominio del frontend
❌ `*` en producción

---

## 2.4 Autorización validada (doble capa)

* Frontend **oculta**
* Backend **decide**

📌 El backend **manda siempre**.

---

# 🗄️ 3. BASE DE DATOS — INTEGRIDAD Y SEGURIDAD

## 3.1 Migraciones controladas

* Última migración aplicada
* Sin migraciones pendientes
* Sin `prisma migrate dev` en producción

✔ Usar `migrate deploy`

---

## 3.2 Backups (NO opcional)

Debes dejar claro:

| Pregunta               | Respuesta        |
| ---------------------- | ---------------- |
| ¿Cada cuánto?          | Diario / Semanal |
| ¿Dónde?                | Servicio externo |
| ¿Automático?           | Sí               |
| ¿Restauración probada? | Sí               |

📌 **Backup no probado = no existe**

---

## 3.3 Accesos a la DB

* Credenciales únicas
* Usuario sin permisos innecesarios
* No acceso público abierto

---

# 📦 4. BUILD Y DESPLIEGUE

## 4.1 Build reproducible

Debes poder hacer:

```bash
npm install
npm run build
npm run start
```

Y que **funcione sin tocar código**.

---

## 4.2 Versionado y control

* Tag de release
* Commit claro de deploy
* Changelog básico

Ejemplo:

```bash
release: v1.0.0 – production deploy
```

---

## 4.3 Rollback plan (OBLIGATORIO)

Pregunta clave:

> “Si el deploy falla, ¿cómo vuelves atrás?”

✔ Versión anterior
✔ DB intacta
✔ Tiempo estimado

📌 Sin rollback → deploy peligroso.

---

# 🧪 5. TESTING DE PRODUCCIÓN (REAL, NO ACADÉMICO)

## 5.1 Smoke tests obligatorios

Antes de abrir a usuarios:

* Login ADMIN
* Login TECNICO
* Crear ticket
* Cambiar estado
* Solicitar eliminación
* Aprobar eliminación
* Logout / sesión expirada

---

## 5.2 Casos de error

* Token vencido
* Rol incorrecto
* Acceso directo a rutas
* Datos inválidos

📌 Esto valida seguridad y UX.

---

# 📊 6. LOGS Y MONITOREO

## 6.1 Logs mínimos

Backend debe registrar:

* Errores
* Acciones críticas
* Cambios de estado
* Eliminaciones

---

## 6.2 Visibilidad

Debes poder responder:

> “¿Qué pasó ayer a las 3 PM?”

Si no → problema serio.

---

# 👥 7. OPERACIÓN CON USUARIOS REALES

## 7.1 Usuarios iniciales

* Admin principal
* Roles definidos
* Contraseñas temporales

---

## 7.2 Manual mínimo de uso

Aunque sea básico:

* Cómo iniciar sesión
* Cómo crear ticket
* Cómo cerrar ticket
* Qué NO hacer

📌 Reduce errores humanos.

---

# 📢 8. DOCUMENTACIÓN FINAL (PROTEGE TU TRABAJO)

Debe quedar cerrado:

* Alcance real (Sprint 3)
* Qué NO hace el sistema
* Qué sigue (Sprint 4+)
* Decisiones técnicas

📌 Esto te protege de:

> “Oye, ¿por qué no hace X?”

---

# 🧠 9. GOBERNANZA TÉCNICA (TU NUEVO ROL)

Tú decides:

* Qué entra
* Qué no entra
* Cuándo se despliega
* Cuándo se congela

Eso **es liderazgo técnico**.

---

# 🏁 10. DEFINICIÓN DE “SPRINT 4 COMPLETADO”

Sprint 4 **NO se cierra cuando “funciona”**, sino cuando:

✔ Está desplegado
✔ Está probado
✔ Está documentado
✔ Tiene backup
✔ Tiene rollback
✔ Usuarios lo usan
✔ Tú puedes dormir tranquilo

---

📅 Contexto actualizado

• Inicio Sprint 4 (Día 1): 30/12/2025  
• Sistema 100% listo (freeze final): 04/01/2026  
• Presentación a inversionistas: 05/01/2026  

⚠️ El día 05/01 no se realiza trabajo técnico.
⚠️ El sistema debe estar congelado desde el 04/01.

---

# 🚀 Checklist Ejecutable de Deploy Real

**Gestor de Tickets DATRA**

> **Regla de oro del plan**
> 🔴 *Nada crítico se hace el último día.*
> 🔴 *Nada nuevo se programa después del deploy inicial.*

---

## 🗓️ CRONOGRAMA GENERAL — SPRINT 4 (AJUSTADO)

| Día   | Fecha       | Objetivo principal                                  |
| ----  | ----------- | --------------------------------------------------- |
| Día 1 | 30/12/2025  | Preparación, hardening y cierre técnico previo      |
| Día 2 | 31/12/2025  | Deploy backend + base de datos                      |
| Día 3 | 01/01/2026  | Deploy frontend + integración completa              |
| Día 4 | 02/01/2026  | Smoke tests + hardening de seguridad                |
| Día 5 | 03/01/2026  | Pruebas con usuarios reales + correcciones críticas |
| Día 6 | 04/01/2026  | Freeze final + respaldo + ensayo de demo            |
| —     | 05/01/2026  | 🎤 Presentación (sin cambios técnicos)              |


---

# 🧱 DÍA 1 — 30/12

## 🎯 Objetivo: **Cerrar técnicamente el sistema antes de tocar producción**

### ✅ Checklist ejecutable

#### 1️⃣ Confirmar congelamiento

---

## 🛠️ Ajuste Controlado — Normalización de “Servicio Afectado” (Frontend)

### Contexto

Durante la revisión previa a producción, se identificó que el campo **“Servicio afectado”** en el formulario de creación de tickets permitía **entrada de texto libre**, lo que generaba riesgo de **datos inconsistentes** (variaciones de formato, abreviaturas, errores tipográficos).

Este ajuste responde a retroalimentación operativa directa y tiene como objetivo **mejorar la calidad de los datos sin afectar la arquitectura existente**.

---

### Decisión Técnica

* El campo **`serviceAffected` se mantiene como `string` en el backend**.
* **No se implementa un enum ni validación restrictiva en backend** por decisión arquitectónica.
* La **normalización se aplica exclusivamente en frontend**, mediante selección guiada.
* El contrato API **no se modifica**.
* La base de datos **no se modifica**.

📌 *El backend sigue aceptando cualquier cadena válida; el frontend guía la entrada para reducir inconsistencias.*

---

### Implementación

El campo **“Servicio afectado”** se reemplaza por un **select con opciones predefinidas**, agrupadas por tipo de servicio ofrecido por Datra:

#### Servicios disponibles

**Internet Dedicado**

* Internet dedicado 100 Mbps
* Internet dedicado 200 Mbps
* Internet dedicado 500 Mbps
* Internet dedicado 1 Gbps
* Internet dedicado 2 Gbps
* Internet dedicado 4 Gbps
* Internet dedicado 10 Gbps

**Internet Compartido**

* Internet compartido 100 Mbps
* Internet compartido 200 Mbps
* Internet compartido 500 Mbps
* Internet compartido 1 Gbps
* Internet compartido 2 Gbps
* Internet compartido 4 Gbps
* Internet compartido 10 Gbps

**Enlaces**

* Enlace punto a punto

El valor enviado al backend corresponde **exactamente al texto seleccionado**, manteniéndose como tipo `string`.

---

### Alcance y Riesgo

| Aspecto                | Estado        |
| ---------------------- | ------------- |
| Backend                | ❌ Sin cambios |
| Contrato API           | ❌ Sin cambios |
| Base de datos          | ❌ Sin cambios |
| UX                     | ✅ Mejora      |
| Normalización de datos | ✅             |
| Riesgo                 | 🟢 Bajo       |

---

### Clasificación del Cambio

* Tipo: **Hardening de Frontend**
* Sprint: **Sprint 4**
* Impacto funcional: **Nulo**
* Impacto operativo: **Positivo**
* Compatibilidad: **100% retrocompatible**

---

📌 *Este ajuste no introduce nueva funcionalidad ni rompe el congelamiento del sistema; mejora la calidad de la información capturada y prepara el sistema para operación real en producción.*

---


* [*] Backend sin cambios funcionales
* [*] Frontend sin cambios UX
* [*] Issues abiertos documentados
* [*] Scope final aceptado

📌 *Después de hoy, solo correcciones críticas.*

---

#### 2️⃣ Auditoría rápida de código

* [ ] No hay `console.log` olvidados
* [ ] Manejo de errores consistente
* [ ] Validaciones DTO activas
* [ ] Guards aplicados en endpoints críticos

---

#### 3️⃣ Variables de entorno DEFINITIVAS

* [ ] Crear `.env.production` backend
* [ ] Crear `.env.production` frontend
* [ ] JWT_SECRET largo y único
* [ ] CORS definido solo al dominio real
* [ ] NODE_ENV=production

📌 *Esto no se improvisa después.*

---

#### 4️⃣ Commit de preparación

```bash
chore: prepare production environment
```

---

# 🗄️ DÍA 2 — 31/12

## 🎯 Objetivo: **Backend y Base de Datos en producción**

### ✅ Checklist ejecutable

#### 1️⃣ Base de datos producción

* [ ] Instancia PostgreSQL creada
* [ ] Usuario con permisos mínimos
* [ ] Acceso restringido
* [ ] Backup automático configurado

---

#### 2️⃣ Migraciones

```bash
npx prisma migrate deploy
```

* [ ] Migraciones aplicadas
* [ ] Sin errores
* [ ] Datos consistentes

---

#### 3️⃣ Deploy backend

* [ ] Build exitoso
* [ ] API responde `/health` o `/`
* [ ] Login funciona
* [ ] JWT válido
* [ ] Logs activos

---

#### 4️⃣ Pruebas backend (Postman)

* [ ] Login ADMIN
* [ ] Crear ticket
* [ ] Cambiar estado
* [ ] Solicitar eliminación
* [ ] Aprobar eliminación

📌 *Si falla aquí, NO sigues.*

---

# 🌐 DÍA 3 — 01/01

## 🎯 Objetivo: **Frontend desplegado y conectado a producción**

### ✅ Checklist ejecutable

#### 1️⃣ Build frontend

```bash
npm run build
```

* [ ] Build sin warnings críticos
* [ ] Variables correctas
* [ ] API_URL apunta a prod

---

#### 2️⃣ Deploy frontend

* [ ] HTTPS activo
* [ ] Dominio definitivo
* [ ] Redirección HTTP → HTTPS

---

#### 3️⃣ Integración completa

* [ ] Login desde UI
* [ ] Roles correctos
* [ ] Rutas protegidas
* [ ] Logout y sesión expirada

📌 *Este día ya puedes decir: “el sistema vive”.*

---

# 🧪 DÍA 4 — 02/01

## 🎯 Objetivo: **Validar estabilidad, seguridad y flujos criticos**

### ✅ Smoke tests completos

* [ ] ADMIN → todo
* [ ] TECNICO → solo propios
* [ ] INGENIERO → global
* [ ] Acceso sin token → bloqueado
* [ ] Token vencido → logout

---

### 🔐 Hardening mínimo

* [ ] CORS confirmado
* [ ] HTTPS forzado
* [ ] Secrets fuera del código
* [ ] Logs sin datos sensibles

---

# 👥 DÍA 5 — 03/01

## 🎯 Objetivo: **Pruebas con usuarios reales y correcciones criticas**

### ✅ Checklist

* [ ] Usuario real usa el sistema
* [ ] Flujo completo ticket
* [ ] Feedback documentado
* [ ] Bugs reales identificados

📌 *Aquí descubres lo que no ves tú.*

---

# 🛠️ DÍA 6 — 04/01

## 🎯 Objetivo: **Freeze absoluto, respaldo final y ensayo de demo**

### ✅ Checklist

* [ ] Corregir SOLO bugs críticos
* [ ] No refactor
* [ ] No nuevas features
* [ ] Re-test completo
* [ ] Backup manual DB
* [ ] Plan de rollback escrito
* [ ] Demo ensayada
* [ ] Historia clara del proyecto
* [ ] Mensaje para inversionistas preparado
---

### 🔒 Freeze final

```bash
chore: freeze system – production ready
```

📌 *Después de esto, no se toca código.*

# 🎯 DÍA 7 — 05/01

## 💼 PRESENTACIÓN A INVERSIONISTAS

Tú ya no presentas “una app”, presentas:

* Un sistema funcional
* Un proceso
* Una visión
* Un responsable técnico serio

---

## 🧠 MENSAJE CLAVE (MENTOR)

Si sigues este plan:

* No improvisas
* No corres riesgos innecesarios
* No quedas mal
* Te posicionas **como ingeniero de verdad**

---


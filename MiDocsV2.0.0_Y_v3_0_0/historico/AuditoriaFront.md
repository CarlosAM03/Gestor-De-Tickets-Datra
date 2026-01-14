
---

# 🧾 PLAN DE AUDITORÍA FRONTEND

**Proyecto:** Gestor de Tickets Datra
**Fecha:** 13 de enero
**Objetivo:** Auditoría técnica completa previa a acoplamiento v2.0.0

---

## 🎯 OBJETIVOS DE LA AUDITORÍA

1. Determinar el **estado real** del frontend
2. Identificar **desalineaciones** con backend v2.0.0
3. Clasificar hallazgos por **criticidad**
4. Generar insumos claros para:

   * Ajustes
   * Refactors
   * Hardening posterior
5. Evitar cambios improvisados

📌 **Regla:**

> Durante la auditoría **NO se escribe código**
> Solo se **analiza, documenta y clasifica**

---

## 🧩 ALCANCE DE LA AUDITORÍA

### Incluye

* Contratos (types / DTOs)
* Flujo de autenticación
* Guards y seguridad
* APIs consumidas
* Dashboard y analytics
* Navegación y ruteo
* Estados UI dependientes del backend

### Excluye (por ahora)

* Estilos / CSS
* UX visual
* Performance
* Tests automatizados
* Hardening profundo

---

# 🗂️ FASES DE AUDITORÍA (ORDEN OBLIGATORIO)

---

## 🔹 FASE 0 — Preparación (15–20 min)

### Checklist inicial

* Backend v2.0.0 **congelado**
* Frontend **sin cambios nuevos**
* Branch de auditoría creado
* Documento de auditoría abierto

📄 Documento sugerido:

```
AUDITORIA_FRONTEND_v2.md
```

---

## 🔹 FASE 1 — Auditoría de Contratos (CRÍTICA)

📍 **Es la fase más importante**

### Archivos a revisar

```
src/types/
  ├── auth.types.ts
  ├── user.types.ts
  ├── ticket.types.ts
```

### Validar:

* Enum `TicketStatus` vs backend v2
* Enum `ImpactLevel` vs backend v2
* DTO `CreateTicketDto`
* DTO `UpdateTicketDto`
* Campos opcionales vs obligatorios
* Campos que ya no existen en backend

### Resultado esperado

Tabla como esta:

| Tipo         | Campo   | Front    | Back v2     | Estado      |
| ------------ | ------- | -------- | ----------- | ----------- |
| TicketStatus | ON_HOLD | ✅        | ❌           | DESALINEADO |
| ImpactLevel  | LOW     | ❌        | ✅           | DESALINEADO |
| Ticket       | client  | embebido | relacionado | REVISAR     |

📌 **No corregir aún**

---

## 🔹 FASE 2 — Auditoría de APIs Consumidas

### Archivos

```
src/api/
  ├── auth.api.ts
  ├── tickets.api.ts
  ├── users.api.ts
```

### Validar por endpoint:

* Ruta
* Método
* Payload enviado
* Respuesta esperada
* Permisos requeridos

### Resultado esperado

| Endpoint            | Método | Front | Back v2 | Estado   |
| ------------------- | ------ | ----- | ------- | -------- |
| /tickets            | GET    | OK    | OK      | ALINEADO |
| /tickets/:id/status | PATCH  | OK    | ❌       | CAMBIÓ   |
| /users              | POST   | OK    | OK      | ALINEADO |

---

## 🔹 FASE 3 — Auditoría de Autenticación y Seguridad

### Módulos

```
src/auth/
  ├── AuthProvider
  ├── RequireAuth
  ├── RequireRole
  ├── useAuth
```

### Validar:

* Flujo login → token → user
* Persistencia
* Uso de `loading`
* Redirecciones
* Dependencia de `localStorage`
* Interacción con interceptor

📌 Especial atención:

* Race conditions
* Doble fuente de verdad
* Logout forzado por 401

### Resultado esperado

Listado de **riesgos**, no fixes:

* ⚠️ Redirect temprano
* ⚠️ Token válido pero user nulo
* ⚠️ 401 no crítico provoca logout

---

## 🔹 FASE 4 — Auditoría de Guards y Rutas

### Archivos

```
src/router/AppRoutes.tsx
src/layouts/MainLayout.tsx
```

### Validar:

* Qué rutas están protegidas
* Qué roles acceden
* Si el front asume permisos que el back ya controla
* Rutas nuevas no soportadas por backend

📌 Objetivo:

> El front **NO debe inventar permisos**

---

## 🔹 FASE 5 — Auditoría de Dashboard y Analytics

### Archivos

```
src/pages/Dashboard/
```

### Validar:

* Métricas calculadas
* Estados usados
* Agrupaciones
* Filtros
* Suposiciones de datos

⚠️ Identificar:

* Métricas imposibles en backend v2
* Estados obsoletos
* Agrupaciones que requieren endpoint nuevo

---

## 🔹 FASE 6 — Auditoría de Estados UI dependientes del backend

### Revisar:

* Loading
* Empty
* Error
* Success

### Validar:

* ¿El backend puede realmente devolver ese estado?
* ¿El error se interpreta correctamente?

---

## 🔹 FASE 7 — Clasificación de Hallazgos

Clasificar TODO en:

### 🔴 BLOQUEANTE

Impide integración v2

### 🟠 MAYOR

Funciona pero mal alineado

### 🟡 MENOR

Mejora futura

---

# 📦 ENTREGABLE FINAL DE LA AUDITORÍA

El día 13 **NO se corrige nada**, se entrega:

### 📄 Documento con:

1. Resumen ejecutivo
2. Lista de desalineaciones
3. Riesgos técnicos
4. Módulos afectados
5. Prioridades de ajuste
6. Propuesta de orden de fixes

---

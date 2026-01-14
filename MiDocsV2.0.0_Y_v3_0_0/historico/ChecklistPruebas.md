
---

# ✅ CHECKLIST OFICIAL DE PRUEBAS HTTP

## Backend Gestor de Tickets DATRA — v2.0.0

📌 **Objetivo**
Validar que el backend:

* cumple contratos
* rechaza usos inválidos
* aplica permisos correctamente
* no expone información indebida

---

## 🧱 1️⃣ AUTH / SEGURIDAD (CRÍTICO)

### 🔐 Login

**POST /auth/login**

| Caso                 | Esperado  |
| -------------------- | --------- |
| Credenciales válidas | 200 + JWT |
| Password incorrecto  | 401       |
| Email inexistente    | 401       |
| Usuario inactivo     | 403       |
| Body incompleto      | 400       |

📌 **Validar**:

* token contiene `id`, `role`
* expiración correcta
* no se filtra password

---

### 🔐 Guards globales

| Caso               | Esperado |
| ------------------ | -------- |
| Endpoint sin token | 401      |
| Token inválido     | 401      |
| Token expirado     | 401      |
| Rol no autorizado  | 403      |

---

## 👤 2️⃣ USERS

### ➕ Crear usuario

**POST /users** (ADMIN)

| Caso               | Esperado        |
| ------------------ | --------------- |
| ADMIN crea usuario | 201             |
| Rol omitido        | default TECNICO |
| Email duplicado    | 409 / 400       |
| No ADMIN           | 403             |
| Password < 6 chars | 400             |

---

### 📋 Listar usuarios

**GET /users** (ADMIN)

| Caso                | Esperado    |
| ------------------- | ----------- |
| ADMIN               | 200 + lista |
| TECNICO / INGENIERO | 403         |

---

### 🔍 Obtener usuario por ID

**GET /users/:id**

| Caso               | Esperado |
| ------------------ | -------- |
| ADMIN → cualquiera | 200      |
| Usuario → sí mismo | 200      |
| Usuario → otro     | 403      |
| ID inexistente     | 404      |
| ID no numérico     | 400      |

---

### ✏️ Update self

**PATCH /users/me** *(si existe)*

| Caso             | Esperado |
| ---------------- | -------- |
| Cambiar nombre   | 200      |
| Cambiar password | 200      |
| Usuario inactivo | 403      |
| Body vacío       | 400      |

---

## 🧾 3️⃣ CLIENTS

### ➕ Crear cliente

**POST /clients** (ADMIN)

| Caso                 | Esperado |
| -------------------- | -------- |
| RFC válido           | 201      |
| RFC duplicado        | 400      |
| RFC min/max inválido | 400      |
| No ADMIN             | 403      |

---

### 🔍 Buscar cliente por RFC

**GET /clients/:rfc**

| Caso             | Esperado |
| ---------------- | -------- |
| Cliente activo   | 200      |
| Cliente inactivo | 404      |
| RFC inexistente  | 404      |
| Sin rol válido   | 403      |

---

### 🔎 Autocomplete

**GET /clients?q=ABC**

| Caso             | Esperado   |
| ---------------- | ---------- |
| Query ≥ 2 chars  | 200        |
| Query < 2        | []         |
| Cliente inactivo | No aparece |

---

### ⛔ Desactivar cliente

**PATCH /clients/:rfc/deactivate** (ADMIN)

| Caso              | Esperado          |
| ----------------- | ----------------- |
| Activo → inactivo | 200               |
| Ya inactivo       | 200 (idempotente) |
| No ADMIN          | 403               |

---

### ✅ Reactivar cliente

**PATCH /clients/:rfc/activate** (ADMIN)

| Caso              | Esperado |
| ----------------- | -------- |
| Inactivo → activo | 200      |
| Ya activo         | 200      |
| No ADMIN          | 403      |

---

## 🧾 4️⃣ SERVICE CONTRACTS

### 📋 Listar servicios

**GET /services**

| Caso           | Esperado |
| -------------- | -------- |
| Usuario válido | 200      |
| Sin token      | 401      |

---

### 🔍 Obtener servicio por ID

**GET /services/:id**

| Caso      | Esperado |
| --------- | -------- |
| Existe    | 200      |
| No existe | 404      |

---

## 🎫 5️⃣ TICKETS (CRÍTICO)

### ➕ Crear ticket

**POST /tickets**

| Caso                 | Esperado |
| -------------------- | -------- |
| Cliente activo       | 201      |
| Cliente inactivo     | 400      |
| Servicio inexistente | 400      |
| Sin token            | 401      |

---

### 🔁 Cambiar estado

**PATCH /tickets/:id/status**

| Caso                | Esperado |
| ------------------- | -------- |
| Transición válida   | 200      |
| Transición inválida | 400      |
| Ticket cancelado    | 400      |
| Rol no permitido    | 403      |

---

### 📜 Historial

**GET /tickets/:id/history**

| Caso             | Esperado |
| ---------------- | -------- |
| Ticket existe    | 200      |
| Ticket no existe | 404      |
| Sin token        | 401      |

---

## 📊 6️⃣ MÉTRICAS (si ya expuestas)

| Endpoint          | Validar      |
| ----------------- | ------------ |
| GET /metrics/*    | Solo lectura |
| Sin token         | 401          |
| Roles incorrectos | 403          |

---

# 🛡️ PLAN DE HARDENING OFICIAL

## 1️⃣ Errores HTTP CONSISTENTES

| Caso             | Código |
| ---------------- | ------ |
| Input inválido   | 400    |
| No autenticado   | 401    |
| No autorizado    | 403    |
| No encontrado    | 404    |
| Conflicto lógico | 409    |
| Error interno    | 500    |

📌 **Nunca**:

* 200 con error
* mensajes técnicos de Prisma
* stack traces

---

## 2️⃣ Edge Cases CRÍTICOS

### 🔸 IDs

* `NaN`
* negativos
* strings

👉 Respuesta: **400**

---

### 🔸 Estados

* transición inválida
* doble cancelación
* cerrar sin resolver

👉 Respuesta: **400**

---

### 🔸 Usuarios inactivos

* login
* crear tickets
* cambios de estado

👉 **403 siempre**

---

## 3️⃣ Permisos (NO NEGOCIABLE)

| Acción             | Rol                 |
| ------------------ | ------------------- |
| Crear usuario      | ADMIN               |
| Ver usuarios       | ADMIN               |
| Crear cliente      | ADMIN               |
| Desactivar cliente | ADMIN               |
| Crear ticket       | TECNICO / INGENIERO |
| Cambiar estado     | Según transición    |

---

## 4️⃣ Seguridad Operativa

✔ DTOs separan input/output
✔ Controllers no contienen lógica
✔ Services validan todo
✔ Prisma solo en services
✔ Historial solo para tickets

---

## 5️⃣ Criterio de CIERRE v2.0.0

El backend se considera **cerrado** cuando:

✔ Todos los tests manuales pasan
✔ No hay endpoint “dudoso”
✔ No hay `TODO` abiertos
✔ No hay reglas implícitas

---

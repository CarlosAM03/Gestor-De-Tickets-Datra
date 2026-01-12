
---

##Estado de implementacion actual
---
| Componente             | Estado      |
| ---------------------- | ----------- |
| Prisma Schema v2.0.0   | ✅ Cerrado   |
| Contratos de Dominio   | ✅ Cerrados  |
| Contratos de Endpoints | ✅ Cerrados  |
| Servicios principales  | ✅ Cerrados   |
| Controladores          | ✅ Cerrados  |
| TicketHistory          | ✅ Cerrados  |
| ServiceContracts       | ✅ Cerrados  |
| AdminImportClients     | ✅ Cerrados  |
| Módulos NestJS         | ✅ Cerrados  |


---

# 🔗 Documentación de Conexión Frontend → Backend

**Gestor de Tickets Datra — Backend API (Corte 11/01/2026)**

---

## 🌐 Base URL (entorno desarrollo)

```ts
http://localhost:3000
```

> ⚠️ Todos los endpoints **excepto `/auth/login`** requieren autenticación JWT.

---

## 🔐 Autenticación

### ▶️ Login

**Endpoint**

```http
POST /auth/login
```

**Body (JSON)**

```json
{
  "email": "admin@datra.mx",
  "password": "keyAdmin01"
}
```

**Respuesta exitosa (200)**

```json
{
  "message": "Login exitoso",
  "access_token": "JWT_TOKEN",
  "expires_in": "3600s",
  "user": {
    "id": "uuid",
    "name": "Admin Datra",
    "email": "admin@datra.mx",
    "role": "ADMIN"
  }
}
```

---

### 🔑 Uso del token en Frontend

En **todas las requests protegidas**:

```http
Authorization: Bearer <access_token>
```

Ejemplo con `fetch`:

```ts
fetch('/tickets', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## 👤 Usuarios (`/users`)

> 🔒 Protegido por JWT + Roles

### Crear usuario

```http
POST /users
```

### Obtener usuarios

```http
GET /users
```

### Obtener usuario por ID

```http
GET /users/:id
```

### Actualizar perfil propio

```http
PATCH /users/me
```

### Actualizar usuario (admin)

```http
PATCH /users/:id
```

---

## 🧾 Clientes (`/clients`)

### Obtener todos

```http
GET /clients
```

### Obtener por RFC

```http
GET /clients/:rfc
```

### Activar cliente

```http
PATCH /clients/:rfc/activate
```

### Desactivar cliente

```http
PATCH /clients/:rfc/deactivate
```

> 📌 Los clientes **no se eliminan**, solo se activan/desactivan (soft delete).

---

## 📑 Contratos de Servicio (`/service-contracts`)

### Crear contrato

```http
POST /service-contracts
```

### Obtener todos

```http
GET /service-contracts
```

### Obtener por cliente (RFC)

```http
GET /service-contracts/client/:rfc
```

### Obtener por ID

```http
GET /service-contracts/:id
```

### Actualizar contrato

```http
PATCH /service-contracts/:id
```

### Desactivar contrato

```http
PATCH /service-contracts/:id/deactivate
```

---

## 🎫 Tickets (`/tickets`)

### Crear ticket

```http
POST /tickets
```

### Obtener todos

```http
GET /tickets
```

### Obtener por ID

```http
GET /tickets/:id
```

### Actualizar ticket

```http
PATCH /tickets/:id
```

### Resolver ticket

```http
PATCH /tickets/:id/resolve
```

### Cerrar ticket

```http
PATCH /tickets/:id/close
```

### Cancelar ticket

```http
PATCH /tickets/:id/cancel
```

---

## 🕒 Historial de Tickets

### Obtener historial de un ticket

```http
GET /tickets/:ticketId/history
```

> 📌 El historial es **inmutable**, solo lectura.

---

## 📥 Importación Masiva de Clientes (Admin)

### Importar clientes vía CSV

```http
POST /admin/import-clients
```

* Requiere rol **ADMIN**
* Entrada vía archivo CSV
* Valida estructura, formato y duplicados

---

## 🔐 Seguridad & Reglas Globales

### Autenticación

* JWT obligatorio
* Token validado vía `JwtAuthGuard`

### Autorización

* Control por roles (`@Roles`)
* Guard global `RolesGuard`

Roles disponibles:

```ts
ADMIN
INGENIERO
TECNICO
```

---

## 🚨 Manejo de Errores

Errores de dominio siguen el formato:

```json
{
  "message": "Mensaje claro",
  "code": "FORBIDDEN | NOT_FOUND | BAD_REQUEST"
}
```

Errores comunes:

* `401 Unauthorized` → token inválido o ausente
* `403 Forbidden` → rol insuficiente
* `404 Not Found` → recurso inexistente

---

## ✅ Estado del Backend

✔ Endpoints **cerrados y estables**
✔ Seguridad funcional
✔ JWT + Roles operativos
✔ Listo para consumo por Frontend
✔ Sin breaking changes previstos en Semana 2

---

## 🧠 Nota Final para Frontend

* **No reinventar lógica**
* Confiar en estados y transiciones del backend
* El frontend **solo consume y representa**
* Validaciones críticas viven en backend

---

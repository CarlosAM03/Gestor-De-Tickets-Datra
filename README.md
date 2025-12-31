﻿
---

# 🎫 Gestor de Tickets Datra

**Sistema Empresarial de Gestión de Incidencias y Soporte Técnico**

---

## 📌 Visión General

El **Gestor de Tickets Datra** es un sistema empresarial diseñado para **centralizar, controlar y auditar** la gestión de incidencias, solicitudes técnicas y procesos internos de soporte dentro de la empresa **Datra**.

El sistema está construido bajo principios de **arquitectura limpia, separación de responsabilidades y contratos estables**, con una visión clara de **crecimiento futuro**, integración con sistemas de monitoreo y despliegue en infraestructura empresarial.

📌 **Estado actual:**
✔ Sistema funcional
✔ Arquitectura cerrada
✔ Frontend y Backend congelados (Sprint 3)
✔ Listo para despliegue controlado y pruebas de producción

---

## 🎯 Objetivos del Sistema

* Centralizar la operación de soporte técnico
* Controlar flujos de trabajo por **roles**
* Garantizar trazabilidad completa (auditoría)
* Prevenir eliminaciones destructivas de información
* Facilitar métricas, reportes y dashboards futuros
* Servir como base para integración con sistemas de monitoreo administrado

---

## 🧱 Arquitectura General

El sistema se compone de **dos capas principales**, completamente desacopladas pero alineadas por contrato:

### 🔹 Backend (Core del negocio)

* Define **todas las reglas críticas**
* Valida permisos, estados y flujos
* Controla seguridad, auditoría y persistencia

### 🔹 Frontend (Capa de presentación)

* Consume exclusivamente la API oficial
* Refleja permisos según rol
* No replica reglas de negocio críticas
* Proporciona UX empresarial y segura

📌 **Principio rector**:

> *El backend manda. El frontend obedece.*

---

## 📁 Estructura General del Repositorio

```
GestorTicketsDatra/
│
├── gestor-tickets-datra/        # Backend (NestJS)
│   ├── src/
│   ├── prisma/
│   ├── dist/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│   └── README.md               # Documentación técnica backend
│
├── front-gestor-tickets-datra/ # Frontend (React + TS)
│   ├── src/
│   ├── index.html
│   ├── .env
│   └── README.md               # Documentación técnica frontend
│
├── .gitignore
└── README.md                   # Documentación general (este archivo)
```

---

# 🧭 Backend — NestJS

**`gestor-tickets-datra`**

## 🧱 Stack Tecnológico

* Node.js 18.x
* NestJS ^10
* TypeScript ^5
* Prisma ORM 5.x
* PostgreSQL
* JWT (autenticación)
* Guards + Roles (control de acceso)
* Soft Delete + Auditoría

---

## 👤 Roles del Sistema

| Rol           | Capacidades                                                   |
| ------------- | ------------------------------------------------------------- |
| **ADMIN**     | Control total, auditoría, aprobación/rechazo de eliminaciones |
| **INGENIERO** | Gestión global de tickets, cierre, métricas                   |
| **TECNICO**   | Gestión de tickets propios, cierre, solicitud de eliminación  |

📌 **Decisiones clave**:

* No existe registro público
* El ADMIN no se crea por endpoint
* Eliminaciones siempre son **controladas (soft delete)**

---

## 🎫 Funcionalidades Backend

✔ Creación de tickets con código autogenerado
✔ Asignación automática de usuario creador
✔ Listado por alcance (`mine` / `all`)
✔ Filtros avanzados (fecha, impacto, estatus, búsqueda)
✔ Edición controlada
✔ Cambio de estatus tipado
✔ Solicitud y aprobación de eliminación
✔ Auditoría completa (`TicketHistory`)

---

## 🔌 Endpoints Principales

| Método | Endpoint             |
| ------ | -------------------- |
| POST   | /auth/login          |
| GET    | /tickets             |
| GET    | /tickets/:id         |
| POST   | /tickets             |
| PATCH  | /tickets/:id         |
| PATCH  | /tickets/:id/status  |
| DELETE | /tickets/:id         |
| GET    | /tickets/:id/history |

📌 Endpoints **congelados desde Sprint 3**.

---

## 📊 Estado Backend

✔ Funcional
✔ Estable
✔ Congelado
✔ Listo para producción controlada

---

# 🖥️ Frontend — React + TypeScript

**`front-gestor-tickets-datra`**

## 🎯 Propósito

Proveer una **interfaz empresarial, segura y clara** para la operación diaria del sistema, respetando estrictamente el contrato del backend.

---

## 🧱 Stack Frontend

* React 18
* TypeScript
* Vite
* React Router DOM
* Axios
* Bootstrap 5
* Context API (Auth)

---

## 🔐 Seguridad y Sesión

✔ Login real contra backend
✔ Persistencia de sesión
✔ Interceptor JWT automático
✔ Manejo global de 401
✔ Protección de rutas
✔ Protección por rol

---

## 📊 Funcionalidades Frontend

### Dashboard

* Actividad reciente
* Contexto por rol
* Preparado para métricas

### Tickets

* Listado
* Filtros
* Detalle
* Creación
* Edición permitida
* Cambio de estatus
* Solicitud de eliminación

### Usuarios

* Listado (ADMIN)
* Vista de perfil
* ❌ Edición pendiente → Sprint 4

---

## 📊 Estado Frontend

✔ Funcional
✔ UX consolidada
✔ Fondo corporativo aplicado post-login
✔ Rutas y layouts cerrados
✔ Congelado desde Sprint 3

---

# 🧠 Decisiones Técnicas Clave

* Soft delete obligatorio
* Auditoría completa
* Backend como autoridad
* Contratos estables
* Arquitectura preparada para escalar
* Pensado para integración futura con monitoreo

---

# 🔒 Estado del Proyecto — Cierre Sprint 3

| Área      | Estado               |
| --------- | -------------------- |
| Backend   | ✅ Congelado          |
| Frontend  | ✅ Congelado          |
| Dashboard | ✅ Cerrado            |
| Tickets   | ✅ Operativo          |
| Usuarios  | 🟡 Edición pendiente |
| Sprint 3  | 🟢 CERRADO           |

---

# 🔜 Sprint 4 — Enfoque

* Edición de usuario
* Hardening de producción
* Despliegue real
* Testing post-deploy
* Presentación ejecutiva
* Integración futura con monitoreo

---

# 👨‍💻 Equipo

**Carlos Benjamín Armenta Márquez**
Rol:
  * Dirección técnica del proyecto
  * Arquitectura de software
  * Desarrollo backend-frontend
  * Integración
  * Planeación de despliegue y evolución

**Javier Fernández Cortez**
Rol:
   * Diseño UI/UX
   * Mockups y apoyo visual

---

## 🔧 Instalación y Configuración del Backend

### 1️⃣ Requisitos Previos

* Node.js 18+
* Prisma ORM** **v5.16.1**
* PostgreSQL 14+
* npm 9+

---

### 2️⃣ Instalación

```bash
cd gestor-tickets-datra
npm install
```

---

### 3️⃣ Configuración de Entorno

```bash
cp .env.example .env
```

Editar `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/gestor_tickets?schema=public"
JWT_SECRET="SECRET_KEY"
PORT=3000
```

---

### 4️⃣ Prisma

```bash
npx prisma generate
npx prisma migrate dev
```

Opcional:

```bash
npx prisma studio
```

---

### 5️⃣ Ejecutar el Servidor

```bash
npm run start:dev
```

Servidor disponible en:

```
http://localhost:3000
```

Swagger (si está habilitado):

```
http://localhost:3000/api
```

---

## 🛠 Scripts Disponibles

```bash
npm run start        # Producción
npm run start:dev    # Desarrollo
npm run build        # Compilar proyecto
npm run test         # Tests unitarios
npm run prisma:studio
```

---

## 🔧 Instalación y Ejecución del Frontend

### 1️⃣ Requisitos Previos

* Node.js 18+
* npm 9+
* Backend operativo

---


### 2️⃣ Instalación

```bash
cd front-gestor-tickets
npm install
```

---

### 3️⃣ Configuración de Entorno

```bash
cp .env.example .env
```

Ejemplo:

```env
VITE_API_URL=http://localhost:3000
```

---

### 4️⃣ Ejecución en Desarrollo

```bash
npm run dev
```

Frontend disponible en:

```
http://localhost:5173
```

---

### 5️⃣ Build de Producción

```bash
npm run build
```

---

## 📊 Diagrama Entidad–Relación (Base de Datos)

La base de datos del **Gestor de Tickets Datra** está diseñada para soportar un sistema de tickets empresarial, con **control de roles**, **auditoría completa**, **soft delete**, **trazabilidad de acciones** y **gestión formal de clientes**.

El modelo se compone de **cuatro entidades centrales**:

* **User**
* **Client**
* **Ticket**
* **TicketHistory**

Además, se utilizan **enums tipados** para garantizar consistencia en estados, roles, impacto y tipo de cliente.

---

### 🧱 Entidades principales

#### 👤 User

Representa a los usuarios del sistema (ADMIN, TÉCNICO, INGENIERO).

**Responsabilidades:**

* Crear tickets
* Realizar diagnósticos preliminares
* Cerrar tickets
* Solicitar o aprobar eliminaciones
* Registrar acciones en el historial (auditoría)

**Relaciones clave:**

* Un usuario puede estar asociado a **muchos tickets** en distintos roles:

  * creador
  * técnico de cierre
  * diagnóstico preliminar
  * aprobador de eliminación
* Un usuario puede realizar **muchas acciones de auditoría** (`TicketHistory`)

---

#### 🏢 Client

Representa a los **clientes de la empresa Datra**, identificados de forma única por su **RFC**.

**Responsabilidades:**

* Agrupar tickets por cliente
* Permitir auditoría, filtros y métricas futuras
* Facilitar integración con sistemas externos y monitoreo

**Relaciones clave:**

* Un cliente puede estar asociado a **muchos tickets**
* El RFC del cliente se replica como **snapshot** en el historial para auditoría

📌 El modelo de cliente es **definitivo y escalable**, preparado para uso empresarial real.

---

#### 🎫 Ticket

Entidad central del sistema. Representa un incidente o solicitud de soporte.

**Características principales:**

* Código único de identificación
* Ciclo de vida completo
  (OPEN → IN_PROGRESS → ON_HOLD → RESOLVED → CLOSED / CANCELLED)
* Asociación opcional a cliente
* Diagnóstico y cierre estructurados
* Eliminación controlada (soft delete)
* Relación explícita con usuarios según su rol
* Historial completo de auditoría

---

#### 📜 TicketHistory

Registra **todas las acciones relevantes** realizadas sobre un ticket.

**Propósito:**

* Auditoría completa
* Trazabilidad de cambios
* Cumplimiento administrativo
* Base para métricas y reportes futuros

Cada registro indica:

* Qué ticket fue afectado
* RFC del cliente (snapshot)
* Qué acción se realizó
* Valor anterior y nuevo
* Quién realizó la acción
* Fecha y hora

---

### 🔐 Enums del sistema

| Enum           | Descripción                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| `TicketStatus` | Estado del ticket (OPEN, IN_PROGRESS, ON_HOLD, RESOLVED, CLOSED, CANCELLED) |
| `UserRole`     | Rol del usuario (ADMIN, TECNICO, INGENIERO)                                 |
| `ImpactLevel`  | Nivel de impacto (CRITICAL, HIGH, MEDIUM, LOW, INFO)                        |
| `ClientType`   | Tipo de cliente (INTERNO, EXTERNO)                                          |

---

## 🧩 Diagrama ER (Mermaid — Actualizado a Prisma)

```mermaid
erDiagram
    USER {
        int id PK
        string name
        string email
        string password
        enum role
        boolean active
        datetime createdAt
        datetime updatedAt
    }

    CLIENT {
        string rfc PK
        string companyName
        string businessName
        string location
        datetime createdAt
        datetime updatedAt
    }

    TICKET {
        int id PK
        string code
        datetime openedAt
        enum status
        string requestedBy
        string contact
        enum clientType

        string serviceAffected
        string problemDesc
        string eventLocation
        datetime estimatedStart
        enum impactLevel

        string initialFindings
        string probableRootCause

        string actionsTaken
        datetime closedAt
        string serviceStatus
        string additionalNotes
        boolean correctiveAction

        boolean deleteRequested
        datetime deletedAt

        datetime createdAt
        datetime updatedAt
    }

    TICKETHISTORY {
        int id PK
        int ticketId
        string clientRfc
        string action
        string fromValue
        string toValue
        datetime createdAt
    }

    USER ||--o{ TICKET : creates
    USER ||--o{ TICKET : preliminary
    USER ||--o{ TICKET : closes
    USER ||--o{ TICKET : deletes

    CLIENT ||--o{ TICKET : has

    TICKET ||--o{ TICKETHISTORY : has
    USER ||--o{ TICKETHISTORY : performs
```

---

## 🔗 Relaciones y cardinalidades

| Relación                          | Tipo | Descripción                          |
| --------------------------------- | ---- | ------------------------------------ |
| User → Ticket (createdBy)         | 1:N  | Usuario creador del ticket           |
| User → Ticket (preliminaryBy)     | 1:N  | Diagnóstico preliminar               |
| User → Ticket (closingTechnician) | 1:N  | Usuario que cierra el ticket         |
| User → Ticket (deletedBy)         | 1:N  | Usuario que aprueba eliminación      |
| Client → Ticket                   | 1:N  | Cliente asociado a múltiples tickets |
| Ticket → TicketHistory            | 1:N  | Historial completo del ticket        |
| User → TicketHistory              | 1:N  | Acciones realizadas por usuarios     |

---

## 🧠 Decisiones de diseño

* ✅ **Soft delete** para preservar historial y trazabilidad
* ✅ **Auditoría completa** mediante `TicketHistory`
* ✅ **Entidad Client separada y definitiva**
* ✅ **Snapshot de RFC en historial** para auditoría robusta
* ✅ **Relaciones explícitas por rol**
* ✅ **Enums tipados** para evitar estados inválidos
* ✅ Diseño preparado para **escalado, métricas y monitoreo futuro**

---

### 🔒 Estado del modelo

📌 **Modelo congelado — Sprint 3 cerrado**
📌 Cualquier cambio estructural pasa a **Sprint 4**

---

## Routing

La aplicación utiliza React Router DOM 6.23.0

### Estado frente a v7
- No se utilizan rutas relativas
- No se utilizan splat paths (`*`)
- Arquitectura compatible con v7

La migración a React Router DOM v7 está planificada
post-producción y no representa riesgo funcional.

---
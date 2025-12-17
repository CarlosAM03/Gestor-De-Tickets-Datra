﻿﻿﻿# 🎫 Gestor de Tickets Datra

Sistema de gestión de tickets desarrollado para la empresa **Datra**, orientado a la administración de solicitudes, incidencias y procesos internos de soporte técnico.

Este repositorio actualmente contiene **el Backend completo (NestJS)**. El **Frontend** modo moc en proceso de migracion integrado dentro de la misma estructura del proyecto.

---

## 📌 Alcance del Sistema

El sistema está diseñado para:

* Gestionar tickets de soporte con ciclo de vida controlado
* Aplicar reglas de negocio basadas en **roles de usuario**
* Mantener trazabilidad de acciones (auditoría)
* Permitir crecimiento hacia métricas, reportes y dashboards

---

## 📁 Estructura General del Proyecto

```
GestorTicketsDatra/
│
├── gestor-tickets-datra/        # Backend (NestJS)
│   ├── src/
│   ├── prisma/
│   ├── dist/
│   ├── node_modules/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│   └── README.md               # Documentación técnica del backend
│
├── .gitignore
└── README.md                   # Este archivo
```

---

## 🚀 Backend — NestJS (`gestor-tickets-datra`)

### 🧱 Stack Tecnológico

* **Node.js**: 18.x
* **NestJS**: ^10.x
* **TypeScript**: ^5.x
* **Prisma ORM**: **v5.16.1**
* **Base de datos**: PostgreSQL
* **Autenticación**: JWT
* **Validaciones**: class-validator / class-transformer
* **Control de acceso**: Guards + Roles

---

## 👤 Roles del Sistema

| Rol           | Descripción                                                                             |
| ------------- | --------------------------------------------------------------------------------------- |
| **ADMIN**     | Control total del sistema, aprobación de eliminaciones, auditoría, métricas             |
| **TECNICO**   | Crear, consultar y actualizar sus tickets. Puede cerrar tickets y solicitar eliminación |
| **INGENIERO** | Crear, consultar, actualizar y cerrar tickets globales. Acceso a métricas generales     |

📌 **Notas importantes**

* El **ADMIN no se crea por endpoint público**
* La eliminación de tickets es **por solicitud (soft delete)**

---

## 🎫 Funcionalidades Implementadas

### Tickets

✔ Crear ticket con código autogenerado

✔ Asignación automática del usuario creador

✔ Listar tickets:

* Propios (`scope=mine`)
* Globales (`scope=all`)

✔ Filtros avanzados:

* Rango de fechas (`from`, `to`)
* Impacto
* Estatus
* Búsqueda textual

✔ Ver detalle de ticket

✔ Actualizar información del ticket

✔ Actualizar estatus (tipado seguro)

✔ Solicitud de eliminación

---

## 🔌 Endpoints Principales

| Método | Ruta                              | Descripción                           |
| ------ | --------------------------------- | ------------------------------------- |
| POST   | /tickets                          | Crear ticket                          |
| GET    | /tickets                          | Listar tickets (mine / all + filtros) |
| GET    | /tickets/:id                      | Ver ticket                            |
| PATCH  | /tickets/:id                      | Actualizar información                |
| PATCH  | /tickets/:id/status               | Actualizar estatus                    |
| DELETE | /tickets/:id                      | Solicitar eliminación                 |
| GET    | /tickets/admin/delete-requests    | Ver solicitudes (ADMIN)               |
| PATCH  | /tickets/admin/:id/approve-delete | Aprobar eliminación                   |
| PATCH  | /tickets/admin/:id/reject-delete  | Rechazar eliminación                  |
| GET    | /tickets/:id/history              | Historial del ticket (ADMIN)          |

---

## 🔧 Instalación y Configuración del Backend

### 1️⃣ Requisitos Previos

* Node.js 18+
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

## 📊 Estado Actual del Proyecto

✔ Backend funcional y estable

✔ Reglas de negocio por rol aplicadas

✔ Sistema listo para conexión con Frontend

✔ Arquitectura preparada para métricas y reportes

❌ Frontend aún no integrado

---

## 🎯 Objetivo del Proyecto

* Centralizar la gestión de tickets de Datra
* Unificar backend y frontend en un solo repositorio
* Mantener estándares profesionales de desarrollo
* Facilitar escalabilidad y mantenimiento

---

## 👨‍💻 Equipo

**Carlos Benjamín Armenta Márquez**
Roles: Líder de proyecto, arquitectura, planificación, desarrollo backend, integración frontend

**Javier Fernández Cortez**
Roles: Diseño y desarrollo del frontend

---

# 🖥️ Frontend — Aplicación Web (`front-gestor-tickets`)

El **Frontend del Gestor de Tickets Datra** corresponde a la capa de presentación del sistema y es responsable de proporcionar una **interfaz web segura, clara y controlada** para los distintos perfiles de usuario definidos por la organización.

Esta capa se desarrolla con un enfoque **empresarial**, consumiendo exclusivamente la **API oficial del backend** y respetando estrictamente las reglas de negocio, permisos y flujos establecidos del lado servidor.

---

## 📌 Alcance del Frontend

El frontend está diseñado para:

* Permitir el acceso seguro de usuarios mediante autenticación centralizada
* Visualizar y gestionar tickets de soporte en tiempo real
* Aplicar control de acceso visual según **rol del usuario**
* Facilitar la operación diaria de técnicos e ingenieros
* Proveer herramientas administrativas para supervisión y auditoría
* Preparar la base para dashboards, métricas y reportes ejecutivos

📌 **Principio arquitectónico**:
El frontend **no implementa reglas críticas de negocio**.
Todas las validaciones finales y autorizaciones se realizan en el backend.

---

## 🧱 Stack Tecnológico (Frontend)

* **Node.js**: 18.x
* **React**: ^18.x
* **TypeScript**: ^5.x
* **Gestión de estado**: Context API / Zustand / Redux Toolkit (según evolución del proyecto)
* **Cliente HTTP**: Axios
* **Enrutamiento**: React Router DOM
* **Estilos**: Bootstrap / Tailwind CSS (definición final según lineamientos visuales)
* **Autenticación**: JWT (consumido desde backend)

Este stack permite un desarrollo **modular, escalable y mantenible**, alineado con estándares actuales de aplicaciones empresariales.

---

## 🔐 Autenticación y Seguridad

### Acceso al sistema

* Endpoint consumido: `POST /auth/login`
* El frontend **solo expone funcionalidad de login**
* No existe registro público de usuarios
* El token JWT se gestiona de forma controlada para proteger la sesión

### Gestión de sesión

* Protección de rutas privadas
* Manejo automático de sesión expirada (401)
* Logout controlado
* Interceptor HTTP para inyección de token y manejo centralizado de errores

📌 **Decisión de seguridad**:
La creación de usuarios y asignación de roles es responsabilidad exclusiva del **ADMIN**, fuera del alcance del frontend público.

---

## 👤 Roles del Sistema (Vista Frontend)

| Rol           | Funcionalidades visibles                                                                       |
| ------------- | ---------------------------------------------------------------------------------------------- |
| **ADMIN**     | Gestión global de tickets, aprobación/rechazo de eliminaciones, auditoría, historial, métricas |
| **TECNICO**   | Creación, consulta, actualización y cierre de tickets propios. Solicitud de eliminación        |
| **INGENIERO** | Gestión global de tickets, cierre, solicitud de eliminación y acceso a métricas                |

📌 El frontend **controla la visibilidad de acciones** según rol.
📌 El backend **valida siempre los permisos reales**.

---

## 🎫 Funcionalidades del Frontend

### Gestión de Tickets

✔ Listado de tickets:

* Tickets propios (`scope=mine`)
* Tickets globales (`scope=all`)

✔ Filtros operativos:

* Estatus
* Impacto
* Rango de fechas
* Búsqueda textual

✔ Visualización de detalle de ticket

✔ Creación de nuevos tickets

✔ Actualización de información permitida

✔ Cambio de estatus del ticket

✔ Solicitud de eliminación (flujo controlado)

✔ Visualización de historial (ADMIN)

---

### Dashboard Operativo

* Vista inicial con tickets recientes
* Resumen operativo por rol
* Espacio preparado para métricas y KPIs
* Componentes administrativos exclusivos para perfiles autorizados

---

## 🔌 Integración con Backend

El frontend consume **únicamente** la API oficial del backend.

### Endpoints principales utilizados

| Función               | Endpoint                    |
| --------------------- | --------------------------- |
| Login                 | POST `/auth/login`          |
| Listar tickets        | GET `/tickets`              |
| Ver detalle           | GET `/tickets/:id`          |
| Crear ticket          | POST `/tickets`             |
| Actualizar ticket     | PATCH `/tickets/:id`        |
| Cambiar estatus       | PATCH `/tickets/:id/status` |
| Solicitar eliminación | DELETE `/tickets/:id`       |
| Historial             | GET `/tickets/:id/history`  |

📌 Los contratos de datos y tipos se mantienen **alineados con el backend**.

---

## 📁 Arquitectura del Frontend

```
front-gestor-tickets-datra/
│
├── src/
│   ├── api/
│   │   ├── http.ts              # Axios base + interceptores
│   │   ├── auth.api.ts          # /auth/login
│   │   └── tickets.api.ts       # Endpoints de tickets
│   │
│   ├── auth/
│   │   ├── AuthContext.tsx      # Estado global de sesión
│   │   ├── AuthProvider.tsx
│   │   ├── useAuth.ts
│   │   ├── RequireAuth.tsx      # Protección de rutas
│   │   └── RequireRole.tsx      # Protección por rol
│   │
│   ├── layouts/
│   │   ├── MainLayout.tsx       # Layout para login
│   │   ├── MainLayout.css  
│   │   └── Sidebar.tsx        # Layout protegido (sidebar, navbar)
│   │
│   ├── pages/
│   │   ├── Login/
│   │   │   ├── Login.tsx
│   │   │   └── Login.css
│   │   │
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   └── Dashboard.css
│   │   │
│   │   └── Users/
│   │       ├── Users.tsx
│   │       └── Users.css
│   │   
│   │
│   ├── tickets/
│   │   ├── pages/
│   │   ├── components/
│   │   └── hooks/
│   │
│   ├── routes/
│   │   └── AppRouter.tsx
│   │
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   └── ticket.types.ts
│   │
│   ├── utils/
│   │   ├── constants.ts
│   │   └── role.utils.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── .env
├── .env.production
├── index.html
└── README.md
```

Esta estructura permite **separación clara de responsabilidades** y facilita la evolución del sistema.

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

## 📊 Estado Actual del Frontend

✔ Arquitectura frontend definida
✔ Plan de desarrollo validado
✔ Contrato backend claramente establecido

🟡 Integración progresiva en curso

❌ Aún no integrado completamente al repositorio principal

---

## 🎯 Objetivo del Frontend

* Proveer una interfaz profesional y confiable
* Facilitar la operación diaria del área de soporte
* Cumplir políticas de seguridad y control de acceso
* Preparar el sistema para métricas y dashboards ejecutivos
* Integrarse completamente con el backend Datra

---

## 📊 Diagrama Entidad–Relación (Base de Datos)

La base de datos del **Gestor de Tickets Datra** está diseñada para soportar un sistema de tickets profesional, con **control de roles**, **auditoría completa**, **soft delete** y **trazabilidad de acciones**.

El modelo se compone principalmente de tres entidades centrales:

* **User**
* **Ticket**
* **TicketHistory**

Además, se utilizan **enums tipados** para garantizar consistencia en estados, roles e impacto.

---

### 🧱 Entidades principales

#### 👤 User

Representa a los usuarios del sistema (ADMIN, TÉCNICO, INGENIERO).

**Responsabilidades:**

* Crear tickets
* Realizar diagnósticos preliminares
* Cerrar tickets
* Solicitar o aprobar eliminaciones
* Registrar acciones en el historial

Relaciones clave:

* Un usuario puede estar asociado a **muchos tickets** en distintos roles.
* Un usuario puede realizar **muchas acciones de auditoría** (`TicketHistory`).

---

#### 🎫 Ticket

Entidad central del sistema. Representa un incidente o solicitud de soporte.

**Características principales:**

* Ciclo de vida completo (OPEN → IN_PROGRESS → RESOLVED → CLOSED)
* Información del cliente e impacto
* Diagnóstico, acciones y cierre
* Eliminación controlada (soft delete)
* Relación con múltiples usuarios según el rol que desempeñaron

---

#### 📜 TicketHistory

Registra **todas las acciones relevantes** realizadas sobre un ticket.

**Propósito:**

* Auditoría completa
* Trazabilidad de cambios
* Cumplimiento y control administrativo

Cada registro indica:

* Qué ticket fue afectado
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

## 🧩 Diagrama ER (Mermaid)

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
        string action
        string fromValue
        string toValue
        datetime createdAt
    }

    USER ||--o{ TICKET : creates
    USER ||--o{ TICKET : closes
    USER ||--o{ TICKET : preliminary
    USER ||--o{ TICKET : deletes

    TICKET ||--o{ TICKETHISTORY : has
    USER ||--o{ TICKETHISTORY : performs
```

---

## 🔗 Relaciones y cardinalidades

| Relación                          | Tipo | Descripción                           |
| --------------------------------- | ---- | ------------------------------------- |
| User → Ticket (createdBy)         | 1:N  | Un usuario puede crear muchos tickets |
| User → Ticket (preliminaryBy)     | 1:N  | Diagnóstico preliminar                |
| User → Ticket (closingTechnician) | 1:N  | Usuario que cierra el ticket          |
| User → Ticket (deletedBy)         | 1:N  | Usuario que aprueba eliminación       |
| Ticket → TicketHistory            | 1:N  | Historial completo del ticket         |
| User → TicketHistory              | 1:N  | Acciones realizadas por usuarios      |

---

## 🧠 Decisiones de diseño

* ✅ **Soft delete** para preservar historial y trazabilidad
* ✅ **Auditoría completa** mediante `TicketHistory`
* ✅ **Relaciones explícitas** para cada rol del usuario en el ciclo del ticket
* ✅ **Enums tipados** para evitar estados inválidos
* ✅ Diseño listo para **escalar y agregar métricas**

---
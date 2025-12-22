
# 🎫 Gestor de Tickets Datra — Frontend

Frontend oficial del sistema **Gestor de Tickets Datra**, desarrollado con **React + TypeScript**, orientado a un entorno empresarial y diseñado para consumir **directamente el backend en NestJS**, respetando estrictamente su contrato, reglas de negocio y control de roles.

El proyecto sigue una **arquitectura modular, escalable y preparada para producción**, con crecimiento incremental por sprints.

---

## 🚀 Objetivo del Proyecto

Construir una aplicación web profesional que permita:

* Autenticación real contra backend (JWT)
* Persistencia de sesión
* Control de acceso por roles (ADMIN, INGENIERO, TECNICO)
* Gestión de tickets alineada al contrato backend
* Navegación protegida
* Experiencia de usuario empresarial
* Código mantenible y escalable

---

## ✅ Estado Actual del Sistema (Cierre Sprint 2)

El sistema frontend se encuentra en un **estado estable y funcional**, con el siguiente alcance confirmado:

### 🔐 Autenticación y Seguridad

* Login real (`/auth/login`)
* Manejo de sesión con Context API
* Persistencia de token en `localStorage`
* Interceptor Axios con JWT automático
* Logout automático ante `401`
* Protección de rutas privadas
* Protección por rol (`RequireRole`)

### 🧭 Ruteo y Layouts

* Ruteo centralizado con React Router v6
* Layout público (login)
* Layout protegido (navbar + contenido)
* Rutas protegidas por sesión y rol
* Redirecciones controladas

### 📊 Dashboard

* Dashboard conectado a backend real
* Visualización de actividad reciente **global**
* Información contextual del usuario autenticado
* Sin acciones de edición (lectura informativa)

### 🎫 Tickets (Core — Lectura)

* Listado real de tickets desde backend
* Filtros funcionales (status, búsqueda)
* Acceso al detalle de ticket
* Respeto de permisos desde backend
* UI preparada para edición futura

📌 **Nota:**
La edición, creación y eliminación de tickets se encuentran **parcialmente implementadas** y **documentadas para Sprint 3**.

---

## 🧠 Principios Clave de Arquitectura

* El **backend define las reglas de negocio**
* El frontend **no duplica validaciones críticas**
* Los permisos se reflejan en UI, no se re-implementan
* Separación clara por dominio
* Código tipado y predecible
* Preparado para escalar sin refactor masivo

---

## 🧩 Tecnologías Utilizadas

| Tecnología          | Uso               |
| ------------------- | ----------------- |
| React 18            | UI                |
| TypeScript          | Tipado estricto   |
| Vite                | Bundler           |
| React Router DOM v6 | Ruteo             |
| Axios               | Cliente HTTP      |
| Bootstrap 5         | Base UI           |
| JWT                 | Autenticación     |
| ESLint              | Calidad de código |

---

## 📁 Arquitectura del Proyecto

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
│   │   ├── AuthProvider.tsx
│   │   ├── useAuth.ts
│   │   ├── RequireAuth.tsx
│   │   └── RequireRole.tsx
│   │
│   ├── layouts/
│   │   ├── AuthLayout.tsx
│   │   └── MainLayout.tsx
│   │
│   ├── pages/
│   │   ├── Login/
│   │   ├── Dashboard/
│   │   ├── Tickets/
│   │   ├── Users/
│   │   ├── Unauthorized/
│   │   └── NotFound/
│   │
│   ├── routes/
│   │   └── AppRoutes.tsx
│   │
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   └── ticket.types.ts
│   │
│   ├── constants/
│   │   └── ticketStatus.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── .env
├── .env.production
├── index.html
└── README.md
```

---

## 🔄 Contrato Frontend ↔ Backend

El frontend consume directamente los siguientes endpoints:

### Autenticación

* `POST /auth/login`

### Tickets

* `GET /tickets?scope=mine`
* `GET /tickets?scope=all`
* `GET /tickets/:id`
* `POST /tickets`
* `PATCH /tickets/:id`
* `PATCH /tickets/:id/status`
* `DELETE /tickets/:id`

📌 Las reglas de acceso se validan **en el backend** mediante Guards y lógica de Service.

---

## 🌍 Variables de Entorno

### `.env`

```env
VITE_API_URL=http://localhost:3000
```

### `.env.production`

```env
VITE_API_URL=https://api.dominio.com
```

---

## 🛠️ Instalación y Ejecución

### 1️⃣ Clonar repositorio

```bash
git clone https://github.com/CarlosAM03/Gestor-De-Tickets-Datra.git
cd front-gestor-tickets-datra
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Ejecutar en desarrollo

```bash
npm run dev
```

---

## 🧪 Usuarios de Prueba (Backend)

| Rol       | Email                                             | Password   |
| --------- | ------------------------------------------------- | ---------- |
| Admin     | [admin@email.com](mailto:admin@email.com)         | keyAdmin01 |
| Ingeniero | [ingeniero@email.com](mailto:ingeniero@email.com) | keyIng01   |
| Técnico   | [tecnico@email.com](mailto:tecnico@email.com)     | keyTec01   |

---

## 🔜 Próximo Paso — Sprint 3

Sprint 3 se enfoca en:

* Consolidar el core de tickets
* Corregir creación y edición
* Ajustar scope personal de tickets
* Implementar eliminación controlada
* Perfil de usuario
* Preparar administración de usuarios

📄 El detalle del Sprint 3 se documenta en el archivo de sprints independiente.

---

## 📌 Conclusión

Este frontend se encuentra **listo para evolucionar a producción**, con una base sólida, alineada al backend real y con una arquitectura clara que permite crecimiento controlado por sprints.

Sprint 2 deja un sistema **estable, usable y coherente**.
Sprint 3 consolida el dominio principal.

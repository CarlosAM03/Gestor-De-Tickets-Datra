
---

# 🎫 Gestor de Tickets Datra – Frontend (Real)

Frontend oficial del sistema **Gestor de Tickets Datra**, desarrollado con **React + TypeScript**, orientado a un entorno empresarial, con autenticación real, control de roles y una arquitectura escalable para producción.

Este frontend **consume directamente el backend en NestJS**, sin mocks, y está diseñado para crecer por módulos y dominios.

---

## 🚀 Objetivo del Proyecto

Construir una aplicación web profesional que permita:

* Autenticación real contra backend
* Control de acceso por roles (ADMIN, INGENIERO, TECNICO)
* Visualización y gestión de tickets
* Navegación protegida
* Arquitectura mantenible y escalable
* UX limpia y empresarial

---

## ✅ Estado Actual – Sprint 1 (Frontend Real)

✔️ Autenticación real (login)
✔️ Manejo de sesión con Context API
✔️ Interceptor HTTP con Axios
✔️ Logout automático por 401
✔️ Protección de rutas (RequireAuth)
✔️ Estructura modular por dominio
✔️ Layouts separados (Auth / App)
✔️ Variables de entorno
✔️ Base lista para dashboard empresarial

---

## 🧩 Tecnologías Utilizadas

| Tecnología       | Versión | Uso               |
| ---------------- | ------- | ----------------- |
| React            | 18+     | UI                |
| TypeScript       | 5+      | Tipado estricto   |
| Vite             | 5+      | Bundler           |
| React Router DOM | 6+      | Ruteo             |
| Axios            | 1+      | HTTP client       |
| Bootstrap        | 5+      | Base UI           |
| JWT              | —       | Autenticación     |
| ESLint           | —       | Calidad de código |

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
│   │   ├── AuthContext.tsx      # Estado global de sesión
│   │   ├── AuthProvider.tsx
│   │   ├── useAuth.ts
│   │   ├── RequireAuth.tsx      # Protección de rutas
│   │   └── RequireRole.tsx      # Protección por rol
│   │
│   ├── layouts/
│   │   ├── AuthLayout.tsx       # Layout para login
│   │   └── MainLayout.tsx       # Layout protegido (sidebar, navbar)
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
│   │   ├── Unauthorized/
│   │   │   ├── Unauthorized.tsx
│   │   │   └── Unauthorized.css
│   │   │
│   │   └── NotFound/
│   │       ├── NotFound.tsx
│   │       └── NotFound.css
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

---

## 🔐 Autenticación y Seguridad

### Login

* Login único (sin registro)
* Consumo directo de `/auth/login`
* Token JWT almacenado en `localStorage`
* Usuario guardado en contexto global

### Protección de rutas

* `RequireAuth` protege rutas privadas
* Redirección automática a `/login`
* `RequireRole` valida permisos por rol

### Interceptor HTTP

* Se agrega token automáticamente a cada request
* Si el backend responde `401`:

  * Se limpia sesión
  * Se redirige al login

---

## 🌍 Variables de Entorno

### `.env`

```
VITE_API_URL=http://localhost:3000
```

### `.env.production`

```
VITE_API_URL=https://api.dominio.com
```

Todo acceso al backend se realiza usando esta variable.

---

## 🎨 Diseño y UX

* Diseño empresarial
* Layouts desacoplados
* Sidebar dinámico por rol
* Estilos separados por módulo
* Base Bootstrap + CSS propio
* Preparado para dark/light mode

---

## 🛠️ Instalación y Ejecución

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/CarlosAM03/Gestor-De-Tickets-Datra.git
cd front-gestor-tickets-datra
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Configurar variables de entorno

Crear archivo `.env`:

```env
VITE_API_URL=http://localhost:3000
```

### 4️⃣ Ejecutar en desarrollo

```bash
npm run dev
```

---

## 🧪 Usuarios de Prueba (Backend)

| Rol       | Email                                           | Password   |
| --------- | ----------------------------------------------- | ---------- |
| Admin     | [admin@email.com](mailto:admin@email.com)       | keyAdmin01 |
| Ingeniero | [ingenieo@email.com](mailto:ingenieo@email.com) | keyIng01   |
| Técnico   | [tecnico@email.com](mailto:tecnico@email.com)   | keyTec01   |

---

## 🗺️ Roadmap Próximos Sprints

### Sprint 2

* Dashboard real por rol
* Sidebar dinámica
* Listado de tickets

### Sprint 3

* Crear / editar tickets
* Cambios de estado
* Comentarios

### Sprint 4

* Métricas
* Filtros avanzados
* Optimización UX

---

## 📌 Principios del Proyecto

* Arquitectura limpia
* Separación de responsabilidades
* Código mantenible
* Escalabilidad real
* Pensado para producción

---

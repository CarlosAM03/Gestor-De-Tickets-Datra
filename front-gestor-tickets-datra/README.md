
---
# 🎫 Gestor de Tickets Datra — Frontend

Frontend oficial del sistema **Gestor de Tickets Datra**, desarrollado con **React + TypeScript**, orientado a entorno **empresarial**, con consumo **directo y tipado** del backend en **NestJS**.

El sistema está diseñado bajo principios de **arquitectura limpia**, **contratos estables**, **control de acceso por rol** y **preparación real para producción**.

---

## 🚀 Objetivo del Proyecto

Proveer una aplicación web profesional para la gestión de tickets que permita:

* Autenticación real con JWT
* Persistencia segura de sesión
* Control de acceso por roles
* Visualización y gestión del ciclo de vida de tickets
* Navegación protegida
* UX empresarial consistente
* Escalabilidad sin refactor estructural

---

## ✅ Estado Actual del Sistema

### 📌 **Sprint 3 — CERRADO (Sistema Congelado)**

El frontend se encuentra en **estado estable, funcional y congelado**, con el siguiente alcance confirmado:

---

## 🔐 Autenticación y Seguridad

* Login real contra backend (`/auth/login`)
* Manejo de sesión con `AuthContext`
* Persistencia de token en `localStorage`
* Interceptor Axios con JWT automático
* Logout forzado ante `401`
* Protección de rutas privadas
* Protección por rol (`RequireRole`)
* Redirección dura ante sesión inválida

📌 **Regla clave:**
El frontend **no duplica validaciones críticas**.
La seguridad es definida y validada en backend.

---

## 🧭 Ruteo y Layouts

* React Router DOM v6
* Layout público (Login)
* Layout protegido (`MainLayout`)
* Navbar dinámico según rol
* Fondo global para usuarios autenticados
* Login aislado visual y estructuralmente
* Redirecciones controladas

---

## 📊 Dashboard

* Dashboard conectado a backend real
* Actividad reciente global
* Filtros por:

  * RFC
  * Estado
  * Impacto
  * Rango de fechas
* Orden por:

  * Más recientes
  * Más antiguos
  * Prioridad de impacto
* Visualización contextual por rol
* Sin acciones destructivas

---

## 🎫 Tickets (Core del Sistema)

### Funcionalidades activas:

* Listado real de tickets
* Scope por rol definido por backend
* Vista detalle de ticket
* Creación de ticket
* Edición controlada
* Cambio de estado
* Eliminación controlada
* UX con estados:

  * Loading
  * Vacíos
  * Errores claros

📌 **Nota:**
Toda acción respeta permisos definidos por backend.

---

## 👤 Usuarios

### Funcionalidades activas:

* Listado de usuarios (ADMIN)
* Creación de usuario (ADMIN)
* Vista de perfil de usuario

### ❌ Funcionalidades NO incluidas (Sprint 4):

* Edición de usuario

---

## 🧠 Principios de Arquitectura

* Backend define reglas de negocio
* Frontend refleja permisos, no los inventa
* Tipado estricto compartido
* Separación clara por dominio
* Sin lógica duplicada
* Preparado para crecimiento modular

---

## 🧩 Tecnologías Utilizadas

| Tecnología      | Uso                |
| --------------- | ------------------ |
| React 18        | UI                 |
| TypeScript      | Tipado estricto    |
| Vite            | Build / Dev Server |
| React Router v6 | Ruteo              |
| Axios           | HTTP Client        |
| Bootstrap 5     | Base UI            |
| JWT             | Autenticación      |
| ESLint          | Calidad de código  |

---

## 📁 Arquitectura del Proyecto

```
src/
├── api/                # Axios + endpoints
├── auth/               # AuthContext y guards
├── components/         # Navbar y UI común
├── layouts/            # Layout público / protegido
├── pages/              # Vistas por dominio
├── routes/             # Definición de rutas
├── types/              # Tipos compartidos
├── App.tsx
└── main.tsx
```

---

## 🔄 Contrato Frontend ↔ Backend

### Autenticación

* `POST /auth/login`

### Tickets

* `GET /tickets`
* `GET /tickets/:id`
* `POST /tickets`
* `PATCH /tickets/:id`
* `PATCH /tickets/:id/status`
* `DELETE /tickets/:id`

### Usuarios

* `GET /users`
* `POST /users`
* `GET /users/:id`

📌
Todas las reglas de acceso son validadas en backend.

---

## 🌍 Variables de Entorno

### Desarrollo

```env
VITE_API_URL=http://localhost:3000
```

### Producción

```env
VITE_API_URL=https://api.dominio.com
```

---

## 🛠️ Instalación y Ejecución

```bash
npm install
npm run dev
```

---

## 🔒 Estado del Sistema

* ❌ No se agregan nuevas features
* ❌ No se modifican rutas
* ❌ No se modifican contratos
* ❌ No se modifica lógica base

📌 **El sistema está congelado**
Cualquier cambio posterior se considera **producción**.

---

## 🔜 Sprint 4 — Planeado

* Edición de usuario
* Hardening de seguridad
* Deploy productivo
* Testing post-deploy
* Monitoreo
* Documentación de operación

---

## 🏁 Conclusión Técnica

Este frontend está:

* ✅ Funcional
* ✅ Estable
* ✅ Congelado
* ✅ Listo para despliegue controlado
* ✅ Preparado para escalar sin romper estructura

---


## 📄 2️⃣ Documentación de variables — FRONTEND

En el `README.md` del frontend:

### 🌐 Variables de entorno — Frontend (Vite)

| Variable       | Obligatoria | Descripción                                      |
| -------------- | ----------- | ------------------------------------------------ |
| `VITE_API_URL` | ✅           | URL base del backend                             |
| `VITE_APP_ENV` | ❌           | Entorno de la app (`development` / `production`) |

📌 Todas las variables **DEBEN iniciar con `VITE_`**.

---

## 📁 3️⃣ `.env.example` (ambos repos)

### Backend `.env.example`

```env
NODE_ENV=
PORT=
JWT_SECRET=
JWT_EXPIRES=
DATABASE_URL=
CORS_ORIGIN=
```

### Frontend `.env.example`

```env
VITE_API_URL=
VITE_APP_ENV=
```

✔ Esto es **documentación ejecutable**
✔ Esto es **estándar empresarial**

---

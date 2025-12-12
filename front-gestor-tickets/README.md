## 📌 Gestor de Tickets Datra – Frontend (MVP)

Este proyecto es la interfaz web del Sistema de Gestión de Tickets Datra, desarrollado como MVP para demostrar el flujo completo del sistema antes de conectar el backend real.

El frontend está construido con:

React + TypeScript

Vite

Bootstrap 5 / React-Bootstrap

Context API para Auth

Router DOM v6

Formik + Yup para formularios

Mock API integrada para pruebas sin backend

## 🚀 Características principales
### ✔ Autenticación con Context API

Login

Registro

Permisos básicos (mock)

Persistencia de sesión local

###  ✔ Sistema de tickets

Vista de listado

Vista de ticket

Creación de tickets

Mock API para simular retorno del backend

### ✔ Modo MOCK (sin backend)

Permite ejecutar todo el sistema sin conexión al backend real, ideal para demostraciones y validación del diseño UI/UX.

### ✔ UI moderna y responsiva

Construida con Bootstrap 5 siguiendo lineamientos de software empresarial.

## 📁 Estructura del proyecto
src/
 ├── components/       # Componentes reutilizables
 ├── contexts/         # AuthContext y proveedores
 ├── hooks/            # Custom hooks
 ├── layouts/          # Layout principal con Sidebar/Navbar
 ├── mock/             # Mock API (solo en modo VITE_USE_MOCK=true)
 ├── pages/            # Todas las vistas del sistema
 │    ├── Auth/        # Login / Registro
 │    └── Tickets/     # CRUD de Tickets
 ├── router/           # Rutas protegidas y públicas
 ├── services/         # Servicios reales (axios) o mock
 ├── styles/           # Estilos globales
 └── main.tsx          # Punto de entrada

## 🛠 Tecnologías utilizadas
Tecnología	Uso
React 18 + TS	UI del sistema
Vite	Build y dev server
React Router DOM	Navegación
Bootstrap 5	Estilos
React-Bootstrap	Componentes UI
Formik	Formularios
Yup	Validación
Context API	Sesión y autenticación
Axios	(Preparado para backend real)
Mock API	Simulación local tipo backend
## 🧪 Modo Mock

El proyecto incluye una API falsa que reemplaza automáticamente al backend real cuando está activada.

Activarlo:

Crear (o editar) el archivo .env:

VITE_USE_MOCK=true

Desactivarlo (conexión a backend):
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:3000

## ▶️ Cómo ejecutar el proyecto
1. Instalar dependencias
npm install

2. Iniciar el servidor en modo desarrollo
npm run dev


Abrir:

👉 http://localhost:5173/

## 🔐 Credenciales de prueba (Mock Mode)
### 📌 Administrador
Email: admin@datra.test
Password: Pass1234

### 📌 Técnico
Email: tecnico@datra.test
Password: Pass1234

## 🌐 Compilar para producción
npm run build


Archivos finales quedan en:

/dist

## 📦 Generar vista previa del build
npm run preview

## 🔄 Rutas principales
Ruta	Descripción
/login	Inicio de sesión
/register	Registro
/	Dashboard
/tickets	Listado de tickets
/tickets/new	Crear ticket
/tickets/:id	Ver ticket
## 🧰 Conexión al backend (cuando esté listo)

Cuando tu backend NestJS esté disponible solo debes:

Desactivar mock:

VITE_USE_MOCK=false


Configurar URL:

VITE_API_URL=http://localhost:3000


Los servicios reales (axios) se activarán automáticamente.

## 🧱 Buenas prácticas incluidas

✔ Arquitectura modular
✔ Código limpio y tipado
✔ Lint + reglas de seguridad
✔ Separación UI / lógica / contexto
✔ Sistema preparado para roles y permisos
✔ Navegación protegida (AuthGuard)

## 🗄 Compatibilidad con el Backend (NestJS + Prisma)

Este front está alineado con los modelos:

User

name

email

password

role

active

Ticket

code

openedAt

requestedBy

problemDesc

eventLocation

impacto, estado, timestamps, etc.

Todas las vistas del MVP están diseñadas según este schema.

## 👨‍💻 Desarrollado para

MVP del sistema empresarial de gestión de tickets de Datra
Plataforma para el control, seguimiento y documentación de incidencias de clientes.

## 🎯 Objetivo del MVP

Validar diseño UI/UX

Navegar entre todas las pantallas del sistema

Simular flujo real sin backend

Usar usuarios y tickets de prueba

Facilitar presentaciones y demostraciones

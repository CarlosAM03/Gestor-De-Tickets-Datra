
# 🖥️ Gestor de Tickets Datra – Frontend

Este documento describe el plan, requerimientos y buenas prácticas para desarrollar el **frontend** del Gestor de Tickets Datra, completamente integrado con el backend NestJS + Prisma. Está diseñado para garantizar seguridad, escalabilidad y cumplimiento de roles definidos en backend.

---

## 🎯 Objetivo

1. Reemplazar cualquier API simulada (mock) con el backend real.
2. Implementar control de acceso según roles (ADMIN, TECNICO, INGENIERO).
3. Garantizar una arquitectura escalable y sostenible.
4. Preparar el sistema para uso empresarial real.

> **Nota clave:** El frontend **solo tiene login**. La creación de usuarios y permisos es responsabilidad del ADMIN. Esto elimina riesgos de seguridad y mantiene control centralizado.

---

## 👤 Autenticación y Roles

### Login

* Endpoint: `POST /auth/login`
* Guardar: `JWT`, `role`, `userId`
* Manejar sesión activa, logout y token expirado (401)
* **No hay registro público de usuarios**

### Roles (según backend)

| Rol       | Funciones en UI                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| ADMIN     | Ver todos los tickets, aprobar/rechazar solicitudes de eliminación, historial, métricas, gestión de usuarios |
| TECNICO   | Crear, editar, cerrar tickets propios, solicitar eliminación, consultar tickets globales                     |
| INGENIERO | Crear, editar, cerrar tickets, solicitar eliminación de cualquier ticket, acceso a métricas                  |

> * El frontend **solo oculta o muestra acciones según rol**, el backend valida reglas de negocio.
> * Orden de prioridad de desarrollo: ADMIN, INGENIERO, TECNICO

---

## 🔗 Migración de API (Mock → Real)

1. **Congelar mock**: `mockApi.ts` queda obsoleto.
2. **Cliente HTTP real**: `/src/api/http.ts`

   * Configurar baseURL por entorno
   * Interceptor para JWT
   * Manejo global de errores
3. **Endpoints Tickets**
   | Función             | Endpoint                |
   |--------------------|------------------------|
   | Listado             | GET `/tickets`          |
   | Detalle             | GET `/tickets/:id`      |
   | Crear               | POST `/tickets`         |
   | Actualizar          | PATCH `/tickets/:id`    |
   | Cambiar estatus     | PATCH `/tickets/:id/status` |
   | Solicitud eliminación | DELETE `/tickets/:id`   |

* Mantener contratos y tipos alineados con backend.

---

## 🎫 Gestión de Tickets

### Listado

* Filtros: `scope` (`mine` / `all`), estado, impacto, fecha, búsqueda libre
* Paginación básica preparada
* Mostrar tickets según permisos

### Detalle

* Cargar ticket por ID
* Mostrar historial (ADMIN)
* Mostrar estado actual y acciones permitidas

### Creación / Edición

* Formulario con campos validados
* Actualizar solo campos permitidos
* UX clara: loading, success, error

### Eliminación

* Botón **Solicitar eliminación**
* Estado: "Solicitud enviada", "Pendiente de aprobación"
* No eliminar directamente

---

## ⚠️ Manejo de Errores y Seguridad

| Código | Acción Frontend       |
| ------ | --------------------- |
| 401    | Logout automático     |
| 403    | Vista "No autorizado" |
| 404    | Recurso no encontrado |
| 500    | Error controlado      |

* Nunca mostrar errores crudos
* Logging básico solo para debugging

---

## 📦 Estado Global Recomendado

* Context API / Zustand / Redux Toolkit
* Estados clave: usuario autenticado, rol, token, tickets, filtros activos
* Evitar duplicación y props drilling

---

## 🏗️ Dashboard

* Migrar datos mock a reales
* Mostrar tickets recientes
* Preparar espacio para métricas
* ADMIN tendrá widgets exclusivos

---

## ✅ Checklist Frontend – Producción

* Consume backend real (no mocks)
* Respeta roles y reglas de negocio
* Maneja errores correctamente
* Login único (sin registro)
* Arquitectura escalable
* Variables de entorno definidas (`.env`)
* URLs por ambiente (dev / prod)
* Build sin warnings
* Manejo de loading y empty states

---

## 📐 Arquitectura Recomendada

```
/src
  /api       -> Clientes HTTP (axios/fetch)
  /auth      -> Login, guards, context
  /tickets   -> Vistas, hooks, componentes
  /users/components -> Reutilizables
  /pages
  /layouts
  /routes
  /types     -> Tipos alineados al backend
  /utils/config
```

* Separación clara de dominio
* Nada de lógica de negocio pesada en componentes
* Todo acceso a backend pasa por `/api`

---

## 🔄 Plan de Desarrollo Frontend

| Fase | Objetivo                                     | Tiempo estimado |
| ---- | -------------------------------------------- | --------------- |
| 1    | Integrar Login real y sustituir mockApi      | 2-3 dias        |
| 2    | Migrar dashboard y vistas de tickets         | 1–2 dias        |
| 3    | Implementar filtros, paginación y métricas   | 1-2 dias        |
| 4    | Validaciones finales, UX, pruebas integradas | 1-2 dias        |
| 5    | Build de producción y despliegue             | 2 días          |

---

## 📌 Recomendaciones y Buenas Prácticas

* No agregar nuevas features antes de conectar con backend real
* No cambiar contratos de API
* Validar tipos y DTOs con backend
* Usar interceptores HTTP para manejo centralizado de errores
* Mantener código modular y reutilizable
* Documentar componentes críticos
* Preparar estado global mínimo obligatorio desde el inicio

---

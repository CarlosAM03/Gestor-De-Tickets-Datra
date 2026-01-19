
---

# 📦 Módulo **Clientes / Service Contracts**

**Estado:** **✅ CERRADO — 100% FUNCIONAL**
**Disponibilidad:** Listo para producción
**Dependencias:** Ninguna pendiente o bloqueante

---

## 🎯 Propósito del módulo

El módulo **Clientes / Service Contracts** es responsable de administrar la relación entre los **clientes** del sistema y los **contratos de servicio** asociados a cada uno, permitiendo controlar:

* Servicios contratados
* Niveles de prioridad
* SLA (Service Level Agreement)
* Estado operativo de clientes y contratos
* Acceso seguro según rol de usuario

Este módulo constituye una pieza clave para la correcta operación del sistema de gestión de tickets.

---

## 👥 Roles y permisos

| Rol           | Permisos habilitados                     |
| ------------- | ---------------------------------------- |
| **ADMIN**     | Gestión completa de clientes y contratos |
| **INGENIERO** | Consulta de clientes y contratos         |
| **TECNICO**   | Consulta de clientes y contratos         |

El control de acceso está implementado tanto en backend como en frontend.

---

## 🧩 Funcionalidades implementadas

### 🔹 Gestión de Clientes

* ✅ Listado de clientes
* ✅ Visualización de detalle de cliente
* ✅ Creación de cliente (ADMIN)
* ✅ Edición de cliente (ADMIN)
* ✅ Activación y desactivación lógica de clientes (ADMIN)
* ✅ Visualización de contratos asociados al cliente

---

### 🔹 Gestión de Service Contracts

* ✅ Listado de contratos por cliente
* ✅ Visualización detallada de contrato
* ✅ Creación de contratos (ADMIN)
* ✅ Edición de contratos (ADMIN)
* ✅ Activación de contratos (ADMIN)
* ✅ Desactivación de contratos (ADMIN)
* ✅ Manejo de estado `active / inactive`
* ✅ Gestión de prioridad y SLA
* ✅ Validación de cliente activo al crear un contrato

---

## 🔐 Seguridad y control de acceso

El módulo implementa un esquema de seguridad completo:

* Autenticación basada en **JWT**
* Autorización por roles mediante:

  * `JwtAuthGuard`
  * `RolesGuard`
  * Decorador `@Roles()`
* Protección de rutas tanto en:

  * **Backend (NestJS)**
  * **Frontend (React Router)**

No existen rutas públicas ni accesos no autorizados.

---

## 🖥️ Frontend (React + TypeScript)

### 📄 Vistas implementadas y cerradas

* `ClientsList`
* `ClientView`
* `ClientCreate`
* `ClientEdit`
* `ContractView`
* `ContractEdit`

Todas las vistas se encuentran alineadas con la lógica del backend y correctamente integradas al sistema de navegación y permisos.

---

### 📡 Capa de comunicación API

Archivos responsables:

* `clients.api.ts`
* `service-contracts.api.ts`

Características:

* Normalización de respuestas
* Manejo consistente de errores
* Integración directa con los endpoints del backend
* Uso de un wrapper estándar `{ success, data }`

---

## ⚙️ Backend (NestJS + Prisma)

### 📁 Estructura del módulo

```
service-contract/
 ├── dto/
 │   ├── create-service-contract.dto.ts
 │   ├── update-service-contract.dto.ts
 │   └── service-contract.response.dto.ts
 ├── service-contract.controller.ts
 ├── service-contract.service.ts
 └── service-contract.module.ts
```

---

### 🔌 Endpoints implementados

| Método | Endpoint                            | Descripción           | Rol permitido     |
| ------ | ----------------------------------- | --------------------- | ----------------- |
| POST   | `/service-contracts`                | Crear contrato        | ADMIN             |
| GET    | `/service-contracts`                | Listar contratos      | ADMIN / ING / TEC |
| GET    | `/service-contracts/client/:rfc`    | Contratos por cliente | ADMIN / ING / TEC |
| GET    | `/service-contracts/:id`            | Ver contrato          | ADMIN / ING / TEC |
| PATCH  | `/service-contracts/:id`            | Editar contrato       | ADMIN             |
| PATCH  | `/service-contracts/:id/deactivate` | Desactivar contrato   | ADMIN             |
| PATCH  | `/service-contracts/:id/activate`   | Activar contrato      | ADMIN             |

Todos los endpoints fueron validados y probados.

---

## 🧪 Estado de pruebas

* ✅ Pruebas manuales completas
* ✅ Navegación validada
* ✅ Seguridad por rol comprobada
* ✅ Estados activos e inactivos funcionando correctamente
* ✅ Sincronización total Frontend ↔ Backend
* ✅ No existen endpoints pendientes ni funcionalidades incompletas

---

## 🟢 Conclusión

El módulo **Clientes / Service Contracts** se encuentra:

* ✔ Completamente funcional
* ✔ Estable
* ✔ Seguro
* ✔ Escalable
* ✔ Listo para despliegue en producción

No presenta deuda técnica activa ni dependencias pendientes con otros módulos del sistema.

---

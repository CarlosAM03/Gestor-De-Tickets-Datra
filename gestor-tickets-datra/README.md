# 🧭 Estado actual vs Alcance objetivo  
## Gestor de Tickets Datra – Backend

Este documento describe **qué funcionalidades ya existen**, **qué falta implementar** y **el orden recomendado de desarrollo** para llegar a un sistema completo de gestión de trouble tickets, alineado con el frontend (actualmente en modo mock).

---

## ✅ 1. ¿Qué está implementado actualmente?

### 🔐 Autenticación
- Registro de usuarios con contraseña hasheada
- Login con email + contraseña
- Generación de JWT por sesión
- Expiración de token
- Protección de rutas con `JwtAuthGuard`

👉 **Estado:** funcional y correcto para MVP

---

### 👤 Usuarios
- Crear usuario (register)
- Obtener usuarios
- Obtener usuario por ID
- Eliminar usuario (hard delete)
- Roles guardados como string (`tecnico` por defecto)

👉 **Estado:** básico, sin control de permisos

---

### 🎫 Tickets
- Crear ticket
- Código de ticket autogenerado (`TT-000001`)
- Asignación automática del creador (`createdBy`)
- Obtener todos los tickets
- Obtener ticket por ID
- Actualizar ticket
- Eliminar ticket (hard delete)
- Relaciones con usuarios:
  - creador
  - técnico preliminar
  - técnico de cierre

👉 **Estado:** CRUD funcional, sin reglas de negocio

---

## ⚠️ 2. Limitaciones actuales (importante)

Actualmente el sistema:
- ❌ No distingue permisos por rol
- ❌ Permite eliminar tickets directamente
- ❌ No separa “mis tickets” vs “tickets globales”
- ❌ No tiene historial de cambios
- ❌ No soporta filtros avanzados
- ❌ No tiene estados claros de ciclo de vida
- ❌ No tiene control administrativo real

👉 **Esto es normal para un MVP**, pero no es sostenible a mediano plazo si no se estructura ahora.

---

## 🎯 3. Funcionalidades objetivo 

### 👤 Roles de usuario

| Rol | Capacidades |
|----|------------|
| **Administrador** | Control total, métricas, auditoría, aprobación de eliminaciones |
| **Técnico** | Crear y actualizar tickets |
| **Ingeniero** | Crear, actualizar y cerrar tickets |

📌 **Notas clave**
- El **admin NO se crea por endpoint** (usuario fijo del sistema)
- Técnicos e ingenieros **NO eliminan tickets ni usuarios**
- Las eliminaciones son **solicitudes**, no acciones directas

---

### 🎫 Gestión de tickets (core del sistema)

Debe permitir:
- Ver **mis tickets**
- Ver **tickets globales**
- Crear tickets
- Actualizar tickets
- Cerrar tickets
- Buscar y filtrar por:
  - Fecha
  - Nivel de urgencia
  - Cliente / razón social
  - RFC
  - Estatus
- Ver historial de cambios por ticket

---

### 📊 Resumen y consultas
- Resumen de actividad por usuario
- Resumen general del sistema
- Filtros por fecha, estatus y cliente
- Vista detallada de cada actualización

📌 Métricas y auditoría **no son prioridad inmediata**, pero la estructura debe permitirlas.

---

## 🧱 4. ¿Qué falta implementar realmente? (por capas)

### 🟢 PRIORIDAD ALTA – Core del sistema

1. **Consulta de tickets**
   - Paginacion de consultas

2. **Soft delete**
   - `deletedAt`
   - `deletedBy`
   - `deleteRequested = true`

---

### 🟡 PRIORIDAD MEDIA – Control y roles

3. **Roles y permisos reales**
   - Guards por rol
   - Decoradores (`@Roles()`)

4. **Flujo de aprobación**
   - Solicitud de eliminación
   - Aprobación por admin
   - Eliminación real

5. **Restricciones**
   - Técnicos / ingenieros NO eliminan
   - Admin controla acciones críticas

---

### 🔵 PRIORIDAD BAJA – Métricas y auditoría

8. **Historial de cambios**
   - Tabla `TicketHistory`
   - Quién cambió qué y cuándo

9. **Resumen y métricas**
   - Tickets por rango de fechas
   - Tickets por usuario
   - Tickets por estatus

---

## 🧠 5. ¿Qué conviene hacer primero?

### ❌ NO empezar por métricas
Eso depende de tener bien modelados:
- Estados
- Roles
- Historial

---

### ✅ ORDEN RECOMENDADO

1. **Estados de ticket + filtros** LISTO
2. **Separar tickets propios vs globales** LISTO
3. **Soft delete y solicitudes**
4. **Roles y guards**
5. **Historial de cambios**
6. **Métricas y reportes**

📌 Agregar **roles ahora es rápido**, pero **no sirve** si los tickets aún no tienen reglas claras.
---
## 🧩 7. resultados obtenidos

✔️ Crear tickets → Implementado y funcional (POST /tickets).

✔️ Listar global / propios → Implementado (GET /tickets?scope=mine|all).

✔️ Filtros (fecha, impacto, estatus, búsqueda) → Ahora completamente funcional. El estatus ya valida correctamente los valores permitidos, los otros filtros (from, to, impact, search) están listos.

✔️ Ver detalle → Implementado (GET /tickets/:id).

✔️ Actualizar info → Implementado (PATCH /tickets/:id) para campos editables.

✔️ Actualizar estatus de forma controlada → Implementado (PATCH /tickets/:id/status) con tipado seguro.

✔️ Eliminar → Implementado (DELETE /tickets/:id). La restricción por rol aún no se aplica, pero el endpoint funciona.
---

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

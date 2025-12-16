# 🧭 Estado actual vs Alcance objetivo

## Gestor de Tickets Datra – Backend

Este documento describe **el estado real del backend**, qué componentes están **listos para conectar con el frontend**, qué partes están **cerradas a nivel de arquitectura**, y qué decisiones técnicas siguen pendientes.

El objetivo es que cualquier desarrollador (backend, frontend o reviewer) pueda responder rápidamente:

> **¿Este backend ya puede conectarse a un frontend real?**

---

# ✅ CHECKLIST PRE-FRONTEND (BACKEND READY)

---

## 🔐 1. Autenticación y Seguridad (OBLIGATORIO)

| Item                   | Estado | Notas                 |
| ---------------------- | ------ | --------------------- |
| Registro de usuarios   | ✅      | Contraseñas hasheadas |
| Login con JWT          | ✅      | Email + password      |
| Expiración de token    | ✅      | Configurada           |
| `JwtAuthGuard`         | ✅      | Protege endpoints     |
| Usuario en request     | ✅      | `RequestWithUser`     |
| Manejo de errores auth | ✅      |                       |

🟢 **LISTO PARA FRONTEND**

---

## 👤 2. Roles y Permisos (OBLIGATORIO)

### Roles definidos

| Rol           | Capacidades reales                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| **ADMIN**     | Control total, aprobación/rechazo de eliminaciones, auditoría, historial                             |
| **TECNICO**   | Consultar, crear, editar, cerrar y solicitar eliminación **de sus propios tickets**                  |
| **INGENIERO** | Consultar, crear, editar, cerrar y solicitar eliminación **de todos los tickets**, acceso a métricas |

### Implementación técnica

| Item                          | Estado |
| ----------------------------- | ------ |
| Enum `UserRole`               | ✅      |
| Decorador `@Roles()`          | ✅      |
| `RolesGuard`                  | ✅      |
| Guards aplicados por endpoint | ✅      |
| Reglas finas en service       | ✅      |

📌 **Diseño intencional**: los guards validan *quién puede entrar*; el **service valida reglas de negocio**.

🟢 **LISTO PARA PRODUCCIÓN**

---

## 🎫 3. Tickets – Core del Sistema

### Funcionalidades implementadas

| Funcionalidad                     | Estado            |
| --------------------------------- | ----------------- |
| Crear ticket                      | ✅                 |
| Código autogenerado (`TT-000001`) | ✅                 |
| Asignación automática de creador  | ✅                 |
| Ver tickets propios               | ✅ (`scope=mine`)  |
| Ver tickets globales              | ✅ (`scope=all`)   |
| Ver detalle                       | ✅                 |
| Editar información                | ✅                 |
| Actualizar estatus                | ✅ (tipado seguro) |
| Cerrar ticket                     | ✅                 |

🟢 **LISTO PARA FRONTEND**

---

## 🔍 4. Filtros y Búsqueda

| Filtro                | Estado                |
| --------------------- | --------------------- |
| Fecha (`from` / `to`) | ✅                     |
| Impacto               | ✅                     |
| Estatus               | ✅ (valores validados) |
| Búsqueda texto        | ✅                     |

🟢 **LISTO PARA FRONTEND**

---

## 🧹 5. Eliminación Controlada (Soft Delete)

### Flujo completo

1. Usuario solicita eliminación
2. Ticket queda con `deleteRequested = true`
3. ADMIN aprueba o rechaza
4. Si aprueba:

   * `deletedAt`
   * `deletedBy`
   * `status = CANCELLED`
5. Se registra historial

| Item                       | Estado |
| -------------------------- | ------ |
| Soft delete (`deletedAt`)  | ✅      |
| Solicitud de eliminación   | ✅      |
| Aprobación ADMIN           | ✅      |
| Rechazo ADMIN              | ✅      |
| Ocultar tickets eliminados | ✅      |

🟢 **LISTO PARA FRONTEND**

---

## 📜 6. Auditoría / Historial

| Item                       | Estado |
| -------------------------- | ------ |
| Modelo `TicketHistory`     | ✅      |
| Registro de approve/reject | ✅      |
| Endpoint historial         | ✅      |
| Quién / cuándo             | ✅      |

🟢 **LISTO PARA FRONTEND (ADMIN)**

---

## 🧠 7. Reglas de Negocio Críticas

| Regla                            | Estado      |
| -------------------------------- | ----------- |
| Técnico elimina solo sus tickets | ✅ (service) |
| Ingeniero elimina cualquiera     | ✅ (service) |
| Admin control total              | ✅           |
| No hard delete desde API         | ✅           |
| Estados válidos                  | ✅           |

🟢 **REGLAS IMPLEMENTADAS DONDE CORRESPONDE**

---

## 📡 8. Contrato Backend → Frontend

| Item                    | Estado | Decisión  |
| ----------------------- | ------ | --------- |
| Endpoints estables      | ✅      |           |
| DTOs claros             | ✅      |           |
| Tipos consistentes      | 🟡     | Mejorable |
| Paginación              | ❌      | Pendiente |
| Respuestas normalizadas | 🟡     | Pendiente |

---

## 🚦 Decisión Técnica Final

### ✅ El frontend **YA PUEDE CONECTARSE** si:

* Se inicia con listado simple
* Detalle de ticket
* Crear / editar / cerrar
* Flujos reales de eliminación

### ⏸️ Conviene pausar solo si:

* Se requieren dashboards complejos
* Se necesitan grandes volúmenes de datos desde día 1

👉 **Recomendación:** conectar frontend ahora y evolucionar en paralelo.

---

## 🔜 Siguientes pasos sugeridos

1. Paginación (`page`, `limit`, `total`)
2. Normalizar responses (`{ data, meta }`)
3. Métricas para INGENIERO
4. Swagger / OpenAPI
5. Optimización de queries

---

## Project setup

```bash
npm install
```

## Run

```bash
npm run start:dev
```

---

## License

MIT

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

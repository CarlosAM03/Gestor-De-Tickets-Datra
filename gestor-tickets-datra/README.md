
---

# 🎫 Gestor de Tickets Datra — Backend (NestJS)

Backend oficial del sistema **Gestor de Tickets Datra**, desarrollado con **NestJS + Prisma**, orientado a un entorno empresarial, con **reglas de negocio centralizadas**, **control de acceso por roles** y **contrato estable para frontend productivo**.

Este backend es la **fuente única de verdad** del sistema.

---

## 🚀 Objetivo del Backend

Proveer una API robusta y segura que permita:

* Autenticación real con JWT
* Control estricto de acceso por roles
* Gestión completa del ciclo de vida de tickets
* Eliminación controlada (soft delete)
* Auditoría y trazabilidad
* Contratos estables para frontend
* Escalabilidad futura sin refactor crítico

---

## ✅ Estado Actual del Sistema (Cierre Sprint 3)

El backend se encuentra en estado:

> **🟢 FUNCIONAL · 🟢 ESTABLE · 🟢 CONGELADO**

Listo para:

* Integración frontend real
* Demo funcional
* Producción controlada

---

## 🔐 1. Autenticación y Seguridad

| Funcionalidad                | Estado |
| ---------------------------- | ------ |
| Registro de usuarios         | ✅      |
| Login con JWT                | ✅      |
| Expiración de token          | ✅      |
| `JwtAuthGuard`               | ✅      |
| Usuario inyectado en request | ✅      |
| Logout forzado por 401       | ✅      |

📌 **El backend controla completamente la sesión**
📌 El frontend **no replica lógica crítica**

---

## 👤 2. Roles y Permisos

### Roles definidos

| Rol           | Capacidades                                           |
| ------------- | ----------------------------------------------------- |
| **ADMIN**     | Control total, auditoría, aprobación de eliminaciones |
| **INGENIERO** | Gestión global de tickets, métricas                   |
| **TECNICO**   | Gestión de tickets propios                            |

### Implementación técnica

| Componente                  | Estado |
| --------------------------- | ------ |
| Enum `UserRole`             | ✅      |
| Decorador `@Roles()`        | ✅      |
| `RolesGuard`                | ✅      |
| Validación fina en Services | ✅      |

📌 **Guards = acceso**
📌 **Services = reglas de negocio**

---

## 🎫 3. Tickets — Core del Sistema

### Funcionalidades implementadas

| Funcionalidad                      | Estado |
| ---------------------------------- | ------ |
| Crear ticket                       | ✅      |
| Código autogenerado (`TT-000001`)  | ✅      |
| Asignación automática de creador   | ✅      |
| Ver tickets propios (`scope=mine`) | ✅      |
| Ver tickets globales (`scope=all`) | ✅      |
| Ver detalle                        | ✅      |
| Editar ticket                      | ✅      |
| Cambiar estado                     | ✅      |
| Cerrar ticket                      | ✅      |

🟢 **Core completo y listo para producción**

---

## 🔍 4. Filtros y Búsqueda

| Filtro                | Estado |
| --------------------- | ------ |
| Fecha (`from` / `to`) | ✅      |
| Impacto               | ✅      |
| Estado                | ✅      |
| Búsqueda textual      | ✅      |

---

## 🧹 5. Eliminación Controlada (Soft Delete)

### Flujo oficial

1. Usuario solicita eliminación
2. `deleteRequested = true`
3. ADMIN aprueba o rechaza
4. Si aprueba:

   * `deletedAt`
   * `deletedBy`
   * `status = CANCELLED`
5. Se registra historial

| Elemento                | Estado |
| ----------------------- | ------ |
| Soft delete             | ✅      |
| Solicitud               | ✅      |
| Aprobación ADMIN        | ✅      |
| Rechazo ADMIN           | ✅      |
| Ocultamiento automático | ✅      |

📌 **Nunca se elimina físicamente un ticket desde la API**

---

## 📜 6. Auditoría / Historial

| Funcionalidad                 | Estado |
| ----------------------------- | ------ |
| Modelo `TicketHistory`        | ✅      |
| Registro de acciones críticas | ✅      |
| Endpoint de historial         | ✅      |
| Auditoría completa            | ✅      |

Disponible para **ADMIN**.

---

## 🧠 7. Reglas de Negocio Críticas

| Regla                            | Implementación |
| -------------------------------- | -------------- |
| Técnico elimina solo sus tickets | Service        |
| Ingeniero elimina cualquiera     | Service        |
| Admin control total              | Global         |
| No hard delete                   | Global         |
| Estados válidos                  | Enum + DTO     |

🟢 **Reglas aplicadas donde corresponde**

---

## 👥 8. Clientes (Modelo Mínimo Definitivo)

### Decisión técnica clave (Sprint 3)

Se incorporó un **modelo Cliente mínimo persistente**, sin CRUD administrativo.

### Modelo `Client`

```prisma
model Client {
  /// RFC es el identificador único del cliente
  rfc String @id
  
  companyName  String
  businessName String?
  location     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // Relaciones
  tickets Ticket[]
}
```

### Relación con Ticket (NO destructiva)

```prisma
clientRfc String?
client    Client? @relation(fields: [clientRfc], references: [rfc])
```

✔️ No rompe tickets existentes
✔️ RFC como identificador único
✔️ Preparado para crecimiento futuro

---

## 🔄 9. Flujo Cliente al Crear Ticket

* Si el RFC existe → reutiliza cliente
* Si no existe → lo crea automáticamente
* El frontend **no decide**

DTO extendido (compatible):

```ts
client?: {
  rfc: string;
  companyName: string;
  businessName?: string;
  location?: string;
};
```

---

## 📡 10. Contrato Backend ↔ Frontend

### Endpoints principales

#### Auth

* `POST /auth/login`

#### Tickets

* `GET /tickets?scope=mine`
* `GET /tickets?scope=all`
* `GET /tickets/:id`
* `POST /tickets`
* `PATCH /tickets/:id`
* `PATCH /tickets/:id/status`
* `DELETE /tickets/:id`

#### Clientes

* `GET /clients/:rfc`

📌 Endpoints **congelados** al cierre de Sprint 3

---

## 🌍 Variables de Entorno

```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=8h
PORT=3000
```

---

## 🛠️ Instalación y Ejecución

```bash
npm install
npm run start:dev
```

Producción:

```bash
npm run build
npm run start:prod
```

---

## 🔒 Estado de Congelamiento (Sprint 3)

✔️ Endpoints congelados
✔️ Contratos congelados
✔️ Modelo de datos definido
❌ Edición de usuario → **Sprint Futuro**

---

## 📌 Decisión Técnica Final

El backend se declara:

* ✅ Funcional
* ✅ Estable
* ✅ Congelado
* ✅ Listo para producción controlada

---

## 🔜 Sprint 4 (Producción)

* Deploy real
* Variables seguras
* Testing post-deploy
* Monitoreo
* Documentación final
* Integración futura con sistema de monitoreo

---
## 📄 1️⃣ Documentación de variables — BACKEND

Agrega esta sección en tu `README.md` del backend (o sección “Environment Variables”).

### 🔐 Variables de entorno — Backend

| Variable       | Obligatoria | Descripción                                       |
| -------------- | ----------- | ------------------------------------------------- |
| `NODE_ENV`     | ✅           | Define el entorno (`development` / `production`)  |
| `PORT`         | ❌           | Puerto de escucha del servidor (default 3000)     |
| `JWT_SECRET`   | ✅           | Clave secreta para firmar JWT (larga y aleatoria) |
| `JWT_EXPIRES`  | ✅           | Tiempo de expiración del token (ej. `7h`)         |
| `DATABASE_URL` | ✅           | Cadena de conexión PostgreSQL                     |
| `CORS_ORIGIN`  | ✅           | Dominio permitido para CORS                       |

📌 **Notas profesionales**

* Nunca subir `.env` reales
* `JWT_SECRET` debe rotarse en producción real
* `DATABASE_URL` jamás debe ser localhost en producción

---

## 🏁 Conclusión

Este backend **ya no es un prototipo**.

Es un **sistema empresarial real**, diseñado para:

* crecer
* integrarse
* auditarse
* mantenerse

Sprint 3 queda **formalmente cerrado**.
Sprint 4 inicia como **ingeniería de producción**.

---

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

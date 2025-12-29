
* ✔️ Mantener **compatibilidad total**
* ✔️ No romper contratos existentes
* ✔️ Dejar el backend **definitivo para producción**
* ✔️ Permitir **autocompletado de cliente** desde ya
* ✔️ No abrir administración de clientes (todavía)

---

# 🧩 Contexto y decisión correcta

👉 **Agregar Cliente ahora es la decisión correcta**
Si esto se postergara:

* Tendrías que rehacer DTOs
* Migrar datos en producción
* Cambiar UX crítica después
* Romper tickets históricos

📌 **Conclusión**:
Este ajuste es un **FIX estructural previo al cierre del core**, no una feature extra.

---

# 🎯 Objetivo del FIX (alcance cerrado)

> Incorporar **Cliente mínimo persistente**, creado automáticamente al generar un ticket, con:
>
> * RFC como ID único
> * Autocompletado al crear tickets nuevos
> * Sin administración dedicada
> * Sin afectar tickets existentes

---

# 🏗️ Diseño Propuesto (BACKEND)

## 1️⃣ Nuevo modelo `Client` (Prisma)

👉 **Separado, simple y definitivo**

```prisma
model Client {
  rfc          String  @id
  companyName  String
  businessName String?
  location     String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relaciones
  tickets Ticket[]
}
```

---

## 2️⃣ Relación Ticket → Client (NO ROMPE)

Modificar `Ticket` **de forma no destructiva**:

```prisma
model Ticket {
  // ...

  clientRfc String?
  client    Client? @relation(fields: [clientRfc], references: [rfc])

  // ...
}
```

✔️ Tickets existentes siguen funcionando
✔️ Cliente es opcional
✔️ No migración destructiva

---

## 3️⃣ Migración segura

```bash
npx prisma migrate dev --name add_client_entity
```

📌 **Esto es 100% seguro en este punto del proyecto**

---

# 🔄 Flujo Backend (Lógica correcta)

## 4️⃣ CreateTicket — lógica atómica

👉 **Regla clave**:

> *Si el RFC no existe → crear cliente*
> *Si existe → reutilizar*

### En `TicketService.create`

```ts
// 1. Buscar cliente por RFC
let client = null;

if (data.client?.rfc) {
  client = await this.prisma.client.upsert({
    where: { rfc: data.client.rfc },
    update: {
      companyName: data.client.companyName,
      businessName: data.client.businessName,
      location: data.client.location,
    },
    create: {
      rfc: data.client.rfc,
      companyName: data.client.companyName,
      businessName: data.client.businessName,
      location: data.client.location,
    },
  });
}

// 2. Crear ticket asociado
await this.prisma.ticket.create({
  data: {
    // ...
    clientRfc: client?.rfc ?? null,
  },
});
```

✔️ Sin endpoint extra
✔️ Sin lógica en frontend
✔️ Ideal para producción

---

# 📄 DTOs Backend (versión definitiva)

## CreateTicketDto (EXTENDIDO, no roto)

```ts
export class CreateTicketDto {
  // EXISTENTE
  requestedBy?: string;
  contact?: string;
  serviceAffected?: string;
  problemDesc?: string;
  impactLevel?: ImpactLevel;

  // NUEVO (agrupado)
  client?: {
    rfc: string;
    companyName: string;
    businessName?: string;
    location?: string;
  };
}
```

📌 **No rompe frontend actual**
📌 El frontend solo envía si existe

---

# 🔍 Endpoint de autocompletado (mínimo)

## 5️⃣ Buscar cliente por RFC

```http
GET /clients/:rfc
```

Response:

```ts
{
  rfc: string
  companyName: string
  businessName?: string
  location?: string
}
```

👉 **Un solo endpoint**, sin CRUD.

---

# 🖥️ FRONTEND — Impacto controlado

## 6️⃣ Cambios en TicketForm (Sprint 3)

### Nuevos campos (grupo Cliente)

* RFC (input principal)
* Empresa (autocomplete)
* Razón social (opcional)
* Ubicación (opcional)

### Flujo UX:

1. Usuario escribe RFC
2. `onBlur` → `GET /clients/:rfc`
3. Si existe:

   * Autocompleta campos
4. Si no:

   * Permite llenarlos manualmente
5. Submit → backend decide

📌 **El frontend NO decide si crear cliente**

---

✔️ Compatible
✔️ Tipado fuerte
✔️ Sin romper forms existentes

---

# 🔁 Impacto en Sprint 3 (ajuste mínimo)

## 🟡 Sprint 3 — Ajuste de alcance

### Se agrega **ANTES de continuar con core**

**Nuevo orden recomendado (HOY):**

1. 🧱 **Implementar Client (Backend)**
2. 🧾 **Extender CreateTicketDto**
3. 🔄 **Migración Prisma**
4. 🔍 **GET client por RFC**
5. 🧩 **Ajustar TicketForm**
6. ✅ **Retomar Sprint 3 core normal**

⏱️ **Tiempo estimado real**: 1 día concentrado

---

# 🧠 Estado del Proyecto tras este FIX

| Área            | Estado esperado        |
| --------------- | ---------------------- |
| Modelo de datos | ✅ Definitivo           |
| Tickets         | ✅ Producción-ready     |
| Clientes        | 🟡 Básico (suficiente) |
| UX              | ✅ Fluido               |
| Riesgo técnico  | ❌ Nulo                 |
| Escalabilidad   | ✅ Alta                 |

---

# 📆 Timeline realista (hoy → 5 enero)

| Fecha         | Objetivo                  |
| ------------- | ------------------------- |
| **22–23 dic** | Cliente + Ticket FIX      |
| 24–27 dic     | Consolidar Sprint 3       |
| 28–30 dic     | QA / pruebas reales       |
| 2–4 ene       | Ajustes finales           |
| **5 ene**     | Presentación / aprobación |

---

# 🏁 Conclusión clara

👉 Este **FIX es correcto, necesario y a tiempo**.
👉 No rompe Sprint 3, **lo fortalece**.
👉 Deja el sistema **realmente listo para operación**.



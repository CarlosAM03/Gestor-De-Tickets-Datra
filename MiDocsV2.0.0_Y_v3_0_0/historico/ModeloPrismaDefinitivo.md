# 🧱 Prisma Schema Definitivo — Gestor de Tickets DATRA (v2.0.0)

**Estado:** DEFINITIVO / CONGELADO
**Fuente de verdad:** Modelo de Dominio + Estados + Contratos de Backend

Este esquema Prisma es la **traducción directa y fiel** de:

* Modelo de Datos Definitivo
* Estados y Transiciones congelados
* Contratos de backend

📌 No contiene lógica de negocio (eso vive en servicios)
📌 Sí contiene **estructura, restricciones y semántica de dominio**

---

## ENUMS

```prisma
enum TicketStatus {
  OPEN
  RESOLVED
  CLOSED
  CANCELLED
}

enum ImpactLevel {
  CRITICAL
  HIGH
  MEDIUM
  LOW
  INFO
}

enum UserRole {
  ADMIN
  TECNICO
  INGENIERO
}

enum TicketEventType {
  CREATED
  STATUS_CHANGED
  CLOSED
  CANCELLED
  UPDATED
  COMMENT_ADDED
  IMPORTED_FROM_LIBRENMS
}
```

---

## USER

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  role      UserRole @default(TECNICO)
  active    Boolean  @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  ticketsCreated   Ticket[] @relation("TicketCreatedBy")
  ticketsClosed    Ticket[] @relation("TicketClosedBy")
  ticketsCancelled Ticket[] @relation("TicketCancelledBy")

  history TicketHistory[]
}
```

📌 Usuarios **no se eliminan** (solo `active = false`)

---

## CLIENT

```prisma
model Client {
  rfc          String @id
  clientNumber String @unique

  companyName  String
  businessName String?
  location     String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  serviceContracts ServiceContract[]
  tickets          Ticket[]
}
```

📌 RFC es inmutable
📌 Clientes no se eliminan si tienen tickets

---

## SERVICE CONTRACT

```prisma
model ServiceContract {
  id            Int     @id @default(autoincrement())
  name          String
  priorityLevel Int
  slaHours      Int
  active        Boolean @default(true)

  clientRfc String
  client    Client @relation(fields: [clientRfc], references: [rfc])

  tickets Ticket[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

📌 La prioridad del contrato **no reemplaza** el impacto del ticket

---

## TICKET

```prisma
model Ticket {
  id   Int    @id @default(autoincrement())
  code String @unique

  status TicketStatus @default(OPEN)

  createdAt DateTime @default(now())
  openedAt  DateTime @default(now())
  closedAt  DateTime?
  cancelledAt DateTime?

  clientRfc String
  client    Client @relation(fields: [clientRfc], references: [rfc])

  serviceContractId Int
  serviceContract   ServiceContract @relation(fields: [serviceContractId], references: [id])

  impactLevel ImpactLevel

  problemDescription String
  eventLocation      String?

  createdById Int
  createdBy   User @relation("TicketCreatedBy", fields: [createdById], references: [id])

  closedById Int?
  closedBy   User? @relation("TicketClosedBy", fields: [closedById], references: [id])

  cancelledById Int?
  cancelledBy   User? @relation("TicketCancelledBy", fields: [cancelledById], references: [id])

  history TicketHistory[]

  @@index([status])
  @@index([clientRfc])
  @@index([serviceContractId])
  @@index([createdAt])
}
```

📌 No existe soft delete
📌 Estados terminales controlados por backend

---

## TICKET HISTORY (CORE)

```prisma
model TicketHistory {
  id Int @id @default(autoincrement())

  ticketId Int
  ticket   Ticket @relation(fields: [ticketId], references: [id])

  eventType TicketEventType

  fromStatus TicketStatus?
  toStatus   TicketStatus?

  performedById Int?
  performedBy   User? @relation(fields: [performedById], references: [id])

  metadata Json?

  createdAt DateTime @default(now())

  @@index([ticketId])
  @@index([eventType])
  @@index([createdAt])
}
```

📌 Append-only
📌 Fuente única de auditoría y KPIs

---

## 🔒 Notas finales de congelación

* Este esquema **no admite**:

  * Reapertura de tickets
  * Estados intermedios
  * Soft delete
  * Cambios arbitrarios de estado

* Toda lógica de transición vive en servicios de dominio

* Prisma **refleja**, no decide

---


# 🛠️ Scripts de Migración — Sprint 3 → v2.0.0

**Gestor de Tickets DATRA**
**Enfoque:** Técnica controlada (Prisma + SQL explícito)
**Objetivo:** Ejecutar la migración sin pérdida de datos ni estados inválidos

📌 Este documento describe **qué migraciones crear**, **en qué orden** y **qué scripts de datos ejecutar**.
📌 Está pensado para **ejecución manual y consciente**, no automática.

---

## 0️⃣ Reglas previas (obligatorias)

Antes de iniciar:

* Backup completo de la base de datos
* Backend detenido o en modo mantenimiento
* Rama dedicada: `migration/v2`

📌 No ejecutar en caliente.

---

## 1️⃣ Migración 01 — Estructura base (sin borrar nada)

### Objetivo

Introducir nuevas entidades y campos **sin afectar datos existentes**.

### Cambios Prisma

* Crear modelo `ServiceContract`
* Agregar a `Client`:

  * `clientNumber`
* Agregar a `Ticket`:

  * `serviceContractId`
  * `cancelledAt`
  * `cancelledById`
* Crear enum `TicketEventType`

### Comando

```bash
npx prisma migrate dev --name add_service_contract_and_cancel_fields
```

📌 No eliminar nada aún.

---

## 2️⃣ Script de datos 01 — ClientNumber

### Objetivo

Asignar `clientNumber` a clientes existentes.

### Script SQL

```sql
UPDATE "Client"
SET "clientNumber" = CONCAT('C-', LPAD(ROW_NUMBER() OVER (ORDER BY "createdAt")::text, 5, '0'))
WHERE "clientNumber" IS NULL;
```

📌 Validar unicidad tras ejecutar.

---

## 3️⃣ Script de datos 02 — ServiceContract por cliente

### Objetivo

Crear un contrato base por cliente para enlazar tickets legacy.

### Script SQL

```sql
INSERT INTO "ServiceContract" ("name", "priorityLevel", "slaHours", "active", "clientRfc", "createdAt")
SELECT
  'Contrato Legacy',
  3,
  72,
  true,
  c."rfc",
  NOW()
FROM "Client" c
WHERE NOT EXISTS (
  SELECT 1 FROM "ServiceContract" sc WHERE sc."clientRfc" = c."rfc"
);
```

📌 Este contrato es puente, no definitivo.

---

## 4️⃣ Script de datos 03 — Enlazar tickets a ServiceContract

### Objetivo

Asignar `serviceContractId` a todos los tickets.

### Script SQL

```sql
UPDATE "Ticket" t
SET "serviceContractId" = sc.id
FROM "ServiceContract" sc
WHERE sc."clientRfc" = t."clientRfc"
AND t."serviceContractId" IS NULL;
```

📌 Ningún ticket debe quedar sin contrato.

---

## 5️⃣ Script de datos 04 — Estados legacy → OPEN

### Objetivo

Normalizar estados legacy sin perder semántica.

### Script SQL

```sql
UPDATE "Ticket"
SET "status" = 'OPEN'
WHERE "status" IN ('IN_PROGRESS', 'ON_HOLD');
```

📌 Se conserva operatividad.

---

## 6️⃣ Script de datos 05 — Soft delete → CANCELLED

### Objetivo

Transformar soft delete en cancelación real.

### Script SQL

```sql
UPDATE "Ticket"
SET
  "status" = 'CANCELLED',
  "cancelledAt" = "deletedAt",
  "cancelledById" = "deletedById"
WHERE "deleteRequested" = true;
```

📌 Esto preserva intención histórica.

---

## 7️⃣ Script de datos 06 — Historial

### Objetivo

Adaptar historial legacy a eventos definitivos.

### Pasos

* Mapear `action` → `eventType`
* Poblar `fromStatus` / `toStatus` cuando aplique

### Ejemplo SQL

```sql
UPDATE "TicketHistory"
SET "eventType" = 'CANCELLED'
WHERE "action" ILIKE '%delete%';
```

📌 Ajustar según datos reales.

---

## 8️⃣ Migración 02 — Limpieza estructural

### Objetivo

Eliminar deuda técnica una vez migrados los datos.

### Cambios Prisma

* Eliminar de enum `TicketStatus`:

  * `IN_PROGRESS`
  * `ON_HOLD`

* Eliminar de `Ticket`:

  * `deleteRequested`
  * `deletedAt`
  * `deletedById`

### Comando

```bash
npx prisma migrate dev --name remove_legacy_states_and_soft_delete
```

📌 Ejecutar **solo** si no quedan referencias legacy.

---

## 9️⃣ Validaciones finales

Ejecutar:

```sql
SELECT COUNT(*) FROM "Ticket" WHERE "status" IN ('IN_PROGRESS', 'ON_HOLD');
SELECT COUNT(*) FROM "Ticket" WHERE "serviceContractId" IS NULL;
```

📌 Ambos deben devolver **0**.

---

## 🔒 Cierre de migración

* Ejecutar backend v2.0.0
* Validar creación / resolución / cancelación
* Habilitar frontend

📌 No hay rollback parcial.

---

> “Migrar es cirugía. Lento, limpio y sin improvisar.”

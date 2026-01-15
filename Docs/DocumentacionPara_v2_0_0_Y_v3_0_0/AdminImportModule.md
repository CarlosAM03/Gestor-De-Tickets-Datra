
---

# 1️⃣ Diseño **REAL** del CSV

( columnas exactas + validaciones **derivadas directamente del schema** )

Este CSV **NO inventa campos**, **NO abstrae enums**, **NO usa nombres libres**.
Todo mapea **1:1** contra `Client` y `ServiceContract`.

---

## 📄 CSV oficial: `clients_service_contracts.csv`

### 🔹 Regla estructural

👉 **1 fila = 1 ServiceContract**
👉 Un mismo RFC puede aparecer múltiples veces

---

## 🧱 Columnas EXACTAS

```csv
clientRfc,clientNumber,companyName,businessName,location,clientActive,serviceName,priorityLevel,slaHours,serviceActive
```

---

## 🧩 Mapeo exacto a Prisma

### CLIENT

| CSV          | Prisma              | Regla                 |
| ------------ | ------------------- | --------------------- |
| clientRfc    | Client.rfc          | **PK**, requerido     |
| clientNumber | Client.clientNumber | **UNIQUE**, requerido |
| companyName  | Client.companyName  | opcional              |
| businessName | Client.businessName | opcional              |
| location     | Client.location     | opcional              |
| clientActive | Client.active       | boolean, default true |

---

### SERVICE CONTRACT

| CSV           | Prisma                        | Regla                        |
| ------------- | ----------------------------- | ---------------------------- |
| serviceName   | ServiceContract.name          | **enum ServiceContractName** |
| priorityLevel | ServiceContract.priorityLevel | int ≥ 1                      |
| slaHours      | ServiceContract.slaHours      | int > 0                      |
| serviceActive | ServiceContract.active        | boolean                      |

---

## 🔐 Validaciones **OBLIGATORIAS**

### RFC

* string
* no vacío
* trim
* case-insensitive
* PK → `Client`

---

### clientNumber

* string
* único global
* **NO se recalcula**
* si existe y RFC distinto → **ERROR FATAL**

---

### serviceName

Debe coincidir **exactamente** con el enum:

```ts
ServiceContractName
```

Ejemplos válidos:

```text
INTERNET_DEDICADO_1_GB
INTERNET_COMPARTIDO_500_MB
ENLACE_PUNTO_A_PUNTO
```

❌ `"Internet 1GB"` → inválido
❌ `"DEDICADO_1GB"` → inválido

---

### priorityLevel

* integer
* mínimo `1`
* menor = más prioritario
* no se normaliza

---

### slaHours

* integer
* > 0
* usado por SLA real

---

### serviceActive / clientActive

Valores permitidos:

```text
true | false | 1 | 0
```

---

## 🧪 Ejemplo REAL válido

```csv
clientRfc,clientNumber,companyName,businessName,location,clientActive,serviceName,priorityLevel,slaHours,serviceActive
ABC010203AA1,CL-000123,Empresa Datra SA,Datra,CDMX,true,INTERNET_DEDICADO_1_GB,1,4,true
ABC010203AA1,CL-000123,Empresa Datra SA,Datra,CDMX,true,ENLACE_PUNTO_A_PUNTO,2,8,true
XYZ990011BB2,CL-000124,Cliente Norte,Cliente Norte,MTY,true,INTERNET_COMPARTIDO_500_MB,3,24,true
```

---

## 🔁 Comportamiento backend **REAL**

* Cliente:

  * `rfc` existe → update parcial
  * `rfc` no existe → create
* ServiceContract:

  * `(clientRfc + name)` existe → update
  * no existe → create
* Nunca se borra
* Solo se **activa / desactiva**

---

# 2️⃣ Diseño REAL del `AdminImportModule`

No abstracto, no teórico.
Esto es **lo mínimo correcto** para producción.

---

## 📁 Estructura FINAL

```text
admin-import/
├── admin-import.module.ts
├── admin-import.controller.ts
├── admin-import.service.ts
├── csv/
│   ├── client-service.parser.ts
│   ├── client-service.validator.ts
│   └── client-service.types.ts
```

---

## 🎯 Responsabilidades EXACTAS

### admin-import.controller.ts

✔ Endpoint protegido `ADMIN`
✔ Recibe archivo CSV
✔ Devuelve resumen de importación

```http
POST /admin/import/clients
```

---

### admin-import.service.ts

✔ Orquesta el flujo
✔ Ejecuta transacciones Prisma
✔ NO parsea CSV directamente

Flujo:

1. Parse CSV
2. Validar filas
3. Agrupar por RFC
4. Ejecutar upsert
5. Retornar métricas

---

### client-service.parser.ts

✔ CSV → objetos tipados
✔ Trim, normalización básica
✔ Conversión booleans / ints

---

### client-service.validator.ts

✔ Validaciones de dominio:

* RFC
* clientNumber
* enum ServiceContractName
* SLA
* priority

✔ Detecta:

* conflictos de RFC / clientNumber
* enums inválidos
* filas incompletas

---

### client-service.types.ts

Define el **contrato interno real**:

```ts
export interface ClientServiceRow {
  clientRfc: string;
  clientNumber: string;
  companyName?: string;
  businessName?: string;
  location?: string;
  clientActive: boolean;

  serviceName: ServiceContractName;
  priorityLevel: number;
  slaHours: number;
  serviceActive: boolean;
}
```

---

## 📦 Resultado REAL del import

```json
{
  "clientsUpserted": 42,
  "serviceContractsCreated": 68,
  "serviceContractsUpdated": 12,
  "rowsWithErrors": 3,
  "errors": [
    {
      "row": 17,
      "reason": "serviceName INVALID_ENUM"
    }
  ]
}
```

---

# 3️⃣ Impacto REAL en Prisma v2.0.0

## ❌ Cambios requeridos: **NINGUNO**

✔ Client ya existe
✔ ServiceContract ya existe
✔ Relaciones correctas
✔ Índices suficientes

El módulo **consume el modelo**, no lo modifica.

---

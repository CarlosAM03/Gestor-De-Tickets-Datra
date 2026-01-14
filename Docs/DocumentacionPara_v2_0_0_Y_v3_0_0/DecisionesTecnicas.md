
---
# 📎 Anexo — Decisiones Técnicas y Riesgos Aceptados

**Gestor de Tickets DATRA — v2.0.0**

**Estado:** 🔒 CONGELADO  
**Alcance:** Backend, Base de Datos, Contratos de Dominio e Integraciones  
**Vigencia:** v2.x y v3.x  

Este documento registra **todas las decisiones técnicas críticas** tomadas durante el diseño y cierre de la versión **v2.0.0**, así como los **riesgos conscientemente aceptados**.

Su objetivo es:

* Evitar retrabajo
* Evitar ambigüedad
* Evitar re-discusión técnica
* Servir como respaldo ante auditoría técnica y operativa

---

## 1️⃣ Principio Rector del Backend

### 📌 Decisión

El backend se diseña bajo los principios de:

* **Auditoría completa**
* **Inmutabilidad histórica**
* **Estados explícitos**
* **Contratos claros, versionados y estables**
* **Backend como autoridad del dominio**

### 🎯 Justificación

El sistema entra en **operación real**, por lo que la estabilidad, trazabilidad y control tienen prioridad absoluta sobre la flexibilidad o conveniencia de implementación.

### ⚠️ Riesgo aceptado

Mejoras futuras requerirán:

* capas adicionales
* adapters
* metadata
* cálculos dinámicos

en lugar de cambios estructurales directos.

---

## 2️⃣ Congelación del Modelo de Datos (Prisma v2.0.0)

### 📌 Decisión

El schema Prisma de las entidades:

* `Ticket`
* `TicketHistory`
* `User`
* `Client`
* `ServiceContract`

queda **congelado en v2.0.0**.

No se aceptan modificaciones estructurales en v2.x ni v3.x.

### 🎯 Justificación

* Evitar migraciones en operación
* Garantizar consistencia histórica
* Facilitar auditoría, reporting y KPIs reales

### ⚠️ Riesgo aceptado

Cambios futuros deberán resolverse mediante:

* metadata
* nuevos módulos
* lógica de dominio
* versionado de contratos

---

## 3️⃣ Tickets: Estados y Ciclo de Vida

### 📌 Decisión

Los estados del ticket son **finitos, explícitos y controlados**:

```

OPEN → RESOLVED → CLOSED
OPEN → CANCELLED

````

No existen:

* transiciones implícitas
* reaperturas
* saltos de estado

### 🎯 Justificación

* Control operacional claro
* Validaciones simples
* Auditoría confiable
* KPIs consistentes

### ⚠️ Riesgo aceptado

No se soportan flujos “custom” sin cambios de versión mayor.

---

## 4️⃣ TicketHistory como Fuente Única de Verdad

### 📌 Decisión

`TicketHistory` es:

* append-only
* no editable
* no borrable

Toda acción relevante genera un evento.

### 🎯 Justificación

* Auditoría legal y operativa
* Reconstrucción histórica completa
* Base única para métricas y KPIs

### ⚠️ Riesgo aceptado

Crecimiento de la tabla a largo plazo.

📌 **Mitigación futura:** archivado o particionado (v4+).

---

## 5️⃣ Uso de Metadata JSON Tipada (Boundary Explícito)

### 📌 Decisión

La metadata de `TicketHistory`:

* se modela con **DTOs tipados**
* se serializa explícitamente a JSON al persistir

Se define una frontera clara dominio → persistencia:

```ts
function toJson<T>(data: T): Prisma.InputJsonValue
````

### 🎯 Justificación

* Separar dominio tipado de persistencia JSON
* Permitir evolución sin migraciones
* Soportar integraciones externas (LibreNMS, importadores, futuros sistemas)

### ⚠️ Riesgo aceptado

* La BD no valida estructura de metadata
* La validación recae en backend

📌 Se acepta conscientemente el uso de cast:
`unknown → InputJsonValue`
como frontera controlada.

---

## 6️⃣ Usuarios y Roles (Auth)

### 📌 Decisión

El módulo de autenticación **no se modifica** para v2.0.0 ni v3.0.0.

Roles oficiales:

```
ADMIN
TECNICO
INGENIERO
```

### 🎯 Justificación

* El modelo actual cubre los casos reales
* Cambios aquí impactan seguridad
* Se prioriza estabilidad operativa

### ⚠️ Riesgo aceptado

Permisos finos se resuelven en:

* controladores
* policies
* guards

📌 **Acción requerida:** auditoría de controladores antes de ampliar permisos.

---

## 7️⃣ Clients: Identidad y Persistencia

### 📌 Decisión

El **RFC** es la clave primaria del cliente.

No se permite:

* cambio de RFC
* eliminación física

Solo se permite:

* activación
* desactivación

### 🎯 Justificación

* Identidad fiscal real
* Auditoría
* Prevención de duplicados

### ⚠️ Riesgo aceptado

Errores de alta requieren corrección administrativa, no técnica.

---

## 8️⃣ ServiceContract como Entidad Persistida

### 📌 Decisión

Cada cliente puede tener **múltiples ServiceContracts**, cada uno con:

* `ServiceContractName` (ENUM cerrado)
* `priorityLevel`
* `slaHours`
* estado activo

### 🎯 Justificación

* SLA y prioridad son contractuales
* Varían por cliente
* Impactan métricas reales

### ⚠️ Riesgo aceptado

Cambios de catálogo requieren migración.

📌 **Revisión posible:** v4.0.0+

---

## 9️⃣ Prioridad, Impacto y SLA

### 📌 Decisión

* Prioridad contractual se persiste en `ServiceContract`
* Impacto (`ImpactLevel`) se define por ticket
* El semáforo **NO se persiste**

### 🎯 Justificación

* El semáforo depende del tiempo actual
* Persistirlo generaría inconsistencias
* SLA real se calcula dinámicamente

### ⚠️ Riesgo aceptado

Mayor carga de cálculo en backend.

---

## 🔟 Contrato de Endpoints (Frontend 1:1)

### 📌 Decisión

El contrato de endpoints v2.0.0 se declara **CERRADO**, independientemente del estado de implementación.

El contrato es:

* la fuente de verdad
* vinculante para frontend
* versionado

### 🎯 Justificación

* Permite desarrollo paralelo
* Evita cambios oportunistas
* Protege integraciones

### ⚠️ Riesgo aceptado

Cambios operativos requieren nueva versión (v3.0.0).

---

## 1️⃣1️⃣ Frontend como Consumidor Pasivo

### 📌 Decisión

El frontend:

* NO controla estados
* NO infiere reglas de dominio
* NO recalcula lógica crítica
* NO persiste derivados

### 🎯 Justificación

* Evitar divergencias
* Centralizar lógica
* Simplificar auditoría

### ⚠️ Riesgo aceptado

Menor flexibilidad inmediata en UI.

---

## 1️⃣2️⃣ Integración con LibreNMS

### 📌 Decisión

LibreNMS:

* Detecta eventos
* Notifica
* NO gestiona tickets

Tipo de integración:

* Push HTTP
* Endpoints dedicados
* Token exclusivo

Eventos registrados como:

```
TicketEventType.IMPORTED_FROM_LIBRENMS
```

### 🎯 Justificación

* Separar monitoreo de operación humana
* Evitar automatismos peligrosos
* Mantener control del dominio

### ⚠️ Riesgo aceptado

Integración más estricta y compleja.

---

## 1️⃣3️⃣ Alert Clear NO Resuelve Tickets

### 📌 Decisión

Una alerta recuperada (`alert clear`):

* NO resuelve
* NO cierra
* NO cancela

Solo genera evento de historial (`UPDATED`).

### 🎯 Justificación

* Resolver ≠ alerta desaparecida
* Evitar cierres falsos
* Requiere validación humana

### ⚠️ Riesgo aceptado

Mayor carga operativa manual.

---

## 1️⃣4️⃣ Módulo AdminImportClients (ADMIN)

### 📌 Decisión

Se implementa módulo exclusivo ADMIN para:

* alta
* edición
* activación / desactivación
* importaciones CSV unitarias o pequeñas

Sin modificar Prisma.

### 🎯 Justificación

* Operación real lo requiere
* Evita scripts manuales
* Centraliza validaciones

### ⚠️ Riesgo aceptado

Errores de CSV requieren validación estricta.

---

## 1️⃣5️⃣ Diseño Oficial del CSV de Importación

### 📌 Decisión

Formato **1:1 con el modelo**:

```csv
clientRfc,clientNumber,companyName,businessName,location,clientActive,serviceName,priorityLevel,slaHours,serviceActive
```

* 1 fila = 1 ServiceContract
* RFC puede repetirse
* ENUMs estrictos

### 🎯 Justificación

* Sin mapeos ambiguos
* Compatible con auditoría
* Predecible

### ⚠️ Riesgo aceptado

Menor tolerancia a errores de entrada.

---

## 1️⃣6️⃣ Implementación ≠ Contrato

### 📌 Decisión

El hecho de que un módulo:

* no esté implementado
* esté en desarrollo
* esté parcialmente completo

**NO invalida el contrato ni autoriza cambios de diseño**.

### 🎯 Justificación

* Proteger arquitectura
* Evitar desviaciones
* Mantener alineación frontend-backend

---

## 🔚 Cierre del Documento

### 📌 Regla Final (NO NEGOCIABLE)

> **Toda decisión no documentada aquí
> NO puede modificar el backend en v2.x / v3.x**

Este anexo existe para:

* Proteger la arquitectura
* Justificar decisiones ante auditoría
* Facilitar onboarding
* Evitar regresiones
* Evitar retrabajo
* Blindar la ejecución técnica


---

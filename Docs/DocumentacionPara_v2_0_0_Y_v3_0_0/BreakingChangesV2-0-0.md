
---

# 🚨 Breaking Changes — v2.0.0

> **Esta versión introduce cambios incompatibles con versiones anteriores.**
> Cualquier frontend, integración o documentación basada en v1.x **debe actualizarse obligatoriamente**.

---

## 🔥 1. Eliminación total de flujos de eliminación de tickets

Se eliminaron **definitivamente** los siguientes flujos:

* Solicitud de eliminación de tickets
* Aprobación o rechazo de eliminación
* Soft delete de tickets
* Estados intermedios relacionados con eliminación

### ❌ Estados eliminados

* `IN_PROGRESS`
* `ON_HOLD`
* `PENDING_DELETE`

### ❌ Flags eliminados

* `deleteRequested`
* `canDelete`
* `approvalRequired`

📌 **Nuevo criterio**:
Los tickets **no se eliminan**.
El ciclo de vida válido es controlado exclusivamente por **eventos de dominio**.

---

## 🧩 2. Modelo de Ticket plano (v1) eliminado

El modelo de ticket plano utilizado en v1 queda **obsoleto y eliminado**.

### ❌ Campos que ya NO existen

```ts
assignedTo
contact
serviceAffected
problemDesc
updatedAt
```

📌 En v2:

* El ticket es un **aggregate root**
* Las mutaciones se reflejan mediante **eventos + historial**
* No existen campos “derivados” o ambiguos

---

## 📜 3. Historial de tickets ahora es versionado y con metadata

El historial de tickets ya **no es texto plano**.

### ❌ Eliminado

```ts
history: {
  description: string;
}
```

### ✅ Nuevo contrato obligatorio

```ts
metadata: {
  version: 'v2';
  // payload específico del evento
}
```

📌 Todo evento de historial debe:

* Tener tipo explícito (`TicketEventType`)
* Indicar transición de estado
* Incluir metadata versionada

---

## 🔁 4. Separación estricta entre DTOs y modelos de UI

En v2 se **rompe explícitamente** la equivalencia entre:

* DTOs HTTP
* Modelos de UI
* Formularios

### ❌ Ya no es válido asumir:

* “El frontend usa los DTOs del backend”
* “TicketDTO representa el estado del ticket en UI”
* “Los formularios se basan en DTOs”

📌 Los DTOs representan **contratos HTTP**,
📌 La UI trabaja con **modelos enriquecidos propios**.

---

## 🏢 5. Cliente como entidad raíz del dominio

En v2 el **Cliente es entidad primaria**.

### ❌ Suposiciones inválidas

* Contratos sin cliente
* Tickets sin cliente válido
* `clientRfc` opcional

📌 Reglas actuales:

* No existe `ServiceContract` sin `Client`
* Todo ticket debe referenciar un cliente activo
* `clientRfc` es obligatorio

---

## 📄 6. ServiceContract deja de ser catálogo global

Los contratos de servicio **no son plantillas** ni catálogo compartido.

### ❌ Eliminado

* “Catálogo de contratos”
* “Contratos genéricos”
* “Plantillas de servicio”

📌 En v2:

* Cada contrato pertenece a **un cliente**
* Es una **instancia real**, no una definición abstracta

---

## 🔌 7. Endpoints eliminados

Los siguientes endpoints **ya no existen** y no deben documentarse ni consumirse:

```http
DELETE /tickets/:id
POST /tickets/:id/request-delete
POST /tickets/:id/approve-delete
DELETE /users/:id
```

📌 Cualquier referencia a ellos es **incorrecta**.

---

## 📊 8. Dashboard basado en estados ilegales eliminado

Se eliminaron métricas que dependían de estados inexistentes.

### ❌ Métricas inválidas

* Tickets “en progreso”
* Tickets “en espera”
* Tickets “pendientes de aprobación”

📌 Las métricas deben basarse **solo en estados reales del dominio**.

---

## 👥 9. Clientes ya no se crean solo por importación

El sistema **ya no depende exclusivamente de CSV**.

### ❌ Suposiciones eliminadas

* “Los clientes solo se crean por importación”
* “No existe alta manual de clientes”

📌 En v2:

* Existe creación manual de clientes
* La importación es un flujo adicional, no exclusivo

---

## 🧹 10. Eliminación de compatibilidad con v1

Se eliminan completamente:

* Secciones de compatibilidad con versiones anteriores
* Referencias a “legacy flows”
* Planes de migración futura desde v1

📌 **La migración ya ocurrió.**
📌 Mantener estas secciones genera confusión y errores.

---

## ⚠️ Nota obligatoria para documentación

Añadir en la cabecera de cualquier README principal:

```md
⚠️ Este proyecto opera exclusivamente bajo dominio v2.0.0.
Cualquier referencia a flujos, estados o modelos de v1.x es obsoleta.
```

---


---

# 🏗️ Arquitectura Backend — v2.0.0

## 1. Principio Rector

El backend del **Gestor de Tickets Datra** está diseñado bajo el principio de:

> **Backend como árbitro absoluto del dominio**

Esto implica que:

* Todas las reglas de negocio viven **exclusivamente** en backend
* El frontend **no infiere**, **no completa** y **no corrige** lógica
* El backend expone **contratos estables**, no modelos internos
* Ningún estado puede mutar sin una **acción de dominio explícita**

---

## 2. Estilo Arquitectónico

### 🧱 Arquitectura Modular (NestJS)

* Módulos aislados por dominio
* Dependencias explícitas
* Sin acoplamientos implícitos
* Sin “shared business logic” transversal

Ejemplos de módulos:

* `auth`
* `users`
* `clients`
* `service-contract`
* `tickets`
* `ticket-history`

📌 Cada módulo:

* Controla su propio dominio
* Expone solo lo necesario
* No muta entidades externas directamente

---

## 3. Persistencia y Dominio

### 🗄️ Prisma como fuente del modelo persistente

* Prisma define el **modelo real**
* El dominio se alinea estrictamente a Prisma
* No existen modelos “paralelos” en runtime

📌 Regla:

> Si no existe en Prisma, **no existe en el sistema**

---

## 4. Modelo de Dominio Dirigido por Eventos

El sistema adopta un enfoque **event-driven interno** para auditoría:

* Las acciones generan **eventos de dominio**
* Los eventos generan **historial**
* El historial es la fuente de verdad para auditoría y métricas

📌 El estado actual es solo una **proyección** del historial.

---

## 5. Ticket como Aggregate Root

`Ticket` es un **aggregate root** con las siguientes características:

* Controla su propio ciclo de vida
* Valida todas las transiciones
* Bloquea mutaciones ilegales
* Genera historial obligatorio

No existen:

* Mutaciones parciales sin validación
* Cambios de estado genéricos
* Acceso directo a campos críticos

---

## 6. Estados y Transiciones (Congelado)

Estados válidos:

```
OPEN → RESOLVED → CLOSED
OPEN → CANCELLED
RESOLVED → CANCELLED
```

❌ Cualquier otra transición es un **error de dominio**

📌 No existen estados intermedios
📌 No existe reapertura
📌 No existe eliminación

---

## 7. Acciones de Dominio Explícitas

Las únicas acciones que mutan el estado son:

| Acción          | Transición                  |
| --------------- | --------------------------- |
| `createTicket`  | → OPEN                      |
| `resolveTicket` | OPEN → RESOLVED             |
| `closeTicket`   | RESOLVED → CLOSED           |
| `cancelTicket`  | OPEN / RESOLVED → CANCELLED |
| `updateTicket`  | Información no estructural  |

📌 Cada acción:

* Valida estado actual
* Valida rol
* Ejecuta reglas
* Registra historial
* Es atómica (rollback si falla)

---

## 8. Historial (TicketHistory) — Append Only

El historial cumple las siguientes reglas:

* Inmutable
* No editable
* No eliminable
* Ordenado temporalmente
* Versionado mediante metadata

```ts
TicketHistory {
  ticketId
  eventType
  fromStatus
  toStatus
  performedById
  metadata { version: 'v2' }
}
```

📌 Si el historial no se puede registrar → la operación falla completa.

---

## 9. Separación DTO ↔ Modelo Interno

El backend expone **DTOs HTTP**, no entidades internas.

* DTOs = contrato externo
* Entidades Prisma = dominio interno
* Nunca se exponen entidades crudas

📌 Esto permite:

* Evolución interna sin romper frontend
* Versionado de contratos
* Migración controlada a v3

---

## 10. Seguridad y Acceso

* Autenticación: JWT
* Autorización: Roles + Guards
* Validación de permisos:

  * En controller (acceso)
  * En service (regla de dominio)

📌 Un endpoint protegido **no implica** acción permitida.

---

## 11. Cliente como Entidad Raíz

Principios no negociables:

* Todo ticket pertenece a un cliente
* Todo contrato pertenece a un cliente
* No existe contrato huérfano
* No se crean clientes implícitamente

📌 Cliente es el **ancla del dominio operativo**.

---

## 12. ServiceContract como Entidad Dependiente

* No es catálogo
* No es plantilla
* No es global

Cada contrato:

* Pertenece a un cliente
* Tiene SLA y prioridad propios
* Puede activarse o desactivarse
* Se usa directamente en tickets

---

## 13. Endpoints como Contrato Congelado

Los endpoints representan **acciones de dominio**, no CRUD genérico.

* No se agregan endpoints “conveniencia”
* No se exponen mutaciones ambiguas
* Todo cambio relevante genera historial

📌 El contrato HTTP es **estable en v2.0.0**.

---

## 14. Filosofía de Evolución

Esta arquitectura está diseñada para:

* Crecer sin romper contratos
* Soportar métricas reales
* Permitir auditorías legales
* Migrar a infraestructura on-prem
* Preparar v3.0.0 sin reescritura

---

## 🏁 Cierre Arquitectónico

Este backend:

* No es experimental
* No es flexible por accidente
* Es **estricto por diseño**
* Prioriza **consistencia sobre comodidad**
* Prefiere **errores tempranos** a corrupción silenciosa

📌 **Arquitectura Backend v2.0.0 — Dominio Congelado**

---

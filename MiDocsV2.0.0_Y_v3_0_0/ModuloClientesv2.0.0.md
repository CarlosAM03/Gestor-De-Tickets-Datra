
---

# ⏱️ CRONOGRAMA – MÓDULO CLIENTES

**Duración total:** **6 a 8 horas**
**Objetivo:** Habilitar Clientes + Contratos como dependencia funcional para Tickets, Historial y Dashboards.

---

## 🕐 BLOQUE 1 — Análisis & Diseño (45–60 min)

### Objetivo

Asegurar **acoplamiento 1:1 con backend** antes de escribir UI.

### Tareas

* Revisar endpoints backend existentes:
Clients
| Endpoint                       | Roles                       |
| ------------------------------ | --------------------------- |
| POST /clients                  | ADMIN                       |
| GET /clients?q                 | ADMIN / TECNICO / INGENIERO |
| GET /clients/:rfc              | ADMIN / TECNICO / INGENIERO |
| PATCH /clients/:rfc/activate   | ADMIN                       |
| PATCH /clients/:rfc/deactivate | ADMIN                       |
Contratos
| Endpoint                                | Roles                       |
| --------------------------------------- | --------------------------- |
| POST /service-contracts                 | ADMIN                       |
| GET /service-contracts                  | ADMIN / TECNICO / INGENIERO |
| GET /service-contracts/client/:rfc      | ADMIN / TECNICO / INGENIERO |
| PATCH /service-contracts/:id            | ADMIN                       |
| PATCH /service-contracts/:id/deactivate | ADMIN                       |

* Validar:

  * IDs
  * relaciones cliente ↔ contrato
  * campos obligatorios
* Definir modelos frontend:

  * `Client`
  * `ServiceContract`
* Definir permisos por rol

### Entregable

✔ Tipos TS finales
✔ Contrato API claro
✔ Cero suposiciones en UI

---

## 🕑 BLOQUE 2 — Infraestructura Frontend (45–60 min)

### Objetivo

Tener el **esqueleto del módulo** integrado al sistema.

### Tareas

* Crear estructura:

  ```
  src/pages/Clients/
    ClientsList.tsx
    ClientView.tsx
    ClientCreate.tsx
    ClientEdit.tsx
  src/pages/Contracts/
    ContractCreate.tsx
    ContractView.tsx
  ```
* Crear:

  * `clients.api.ts`
  * `contracts.api.ts`
* Registrar rutas en `AppRoutes`
* Proteger con `RequireAuth / RequireRole`

### Entregable

✔ Rutas accesibles
✔ Navbar integrada
✔ Módulo visible aunque vacío

---

## 🕒 BLOQUE 3 — Lista de Clientes (60 min)

### Objetivo

Permitir **ver y seleccionar clientes**, requisito mínimo para tickets.

### Tareas

* `ClientsList`

  * Tabla simple
  * Nombre, RFC, estado
  * Botón Ver
  * Botón Crear
* Cargar desde backend real
* Manejo de loading / error

### Entregable

✔ Lista funcional
✔ Datos reales
✔ Navegación estable

---

## 🕓 BLOQUE 4 — Cliente + Contrato (90 min)

### Objetivo

Establecer la **relación Cliente ↔ Contrato**, clave del sistema.

### Tareas

* `ClientView`

  * Datos generales
  * Lista de contratos asociados
* `ContractCreate`

  * Crear contrato para cliente
  * Relación explícita `clientId`
* Validar:

  * 1 Cliente → N Contratos

### Entregable

✔ Relación real 1:N
✔ Contratos visibles desde cliente
✔ Sin mocks

---

## 🕔 BLOQUE 5 — Importación CSV (60 min)

### Objetivo

Habilitar **altas masivas**, requisito de negocio.

### Tareas

* UI mínima:

  * Input file
  * Botón Importar
* Conectar a endpoint real
* Mostrar resultado:

  * Éxito
  * Errores básicos
* NO validaciones complejas en frontend

### Entregable

✔ CSV funcional
✔ Alta masiva real
✔ Error handling básico

---

## 🕕 BLOQUE 6 — Integración con Tickets (45–60 min)

### Objetivo

Permitir que **Tickets usen Clientes reales**.

### Tareas

* En `TicketCreate`:

  * Selector de Cliente
  * Selector de Contrato (dependiente)
* Validar:

  * No ticket sin cliente
  * Contrato pertenece al cliente

### Entregable

✔ Tickets ya no están “huérfanos”
✔ Core del sistema habilitado

---

## 🕖 BLOQUE 7 — Hardening ligero & Documentación (30–45 min)

### Objetivo

Cerrar el día **sin deuda invisible**.

### Tareas

* Validar flujos:

  * Cliente → Contrato → Ticket
* Documentar:

  * Qué está funcional
  * Qué queda pendiente
* Marcar explícitamente:

  * TODOs
  * Hardening futuro

### Entregable

✔ Estado claro
✔ Sin sorpresas técnicas
✔ Listo para continuar

---

# ✅ RESULTADO ESPERADO AL FINAL (8h)

✔ Clientes integrados 1:1 con backend
✔ Contratos funcionales
✔ CSV operativo
✔ Tickets desbloqueados
✔ Historial y dashboards con datos reales
✔ Arquitectura limpia
✔ Sin parches

---





Perfecto. Con todo lo que compartiste **ya tenemos suficiente información real** para hacer esto **bien y en el orden correcto**, sin re-trabajo y **acoplado 1:1 al backend** como pediste.

Voy a estructurar la respuesta en **capas**, no por archivos, porque así es como se evita romper cosas:

---

# 🧭 PRINCIPIO RECTOR (léelo primero)

> **El backend ya define el dominio.
> El frontend solo lo representa y orquesta.
> Nunca infiere, nunca “completa”, nunca inventa.**

Todo lo que sigue respeta eso.

---

# 🧱 CAPA 0 — VALIDACIÓN DE LO QUE YA EXISTE (NO SE TOCA)

Antes de escribir código nuevo, **confirmamos que esto ya está BIEN**:

### ✅ Tipos

* `Client`
* `CreateClientPayload / UpdateClientPayload`
* `ServiceContract`
* `CreateServiceContractPayload / UpdateServiceContractPayload`

👉 **Están correctos y alineados con backend**
👉 **NO los modifiques ahora**

---

### ✅ APIs

* `clients.api.ts`
* `service-contracts.api.ts`

👉 Están **perfectamente 1:1** con los endpoints que documentaste
👉 No agregues lógica aquí
👉 No agregues transformaciones

**Estado:** ✔ cerrados para este bloque

---

# 🧭 ORDEN CORRECTO DE IMPLEMENTACIÓN (MUY IMPORTANTE)

Este es el orden **real** que debes seguir.
Si lo alteras, volverán los bugs tipo `NaN`, pantallas blancas o rutas muertas.

---

## 🔹 PASO 1 — RUTAS (antes que componentes)

📌 **Regla:**

> Si la ruta no existe, el componente no existe.

### 1.1 Agregar rutas de Clientes y Contratos en `AppRoutes.tsx`

👉 **Primero solo rutas, aunque los componentes estén vacíos**

Agrega **debajo de USERS y antes de TICKETS**:

```tsx
{/* CLIENTS */}
<Route
  path="clients"
  element={
    <RequireRole allowedRoles={[UserRole.ADMIN, UserRole.INGENIERO, UserRole.TECNICO]}>
      <ClientsList />
    </RequireRole>
  }
/>

<Route
  path="clients/create"
  element={
    <RequireRole allowedRoles={[UserRole.ADMIN]}>
      <ClientCreate />
    </RequireRole>
  }
/>

<Route
  path="clients/:rfc"
  element={
    <RequireRole allowedRoles={[UserRole.ADMIN, UserRole.INGENIERO, UserRole.TECNICO]}>
      <ClientView />
    </RequireRole>
  }
/>

<Route
  path="clients/:rfc/edit"
  element={
    <RequireRole allowedRoles={[UserRole.ADMIN]}>
      <ClientEdit />
    </RequireRole>
  }
/>

{/* CONTRACTS */}
<Route
  path="clients/:rfc/contracts/create"
  element={
    <RequireRole allowedRoles={[UserRole.ADMIN]}>
      <ContractCreate />
    </RequireRole>
  }
/>

<Route
  path="contracts/:id"
  element={
    <RequireRole allowedRoles={[UserRole.ADMIN, UserRole.INGENIERO, UserRole.TECNICO]}>
      <ContractView />
    </RequireRole>
  }
/>
```

🧠 **Por qué así**

* RFC es el identificador real
* Evita `/undefined/edit`
* Refuerza relación Cliente → Contrato

📌 **NO sigas hasta que estas rutas carguen sin pantalla blanca**

---

## 🔹 PASO 2 — NAVBAR (solo visibilidad, nada de lógica)

Antes de lógica, **haz visible el módulo**.

En `AppNavBar` agrega solo:

```tsx
<Nav.Link as={Link} to="/clients">
  Clientes
</Nav.Link>
```

✔ Si aparece → seguimos
❌ Si no → se corrige aquí

---

## 🔹 PASO 3 — CLIENTS LIST (PRIMER COMPONENTE REAL)

Este **SIEMPRE va primero** porque:

* Lo usan Tickets
* Lo usan Contratos
* Lo usan CSV
* Lo usa todo

### 3.1 `ClientsList.tsx` — comportamiento mínimo

Orden interno:

1. `useState<Client[]>`
2. `useEffect`
3. `searchClients('')`
4. Tabla simple

📌 **No filtros complejos**
📌 **No paginación**
📌 **No memo**
📌 **No optimizaciones**

Solo esto:

* RFC
* Client Number
* Estado
* Botón **Ver**
* Botón **Crear**

Si esto funciona → el backend está bien acoplado.

---

## 🔹 PASO 4 — CLIENT VIEW (LECTURA PURA)

Este componente **NO edita nada**.

Orden:

1. `useParams<{ rfc: string }>()`
2. `getClientByRfc(rfc)`
3. `getServiceContractsByClient(rfc)`

Renderiza:

* Datos del cliente
* Lista de contratos
* Botón:

  * Editar (ADMIN)
  * Crear contrato (ADMIN)

📌 **NO** crees contratos aquí
📌 **NO** mutaciones

---

## 🔹 PASO 5 — CONTRACT CREATE (RELACIÓN EXPLÍCITA)

Aquí se **solidifica el 1:N**

Orden:

1. `useParams<{ rfc: string }>()`
2. El `clientRfc` **no se pide**, viene de la ruta
3. Form simple:

   * name
   * priorityLevel
   * slaHours
4. `createServiceContract({ clientRfc, ... })`

📌 Si aquí se rompe → el backend está mal
📌 Si funciona → core validado

---

## 🔹 PASO 6 — CLIENT CREATE / EDIT (ADMIN ONLY)

### ClientCreate

* Form
* `createClient`
* redirect a `/clients/:rfc`

### ClientEdit

* `useParams<{ rfc }>`
* `getClientByRfc`
* `updateClient`

📌 **NO cambies RFC**
📌 RFC es identidad, no atributo

---

## 🔹 PASO 7 — RECIÉN AHORA: TICKETS

Solo cuando **ClientsList + ClientView** funcionan:

En `TicketCreate`:

1. Selector de cliente (usa `searchClients`)
2. Al elegir cliente → `getServiceContractsByClient`
3. Bloquear submit sin cliente/contrato

👉 Aquí se desbloquea TODO el sistema

---

# 🧪 CHECKLIST DE AVANCE (OBLIGATORIO)

Antes de seguir avanzando, confirma:

* [ ] `/clients` lista datos reales
* [ ] `/clients/:rfc` carga sin errores
* [ ] Contratos se ven desde cliente
* [ ] Crear contrato funciona
* [ ] No hay `NaN`, `undefined`, ni rutas inválidas
* [ ] Consola limpia

---

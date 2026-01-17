
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

  * `GET /clients`
  * `GET /clients/:id`
  * `POST /clients`
  * `PATCH /clients/:id`
  * `GET /clients/:id/contracts`
  * `POST /contracts`
  * `POST /clients/import` (CSV)
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


---

# 🧩 Arquitectura Frontend — v2.0.0

## 1. Principio Rector

El frontend del **Gestor de Tickets Datra** está diseñado bajo el principio de:

> **Frontend como consumidor pasivo de contratos backend**

Esto implica que:

* El frontend **no contiene lógica de negocio**
* El frontend **no valida reglas de dominio**
* El frontend **no infiere estados ni transiciones**
* El frontend **solo representa y ejecuta acciones permitidas**
* El backend es la **única fuente de verdad**

📌 El frontend **no corrige errores del backend**, solo los **maneja de forma segura**.

---

## 2. Rol del Frontend en el Sistema

El frontend es responsable de:

* Autenticación y gestión de sesión (token)
* Consumo estricto de contratos HTTP
* Renderizado de estado
* Control de acceso visual (UI)
* Manejo de errores de forma segura (UI-safe)
* Orquestación de flujos de usuario

El frontend **NO** es responsable de:

* Reglas de negocio
* Validaciones de dominio
* Control de estados de tickets
* Auditoría
* Seguridad real

---

## 3. Estilo Arquitectónico

### 🧱 Arquitectura por Capas Funcionales

El frontend sigue una arquitectura **funcional y desacoplada**, basada en:

* API Layer (contratos HTTP)
* Types Layer (contratos tipados)
* Auth Layer (estado de sesión)
* Routing Layer (control de acceso)
* UI Components (representación)
* Pages (orquestación de vistas)

📌 No existe un “dominio frontend” paralelo al backend.

---

## 4. API Layer — Contratos Congelados

Ubicación: `src/api`

Responsabilidad:

* Encapsular **únicamente** llamadas HTTP
* Exponer funciones semánticas (no genéricas)
* Respetar endpoints backend congelados
* No contener lógica de UI ni de dominio

Ejemplos:

* `tickets.api.ts`
* `ticket-history.api.ts`
* `clients.api.ts`
* `service-contracts.api.ts`

📌 Regla:

> Un archivo API = un bounded context del backend

---

## 5. HTTP Core

Archivo central: `src/api/http.ts`

Responsabilidad:

* Configuración de cliente HTTP
* Inyección de token JWT
* Manejo centralizado de errores HTTP
* Normalización de respuestas de error

📌 Ningún componente hace `fetch` o `axios` directo.
📌 Todo error HTTP pasa por una capa común.

---

## 6. Types Layer — Contratos Tipados

Ubicación: `src/types`

Responsabilidad:

* Definir **DTOs frontend**
* Reflejar exactamente los contratos del backend
* Tipar respuestas, requests y errores
* Congelar estructuras esperadas

Ejemplos:

* `ticket-types`
* `ticket-history-types`
* `service-contract-types`
* `http-error.types.ts`

📌 Los tipos **no se interpretan**, solo se consumen.
📌 Si el backend cambia, **el tipo rompe** → corrección explícita.

---

## 7. Autenticación y Sesión

Ubicación: `src/auth`

Componentes clave:

* `AuthContext`
* `AuthProvider`
* `useAuth`
* `RequireAuth`
* `RequireRole`

Responsabilidad:

* Almacenar estado de sesión
* Proveer usuario autenticado
* Controlar acceso a rutas
* Reaccionar a 401 / 403

📌 El frontend **no decide permisos**, solo **oculta o bloquea UI**.

---

## 8. Routing y Control de Acceso

Ubicación: `src/router`

Responsabilidad:

* Definir rutas de la aplicación
* Aplicar guards visuales
* Separar rutas públicas / privadas
* Enlazar layouts con páginas

📌 Si un usuario accede por URL directa:

* El backend sigue siendo el árbitro final

---

## 9. Pages — Orquestación de Vistas

Ubicación: `src/pages`

Responsabilidad:

* Orquestar llamadas API
* Manejar loading / error / empty
* Pasar datos a componentes
* No contener lógica de dominio

📌 Una página **no decide qué es válido**, solo **qué mostrar**.

---

## 10. Components — Representación Pura

Ubicación: `src/components`

Responsabilidad:

* Renderizar datos
* Emitir eventos de usuario
* Ser lo más “tontos” posible
* No llamar APIs directamente (salvo excepciones controladas)

Ejemplo:

* `TicketForm`
* `TicketEditStatus`
* `AppNavBar`

📌 Componentes **no conocen reglas del sistema**.

---

## 11. Layouts

Ubicación: `src/layouts`

Responsabilidad:

* Composición visual global
* Estructura base de la app
* Navegación y contenedores

📌 No contienen lógica de negocio ni acceso a datos.

---

## 12. Manejo de Errores (UI Safe)

Principios:

* El frontend **no transforma errores de dominio**
* Muestra mensajes claros pero genéricos
* Nunca expone trazas internas
* Reacciona correctamente a:

  * 401 → logout
  * 403 → acceso denegado
  * 404 → recurso inexistente
  * 409 / 422 → conflicto de estado

📌 El backend define **qué falló**, el frontend define **cómo mostrarlo**.

---

## 13. Estados y Transiciones

El frontend:

* **No calcula transiciones**
* **No habilita acciones ilegales**
* Usa el estado actual del backend como referencia

Ejemplo:

* Si un ticket está `CLOSED`

  * UI deshabilita acciones
  * Backend sigue validando

📌 Doble protección: visual + backend.

---

## 14. Evolución Controlada

Esta arquitectura permite:

* Cambios de UI sin romper backend
* Evolución visual independiente
* Refactor frontend sin impacto en dominio
* Acoplamiento 1:1 estable

📌 El frontend puede rehacerse completo sin tocar backend.

---

## 🏁 Cierre Arquitectónico

Este frontend:

* No es un “cliente inteligente”
* No replica lógica crítica
* No intenta ser resiliente por su cuenta
* Es **estricto, predecible y alineado**
* Existe para **servir al dominio**, no para redefinirlo

📌 **Arquitectura Frontend v2.0.0 — Contratos Primero**

---

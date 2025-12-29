
---

# 🗓️ Día 5 — Sprint 3

## 🏁 Cierre Oficial de Sprint + Congelación del Sistema

📅 **Fecha:** 28 de diciembre de 2025
📦 **Sprint:** 3
🎯 **Objetivo del día:**

> **Cerrar Sprint 3 de forma profesional**, dejar el sistema **congelado, estable y demostrable**, y preparar el terreno para **Sprint 4: Lanzamiento a Producción**.

---

## 🧠 Mentalidad del Día 5 (MUY IMPORTANTE)

Este día **NO es para construir features nuevas**.

Este día es para:

* Confirmar que **todo lo que existe funciona**
* Eliminar ruido técnico
* Garantizar que **nada se rompe**
* Dejar evidencia clara de:

  * Qué está terminado
  * Qué está pendiente
  * Qué entra en producción
  * Qué se pospone conscientemente

> 💡 **Sprint 3 se cierra cuando el sistema es confiable**, no cuando tiene más código.

---

## 🧱 Fase 1 — Congelación Funcional (OBLIGATORIO)

### 🧊 Objetivo

> Declarar oficialmente **FEATURE FREEZE** del Sprint 3.

### Acciones

* ❌ No agregar nuevas pantallas
* ❌ No modificar flujos principales
* ❌ No cambiar contratos API
* ✔️ Solo correcciones **no destructivas**

### Resultado esperado

📌 El sistema queda **funcionalmente idéntico** de aquí en adelante.

---

## 🧹 Fase 2 — Limpieza Técnica Final

### 🎯 Objetivo

> Eliminar ruido técnico que **no rompe funcionalidad**, pero afecta calidad.

---

### 1️⃣ Warnings de Accesibilidad (`axe/forms`)

#### Archivos involucrados

* `TicketEditStatus.tsx`
* `UserCreate.tsx`

#### Acción

* Ajustar correctamente:

  * `Form.Label`
  * `htmlFor`
  * `controlId`
  * `aria-label` o `aria-labelledby`

📌 **Nota importante**
No es obligatorio que Edge deje de mostrar el warning, **sí es obligatorio** que:

* El código esté bien estructurado
* El warning esté **resuelto o documentado técnicamente**

✔️ Resultado válido:

* Warning desaparece **o**
* Warning justificado en documentación técnica

---

### 2️⃣ Limpieza de estados y mensajes UX

Checklist:

* [ ] Mensajes de error claros (`403`, `404`, `500`)
* [ ] Spinners visibles solo cuando corresponde
* [ ] Estados vacíos consistentes
* [ ] Botones correctamente deshabilitados

---

### 3️⃣ Validación de tipos y conversiones

Checklist:

* [ ] `id` siempre convertido a `number`
* [ ] `useParams()` validado
* [ ] No llamadas a API con `NaN`
* [ ] Uso correcto de `authUser.id`

📌 Esto es **crítico para producción**.

---

## 👥 Fase 3 — Usuario (Cierre Definitivo Sprint 3)

### 🎯 Objetivo

> Dejar el módulo de usuarios **completo según contrato actual**, sin promesas ambiguas.

---

### Estado esperado al final del día

| Funcionalidad    | Estado                  |
| ---------------- | ----------------------- |
| Listado usuarios | ✅                       |
| Filtros          | ✅                       |
| Vista usuario    | ✅                       |
| Crear usuario    | ✅                       |
| Eliminar usuario | ✅                       |
| Editar usuario   | 🔵 Preparado, NO activo |

📌 **Edición de usuario NO se implementa hoy**
Solo se deja:

* UI preparada
* Lógica documentada
* Pendiente oficial para Sprint 4

---

## 📊 Fase 4 — Dashboard (Pulido Final)

### 🎯 Objetivo

> Dejar el Dashboard **estable, limpio y presentable**.

### Acciones

* [ ] Validar carga sin errores
* [ ] Confirmar `scope=all`
* [ ] Documentar filtro por fechas como:

  * Pendiente backend
  * Sprint futuro
* [ ] Quitar cualquier acción editable

📌 Dashboard = **solo lectura**, confiable y rápido.

---

## 🎨 Fase 5 — Branding Básico (NO visual fancy)

### 🎯 Objetivo

> Dejar el sistema **coherente visualmente**, no bonito.

### Acciones mínimas

* [ ] Colores corporativos consistentes
* [ ] Tipografía uniforme
* [ ] Espaciados corregidos
* [ ] Headers claros
* [ ] Eliminar estilos temporales

📌 **No diseño gráfico**, solo coherencia profesional.

---

## 🧪 Fase 6 — Testing Manual por Rol (CRÍTICO)

### 🎯 Objetivo

> Probar el sistema **como usuario real**, no como desarrollador.

---

### Pruebas obligatorias

#### 👤 ADMIN

* Login
* Dashboard
* Tickets:

  * Crear
  * Editar
  * Cambiar estatus
  * Aprobar/rechazar eliminación
* Usuarios:

  * Listar
  * Crear
  * Ver
  * Eliminar
* Logout

---

#### 🧑‍🔧 INGENIERO

* Login
* Dashboard
* Tickets globales
* Ver perfil propio
* Confirmar NO acceso a:

  * Usuarios
  * Acciones administrativas

---

#### 🧑‍💻 TECNICO

* Login
* Tickets propios
* Cambiar estatus permitido
* Ver perfil propio
* Confirmar restricciones

📌 **Si algo falla aquí → Sprint NO se cierra**

---

## 📦 Fase 7 — Documentación de Cierre Sprint 3

### 🎯 Objetivo

> Dejar evidencia clara para futuro tú y para cualquier tercero.

---

### Documentos a generar

* ✅ **Estado final Sprint 3**
* ✅ Pendientes conscientes (Sprint 4)
* ✅ Warnings conocidos
* ✅ Alcance congelado
* ✅ Decisiones técnicas tomadas

📌 Esto es **clave para producción**.

---

## 🧊 Fase 8 — Freeze Final & Tag

### 🎯 Objetivo

> Dejar el código listo para avanzar a producción.

### Acciones

* [ ] Commit final:

  ```
  chore: freeze sprint 3 - system stable
  ```
* [ ] Tag:

  ```
  sprint-3-final
  ```
* [ ] NO más commits funcionales

---

## 🏁 Resultado Esperado al Final del Día 5

| Área          | Estado                   |
| ------------- | ------------------------ |
| Sistema       | 🟢 Estable               |
| Funcionalidad | 🟢 Completa              |
| Usuarios      | 🟢 Cerrado               |
| Tickets       | 🟢 Cerrado               |
| Dashboard     | 🟢 Cerrado               |
| UX            | 🟢 Profesional           |
| Producción    | 🟡 Listo para planificar |

---

## 🧠 Conclusión Final del Día 5

> El Sprint 3 **NO termina cuando todo es perfecto**
> Termina cuando:
>
> ✔️ El sistema funciona
> ✔️ Nada se rompe
> ✔️ Todo está documentado
> ✔️ El alcance está congelado

---



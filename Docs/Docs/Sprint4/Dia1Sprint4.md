
---

# 🧱 DÍA 1 — PLAN PROFESIONAL EJECUTABLE

**Sprint 4 · 30/12**

---

## 🧠 PRINCIPIO DEL DÍA (léelo antes de empezar)

Hoy **NO** es un día de “programar mucho”.
Hoy es un día de:

* Decidir
* Cerrar
* Documentar
* Preparar el terreno

📌 *Si hoy te aceleras, mañana pagarás el precio.*

---

## 🕔 5:00 – 5:15 PM

### 🔹 Bloque 0 — Arranque consciente (15 min)

**Objetivo:** Entrar en modo ingeniería, no modo ansiedad.

✔ Qué hacer:

* Abre tu checklist del Sprint 4
* Lee **solo** el objetivo del Día 1
* Ten agua / café listo
* Silencia distracciones

❌ Qué NO hacer:

* Abrir código aún
* Pensar en deploy
* Pensar en inversionistas

📌 *Hoy solo cerramos el sistema.*

---

## 🕔 5:15 – 6:00 PM

### 1️⃣ Confirmar congelamiento (45 min)

**Objetivo:** Declarar oficialmente qué entra y qué NO entra.

#### Paso a paso

1. **Lee el alcance final actual**

   * Tickets
   * Roles
   * Flujos
   * Estados

2. **Pregúntate uno por uno**:

   > “¿Esto está listo para que alguien lo use mañana?”

3. Documenta (aunque sea en notas):

   * Issues conocidos (si existen)
   * Limitaciones aceptadas
   * Cosas que *NO* se harán en Sprint 4

#### Resultado esperado

* ✔ Scope final aceptado
* ✔ Sistema “cerrado” mentalmente

📌 *Después de este punto, solo bugs críticos.*

🧠 **Descanso corto (5 min)**

---

## 🕕 6:05 – 7:00 PM

### 🛠️ Ajuste Controlado — “Servicio Afectado” (55 min)

**Objetivo:** Validar que este cambio **no rompe nada** y está bien justificado.

⚠️ OJO:
Si **ya está implementado**, este bloque es de **verificación**, no de desarrollo pesado.

#### Paso a paso

1. Revisa:

   * Que el backend **no cambió**
   * Que el contrato API sigue igual
   * Que el valor enviado es exactamente el string esperado

2. Valida UX:

   * Select claro
   * Opciones correctas
   * Sin inputs libres escondidos

3. Confirma documentación:

   * Decisión técnica clara
   * Riesgo bajo
   * Clasificación correcta

#### Resultado esperado

* ✔ Cambio aceptado formalmente
* ✔ No rompe congelamiento
* ✔ Listo para producción

📌 *Este ajuste ya está bien planteado. No le des más vueltas.*

🧠 **Descanso real (10 min)**
Levántate. Estírate. Nada de pantalla.

---

## 🕖 7:10 – 8:00 PM

### 2️⃣ Auditoría rápida de código (50 min)

**Objetivo:** Detectar errores tontos antes de producción.

#### Orden recomendado (no improvises)

1. **Backend primero**

   * Busca `console.log`
   * Revisa guards en endpoints críticos
   * Confirma validaciones DTO

2. **Frontend**

   * Logs olvidados
   * Manejo básico de errores
   * Rutas protegidas

⚠️ Regla importante:

> Si algo **no es crítico**, solo documéntalo.
> No empieces refactors.

#### Resultado esperado

* ✔ Código “limpio”
* ✔ Riesgo reducido
* ✔ Lista corta de “cosas conocidas”

🧠 **Descanso corto (5 min)**

---

## 🕗 8:05 – 8:45 PM

### 3️⃣ Variables de entorno DEFINITIVAS (40 min)

**Objetivo:** Dejar listo lo más crítico de producción SIN subir nada.

#### Paso a paso

1. **Backend**

   * Define todas las variables (aunque aún no las cargues)
   * Genera **JWT_SECRET real** (largo, único)
   * Define `CORS_ORIGIN` (dominio final o placeholder claro)

2. **Frontend**

   * Define `API_URL` de producción (aunque aún no exista)
   * Define `APP_ENV=production`

⚠️ Importante:

* No subir `.env`
* Solo dejar **listas las definiciones**

#### Resultado esperado

* ✔ Variables claras
* ✔ Nada improvisado mañana
* ✔ Seguridad consciente

📌 *Esto te ahorra errores graves en Día 2.*

---

## 🕣 8:45 – 9:00 PM

### 4️⃣ Commit de preparación (15 min)

**Objetivo:** Cerrar el día con un punto de control limpio.

```bash
chore: prepare production environment
```

✔ Qué debe incluir:

* Ajuste frontend (si aplica)
* Limpieza menor
* Documentación

❌ Qué NO debe incluir:

* Features nuevas
* Cambios estructurales
* Experimentos

---

## 🧠 CIERRE DEL DÍA (9:00 PM)

Antes de cerrar la laptop, responde mentalmente:

* ¿Sé exactamente qué voy a hacer mañana? ✅
* ¿Hay algo crítico sin decidir? ❌
* ¿El sistema está estable? ✅

Si las respuestas son esas → **día exitoso**.

---

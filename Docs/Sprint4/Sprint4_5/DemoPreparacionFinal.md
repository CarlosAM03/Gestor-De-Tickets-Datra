
---

# 🗓️ CRONOGRAMA — 02 DE ENERO

## 🕑 Estabilización silenciosa

**Horario:** 2:00 pm – 8:00 pm (6 horas)
**Modalidad:** Bajo riesgo · Sin features nuevas · Con pausas preventivas

> 🎯 **Objetivo del día:**
> Confirmar que el sistema **no tiene sorpresas ocultas** antes del ensayo formal.

---

## ⏱️ 2:00 – 2:15 pm | Arranque controlado (15 min)

✔ Revisar estado mental / contexto
✔ Abrir:

* Dashboard Railway
* Dashboard Vercel
* Repo backend (main)
* Repo frontend (main)

📌 **Regla:** hoy no se “programa por inercia”.

---

## ⏱️ 2:15 – 3:00 pm | Revisión de logs backend (45 min)

### Tareas

* Revisar logs últimos 3–5 días
* Identificar:

  * errores recurrentes
  * warnings
  * excepciones silenciosas

### Validar

* [ ] Login
* [ ] Creación / lectura de tickets
* [ ] Autorización por rol
* [ ] Errores 401 / 403 esperados

📌 **Resultado esperado:**

> “No hay errores desconocidos en producción”.

---

## ☕ 3:00 – 3:10 pm | Pausa preventiva (10 min)

*Agua / café / despejar cabeza*
📌 Esto **reduce errores estúpidos**.

---

## ⏱️ 3:10 – 3:45 pm | Variables de entorno definitivas (35 min)

### Backend

* [ ] `DATABASE_URL`
* [ ] `JWT_SECRET`
* [ ] `JWT_EXPIRES_IN`
* [ ] `CORS_ORIGIN`
* [ ] `NODE_ENV=production`

### Frontend

* [ ] `VITE_API_URL`
* [ ] `APP_ENV=production`

📌 Confirmar:

* Sin variables sobrantes
* Sin valores legacy
* Sin valores de staging

---

## ☕ 3:45 – 3:55 pm | Pausa breve (10 min)

---

## ⏱️ 3:55 – 4:30 pm | Revisión CORS + sesión (35 min)

### Verificar

* [ ] CORS permite **solo** dominio frontend
* [ ] No hay slash final conflictivo
* [ ] Preflight OK
* [ ] Headers correctos

### Sesión

* Token se guarda
* Token se envía
* Token expira correctamente

📌 **Aquí se detectan el 80% de bugs de demo.**

---

## ☕ 4:30 – 4:40 pm | Pausa preventiva (10 min)

---

## ⏱️ 4:40 – 5:20 pm | Evaluación Logout (CRÍTICO)

### Análisis (NO tocar código aún)

Responder **sí o sí**:

| Pregunta                   | Respuesta |
| -------------------------- | --------- |
| ¿Logout elimina token?     |           |
| ¿Estado de auth se limpia? |           |
| ¿Redirige correctamente?   |           |
| ¿Refresh revive sesión?    |           |
| ¿Token vencido bloquea?    |           |

---

### 📌 Decisión técnica

#### ✔ **Se corrige SOLO si:**

* El bug es **determinista**
* La corrección es **local**
* No afecta flujos críticos
* No requiere refactor

#### ❌ **Se pospone si:**

* Implica arquitectura auth
* Requiere tocar backend
* Puede romper login

👉 Si cumple criterios → **entra hoy**
👉 Si no → **se documenta y congela**

---

## ☕ 5:20 – 5:30 pm | Pausa breve (10 min)

---

## ⏱️ 5:30 – 6:15 pm | Ajuste permitido (si aplica) (45 min)

### Posibles acciones

* Fix visual logout
* Fix redirect
* Fix limpieza de estado
* Fix imagen `vacio.png`

📌 **No más de 1 commit.**

---

## ⏱️ 6:15 – 7:00 pm | Validación post-fix (45 min)

* Login
* Logout
* Relogin
* Acceso a rutas protegidas
* Dashboard estable

📌 Si algo falla → **rollback inmediato**.

---

## ⏱️ 7:00 – 8:00 pm | Documentación y cierre (1 h)

✔ Documentar:

* Qué se revisó
* Qué se tocó
* Qué se decidió NO tocar
* Riesgos conocidos

✔ Commit claro (si aplica)
✔ Cierre mental del día

---

# 📘 CHECKLIST FINAL — SPRINT 4.5

## 🧪 Preparación final de demo y presentación

---

### 🗓️ **02 de enero — Estabilización silenciosa**

✔ Revisar logs backend (errores / warnings)
✔ Confirmar CORS definitivo
✔ Confirmar variables prod frontend/backend
✔ Corregir `vacio.png` (único ajuste permitido)

---

### 🗓️ **03 de enero — Ensayo de producción**

✔ Smoke test completo desde UI
✔ Flujo completo como ADMIN
✔ Flujo como TECNICO
✔ Flujo como INGENIERO
✔ Simular token expirado
✔ Probar logout / refresh

📌 **Nada nuevo, solo validar**.

---

### 🗓️ **04 de enero — DÍA 6 REAL**

#### ✅ Checklist ejecutable

**Técnico**

* [ ] Re-test final
* [ ] Backup manual DB (dump)
* [ ] Confirmar rollback (commit anterior)
* [ ] Tag release (`v1.0.0`)

**Operativo**

* [ ] Historia clara del sistema
* [ ] Qué hace / qué NO hace
* [ ] Decisiones técnicas clave
* [ ] Riesgos conocidos y controlados

**Cierre**

```bash
chore: freeze system – production ready
```

---

# 🎤 5. PRESENTACION DE DEMO


* Control
* Proceso
* Criterio
* Responsabilidad técnica

👉 **Eso es profesionalismo real.**

---




---

# 🌐 DÍA 3 — 01/01

**Sprint 4 · Día 3**

## 🎯 Objetivo del día

> **Desplegar el frontend en producción real (Vercel) y conectarlo correctamente al backend productivo**, validando el flujo completo de autenticación y operación básica del sistema.

📌 Al cerrar este día puedes afirmar técnicamente:

> **“El sistema está vivo y accesible públicamente.”**

---

## ⏱️ Contexto previo

* Día 2 cerrado correctamente
* Backend productivo en Railway
* DB vacía pero segura
* API funcional
* Variables de entorno estables
* Sin deuda técnica crítica pendiente

---

# 🕒 CRONOGRAMA HORARIO DETALLADO

---

## 🕒 2:00 – 2:30 PM

### 🧱 Bloque 1 — Preparación y build local del frontend (30 min)

**Objetivo:** Confirmar que el frontend es *deployable* sin errores.

### Tareas

* [ ] Entrar al **repo frontend de producción**
* [ ] Revisar variables de entorno locales / producción
* [ ] Confirmar `API_URL` → backend Railway
* [ ] Ejecutar:

```bash
npm run build
```

### Validaciones

* [ ] Build finaliza sin errores
* [ ] No warnings críticos
* [ ] Sin referencias a `localhost`

🚨 **Si falla aquí → NO se avanza**

📌 **Resultado esperado:**
Build estable y listo para producción.

---

## 🕒 2:30 – 3:00 PM

### 🔌 Bloque 2 — Configuración inicial en Vercel (30 min)

**Objetivo:** Infraestructura frontend lista (aún sin validar integración).

### Tareas

* [ ] Importar repo frontend en Vercel
* [ ] Verificar framework detectado correctamente
* [ ] Configurar:

  * Build command
  * Output directory
* [ ] Revisar settings generales del proyecto

📌 **Resultado esperado:**
Proyecto creado en Vercel, listo para recibir variables.

---

## 🕒 3:00 – 3:30 PM

### 🔑 Bloque 3 — Variables de entorno frontend (30 min)

**Objetivo:** Frontend seguro y alineado con backend productivo.

### Variables a cargar (ejemplo)

* `API_URL`
* Variables públicas necesarias (`VITE_`, `NEXT_PUBLIC_`, etc.)

✔ Sin valores sensibles
❌ Nada hardcodeado
❌ Nada de `.env` en el repo

### Validaciones

* [ ] Variables cargadas correctamente
* [ ] Entorno configurado como **Production**

📌 **Resultado esperado:**
Frontend listo para deploy real.

---

## 🕒 3:30 – 4:00 PM

### 🚀 Bloque 4 — Deploy frontend (30 min)

**Objetivo:** Frontend público y accesible.

### Tareas

* [ ] Ejecutar deploy en Vercel
* [ ] Esperar build y deploy
* [ ] Abrir URL pública

### Validaciones

* [ ] Deploy exitoso
* [ ] HTTPS activo
* [ ] Dominio accesible
* [ ] Sin errores de carga en consola

📌 **Resultado esperado:**
Frontend visible públicamente.

---

## 🕒 4:00 – 4:20 PM

### ☕ Break consciente (20 min)

📌 Descanso **obligatorio**
Previene errores de integración y debugging impulsivo.

---

## 🕒 4:20 – 5:00 PM

### 🔗 Bloque 5 — Integración Frontend ↔ Backend (40 min)

**Objetivo:** Flujo real funcionando.

### Pruebas obligatorias desde UI

* [ ] Login desde interfaz
* [ ] JWT recibido y almacenado correctamente
* [ ] Roles respetados
* [ ] Rutas protegidas
* [ ] Logout funcional
* [ ] Expiración de sesión válida

📌 **Nota:**
DB vacía → aquí se crea el primer usuario ADMIN o se usa seed planificado.

🚨 **Si algo falla → se corrige antes de avanzar**

---

## 🕒 5:00 – 5:30 PM

### 🧪 Bloque 6 — Validación final y seguridad (30 min)

**Objetivo:** Confirmar que el sistema es presentable y seguro.

### Checklist

* [ ] HTTPS activo (Vercel)
* [ ] CORS correcto (Railway)
* [ ] JWT expira correctamente
* [ ] No errores visibles
* [ ] UI estable

📌 **Resultado esperado:**
Sistema usable por terceros sin intervención manual.

---

## 🕒 5:30 – 6:00 PM

### 📝 Bloque 7 — Documentación + commit final (30 min)

### Documentar

* URL Frontend
* URL Backend
* Variables requeridas (sin valores)
* Stack tecnológico
* Fecha de deploy
* Riesgos detectados (si los hay)

### Commit

```bash
chore: deploy frontend to production (vercel)
```

📌 **Resultado esperado:**
Sprint documentado y cerrable.

---

## 🕒 6:00 PM — CIERRE DEL DÍA

* ¿Frontend productivo? ✅
* ¿Integración completa? ✅
* ¿Sistema accesible públicamente? ✅
* ¿Demo estable? ✅

  **Sprint 4 cerrado con éxito.**

---

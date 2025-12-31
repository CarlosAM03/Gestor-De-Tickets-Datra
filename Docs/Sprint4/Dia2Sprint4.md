
---

# 🗄️ DÍA 2 — 31/12

## Backend + Base de Datos en Producción (Railway)

---

## 🕒 3:00 – 3:20 PM

### 🔹 Bloque 0 — Preparación y contexto (20 min)

**Objetivo:** No empezar “en frío”.

**Acciones:**

* Abrir README + Docs/Sprint4/PlanDeDeployYProduccion.md
* Confirmar:

  * Repo de deploy backend aún NO creado
  * `.env.production` local correcto
  * Prisma version confirmada (5.16.1)
* Tener a la mano:

  * GitHub
  * Railway
  * Postman

📌 *Si algo no está claro aquí, se corrige antes de tocar producción.*

---

## 🕒 3:20 – 3:50 PM

### 🔹 Bloque 1 — Crear repos privados de deploy (30 min)

**Objetivo:** Separar desarrollo de producción.

**Acciones:**

1. Crear repo privado:

   * `gestor-tickets-back-prod`
2. Inicializar desde local:

   ```bash
   git remote add prod-back <url>
   git push prod-back main
   ```
3. Confirmar:

   * Solo backend + docs necesarias
   * NO `.env`
   * NO history innecesaria

✅ **Checkpoint 1:** Repo limpio, privado y listo

---

## 🕒 3:50 – 4:30 PM

### 🔹 Bloque 2 — Crear infraestructura en Railway (40 min)

**Objetivo:** Infraestructura estable antes de deploy.

**Acciones:**

1. Crear proyecto Railway
2. Crear servicio PostgreSQL
3. Validar:

   * Región
   * Backups habilitados
   * Credenciales únicas
4. Crear usuario de producción (si Railway lo permite)
5. Copiar `DATABASE_URL`

📌 **NO desplegar código aún**

✅ **Checkpoint 2:** DB creada y accesible

---

## 🕒 4:30 – 5:00 PM

### ☕ Pausa consciente (30 min)

* Alejarte de la pantalla
* Nada de código
* Agua / comida ligera

📌 *Esta pausa evita errores de producción.*

---

## 🕒 5:00 – 5:40 PM

### 🔹 Bloque 3 — Variables de entorno en Railway (40 min)

**Objetivo:** Backend seguro antes de arrancar.

**Variables mínimas:**

* `NODE_ENV=production`
* `PORT=3000`
* `DATABASE_URL`
* `JWT_SECRET`
* `JWT_EXPIRES`
* `CORS_ORIGIN`

**Acciones:**

* Copiar desde `.env.production`
* Verificar:

  * Sin espacios
  * Sin comillas extra
  * JWT largo

✅ **Checkpoint 3:** Variables cargadas sin errores

---

## 🕒 5:40 – 6:20 PM

### 🔹 Bloque 4 — Migraciones Prisma (40 min)

**Objetivo:** Base consistente.

**Acciones:**

```bash
npx prisma migrate deploy
```

Verificar:

* Todas las migraciones aplicadas
* Sin warnings
* Tablas creadas correctamente

📌 **SI FALLA → SE DETIENE EL DÍA**

✅ **Checkpoint 4:** DB lista y estructurada

---

## 🕒 6:20 – 7:00 PM

### 🔹 Bloque 5 — Deploy Backend (40 min)

**Acciones:**

* Conectar repo a Railway
* Build automático
* Ver logs:

  * NestJS inicia
  * Prisma conecta
* Ver endpoint base:

  * `/`
  * `/health` (si existe)

✅ **Checkpoint 5:** API arriba con HTTPS

---

## 🕒 7:00 – 7:40 PM

### 🔹 Bloque 6 — Pruebas backend (Postman) (40 min)

**Pruebas obligatorias:**

* Login ADMIN
* Crear ticket
* Cambio de estado
* Solicitud eliminación
* Aprobación

📌 *Si una falla → NO frontend mañana.*

✅ **Checkpoint 6:** Backend funcional

---

## 🕒 7:40 – 8:00 PM

### 🔹 Bloque 7 — Cierre técnico del día (20 min)

**Acciones:**

* Documentar:

  * URL backend
  * Estado DB
  * Issues encontrados
* Commit de documentación (si aplica)
* Apagar entorno

---

# 🧠 Criterio Profesional del Día 2

✔ Infraestructura primero
✔ Variables antes de código
✔ Migraciones antes de tráfico
✔ Pruebas antes de frontend
✔ **No avanzar por presión de tiempo**

---

## 🔒 Resultado esperado al cerrar el día

* Backend en producción
* DB estable
* Endpoints críticos validados
* Base sólida para **Día 3 (Frontend + Demo)**

---

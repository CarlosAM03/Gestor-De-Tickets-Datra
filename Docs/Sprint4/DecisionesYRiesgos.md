Perfecto.
Esto es exactamente lo que hace un **ingeniero responsable antes de producción**: **documentar las decisiones y los riesgos conocidos**, no esconderlos.

Vamos en **dos bloques claros**:

1️⃣ **Documentación formal de decisiones y riesgos (para README / docs técnicas)**
2️⃣ **Transición limpia a Variables de Entorno Definitivas**

Sin prisas, sin saturarte.

---

# 📘 DOCUMENTACIÓN TÉCNICA — DECISIONES Y RIESGOS CONOCIDOS

**Sprint 4 — Día 1**

Esta sección debe quedar **por escrito** en tu documentación técnica (README backend o `/docs/architecture.md`).

---

## 1️⃣ JWT_EXPIRES — Convención de Nombre

### 📌 Contexto

En el backend se utiliza la variable de entorno `JWT_EXPIRES` para definir la duración del token JWT, consumida tanto en el `JwtModule` como en la respuesta de login.

```ts
expiresIn: config.get('JWT_EXPIRES')
```

### 📌 Decisión

Se adopta el nombre:

```env
JWT_EXPIRES=3600s
```

en lugar de `JWT_EXPIRES_IN`.

### 📌 Justificación

* Consistencia interna del proyecto
* Compatible con el formato esperado por `@nestjs/jwt`
* Evita cambios innecesarios en código estable previo a producción

### 📌 Riesgo

🟢 **Bajo**

* El nombre es interno al proyecto
* Documentado explícitamente
* No depende de terceros

### 📌 Estado

✔ **Aceptado para producción**

---

## 2️⃣ Exposición de `password` en `findAll()` de usuarios

### 📌 Contexto

El método:

```ts
findAll() {
  return this.prisma.user.findMany();
}
```

retorna los usuarios incluyendo el campo `password` (hash).

### 📌 Evaluación de Riesgo

* El hash **NO es la contraseña en texto plano**
* El endpoint está protegido por:

  * Autenticación JWT
  * Autorización por rol (ADMIN)

### 📌 Decisión

No se refactoriza este punto en Sprint 4 para evitar:

* Cambios funcionales tardíos
* Riesgo de romper flujos existentes
* Scope creep previo a producción

### 📌 Mitigación

* Endpoint **NO expuesto públicamente**
* Uso restringido a administración interna
* Documentado como deuda técnica controlada

### 📌 Plan futuro

✔ En sprint posterior:

* Uso de `select` o DTO de salida
* Exclusión explícita del campo `password`

### 📌 Estado

🟡 **Aceptado con riesgo documentado**

---

## 3️⃣ `role` como `string` en `RequestWithUser`

### 📌 Contexto

La interfaz:

```ts
export interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    role: string;
  };
}
```

usa `role` como `string`, aunque internamente el sistema maneja `UserRole` (enum Prisma).

### 📌 Evaluación

* El valor proviene directamente del JWT
* El `RolesGuard` valida contra `UserRole`
* TypeScript no impacta runtime

### 📌 Decisión

Corregido

### 📌 Justificación

* Cambio menor en dos lineas de codigo (linea de importacion y linea modificada con UserRole)

### 📌 Riesgo

🟢 Eliminado

### 📌 Estado

✔ **Corregido aceptado para producción**

---

## 🧠 CIERRE DE DOCUMENTACIÓN

📌 **Regla aplicada**

> Todo lo que no se corrige, se documenta.
> Todo lo documentado, se gobierna.


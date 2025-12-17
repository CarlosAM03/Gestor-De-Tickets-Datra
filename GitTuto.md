Perfecto 👍
Aquí tienes un **README completo, claro y con tono empresarial–didáctico**, pensado **para una persona que usa GitHub por primera vez**, **desde la terminal de Visual Studio Code**, **sin experiencia previa en programación**.

Está listo para **copiar y pegar tal cual** en un `README.md`.

---

# 📘 Guía Básica de Git y GitHub

**Uso desde la terminal de Visual Studio Code**

Esta guía explica **paso a paso** cómo utilizar **Git** y **GitHub** desde la **terminal integrada de Visual Studio Code**, orientada a personas que **nunca han trabajado con Git** o tienen conocimientos mínimos de programación.

---

## 🧠 ¿Qué es Git y para qué sirve?

**Git** es un sistema de control de versiones que permite:

* Guardar el historial de cambios de un proyecto
* Trabajar sin miedo a “romper” el código
* Volver a versiones anteriores
* Colaborar con otras personas en un mismo proyecto

**GitHub** es una plataforma en línea donde se almacenan los repositorios creados con Git.

📌 **Importante**

* Git → vive en tu computadora
* GitHub → vive en internet

---

## 🧰 Requisitos Previos

Antes de comenzar asegúrate de tener:

1. ✅ **Git instalado**
   Verifica con:

   ```bash
   git --version
   ```

2. ✅ **Visual Studio Code instalado**

3. ✅ **Una cuenta en GitHub**

---

## 🖥️ Abrir la terminal en Visual Studio Code

1. Abre Visual Studio Code
2. Abre tu proyecto (File → Open Folder)
3. Abre la terminal integrada:

   * **Windows / Linux:** `Ctrl + Ñ` o `Ctrl + Shift + Ñ`
   * **Mac:** `Cmd + Ñ`

---

## 📁 Crear o usar un repositorio

### 🔹 Caso 1: Proyecto nuevo

```bash
git init
```

✔ Inicializa Git en el proyecto
✔ Crea una carpeta oculta `.git`

---

### 🔹 Caso 2: Proyecto ya existente en GitHub

```bash
git clone https://github.com/usuario/repositorio.git
```

✔ Descarga el proyecto
✔ Ya queda conectado a GitHub

---

## 📄 Ver el estado del proyecto

```bash
git status
```

Este comando te dice:

* Qué archivos cambiaron
* Qué archivos están listos para guardar
* Qué archivos faltan por agregar

📌 **Úsalo TODO el tiempo**

---

## ➕ Agregar archivos a Git

### Agregar todos los archivos modificados

```bash
git add .
```

### Agregar un archivo específico

```bash
git add nombre-del-archivo
```

📌 Esto **NO guarda cambios**, solo los prepara.

---

## 💾 Guardar cambios (commit)

```bash
git commit -m "Mensaje claro del cambio"
```

Ejemplo:

```bash
git commit -m "Agrega formulario de login"
```

✔ Guarda una versión del proyecto
✔ El mensaje debe explicar **qué se hizo**

---

## 🌐 Conectar el proyecto con GitHub (solo una vez)

```bash
git remote add origin https://github.com/usuario/repositorio.git
```

Verificar conexión:

```bash
git remote -v
```

---

## ⬆️ Subir cambios a GitHub (push)

```bash
git push origin main
```

📌 La primera vez puede pedir usuario y contraseña o token.

✔ Tus cambios ahora están en GitHub

---

## ⬇️ Descargar cambios desde GitHub (pull)

```bash
git pull origin main
```

✔ Actualiza tu proyecto local
✔ Trae cambios hechos por otros

---

## 🔄 Flujo de trabajo recomendado (EL MÁS IMPORTANTE)

Siempre sigue este orden:

```bash
git status
git add .
git commit -m "Mensaje claro"
git pull origin main
git push origin main
```

📌 Esto evita errores y conflictos.

---

## 🧳 Guardar cambios temporalmente (stash)

Sirve cuando:

* Tienes cambios sin terminar
* Necesitas hacer `pull` o cambiar de rama

### Guardar cambios

```bash
git stash
```

### Ver stashes guardados

```bash
git stash list
```

### Recuperar cambios

```bash
git stash apply
```

O recuperar y borrar:

```bash
git stash pop
```

---

## 🔍 Ver historial de cambios

```bash
git log
```

Para versión corta:

```bash
git log --oneline
```

---

## 🧨 Errores comunes y cómo evitarlos

### ❌ “No puedo hacer push”

➡️ Solución:

```bash
git pull origin main
```

Luego vuelve a intentar el push.

---

### ❌ “Me equivoqué en un commit”

No te preocupes. Git **no borra**, solo guarda historial.

---

### ❌ “Perdí cambios”

Probablemente:

* Están en un `stash`
* Están en un commit anterior

👉 Git casi nunca pierde información.

---

## 🧠 Buenas prácticas

✔ Haz commits pequeños
✔ Usa mensajes claros
✔ Haz pull antes de push
✔ Usa `git status` constantemente
✔ No tengas miedo de equivocarte

---

## 📌 Glosario rápido

| Término    | Significado                   |
| ---------- | ----------------------------- |
| Repository | Proyecto con Git              |
| Commit     | Guardar cambios               |
| Push       | Subir a GitHub                |
| Pull       | Descargar de GitHub           |
| Stash      | Guardar cambios temporalmente |
| Branch     | Línea de trabajo              |
| Main       | Rama principal                |

---



# 🎟️ Gestor de Tickets DATR A

Aplicación web para la gestión de tickets de soporte, desarrollada con **React + TypeScript**, **React-Bootstrap** y **Formik**. Este proyecto está enfocado en una experiencia de usuario clara, moderna y empresarial.

---

## 🚀 Tecnologías utilizadas

* ⚛️ React + TypeScript
* 🎨 React-Bootstrap
* 🧭 React Router DOM
* 📋 Formik
* 🧪 API simulada (mockApi)

---

## ✨ Cambios y actualizaciones recientes

### 🎨 Diseño y UX

* ✅ **Color corporativo aplicado**

  * Se definió el color empresarial `#1e3570`
  * Botones principales (Guardar, Nuevo, Volver) usan este color
  * Clase reutilizable: `.btn-datra`

* ✅ **Dashboard mejorado**

  * Se mantiene la tarjeta de **Bienvenido** y **Actividad reciente**
  * Cuando no existen tickets recientes, se muestra una imagen de estado vacío (`vacio.png`) **debajo del contenido**, sin alterar el layout

* ✅ **Formulario de Nuevo Ticket con texto más grande**

  * Labels, inputs y textareas con mayor tamaño de fuente
  * Mejor legibilidad y menor fatiga visual

---

### 📝 Formulario de Tickets

* ✅ **Textarea auto-expandible**

  * Los campos de texto crecen automáticamente conforme se escribe
  * Sin scroll interno ni necesidad de redimensionar manualmente

* ✅ **Campos opcionales separados**

  * Se añadieron los campos:

    * Diagnóstico inicial
    * Acciones tomadas
  * Separados visualmente por una línea (`hr`) y la etiqueta *Opcional*
  * Altura inicial más compacta que el campo principal

* ✅ **Ubicación con sistema mixto**

  * Campo editable manualmente
  * Botón 📍 que obtiene la ubicación actual del usuario usando la API de Geolocalización del navegador
  * Se insertan coordenadas automáticamente en el campo

---

### 🧭 Navegación y seguridad

* 🔐 Rutas protegidas mediante `ProtectedRoute`
* 👤 Contexto de autenticación (`AuthContext`)
* 🚫 Página de acceso no autorizado

---

## 📁 Estructura relevante del proyecto

```
src/
├── assets/
│   └── vacio.png
├── components/
│   ├── AppNavBar.tsx
│   └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx
├── pages/
│   ├── Dashboard.tsx
│   └── tickets/
│       ├── TicketForm.tsx
│       ├── TicketList.tsx
│       └── TicketView.tsx
├── api/
│   └── mockApi.ts
├── App.tsx
└── App.css
```

---

## 🖼️ Estados visuales

* 📭 **Estado vacío del dashboard**

  * Imagen ilustrativa cuando no hay tickets recientes
  * Mejora la percepción visual del sistema

---

## 🔮 Próximas mejoras sugeridas

* Integración con backend real
* Listado de tickets recientes en el dashboard
* Gráficas y métricas
* Roles (admin / técnico)
* Conversión de coordenadas a dirección (Google Maps)

---

## 👨‍💻 Autor

Proyecto desarrollado con fines académicos y prácticos.

---


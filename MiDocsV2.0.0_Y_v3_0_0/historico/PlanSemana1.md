
---

# 🗓️ PLAN DE TRABAJO — v2.0.0 (AJUSTADO)

## 🟢 SEMANA 1 — Cierre del CORE Definitivo

**Periodo:** 05 – 11 de enero de 2026
**Deadline global:** v2.0.0 operativa el **01 de febrero de 2026**

---

## 🎯 Objetivo REAL de la semana

Cerrar **de forma definitiva y sin ambigüedades**:

* El **modelo de datos final** (válido hasta v3.0.0)
* Las **reglas de negocio reales** según operación DATRA
* La **estructura de historial, métricas y auditoría**
* El **contrato backend–frontend**
* Las **decisiones que impactan migración on-prem y LibreNMS**

📌 **Al terminar la semana:**

> El backend y la base de datos quedan diseñados para producción real,
> aunque aún no estén desplegados localmente.

---

## 👤 Carlos — Responsable Técnico (CORE)

### ✅ Qué hacer (AJUSTADO A LA REALIDAD DE LA EMPRESA)

---

## 1️⃣ Base de Datos — Diseño DEFINITIVO

### Entidades obligatorias

**Tickets**

* Identificador único
* Estado actual
* Prioridad operativa
* Cliente (FK)
* Servicio (FK)
* Fechas clave (creación, último cambio, cierre)
* Semáforo calculado (no persistido como estado)

**TicketHistory (CRÍTICO)**

* Evento (enum)
* Estado anterior → estado nuevo
* Usuario que ejecuta
* Timestamp
* Motivo / comentario
* Metadata (cuando aplique)
  📌 Debe permitir:
* auditoría completa
* métricas
* reconstrucción del ticket en el tiempo

**Clientes**

* RFC (único, obligatorio)
* Número de cliente
* Relación 1:N con tickets
* Relación con servicios contratados

**Servicios**

* Identificador
* Tipo de servicio
* Prioridad asociada (impacta semáforo)
* Relación 1:N con clientes

---

### Relaciones y restricciones

* Cliente → Tickets (1:N)
* Servicio → Tickets (1:N)
* RFC **único y validado**
* No deletes físicos
* Índices pensados para métricas (fechas, cliente, estado)

📌 **Eliminar definitivamente**:

* soft delete
* delete lógico
  👉 Todo pasa por **estado CANCELLED**

---

## 2️⃣ Estados y Reglas (ALINEADOS A OPERACIÓN)

### Estados oficiales (APROBADOS)

* `OPEN`
* `RESOLVED`
* `CLOSED`
* `CANCELLED`

📌 **No existen otros estados.**

---

### Reglas clave

* CANCELLED ≠ eliminado
* Un ticket cancelado:

  * desaparece del frontend operativo
  * permanece **completo en historial**
* El semáforo:

  * NO es estado
  * es una **regla operativa** basada en:

    * tiempo abierto
    * servicio
    * impacto
    * SLA futuro

---

## 3️⃣ Historial, Métricas y Auditoría (BASE DE v3.0.0)

### Historial (OBLIGATORIO)

Registrar:

* Creación
* Cada cambio de estado
* Solicitud de cancelación
* Resolución
* Cierre
* Actor (usuario / sistema)
* Timestamp exacto

📌 Aunque el frontend aún no lo muestre todo, **la DB sí lo guarda**.

---

### KPIs requeridos (definidos desde DB)

* Tiempo total abierto
* Tiempo en cada estado
* Tiempo entre transiciones
* Tickets por:

  * cliente
  * servicio
  * periodo
  * estado

📌 Las métricas se **calculan**, no se improvisan en frontend.

---

### Auditoría (pensada desde hoy)

* Exportable
* Por cliente
* Por periodo
* Con historial completo del ticket

📌 v2.0.0 prepara la base
📌 v3.0.0 agrega automatización y reportes

---

## 4️⃣ Backend — Endurecimiento y Contratos

### Seguridad

* Validaciones estrictas
* Roles claros
* Backend decide todo
* Frontend **no confía en sí mismo**

---

### Contratos API (CIERRE)

* Endpoints definitivos
* DTOs claros
* Respuestas estables
* Versionado implícito (no romper)

📌 Lo que quede aquí:

> **Javier solo puede consumirlo, no reinterpretarlo**

---

## 5️⃣ Decisiones Estratégicas de Infraestructura (DOCUMENTADAS)

Aunque no se migra aún, **deben quedar reflejadas**:

* Backend y DB diseñados para:

  * Ubuntu Server
  * PostgreSQL local
* Pensado para convivir con LibreNMS
* Sin dependencias SaaS obligatorias
* Costos = operación local

---

## ❌ NO hacer (REFORZADO)

* ❌ No agregar features
* ❌ No tocar frontend
* ❌ No cambiar alcance
* ❌ No “parches rápidos”
* ❌ No decisiones implícitas
* ❌ No avanzar sin documentar

---

## ✅ ENTREGABLES OBLIGATORIOS AL FINAL DE SEMANA 1

Al **domingo 11 de enero**, deben existir y estar cerrados:

1. `03_Modelo_Datos_Definitivo.md` ✅
2. `04_Estados_y_Reglas.md` ✅
3. `05_Historial_Metricas_Auditoria.md` ✅
4. Contratos API definidos (documentados)
5. Backend conceptualmente **congelado**

📌 **Si algo no entra aquí, no entra en v2.0.0.**

---

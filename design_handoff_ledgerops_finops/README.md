# Handoff: LedgerOps — Consola FinOps AWS

## Overview

LedgerOps es una consola FinOps multi-cuenta para un equipo de finanzas cloud que gestiona
una organización de AWS con ~14 cuentas y un gasto de ~$500k/mes. Reúne en una sola interfaz
lo que hoy está repartido entre Cost Explorer, CloudTrail, Trusted Advisor, Budgets,
Compute Optimizer y CloudWatch, y añade una vista de "top consumidores" con umbrales de
utilización e histórico de 90 días para decidir si un recurso se baja, se sube o se mantiene.

Reserva además un hueco de producto para el **FinOps Agent de AWS** (hoy en preview): un
panel lateral, no conectado, que documenta qué contexto recibirá y qué preguntas responderá.

Idioma de la interfaz: **español, con términos técnicos en inglés** (eventName, Savings Plans,
rightsizing, Trusted Advisor, budget…). Densidad: equilibrada.

## About the Design Files

Los archivos `.dc.html` de este bundle son **referencias de diseño creadas en HTML** —
prototipos que muestran el aspecto y el comportamiento previstos, **no código de producción
para copiar tal cual**. Su lógica vive en una clase JS con datos ficticios embebidos; no hay
llamadas reales a AWS.

La tarea es **recrear estos diseños en el entorno del codebase destino** (React, Vue, Svelte,
lo que ya exista) usando sus patrones, su librería de componentes y su capa de datos. Si aún
no hay codebase, elige el framework más apropiado e implementa allí. Toma de los archivos:
la estructura de pantallas, la jerarquía visual, los valores exactos de color/tipografía/espaciado,
las reglas de negocio (umbrales, veredictos) y los textos.

## Fidelity

**Alta fidelidad (hifi).** Colores, tipografía, espaciado, estados e interacciones son
definitivos. Recrear la UI de forma fiel al píxel usando las librerías y patrones del codebase.
Las únicas partes deliberadamente "de mentira" son los datos (mock) y el FinOps Agent
(inerte por diseño, hasta que AWS libere la API).

Archivo de referencia principal: **`FinOps Console v6.dc.html`**. Las versiones anteriores se
incluyen solo como historial de decisiones; no implementarlas.

---

## Arquitectura de la aplicación

Shell de aplicación de una sola página, altura fija de viewport, sin scroll de documento:

```
┌─────────────┬──────────────────────────────────────────────┐
│  sidebar    │  header (fijo)                               │
│  236px      ├──────────────────────────────────────────────┤
│  ↕ 64px     │  content (única zona con scroll)             │
│  colapsable │                                              │
└─────────────┴──────────────────────────────────────────────┘
```

- Root: `display:flex; height:100vh; min-height:640px; overflow:hidden`.
- Sidebar: `flex:none`, ancho `236px` expandido / `64px` colapsado, `transition: width .16s ease`.
- Main: `flex:1; min-width:0; display:flex; flex-direction:column; overflow:hidden`.
- Content: `flex:1; overflow:auto; padding:20px 26px 40px`.
- Overlays a nivel de root, con `position:fixed`: paleta de comandos (z 60), modal (z 50), panel del agente (z 40).

### Navegación

Siete destinos. Seis pantallas + el panel del agente (que es un drawer, no una pantalla):

| Icono | Destino | Estado |
|---|---|---|
| Cuadrícula 2×2 | Dashboard | `screen: 'dashboard'` |
| Barras ascendentes | Cost Explorer | `screen: 'cost'` |
| Líneas con viñetas | CloudTrail | `screen: 'trail'` |
| Escudo con check | Trusted Advisor | `screen: 'advisor'` |
| Rayo | Optimización | `screen: 'optimize'` |
| Dos racks apilados | Top recursos | `screen: 'resources'` |
| Campana (+ badge "3") | Alertas | `screen: 'alerts'` |
| Destellos | FinOps Agent | `agentOpen: true` (drawer) |

Iconos: **Phosphor**, trazo 1.6–1.7, 17×17 en el sidebar, 15–16 en el header. En el prototipo
están inlineados como SVG; en producción usar el paquete Phosphor del codebase.

Ítem de nav (botón, no enlace — es una SPA sin rutas en el prototipo; **en producción usar rutas reales**):

```
display:flex; align-items:center; gap:10px; width:100%; text-align:left;
font-size:13.5px; padding:9px 14px (colapsado: 9px 12px);
border:0; border-left:2px solid <bar>; border-radius:0 8px 8px 0;
background:<bg>; color:<fg>; position:relative; cursor:pointer
:hover  background: var(--s-fill) al 5.5%
```

| Estado | `bar` | `bg` | `fg` |
|---|---|---|---|
| Activo | `--s-acc` | `--s-acc-t` | `--s-acc-strong` |
| Inactivo | `transparent` | `transparent` | `--s-t1` |

**Sidebar colapsable.** Botón "Colapsar" al fondo del sidebar (chevron izquierdo; rota 180°
al colapsar). En estado colapsado se ocultan: marca, etiquetas de sección ("Análisis",
"Asistente"), etiquetas de los ítems, badge "Preview" y tarjeta de organización. El badge "3"
de Alertas se sustituye por un punto de 6px `--s-bad` en `top:6px; right:9px`. **Todo botón de
icono lleva `title` y `aria-label`** con su etiqueta completa.

### Header

Altura auto, `padding:18px 26px 14px`, `box-shadow:0 1px 0 var(--s-line)`. De izquierda a derecha:

1. Título de pantalla (`h3`, 23px) + subtítulo (12.5px, `--s-t2`) — ambos cambian por pantalla.
2. Espaciador `flex:1`.
3. **Disparador de la paleta** (250px): icono de lupa, "Buscar o ir a…", tecla `⌘K` en un chip
   con borde. Es un botón, no un input.
4. Selector de rango de fechas (estático): "1 – 31 Ago 2026".
5. **Toggle de tema**: icono sol en oscuro, luna en claro.
6. Campana con punto rojo.
7. Avatar 32px `--s-acc-fill` + nombre "Marta Cordero" / "FinOps Lead".

### Títulos por pantalla

| Pantalla | Título | Subtítulo |
|---|---|---|
| dashboard | Dashboard | Estado del gasto, compromisos y mayores consumidores |
| cost | Cost Explorer | Desglose de gasto por servicio, cuenta, región y tag |
| trail | CloudTrail | Eventos de API con foco en los que mueven el coste |
| advisor | Trusted Advisor | Checks por categoría en las 14 cuentas |
| optimize | Optimización | Recomendaciones de ahorro y cobertura de compromisos |
| resources | Top recursos | Qué recursos concretos consumen el gasto, servicio por servicio |
| alerts | Alertas y anomalías | Detección de anomalías de coste y estado de budgets |

---

## Screens / Views

### 1. Dashboard

**Propósito.** Responder en cinco segundos: ¿vamos bien de dinero este mes, y si no, por qué?
Deliberadamente ligero — cinco bloques, no ocho. Todo lo que no sea "estado + causa + siguiente
paso" vive en las pantallas especializadas.

**Layout.** `display:flex; flex-direction:column; gap:14px; max-width:1560px`.

1. **Barra de estado.** Fila de una línea, `border-radius:10px`, `padding:14px 18px`, fondo
   `--s-card`. Punto de 7px `--s-warn` con `animation: pulseDot 2.4s ease-in-out infinite`
   (opacidad 1 → .25 → 1). Titular en `--s-warn` 14.5px: "Vas a superar el budget en $12.4k";
   continuación en `--s-t2` 13px: "— forecast $512.4k sobre $500k, con 2 anomalías activas que
   explican $9.1k/día." A la derecha, `.btn-ghost` "Ver anomalías →" que navega a Alertas.
2. **Cuatro KPIs.** `grid-template-columns: repeat(4, minmax(0,1fr)); gap:14px`. Cada tarjeta:
   `radius:10px; padding:18px 20px`, label 12.5px `--s-t2`, cifra **30px / weight 500 /
   letter-spacing -0.02em / tabular-nums**, pie 11.5px `--s-t3`.

   | Label | Valor | Pie | Color de la cifra |
   |---|---|---|---|
   | Coste amortizado MTD | $487,320 | +4.2% vs. julio · $19.6k más | `--s-t` |
   | Forecast fin de mes | $512,400 | 102% del budget de $500k | `--s-warn` |
   | Ahorro identificado | $63,480 | 18 recomendaciones abiertas | `--s-ok` |
   | Anomalías activas | 3 | 2 críticas · $9,140/día | `--s-bad` |

3. **Tendencia + Compromisos.** `grid-template-columns: minmax(0,1.7fr) minmax(0,1fr)`.
   - *Tendencia de gasto*: área SVG `viewBox="0 0 920 220"`, 12 meses. Relleno con gradiente
     vertical del acento (0.28 → 0). Línea 2px `--s-acc`. Cuatro líneas de rejilla horizontales
     `--s-line`. Línea de budget punteada `--s-warn` (`stroke-dasharray:5 5`) en $500k. Punto
     relleno solo en el último mes (r 4.5, relleno `--s-bg`, borde 2px acento). Etiquetas de mes
     debajo, 11px `--s-t3`, repartidas con `justify-content:space-between`.
   - *Compromisos*: cuatro barras (nombre + porcentaje + barra de 5px), y al pie, empujado con
     `margin-top:auto`, "Ahorro pendiente · $63,480/mes" en `--s-ok` 17px.
4. **Top consumidores** (5 filas). Misma tabla que "Top recursos" pero recortada: sin columna Δ
   y con el sparkline dentro de la celda de utilización. Encima, los seis chips de servicio y
   "Ver todo →".
5. **Franja del FinOps Agent.** Fondo `--s-card` con anillo `0 0 0 1px --s-acc-b`, icono de
   destellos en cuadrado 32px con borde de acento, chip "AWS Preview", y `.btn-secondary`
   "Abrir panel".

### 2. Cost Explorer

**Propósito.** Desglosar el gasto por cuatro dimensiones y bajar al detalle de cada fila.

- **Controles.** Segmentado de agrupación: Servicio / Cuenta / Región / Tag: Team. A la derecha,
  segmentado de periodo (7d / 30d / **12m**) y `.btn-secondary` "Exportar CSV".
- **Gráfico apilado.** `viewBox="0 0 920 250"`, 12 barras, cinco series (EC2 38.5%, S3 12.8%,
  RDS 11.3%, EKS 8.6%, Otros 28.8%) en `--s-acc`, `--s-acc2`, `--s-acc3`, `--s-acc-soft`,
  `--s-ring`. Ancho de barra 52% del paso, centrada. Leyenda de cuadraditos 9px arriba a la derecha.
- **Tabla de desglose.** Columnas: dimensión · Gasto MTD · Δ mes anterior · Share (barra + %) ·
  Forecast · Cobertura SP/RI. Cobertura <55% en `--s-warn`, si no `--s-ok`. Δ positivo en
  `--s-warn`, negativo en `--s-ok`. Fila clicable → modal.

Datos de las cuatro agrupaciones: ver `## Datos mock`.

### 3. CloudTrail

**Propósito.** Auditar la actividad de API con el foco puesto en lo que mueve dinero.

- **Cuatro KPIs compactos**: Eventos 24 h **128,443** · AccessDenied **312** (`--s-bad`) ·
  Identidades activas **47** · Eventos con impacto en coste **26** (`--s-acc-soft`, tarjeta con
  anillo de acento).
- **Filtros.** Campo de búsqueda monoespaciado (filtra por eventName, identidad, cuenta, región,
  IP) + tres chips conmutables: "Solo escrituras", "Con error", "Impacto en coste". Chip activo:
  borde `--s-acc`, fondo `--s-acc-t`, texto `--s-acc-strong`. Contador "N eventos" al lado.
- **Tabla monoespaciada** (12.5px): Hora UTC · eventName + eventSource · Identidad · Cuenta ·
  Región · IP origen · Resultado (tag).
  Colores de resultado: Success `--s-ok`, AccessDenied `--s-warn`, Failure `--s-bad`.
- **Estado vacío.** Cuando ningún evento pasa los filtros: icono de lupa tachada, "Ningún evento
  coincide con los filtros", explicación y `.btn-primary` **"Limpiar filtros"** que resetea
  `query`, `fWrites`, `fErrors`, `fCost`.
- **Modal de evento.** Kicker "CloudTrail · evento", título = eventName. Tres stats: Identidad,
  Resultado, Impacto en coste (Sí/No). Cuerpo que explica si el evento crea recursos facturables.
  Después, el **registro JSON de CloudTrail** formateado en un `<pre>` con fondo `--s-bg`,
  `max-height:260px`, scroll, 11.5px monoespaciado. Acción: "Correlacionar con coste".

### 4. Trusted Advisor

- **Cinco tarjetas de categoría** (Cost Optimization, Performance, Security, Fault Tolerance,
  Service Limits), seleccionables. Cada una: nombre, punto de severidad, total de hallazgos
  (error + warn) en 25px, y desglose "N error · N warn · N ok". La seleccionada usa fondo
  `--s-surf2` y anillo `--s-acc-b`.
- **Tabla de checks** de la categoría activa: punto de severidad · nombre + descripción ·
  cuentas afectadas · recursos · ahorro estimado (`--s-ok`) · chevron.
- **Modal de check**: severidad ("Acción requerida" / "Investigar" / "Correcto"), recursos
  afectados, ahorro; explicación de la cadencia de evaluación (24 h, 14 cuentas) y lista de
  recursos detectados. Acción: "Crear change request".

### 5. Optimización

- **Tarjeta de ahorro anualizado**: $761,760 en 34px `--s-ok`, "$63,480 al mes · 18
  recomendaciones abiertas", regla `.hr`, y cuatro fuentes de ahorro con mini-barras.
- **Cobertura de compromisos**: tres columnas (Compute SP 61% objetivo 85%; RDS RI 78% objetivo
  75%; ElastiCache RI 44% objetivo 70%). Color por distancia al objetivo.
- **Rejilla de seis recomendaciones** (3 columnas). Cada tarjeta: fuente en mayúsculas
  `--s-acc-soft` 10px, tag de esfuerzo, título 15px, descripción 12.5px, ahorro 20px `--s-ok`
  y cuenta afectada. `:hover` → anillo de acento. Clic → modal con plan de ejecución
  (lotes del 20%, 48 h de observación de CloudWatch, rollback si p95 sube >10%).

### 6. Top recursos ⭐

**Propósito.** El corazón operativo: qué recursos concretos se comen el presupuesto y si están
bien dimensionados.

- **Selector de servicio.** Seis chips: EC2 (1,284) · RDS (96) · S3 (412) · EKS (22) ·
  Lambda (1,840) · EBS (3,120). El número es el recuento de recursos del servicio.
- **Selector de ventana de evaluación.** Segmentado **14 d / 30 d / 90 d**, precedido de la
  etiqueta "Ventana de evaluación". Cambiar la ventana recalcula la utilización mostrada, el
  color de la barra, el badge de estado y la rama del veredicto del modal. **No** cambia la
  serie histórica ni sus estadísticas.
- **Cuatro KPIs del servicio**: gasto MTD + share, recursos analizados + cuentas, concentración
  del top 10, y desperdicio detectado (tarjeta con anillo `--s-warn`).
- **Tabla.** Recurso (id monoespaciado + nombre) · Tipo (tag outline monoespaciado) ·
  Cuenta · región · Utilización a la ventana activa (barra + % + **sparkline de 90 d**, 60×18) ·
  90 d · Coste/mes · Δ · Estado (badge + acción recomendada debajo en 11px `--s-t3`).
- **Leyenda de umbrales** en la cabecera de la tabla, citando la ventana activa.

**Reglas de estado — implementar exactamente así.**

Para servicios de cómputo (EC2, RDS, EKS), donde la métrica es utilización real:

| Condición | Badge | Color |
|---|---|---|
| `u >= 60` | **Revisión** | `--s-warn` |
| `20 <= u < 60` | **Óptimo** | `--s-ok` |
| `u < 20` | **Infrautilizado** | `--s-bad` |

Para servicios donde la métrica no es utilización de capacidad (S3 = accesos, Lambda = memoria
usada/asignada, EBS = IOPS usadas/provisionadas), aplicar los umbrales sería una falacia
—un bucket de archivo con 1% de accesos no está "mal"—, así que el estado se deriva de si hay
oportunidad de ahorro: `saving > 0` → **Con oportunidad** (`--s-warn`), si no → **Óptimo**
(`--s-ok`). La barra de utilización usa el color del badge en ambos casos.

### 7. Alertas y anomalías

- **Tres tarjetas de anomalía** en fila: icono en cuadrado 34px, título + tag de severidad,
  metadatos, "Causa probable: …", **sparkline de 120×44** con la curva del gasto, impacto en
  20px del color de severidad, y `.btn-primary` "Investigar". Las críticas llevan anillo
  `--s-bad` al 35%.
- **Budgets**: rejilla de 2 columnas con cuatro budgets (nombre, gastado/límite, barra, nota).
  El excedido usa `--s-bad` y la nota "Excedido en $11.4k".
- **Modal de anomalía**: severidad, impacto, evidencia CloudTrail; cuerpo con la causa y el
  método de detección (banda esperada de 60 días por servicio/cuenta/región); lista de acciones
  sugeridas con su ahorro diario. **La acción primaria "Ver evidencia en CloudTrail" navega a
  CloudTrail con el filtro "Impacto en coste" ya activo** y cierra el modal.

### 8. FinOps Agent (drawer)

Panel derecho de 390px, `position:fixed`, borde izquierdo de acento y sombra
`-24px 0 60px rgba(0,0,0,0.5)`. Contenido:

- Cabecera: icono, "FinOps Agent", "No conectado · AWS preview", botón de cierre.
- Aviso en caja de acento: el agente está en preview limitada y este panel queda reservado.
- "Preguntas que podrá responder": cuatro ejemplos en tarjetas al 75% de opacidad.
- "Contexto que recibirá": tags de Cost Explorer, CloudTrail, Trusted Advisor, Budgets,
  Compute Optimizer, CloudWatch, Tags de asignación.
- Pie: input **deshabilitado** + botón "Enviar" deshabilitado (opacidad .5) y
  `.btn-secondary.btn-block` "Solicitar acceso a la preview".

**Importante:** el composer está inerte a propósito. No cablearlo a ningún LLM. Cuando AWS
libere el agente, este panel es el punto de integración.

### 9. Paleta de comandos (⌘K)

Overlay a `z-index:60`, alineado arriba (`padding-top:96px`), caja de 620px con
`animation: popIn .14s ease`. Input con autofocus. Resultados agrupados en tres secciones:

- **Pantallas** — siempre visibles, filtradas por texto. Badge = inicial.
- **Recursos** — solo con query; máximo 6; busca por id, nombre, tipo y cuenta; navega a
  Top recursos con el servicio correcto seleccionado.
- **Eventos CloudTrail** — solo con query; máximo 5; navega a CloudTrail con el eventName
  ya puesto en el filtro.

Teclado: `⌘K`/`Ctrl+K` abre desde cualquier pantalla, `↑`/`↓` mueven la selección, `↵` ejecuta,
`Esc` cierra (y también cierra el modal). El ítem seleccionado se resalta con `--s-acc-t`.
Pie con las ayudas de teclado. Estado vacío: "Sin resultados para esa búsqueda".

---

## El histórico de 90 días — especificación funcional

Es la pieza con más lógica del producto y la que más importa acertar.

### Generación de la serie (mock — sustituir por CloudWatch real)

En producción esto viene de `GetMetricStatistics` / Metric Insights. El prototipo la sintetiza
de forma **determinista a partir del id del recurso**, para que la misma fila muestre siempre
la misma curva:

1. Semilla: hash del id del recurso.
2. 90 puntos (uno por día) sobre el baseline de utilización de 14 d del recurso.
3. Componentes: estacionalidad semanal (±16% del baseline), caída de fin de semana (−22%),
   ruido (±15%), picos esporádicos (3.5% de probabilidad, +55%), y una deriva lineal derivada
   del Δ mensual de la fila (una fila con +142% dibuja pendiente creciente).
4. Se comprime la cola alta para que el máximo quede en `min(97, avg*1.35)`, y se fuerza que
   **el pico sea estrictamente mayor que el p95** (si no, ambos redondean al mismo número y el
   panel de estadísticas se contradice).
5. Estadísticas derivadas: media 90 d, media de los últimos 30 d, p95, pico, y tendencia en
   puntos porcentuales (media de los últimos 30 d − media de los primeros 30 d).

**Invariante crítico:** la serie se genera siempre desde el **baseline fijo de 14 d**, nunca
desde la utilización de la ventana seleccionada. Cambiar de 14 d a 90 d debe cambiar el badge,
no la curva. Media, p95, pico y sparkline son idénticos en las tres ventanas.

### Presentación

Gráfico `viewBox="0 0 640 150"`, área rellena con acento al 18%, línea 1.6px, y **dos líneas de
umbral punteadas**: 60% en `--s-warn` y 20% en `--s-bad`. Encima, cuatro estadísticas alineadas
a la derecha: Media 90 d (coloreada según el estado), p95, Pico, Tendencia en pp (creciente
>2pp en `--s-warn`, decreciente <−2pp en `--s-ok`). Debajo, cuatro etiquetas de mes.

### Veredicto

Caja al pie del gráfico con punto de color, titular y explicación. **Ramifica por la utilización
de la ventana activa** (el mismo número que el badge, nunca por la media de 90 d — si no, badge
y veredicto se contradicen) y por el **tipo de acción** registrada en el recurso:

```
actionType(action):
  sin acción / "Sin acción"                              → none
  Reducir|Consolidar|nodos|Eliminar|Apagar|Snapshot|
  Deshabilitar|Scheduler|autoscaler|parada               → reduce
  Renovar|Savings Plan|cobertura|Spot                    → commit
  cualquier otra                                         → migrate
```

Para servicios de cómputo:

| Utilización | Acción | Veredicto |
|---|---|---|
| ≥60 | reduce | **Revisar dimensionamiento del conjunto** — la instancia está bien dimensionada; el ahorro está en el número de recursos, no en su tamaño |
| ≥60 | migrate/commit | **Uso alto: mantener tamaño** — no tocar capacidad; el ahorro viene de la migración |
| ≥60 | none | **Subir un escalón de tamaño** — poco margen para picos; cuesta ~90% más al mes |
| <20 | none | **Candidato a apagado** — validar con el equipo propietario |
| <20 | cualquiera | **Bajar de tamaño o apagar** — sobredimensionado de forma sostenida |
| 20–60 | cualquiera | **Mantener tamaño, aplicar la acción** — el tamaño es correcto |
| 20–60 | none | **Mantener tamaño** — buen candidato a Savings Plans o RI |

Para el resto de servicios: `reduce` → **Retirar capacidad ociosa**; `migrate` → **Cambiar de
configuración, no de tamaño**; `commit` → **Mantener y asegurar el compromiso**; `none` →
**Sin acción: configuración correcta**.

**Nunca proponer subir tamaño cuando la fila tiene un ahorro asociado.** Es la contradicción
más fácil de introducir y la más costosa: un recurso con "Reducir node group a 12 nodos"
y −$4,200/mes no puede llevar un veredicto que diga "sube un escalón".

**Cita de la ventana.** El cuerpo del veredicto cita "(14 d; media 90 d X%, p95 Y%)". Cuando la
ventana activa es 90 d, cita solo "(90 d; p95 Y%)" — no repetir el mismo dato dos veces. Si la
ventana activa y la media de 90 d divergen ≥3 pp, añadir: "Ventanas distintas: 14 d al X%
frente a 90 d al Y%, así que es un pico reciente, no una tendencia" (o "una caída reciente
sobre una base más alta"). Con ventana 90 d, omitir la nota por completo.

---

## Interactions & Behavior

| Interacción | Comportamiento |
|---|---|
| Clic en ítem de nav | Cambia `screen`; el scroll del contenido vuelve arriba |
| Colapsar sidebar | `236px ↔ 64px`, `transition: width .16s ease` |
| Toggle de tema | Cambia `data-t` en el root; todos los tokens se reevalúan de golpe |
| ⌘K / Ctrl+K | Abre la paleta desde cualquier pantalla (listener global) |
| Esc | Cierra paleta y modal |
| Hover en fila de tabla | Fondo `--s-acc-t`; aparece la afordancia "→" |
| Clic / Enter / Espacio en fila | Abre el modal de detalle. Filas con `tabindex="0"` |
| Chip de filtro CloudTrail | Conmuta; los tres filtros son acumulativos con la búsqueda |
| Ventana de evaluación | Recalcula badges y veredictos, no la serie |
| Modal: clic en backdrop | Cierra. Clic dentro: `stopPropagation` |
| Modal de anomalía: acción | Navega a CloudTrail con `fCost: true` |
| Scroll de tabla | Cabeceras `position: sticky; top: -1px` con fondo `--s-card` |

Animaciones: solo dos, ambas discretas — `pulseDot` (2.4s, opacidad) y `popIn` (.14s, entrada
de la paleta). Nada más se mueve.

Accesibilidad: `:focus-visible { outline: 2px solid var(--s-acc); outline-offset: 2px; }` global,
nunca el anillo azul del navegador. Filas de tabla enfocables y activables por teclado.
Botones de icono con `title` + `aria-label`.

## State Management

```
screen        'dashboard' | 'cost' | 'trail' | 'advisor' | 'optimize' | 'resources' | 'alerts'
theme         'dark' | 'light'          — persistir en localStorage en producción
side          boolean                    — sidebar expandido
modal         objeto de modal | null
agentOpen     boolean
palette       boolean                    — paleta de comandos abierta
pq            string                     — query de la paleta
pi            number                     — índice seleccionado en la paleta
query         string                     — búsqueda de CloudTrail
fWrites       boolean                    — filtro "solo escrituras"
fErrors       boolean                    — filtro "con error"
fCost         boolean                    — filtro "impacto en coste"
group         'service' | 'account' | 'region' | 'tag'   — agrupación de Cost Explorer
taCat         'cost' | 'perf' | 'sec' | 'ft' | 'lim'     — categoría de Trusted Advisor
resSvc        'ec2' | 'rds' | 's3' | 'eks' | 'lambda' | 'ebs'  — servicio en Top recursos
cudosPillar   igual que resSvc                           — servicio en la tabla del dashboard
win           14 | 30 | 90               — ventana de evaluación
```

En producción: `theme` y `side` a localStorage; `screen` y los filtros a la URL para que las
vistas sean compartibles.

### Fuentes de datos reales

| Vista | API |
|---|---|
| KPIs, tendencia, desglose | Cost Explorer `GetCostAndUsage`, `GetCostForecast`; CUR en Athena para el detalle |
| Cobertura / utilización | `GetSavingsPlansCoverage`, `GetSavingsPlansUtilization`, `GetReservationUtilization` |
| Anomalías | `GetAnomalies` (Cost Anomaly Detection) |
| Budgets | `DescribeBudgets` |
| CloudTrail | `LookupEvents`, o Athena sobre el trail de la organización para volumen real |
| Trusted Advisor | Support API `DescribeTrustedAdvisorChecks` / `...CheckResult` (requiere Business/Enterprise) |
| Recomendaciones | Compute Optimizer `GetEC2InstanceRecommendations`, `GetEBSVolumeRecommendations`, `GetLambdaFunctionRecommendations`; Cost Optimization Hub |
| Utilización e histórico | CloudWatch `GetMetricData` (CPUUtilization, memoria vía agente, etc.) |

Multi-cuenta vía AWS Organizations desde la cuenta payer; para CloudTrail y CUR, Athena escala
mejor que las APIs directas.

## Design Tokens

Todo el color pasa por tokens declarados en `.app` y sobrescritos en `.app[data-t="light"]`.
Los fondos son **neutros puros** (negro/blanco), sin tinte; el color vive solo en el acento y
en la semántica.

| Token | Oscuro | Claro | Uso |
|---|---|---|---|
| `--s-bg` | `#0b0b0c` | `#ffffff` | Fondo de la app |
| `--s-card` | `#141416` | `#ffffff` | Tarjetas y tablas |
| `--s-side` | `#0f0f11` | `#fafafa` | Sidebar y drawer |
| `--s-surf2` | `#1c1b22` | `#f4f4f5` | Superficie seleccionada |
| `--s-t` | `#f2f2f3` | `#161617` | Texto principal |
| `--s-t1` | `rgba(242,242,243,.80)` | `rgba(22,22,23,.82)` | Texto secundario |
| `--s-t2` | `rgba(242,242,243,.56)` | `rgba(22,22,23,.58)` | Texto de apoyo |
| `--s-t3` | `rgba(242,242,243,.42)` | `rgba(22,22,23,.44)` | Texto terciario |
| `--s-line` | `rgba(242,242,243,.09)` | `rgba(22,22,23,.13)` | Bordes de 1px |
| `--s-fill` | `rgba(242,242,243,.14)` | `rgba(22,22,23,.08)` | Pistas de barras |
| `--s-ring` | `#3a3a3e` | `rgba(22,22,23,.20)` | Borde de modal, serie "Otros" |
| `--s-acc` | `#9184d9` | `#6455c0` | Acento |
| `--s-acc2` | `#7a6dc4` | `#7d6fce` | Serie 2 |
| `--s-acc3` | `#5f54a3` | `#9a90dd` | Serie 3 |
| `--s-acc-soft` | `#b5abfc` | `#54479f` | Kickers, etiquetas de acento |
| `--s-acc-strong` | `#d2cefd` | `#3f3480` | Texto de nav activa |
| `--s-acc-fill` | `#332c54` | `#ddd7f7` | Avatar |
| `--s-acc-t` | `rgba(145,132,217,.13)` | `rgba(100,85,192,.09)` | Tinte de hover/activo |
| `--s-acc-b` | `rgba(145,132,217,.42)` | `rgba(100,85,192,.34)` | Anillo de acento |
| `--s-ok` | `#84d9b3` | `#1f8a5f` | Correcto / ahorro |
| `--s-warn` | `#d9b47f` | `#96631a` | Atención |
| `--s-bad` | `#d98a8a` | `#b04141` | Crítico |
| `--s-ok-t` / `--s-warn-t` / `--s-bad-t` | tintes al 15/16/16% | tintes al 12/13/12% | Fondos de badge |

Además, los tokens del design system (`--color-text`, `--color-accent`, `--color-surface`,
`--color-divider`, y las rampas `--color-accent-800/100`, `--color-neutral-800/100`) se
remapean dentro de `.app` a los tokens anteriores, de forma que los componentes de la
librería (`.btn`, `.tag`, `.table`, `.seg`, `.input`) cambian de tema con el resto.

**Tipografía.** Inter en todo. Escala usada: 30px/500 (cifra de KPI) · 25px/500 (cifra de
tarjeta TA) · 23px/400 (título de pantalla) · 20px/500 (título de modal, impacto) ·
17px/500 · 16px/500 (título de sección) · 15px/500 · 14.5px · 13.5px (nav, celda) ·
13px · 12.5px (cuerpo denso) · 11.5px · 11px (pies) · 10px con `letter-spacing:.09–.1em` y
`text-transform:uppercase` (kickers). Nunca por encima de weight 500. Todas las cifras
tabulares llevan `font-variant-numeric: tabular-nums`. Monoespaciado
(`ui-monospace, SFMono-Regular, Menlo`) para ids de recurso, eventNames, IPs y el JSON.

**Espaciado.** Gaps de 12/14/16px entre tarjetas; padding de tarjeta 13–20px; padding de
contenido 20px 26px 40px; gap de 8–11px dentro de listas.

**Radios.** 10px tarjetas del dashboard · 8px tarjetas densas, botones, campos, badges ·
12px paleta de comandos · 14px modal · 5–6px chips pequeños · 50% puntos de estado.

**Elevación.** Sin sombras apiladas. Tarjetas: `box-shadow: 0 0 0 1px var(--s-line)` (un anillo,
no una sombra). Modal: `0 0 0 1px var(--s-ring), 0 24px 60px rgba(0,0,0,.65)`. Paleta:
`0 0 0 1px var(--s-acc-b), 0 26px 70px rgba(0,0,0,.6)`. Drawer: `-24px 0 60px rgba(0,0,0,.5)`.

## Assets

Ninguna imagen. Todos los iconos son SVG inline de trazo, estilo **Phosphor** (trazo 1.6–1.7,
`stroke-linecap:round`, `stroke-linejoin:round`). Todos los gráficos son SVG generados desde
datos, sin librería de charting. En producción, sustituir los SVG inline por el paquete de
iconos del codebase y considerar una librería de charts solo si necesitas tooltips e
interacción — las formas actuales son sencillas de reproducir a mano.

Fuente: Inter (peso 400 y 500). El design system la carga; en el codebase destino, usar la que
ya esté configurada si es equivalente.

## Files

| Archivo | Qué es |
|---|---|
| `FinOps Console v6.dc.html` | **Referencia canónica.** Implementar esta. |
| `FinOps Console v5.dc.html` | Paso previo: paleta ⌘K y estados vacíos, antes del rediseño del dashboard y del tema claro |
| `FinOps Console v4.dc.html` | Paso previo: ventana de evaluación conmutable |
| `FinOps Console v3 CUDOS.dc.html` | Paso previo: dashboard cargado estilo CUDOS (descartado por denso) |
| `FinOps Console v2 Orquidea.dc.html` | Exploración de paleta magenta/uva (no implementar) |
| `FinOps Console.dc.html` | Primera versión |
| `DATOS.md` | Los datos mock completos, listos para usar como fixtures |

Los `.dc.html` se abren directamente en un navegador. Su lógica está en la clase JS al final
del archivo; el marcado usa un motor de plantillas propio (`{{ }}`, `<sc-for>`, `<sc-if>`) —
léelo como estructura, no lo portes literalmente.

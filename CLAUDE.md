# CLAUDE.md

Guía del repo para Claude Code. LedgerOps es una consola FinOps multi-cuenta
sobre AWS: reúne Cost Explorer, CloudTrail, Trusted Advisor, Budgets, Compute
Optimizer y CloudWatch en una interfaz y cruza sus datos para decidir qué se
baja, qué se sube y qué se mantiene.

## Comandos

```bash
bun install            # instalar (workspaces de Bun)
bun run dev            # turbo run dev → Next en :3000
bun run build          # build de todo el monorepo
bun run check-types    # tsc --noEmit en cada paquete
bun run lint           # biome check .
bun run format         # biome check --write .
```

Para un solo paquete: `bun run --filter @finops/web build`.

## Estructura

```
apps/web/           Next.js 15 (App Router) — todo el dashboard
packages/ui/        componentes compartidos (shadcn/ui + Tremor) y tokens
packages/types/     modelo de dominio en Zod + puertos de las fuentes AWS
packages/config/    tsconfig, biome y preset de Tailwind compartidos
design_handoff_ledgerops_finops/   handoff de diseño (referencia, no código)
```

Dentro de `apps/web/src`:

```
app/                rutas: / (dashboard), /cost, /cloudtrail, /trusted-advisor,
                    /optimize, /resources, /alerts
components/shell/   sidebar, header, paleta ⌘K, drawer del agente
components/screens/ una pantalla por fichero, todas cliente
components/resources/  tabla de recursos y su modal (dashboard y Top recursos)
lib/finops/         formato, umbrales de utilización y veredicto
server/aws/         adaptadores Mock*Client + fixtures + contenedor dataSources
server/queries.ts   cruces servidor (inventario × series de CloudWatch)
```

## Puertos y adaptadores

`packages/types/src/ports` declara qué necesita la app de cada servicio AWS:
`CostExplorerClient`, `CloudTrailClient`, `TrustedAdvisorClient`,
`ComputeOptimizerClient`, `BudgetsClient`, `ResourceInventoryClient`,
`CloudWatchClient`.

`apps/web/src/server/aws/index.ts` es el **único** punto de composición.
Conectar AWS de verdad = cambiar ahí `Mock*Client` por el adaptador del SDK.

Reglas:

- Ninguna pantalla ni componente importa fixtures directamente; leen de
  `dataSources` o de `server/queries.ts`.
- Cada adaptador valida su respuesta con el esquema Zod del dominio. El
  contrato es el esquema, no la fuente.
- Los nombres del dominio anticipan el esquema de Prisma del día que haya DB:
  `CostRecord`, `Anomaly`, `Resource`, `TrailEvent`, `AdvisorCheck`,
  `Recommendation`, `Budget`, `CommitmentCoverage`, `UtilizationSeries`.

## Reglas de negocio que no se tocan

Están implementadas en `apps/web/src/lib/finops/` y son la parte del producto
más fácil de romper sin darse cuenta.

**Umbrales de estado** (`utilization.ts`). Para servicios de cómputo (EC2, RDS,
EKS), donde la métrica es utilización real:

| Utilización | Estado |
|---|---|
| ≥ 60 | Revisión (`--s-warn`) |
| 20 – 60 | Óptimo (`--s-ok`) |
| < 20 | Infrautilizado (`--s-bad`) |

Donde la métrica **no** es capacidad (accesos de S3, memoria de Lambda, IOPS de
EBS) aplicar esos umbrales sería una falacia: un bucket de archivo con 1% de
accesos no está mal. Ahí el estado sale del ahorro posible: `saving > 0` →
"Con oportunidad", si no "Óptimo".

**Invariante de la serie de 90 días** (`server/aws/mock-cloudwatch.ts`). La
serie se genera de forma determinista desde el id del recurso y sobre su
**baseline fijo de 14 d**, nunca desde la ventana de evaluación activa. Cambiar
de 14 d a 90 d cambia el badge y el veredicto; la curva, la media, el p95 y el
pico son idénticos en las tres ventanas.

**Veredicto** (`verdict.ts`). Ramifica por la utilización de la ventana activa
—el mismo número que muestra el badge, nunca la media de 90 d— y por el tipo de
acción registrada (`none` / `reduce` / `commit` / `migrate`). **Nunca propone
subir de tamaño cuando la fila tiene un ahorro asociado**: un recurso con
"Reducir node group a 12 nodos" y −$4,200/mes no puede llevar un veredicto que
diga "sube un escalón".

## Estado de la aplicación

- URL (nuqs): `group`, `cat`, `svc`, `pillar`, `win`, `q`, `writes`, `errors`,
  `cost`. Las vistas son compartibles y el back del navegador funciona.
- localStorage: tema (`ledgerops:theme`) y sidebar (`ledgerops:sidebar`).
- Las páginas que leen la URL son `force-dynamic`, para que el HTML llegue ya
  con los filtros aplicados.

## Diseño

Fidelidad alta sobre `design_handoff_ledgerops_finops/FinOps Console v6.dc.html`
(las versiones anteriores son solo historial; no implementarlas).

- Todo el color pasa por los tokens `--s-*` de
  `packages/ui/src/styles/tokens.css`. Nada de colores literales en componentes.
  El tema se cambia con `data-t` en el root y todos los tokens se reevalúan.
- Las clases del design system (`.btn`, `.tag`, `.table`, `.seg`, `.input`,
  `.hr`) viven en `packages/ui/src/styles/components.css`. El layout y el
  espaciado se hacen con Tailwind.
- Elevación: un anillo de 1px (`shadow-ring`), no sombras apiladas.
- Los gráficos son SVG generados desde datos, sin librería de charting: el
  handoff lo pide explícitamente y así heredan los tokens de tema. Tremor se usa
  para las barras de medida (`MeterBar`).
- Solo dos animaciones: `pulseDot` y `popIn`. Nada más se mueve.
- Cifras con `tabular-nums`; monoespaciado para ids, eventNames, IPs y JSON.
- Accesibilidad: `:focus-visible` con anillo de acento, filas de tabla
  enfocables y activables por teclado, botones de icono con `title` y
  `aria-label`.

## Cosas que no hay que hacer

- **No cablear el FinOps Agent a ningún LLM.** El drawer es un hueco reservado
  para el agente de AWS: el composer está deshabilitado a propósito.
- No meter base de datos, CI/CD ni el servicio NestJS en esta fase.
- No copiar el marcado de los `.dc.html`: usan un motor de plantillas propio.
  Se leen como estructura y reglas de negocio, no como código.

# LedgerOps — Consola FinOps AWS

Consola FinOps multi-cuenta para una organización AWS de ~14 cuentas y
~$500k/mes. Reúne en una interfaz lo que hoy está repartido entre Cost Explorer,
CloudTrail, Trusted Advisor, Budgets, Compute Optimizer y CloudWatch, y añade
una vista de top consumidores con umbrales de utilización e histórico de 90 días
para decidir si un recurso se baja, se sube o se mantiene.

## Arrancar

```bash
bun install
bun run dev     # http://localhost:3000
```

## Pantallas

| Ruta | Qué responde |
|---|---|
| `/` | ¿vamos bien de dinero este mes, y si no, por qué? |
| `/cost` | desglose por servicio, cuenta, región y tag |
| `/cloudtrail` | actividad de API con foco en lo que mueve dinero |
| `/trusted-advisor` | checks por categoría en las 14 cuentas |
| `/optimize` | recomendaciones de ahorro y cobertura de compromisos |
| `/resources` | qué recursos concretos se comen el presupuesto |
| `/alerts` | anomalías de coste y estado de budgets |

Más el drawer del **FinOps Agent** de AWS: hueco de producto reservado, inerte
por diseño hasta que AWS libere la API.

Atajos: `⌘K` / `Ctrl+K` abre la paleta de comandos desde cualquier pantalla.

## Stack

Turborepo + Bun · TypeScript · Biome · Next.js 15 (App Router) · Tailwind ·
shadcn/ui + Tremor · nuqs · Zod.

```
apps/web/        Next.js — todo el dashboard
packages/ui/     componentes compartidos y tokens del design system
packages/types/  modelo de dominio (Zod) y puertos de las fuentes AWS
packages/config/ tsconfig, biome y preset de Tailwind compartidos
```

## Datos

No hay base de datos ni conexión real a AWS todavía. Cada fuente se consume a
través de un **puerto tipado** (`CostExplorerClient`, `CloudTrailClient`,
`TrustedAdvisorClient`, `ComputeOptimizerClient`, `BudgetsClient`,
`ResourceInventoryClient`, `CloudWatchClient`) con una implementación
`Mock*Client` que lee fixtures y las valida con Zod.

El único punto de composición es `apps/web/src/server/aws/index.ts`: el día que
se conecte AWS de verdad solo cambia la implementación, no el resto de la app.

Los fixtures cubren los estados de la UI, no solo el camino feliz: anomalías
críticas y media, recursos infrautilizados, óptimos y en revisión, budgets
excedidos y holgados, cobertura de Savings Plans del 12% al 96%.

Más detalle de arquitectura y reglas de negocio en [`CLAUDE.md`](./CLAUDE.md).

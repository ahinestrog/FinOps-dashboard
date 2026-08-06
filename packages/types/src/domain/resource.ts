import { z } from 'zod'
import { serviceKeySchema, usdSchema } from './primitives'

/**
 * Naturaleza de la métrica del servicio.
 *
 * - `compute`: la métrica es utilización real de capacidad (EC2, RDS, EKS) y
 *   los umbrales 20/60% aplican.
 * - `other`: la métrica no es capacidad (accesos S3, memoria Lambda, IOPS EBS);
 *   aplicar los umbrales sería una falacia, el estado sale del ahorro posible.
 */
export const metricKindSchema = z.enum(['compute', 'other'])
export type MetricKind = z.infer<typeof metricKindSchema>

/** Recurso concreto con su métrica de utilización y acción propuesta. */
export const resourceSchema = z.object({
  /** Id nativo de AWS: `i-…`, `vol-…`, nombre de bucket, clúster o función. */
  id: z.string(),
  service: serviceKeySchema,
  name: z.string(),
  /** Tipo de instancia, clase de almacenamiento, memoria configurada… */
  type: z.string(),
  account: z.string(),
  region: z.string(),
  /** Utilización de referencia a 14 d, en porcentaje. Baseline de la serie. */
  utilization: z.number().min(0).max(100),
  monthlyCost: usdSchema,
  /** Δ mensual tal cual se muestra: `+142%`, `-4.6%` o `—`. */
  deltaLabel: z.string(),
  /** Clasificación editorial del recurso (Óptimo, Migrable, Infrautilizado…). */
  classification: z.string(),
  explanation: z.string(),
  /** Acción propuesta; `Sin acción` cuando no hay nada que hacer. */
  action: z.string(),
  actionSaving: usdSchema,
})
export type Resource = z.infer<typeof resourceSchema>

/** KPIs del servicio seleccionado en Top recursos. */
export const serviceSummarySchema = z.object({
  spend: usdSchema,
  sharePct: z.number(),
  resourceCount: z.number().int(),
  resourceCountLabel: z.string(),
  accountsLabel: z.string(),
  topTenSpend: usdSchema,
  topTenSharePct: z.number(),
  waste: usdSchema,
  wasteCount: z.number().int(),
})
export type ServiceSummary = z.infer<typeof serviceSummarySchema>

/** Inventario de un servicio: metadatos de presentación + recursos. */
export const serviceInventorySchema = z.object({
  service: serviceKeySchema,
  name: z.string(),
  count: z.number().int(),
  kind: metricKindSchema,
  typeLabel: z.string(),
  metricLabel: z.string(),
  summary: serviceSummarySchema,
  resources: z.array(resourceSchema),
})
export type ServiceInventory = z.infer<typeof serviceInventorySchema>

/**
 * Serie de utilización diaria de 90 días y sus estadísticas derivadas.
 *
 * Invariante: se genera siempre desde el baseline fijo de 14 d del recurso,
 * nunca desde la ventana de evaluación activa. Cambiar de ventana cambia el
 * badge, no la curva.
 */
export const utilizationSeriesSchema = z.object({
  resourceId: z.string(),
  /** 90 puntos, uno por día, en porcentaje. */
  points: z.array(z.number()).length(90),
  mean90: z.number(),
  mean30: z.number(),
  p95: z.number(),
  peak: z.number(),
  /** Tendencia en puntos porcentuales: media últimos 30 d − media primeros 30 d. */
  trendPp: z.number(),
})
export type UtilizationSeries = z.infer<typeof utilizationSeriesSchema>

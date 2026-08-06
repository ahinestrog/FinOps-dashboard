import { z } from 'zod'
import { usdSchema } from './primitives'

export const anomalySeveritySchema = z.enum(['Crítica', 'Media'])
export type AnomalySeverity = z.infer<typeof anomalySeveritySchema>

/** Anomalía de coste detectada por AWS Cost Anomaly Detection. */
export const anomalySchema = z.object({
  id: z.string(),
  title: z.string(),
  severity: anomalySeveritySchema,
  account: z.string(),
  region: z.string(),
  /** `hace 6 h`, `hace 2 d`. */
  detectedLabel: z.string(),
  cause: z.string(),
  /** Impacto diario estimado en USD. */
  dailyImpact: usdSchema,
  /** Serie corta de gasto para el sparkline (9 puntos). */
  series: z.array(z.number()),
  /** Evidencia correlacionada en CloudTrail. */
  evidence: z.string(),
})
export type Anomaly = z.infer<typeof anomalySchema>

export const budgetStatusSchema = z.enum(['ok', 'warn', 'exceeded'])
export type BudgetStatus = z.infer<typeof budgetStatusSchema>

/** Budget de AWS Budgets con su consumo actual. */
export const budgetSchema = z.object({
  id: z.string(),
  name: z.string(),
  spent: usdSchema,
  limit: usdSchema,
  spentLabel: z.string(),
  limitLabel: z.string(),
  status: budgetStatusSchema,
  note: z.string(),
})
export type Budget = z.infer<typeof budgetSchema>

/** Acción sugerida en el modal de anomalía. */
export const anomalyActionSchema = z.object({
  name: z.string(),
  meta: z.string(),
  dailySaving: usdSchema,
})
export type AnomalyAction = z.infer<typeof anomalyActionSchema>

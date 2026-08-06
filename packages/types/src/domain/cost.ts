import { z } from 'zod'
import { costDimensionSchema, usdSchema } from './primitives'

/**
 * Fila de desglose de coste. Equivale a un `GetCostAndUsage` agrupado por una
 * dimensión, ya amortizado y con créditos y Savings Plans repartidos.
 */
export const costRecordSchema = z.object({
  id: z.string(),
  dimension: costDimensionSchema,
  /** Clave técnica de la dimensión (p. ej. `Amazon EC2`, `prod-core`). */
  key: z.string(),
  /** Etiqueta legible; puede incluir el id de cuenta enmascarado. */
  name: z.string(),
  amountMtd: usdSchema,
  /** Δ frente al mismo número de días del mes anterior, en puntos porcentuales. */
  deltaPct: z.number(),
  forecast: usdSchema,
  /** Cobertura de Savings Plans / Reserved Instances sobre gasto elegible. */
  coveragePct: z.number().min(0).max(100),
})
export type CostRecord = z.infer<typeof costRecordSchema>

/** Punto de la serie mensual de gasto amortizado. */
export const monthlyCostPointSchema = z.object({
  month: z.string(),
  /** Gasto del mes en miles de USD. */
  amountK: z.number(),
})
export type MonthlyCostPoint = z.infer<typeof monthlyCostPointSchema>

/** KPIs de cabecera del dashboard. */
export const costSummarySchema = z.object({
  amortizedMtd: usdSchema,
  amortizedDeltaPct: z.number(),
  amortizedDeltaAmount: usdSchema,
  previousMonthLabel: z.string(),
  forecast: usdSchema,
  budget: usdSchema,
  identifiedSavings: usdSchema,
  openRecommendations: z.number().int(),
  activeAnomalies: z.number().int(),
  criticalAnomalies: z.number().int(),
  anomalyDailyImpact: usdSchema,
})
export type CostSummary = z.infer<typeof costSummarySchema>

/** Cobertura o utilización de un compromiso (SP/RI/Spot). */
export const commitmentCoverageSchema = z.object({
  id: z.string(),
  name: z.string(),
  pct: z.number().min(0).max(100),
  targetPct: z.number().min(0).max(100).nullable(),
  note: z.string(),
})
export type CommitmentCoverage = z.infer<typeof commitmentCoverageSchema>

/** Serie apilada del gráfico de Cost Explorer. */
export const costStackSeriesSchema = z.object({
  name: z.string(),
  share: z.number().min(0).max(1),
})
export type CostStackSeries = z.infer<typeof costStackSeriesSchema>

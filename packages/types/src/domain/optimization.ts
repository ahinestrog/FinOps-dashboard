import { z } from 'zod'
import { usdSchema } from './primitives'

export const effortSchema = z.enum(['Bajo', 'Medio', 'Alto'])
export type Effort = z.infer<typeof effortSchema>

/** Recomendación de ahorro (Compute Optimizer, Trusted Advisor, SP…). */
export const recommendationSchema = z.object({
  id: z.string(),
  source: z.string(),
  title: z.string(),
  description: z.string(),
  monthlySaving: usdSchema,
  effort: effortSchema,
  /** `prod-core`, `6 cuentas`… */
  account: z.string(),
})
export type Recommendation = z.infer<typeof recommendationSchema>

/** Fuente de ahorro agregada de la tarjeta de Optimización. */
export const savingSourceSchema = z.object({
  name: z.string(),
  monthlySaving: usdSchema,
})
export type SavingSource = z.infer<typeof savingSourceSchema>

/** Resumen de ahorro potencial de la organización. */
export const savingsSummarySchema = z.object({
  annualized: usdSchema,
  monthly: usdSchema,
  openRecommendations: z.number().int(),
  sources: z.array(savingSourceSchema),
})
export type SavingsSummary = z.infer<typeof savingsSummarySchema>

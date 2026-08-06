import { z } from 'zod'
import { severitySchema } from './primitives'

export const advisorCategoryKeySchema = z.enum(['cost', 'perf', 'sec', 'ft', 'lim'])
export type AdvisorCategoryKey = z.infer<typeof advisorCategoryKeySchema>

/** Check individual de Trusted Advisor dentro de una categoría. */
export const advisorCheckSchema = z.object({
  id: z.string(),
  category: advisorCategoryKeySchema,
  severity: severitySchema,
  name: z.string(),
  description: z.string(),
  /** `6 cuentas`, `1 cuenta`… tal y como se muestra. */
  accountsLabel: z.string(),
  /** Recuento de recursos afectados; `—` cuando el check no cuenta recursos. */
  resourcesLabel: z.string(),
  /** `$21,400/mes` o `—`. */
  savingLabel: z.string(),
})
export type AdvisorCheck = z.infer<typeof advisorCheckSchema>

/** Categoría de Trusted Advisor con su recuento por severidad. */
export const advisorCategorySchema = z.object({
  key: advisorCategoryKeySchema,
  name: z.string(),
  error: z.number().int(),
  warn: z.number().int(),
  ok: z.number().int(),
  checks: z.array(advisorCheckSchema),
})
export type AdvisorCategory = z.infer<typeof advisorCategorySchema>

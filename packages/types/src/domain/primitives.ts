import { z } from 'zod'

/** Severidad semántica compartida por anomalías, checks y estados de recurso. */
export const severitySchema = z.enum(['ok', 'warn', 'bad'])
export type Severity = z.infer<typeof severitySchema>

/** Dimensión de agrupación en Cost Explorer. */
export const costDimensionSchema = z.enum(['service', 'account', 'region', 'tag'])
export type CostDimension = z.infer<typeof costDimensionSchema>

/** Servicios AWS con inventario de recursos en la consola. */
export const serviceKeySchema = z.enum(['ec2', 'rds', 's3', 'eks', 'lambda', 'ebs'])
export type ServiceKey = z.infer<typeof serviceKeySchema>

/**
 * Ventana de evaluación de la utilización. Cambiarla recalcula badges y
 * veredictos; **nunca** la serie histórica de 90 d.
 */
export const evaluationWindowSchema = z.union([z.literal(14), z.literal(30), z.literal(90)])
export type EvaluationWindow = z.infer<typeof evaluationWindowSchema>

/** Importe en USD, siempre en unidades enteras de dólar salvo que se indique. */
export const usdSchema = z.number().finite()

/** Cuenta de la organización AWS. */
export const accountSchema = z.object({
  id: z.string(),
  name: z.string(),
  accountId: z.string(),
})
export type Account = z.infer<typeof accountSchema>

/** Organización AWS observada por la consola. */
export const organizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  accountCount: z.number().int(),
  regionCount: z.number().int(),
  monthlyBudget: usdSchema,
  periodLabel: z.string(),
})
export type Organization = z.infer<typeof organizationSchema>

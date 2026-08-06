import { z } from 'zod'

/** Resultado de la llamada de API tal y como lo devuelve CloudTrail. */
export const trailResultSchema = z.enum(['Success', 'AccessDenied', 'Failure'])
export type TrailResult = z.infer<typeof trailResultSchema>

/** Evento de API de CloudTrail, normalizado para la tabla. */
export const trailEventSchema = z.object({
  id: z.string(),
  /** Hora UTC `HH:mm:ss`. */
  time: z.string(),
  eventName: z.string(),
  /** `ec2.amazonaws.com`, `s3.amazonaws.com`… */
  eventSource: z.string(),
  /** `role/deploy-platform`, `user/j.ferrer`, `root`. */
  identity: z.string(),
  account: z.string(),
  region: z.string(),
  sourceIp: z.string(),
  result: trailResultSchema,
  isWrite: z.boolean(),
  /** El evento crea o modifica recursos facturables. */
  costImpact: z.boolean(),
})
export type TrailEvent = z.infer<typeof trailEventSchema>

/** Filtros acumulativos de la pantalla CloudTrail. */
export const trailFilterSchema = z.object({
  query: z.string().default(''),
  writesOnly: z.boolean().default(false),
  errorsOnly: z.boolean().default(false),
  costImpactOnly: z.boolean().default(false),
})
export type TrailFilter = z.infer<typeof trailFilterSchema>

/** KPIs compactos de la cabecera de CloudTrail. */
export const trailSummarySchema = z.object({
  events24h: z.number().int(),
  accessDenied: z.number().int(),
  activeIdentities: z.number().int(),
  costImpactEvents: z.number().int(),
})
export type TrailSummary = z.infer<typeof trailSummarySchema>

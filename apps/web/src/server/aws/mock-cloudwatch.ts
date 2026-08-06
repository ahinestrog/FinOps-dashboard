import {
  type CloudWatchClient,
  type UtilizationSeries,
  utilizationSeriesSchema,
} from '@finops/types'

const DAYS = 90

/**
 * Sintetiza la serie de utilización de 90 días de forma **determinista a partir
 * del id del recurso**: la misma fila muestra siempre la misma curva.
 *
 * En producción esta serie viene de CloudWatch `GetMetricData`; el resto de la
 * app no distingue una de otra porque ambas cumplen el mismo puerto.
 */
function synthesize(resourceId: string, baseline: number, trendPp: number): number[] {
  let seed = 0
  for (let i = 0; i < resourceId.length; i++) {
    seed = (seed * 31 + resourceId.charCodeAt(i)) % 100000
  }
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648
    return seed / 2147483648
  }

  const values: number[] = []
  for (let d = 0; d < DAYS; d++) {
    const weekly = Math.sin((d / 7) * Math.PI * 2) * baseline * 0.16
    const weekend = d % 7 === 5 || d % 7 === 6 ? -baseline * 0.22 : 0
    const noise = (rnd() - 0.5) * baseline * 0.3
    const spike = rnd() > 0.965 ? baseline * 0.55 : 0
    const drift = trendPp * (d / DAYS - 0.5)
    values.push(Math.max(1, Math.min(99, baseline + weekly + weekend + noise + spike + drift)))
  }

  // Se comprime la cola alta y se fuerza que el pico sea estrictamente mayor
  // que el p95: si no, ambos redondean al mismo número y el panel de
  // estadísticas se contradice.
  const cap = Math.min(97, baseline * 1.35)
  const rawMax = Math.max(...values)
  let peakIdx = 0
  for (let i = 0; i < values.length; i++) if (values[i]! > values[peakIdx]!) peakIdx = i
  const band = cap * 0.9
  if (rawMax > baseline) {
    for (let i = 0; i < values.length; i++) {
      if (values[i]! > baseline) {
        values[i] = baseline + (values[i]! - baseline) * ((band - baseline) / (rawMax - baseline))
      }
    }
  }
  values[peakIdx] = cap
  return values
}

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length

export function buildUtilizationSeries(input: {
  resourceId: string
  baseline: number
  deltaPct: number
}): UtilizationSeries {
  // La deriva de la curva sale del Δ mensual de la fila, acotada a ±30 pp.
  const trendPp = Math.max(-30, Math.min(30, (input.baseline * input.deltaPct) / 100))
  const points = synthesize(input.resourceId, input.baseline, trendPp)
  const sorted = [...points].sort((a, b) => a - b)
  return utilizationSeriesSchema.parse({
    resourceId: input.resourceId,
    points,
    mean90: mean(points),
    mean30: mean(points.slice(60)),
    p95: sorted[Math.floor(0.95 * (DAYS - 1))]!,
    peak: sorted[DAYS - 1]!,
    trendPp: mean(points.slice(60)) - mean(points.slice(0, 30)),
  })
}

/** Adaptador mock de Amazon CloudWatch. */
export class MockCloudWatchClient implements CloudWatchClient {
  async getUtilizationSeries(input: {
    resourceId: string
    baseline: number
    deltaPct: number
  }): Promise<UtilizationSeries> {
    return buildUtilizationSeries(input)
  }
}

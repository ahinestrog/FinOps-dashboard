import type { EvaluationWindow, MetricKind, UtilizationSeries } from '@finops/types'
import type { MeterTone } from '@finops/ui'

export interface UtilizationState {
  label: string
  fg: string
  bg: string
  tone: MeterTone
}

const OK: UtilizationState = { label: 'Óptimo', fg: 'var(--s-ok)', bg: 'var(--s-ok-t)', tone: 'ok' }
const WARN = { fg: 'var(--s-warn)', bg: 'var(--s-warn-t)', tone: 'warn' as const }
const BAD = { fg: 'var(--s-bad)', bg: 'var(--s-bad-t)', tone: 'bad' as const }

/**
 * Estado del recurso a partir de la utilización de la ventana activa.
 *
 * En servicios de cómputo la métrica es utilización real y aplican los
 * umbrales. Donde no lo es (accesos S3, memoria Lambda, IOPS EBS) aplicarlos
 * sería una falacia —un bucket de archivo con 1% de accesos no está "mal"—,
 * así que el estado se deriva de si hay oportunidad de ahorro.
 */
export function utilizationState(
  utilization: number,
  kind: MetricKind,
  saving: number,
): UtilizationState {
  if (kind === 'compute') {
    if (utilization >= 60) return { label: 'Revisión', ...WARN }
    if (utilization < 20) return { label: 'Infrautilizado', ...BAD }
    return OK
  }
  return saving > 0 ? { label: 'Con oportunidad', ...WARN } : OK
}

/**
 * Utilización mostrada para la ventana activa.
 *
 * 14 d es el baseline del recurso; 30 y 90 d salen de la serie. La serie no
 * cambia: cambiar de ventana cambia el badge, no la curva.
 */
export function resolveUtilization(
  baseline: number,
  series: UtilizationSeries,
  win: EvaluationWindow,
): number {
  if (win === 14) return baseline
  return Math.round(win === 30 ? series.mean30 : series.mean90)
}

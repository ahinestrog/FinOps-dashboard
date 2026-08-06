import type { EvaluationWindow, MetricKind, Resource, UtilizationSeries } from '@finops/types'
import { money, percent } from './format'
import type { utilizationState } from './utilization'

/** Tipo de acción registrada en el recurso; ramifica el veredicto. */
export type ActionType = 'none' | 'reduce' | 'commit' | 'migrate'

export function actionType(action: string): ActionType {
  if (!action || action === 'Sin acción') return 'none'
  if (
    /Reducir|Consolidar|nodos|Eliminar|Apagad|Apagar|Snapshot|Deshabilitar|Scheduler|autoscaler|parada/i.test(
      action,
    )
  )
    return 'reduce'
  if (/Renovar|Savings Plan|cobertura|Spot/i.test(action)) return 'commit'
  return 'migrate'
}

export interface Verdict {
  title: string
  body: string
  color: string
  bg: string
}

const bgFor = (color: string) =>
  color === 'var(--s-ok)'
    ? 'var(--s-ok-t)'
    : color === 'var(--s-warn)'
      ? 'var(--s-warn-t)'
      : 'var(--s-bad-t)'

/**
 * Veredicto del histórico de 90 días.
 *
 * Ramifica por la utilización de la **ventana activa** —el mismo número que el
 * badge, nunca la media de 90 d— y por el tipo de acción del recurso. Nunca
 * propone subir de tamaño cuando la fila lleva un ahorro asociado.
 */
export function buildVerdict(input: {
  resource: Resource
  series: UtilizationSeries
  utilization: number
  kind: MetricKind
  metricLabel: string
  win: EvaluationWindow
}): Verdict {
  const { resource, series, utilization, kind, metricLabel, win } = input
  const action = resource.action
  const type = actionType(action)
  const saving = `${money(resource.actionSaving)}/mes`

  const ref =
    win === 90
      ? `(90 d; p95 ${percent(series.p95)})`
      : `(${win} d; media 90 d ${percent(series.mean90)}, p95 ${percent(series.p95)})`

  const gap = utilization - series.mean90
  const winNote =
    win === 90 || Math.abs(gap) < 3
      ? ''
      : ` Ventanas distintas: ${win} d al ${percent(utilization)} frente a 90 d al ${percent(series.mean90)}, así que es ${
          gap > 0
            ? 'un pico reciente, no una tendencia'
            : 'una caída reciente sobre una base más alta'
        }.`

  if (kind === 'compute') {
    let title: string
    let body: string
    let color: string

    if (utilization >= 60 && type === 'reduce') {
      title = 'Revisar dimensionamiento del conjunto'
      body = `Trabaja al ${percent(utilization)} ${ref}: individualmente está bien dimensionada, así que el ahorro no está en bajar su tamaño sino en el número de recursos. La acción propuesta —${action}— libera ${saving} sin bajar de la banda objetivo.`
      color = 'var(--s-warn)'
    } else if (utilization >= 60 && type !== 'none') {
      title = 'Uso alto: mantener tamaño'
      body = `Uso del ${percent(utilization)} ${ref}: el tamaño es el correcto, no toques capacidad. El ahorro viene de ${action} (${saving}), que no altera el rendimiento.`
      color = 'var(--s-warn)'
    } else if (utilization >= 60) {
      const trend =
        series.trendPp > 2 ? `creciente (+${Math.round(series.trendPp)} pp en 90 d)` : 'estable'
      title = 'Subir un escalón de tamaño'
      body = `Uso del ${percent(utilization)} ${ref} y tendencia ${trend}: poco margen para picos. Un escalón más grande añade unos ${money(resource.monthlyCost * 0.9)}/mes; conviene resolverlo antes de comprometer Savings Plans a 3 años sobre este tamaño.`
      color = 'var(--s-warn)'
    } else if (utilization < 20) {
      title = type === 'none' ? 'Candidato a apagado' : 'Bajar de tamaño o apagar'
      body = `Uso del ${percent(utilization)} ${ref}: sobredimensionado de forma sostenida, no solo en los últimos días. ${
        type === 'none'
          ? 'No hay acción registrada: valida con el equipo propietario si el recurso sigue siendo necesario.'
          : `La acción propuesta —${action}— libera ${saving} sin tocar el p95 de servicio.`
      }`
      color = 'var(--s-bad)'
    } else if (type !== 'none') {
      title = 'Mantener tamaño, aplicar la acción'
      body = `Uso del ${percent(utilization)} ${ref}: dentro de la banda objetivo (20–60%), el tamaño es correcto. El ahorro viene de ${action} (${saving}) a igual capacidad.`
      color = 'var(--s-ok)'
    } else {
      title = 'Mantener tamaño'
      body = `Uso del ${percent(utilization)} ${ref}: banda objetivo (20–60%) y sin acción pendiente. Buen candidato a cobertura con Savings Plans o RI, porque el tamaño no va a cambiar a corto plazo.`
      color = 'var(--s-ok)'
    }

    return { title, body: body + winNote, color, bg: bgFor(color) }
  }

  const metric = metricLabel.toLowerCase()
  if (type === 'reduce') {
    return {
      title: 'Retirar capacidad ociosa',
      body: `${metric} del ${percent(series.mean90)} de media en 90 días, sin recuperación en el último mes. ${action} libera ${saving} y no afecta a ningún consumidor activo.`,
      color: 'var(--s-bad)',
      bg: bgFor('var(--s-bad)'),
    }
  }
  if (type === 'migrate') {
    return {
      title: 'Cambiar de configuración, no de tamaño',
      body: `${metric} del ${percent(series.mean90)} de media: el patrón de uso es estable, lo que sobra es la clase o el parámetro elegido. ${action} mantiene el mismo servicio por ${saving} menos.`,
      color: 'var(--s-warn)',
      bg: bgFor('var(--s-warn)'),
    }
  }
  if (type === 'commit') {
    return {
      title: 'Mantener y asegurar el compromiso',
      body: `${metric} del ${percent(series.mean90)} de media y estable: el recurso se queda. ${action} aporta ${saving} sin cambiar nada de la configuración.`,
      color: 'var(--s-ok)',
      bg: bgFor('var(--s-ok)'),
    }
  }
  return {
    title: 'Sin acción: configuración correcta',
    body: `${metric} del ${percent(series.mean90)} de media en 90 días, coherente con la clase elegida y sin desperdicio detectado. Revisar de nuevo si el patrón de acceso cambia.`,
    color: 'var(--s-ok)',
    bg: bgFor('var(--s-ok)'),
  }
}

/** Las cuatro estadísticas alineadas a la derecha del histórico. */
export function historyStats(
  series: UtilizationSeries,
  state: ReturnType<typeof utilizationState>,
) {
  return [
    { label: 'Media 90 d', value: percent(series.mean90), color: state.fg },
    { label: 'p95', value: percent(series.p95), color: 'var(--s-t)' },
    { label: 'Pico', value: percent(series.peak), color: 'var(--s-t)' },
    {
      label: 'Tendencia',
      value: `${series.trendPp >= 0 ? '+' : ''}${Math.round(series.trendPp)} pp`,
      color:
        series.trendPp > 2 ? 'var(--s-warn)' : series.trendPp < -2 ? 'var(--s-ok)' : 'var(--s-t2)',
    },
  ]
}

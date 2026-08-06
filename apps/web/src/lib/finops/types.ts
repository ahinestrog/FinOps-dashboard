import type { MetricKind, Resource, ServiceInventory, UtilizationSeries } from '@finops/types'

/**
 * Recurso con su serie de 90 días ya resuelta.
 *
 * Es lo que cruza la frontera servidor → cliente: el servidor consulta
 * CloudWatch una vez y el cliente recalcula badges y veredictos al cambiar la
 * ventana de evaluación, sin volver a pedir datos.
 */
export interface ResourceRow {
  resource: Resource
  series: UtilizationSeries
}

/** Inventario de un servicio con las series de sus recursos. */
export interface ServiceRows {
  service: ServiceInventory['service']
  name: string
  count: number
  kind: MetricKind
  typeLabel: string
  metricLabel: string
  summary: ServiceInventory['summary']
  rows: ResourceRow[]
}

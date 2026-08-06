import type { ServiceKey } from '@finops/types'
import type { ServiceRows } from '@/lib/finops/types'
import { dataSources } from './aws'

/**
 * Cruza el inventario de recursos con las series de CloudWatch.
 *
 * Se resuelve en el servidor una sola vez por servicio: el cliente ya solo
 * recalcula badges y veredictos al cambiar la ventana de evaluación.
 */
export async function getServiceRows(service: ServiceKey): Promise<ServiceRows | null> {
  const inventory = await dataSources.resources.getService(service)
  if (!inventory) return null

  const rows = await Promise.all(
    inventory.resources.map(async (resource) => ({
      resource,
      series: await dataSources.cloudWatch.getUtilizationSeries({
        resourceId: resource.id,
        baseline: resource.utilization,
        deltaPct: Number.parseFloat(resource.deltaLabel.replace('%', '')) || 0,
      }),
    })),
  )

  const { resources: _resources, ...meta } = inventory
  return { ...meta, rows }
}

export async function getAllServiceRows(): Promise<ServiceRows[]> {
  const services = await dataSources.resources.listServices()
  const all = await Promise.all(services.map((s) => getServiceRows(s.service)))
  return all.filter((s): s is ServiceRows => s !== null)
}

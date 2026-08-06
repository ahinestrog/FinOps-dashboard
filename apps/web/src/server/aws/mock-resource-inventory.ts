import {
  type ResourceInventoryClient,
  type ServiceInventory,
  type ServiceKey,
  serviceInventorySchema,
} from '@finops/types'
import { resourceInventoryFixtures } from './fixtures/resources'

/** Adaptador mock del inventario de recursos (CUR en Athena + Compute Optimizer). */
export class MockResourceInventoryClient implements ResourceInventoryClient {
  async listServices(): Promise<ServiceInventory[]> {
    return serviceInventorySchema.array().parse(resourceInventoryFixtures)
  }

  async getService(service: ServiceKey): Promise<ServiceInventory | null> {
    const found = resourceInventoryFixtures.find((s) => s.service === service)
    return found ? serviceInventorySchema.parse(found) : null
  }
}

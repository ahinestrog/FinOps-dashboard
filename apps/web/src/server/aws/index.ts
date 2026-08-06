import type { FinOpsDataSources } from '@finops/types'
import { MockBudgetsClient } from './mock-budgets'
import { MockCloudTrailClient } from './mock-cloudtrail'
import { MockCloudWatchClient } from './mock-cloudwatch'
import { MockComputeOptimizerClient } from './mock-compute-optimizer'
import { MockCostExplorerClient } from './mock-cost-explorer'
import { MockResourceInventoryClient } from './mock-resource-inventory'
import { MockTrustedAdvisorClient } from './mock-trusted-advisor'

/**
 * Composición de las fuentes de datos.
 *
 * Único punto donde se decide qué implementación de cada puerto usa la app.
 * Conectar AWS de verdad es sustituir aquí `Mock*Client` por el adaptador del
 * SDK: ni las pantallas ni los componentes cambian.
 */
export const dataSources: FinOpsDataSources = {
  costExplorer: new MockCostExplorerClient(),
  budgets: new MockBudgetsClient(),
  cloudTrail: new MockCloudTrailClient(),
  trustedAdvisor: new MockTrustedAdvisorClient(),
  computeOptimizer: new MockComputeOptimizerClient(),
  resources: new MockResourceInventoryClient(),
  cloudWatch: new MockCloudWatchClient(),
}

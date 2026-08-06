import {
  type ComputeOptimizerClient,
  type Recommendation,
  recommendationSchema,
  type SavingsSummary,
  savingsSummarySchema,
} from '@finops/types'
import { recommendationsFixture, savingsSummaryFixture } from './fixtures/optimization'

/** Adaptador mock de Compute Optimizer + Cost Optimization Hub. */
export class MockComputeOptimizerClient implements ComputeOptimizerClient {
  async getSavingsSummary(): Promise<SavingsSummary> {
    return savingsSummarySchema.parse(savingsSummaryFixture)
  }

  async listRecommendations(): Promise<Recommendation[]> {
    return recommendationSchema.array().parse(recommendationsFixture)
  }
}

import {
  type Anomaly,
  anomalySchema,
  type CommitmentCoverage,
  type CostDimension,
  type CostExplorerClient,
  type CostRecord,
  type CostStackSeries,
  type CostSummary,
  commitmentCoverageSchema,
  costRecordSchema,
  costStackSeriesSchema,
  costSummarySchema,
  type MonthlyCostPoint,
  monthlyCostPointSchema,
  type Organization,
  organizationSchema,
} from '@finops/types'
import { anomaliesFixture } from './fixtures/alerts'
import {
  breakdownFixtures,
  commitmentCoverageFixture,
  costStackSeriesFixture,
  costSummaryFixture,
  monthlyTrendFixture,
  organizationFixture,
} from './fixtures/cost'

/**
 * Adaptador mock de AWS Cost Explorer.
 *
 * Cada método valida su fixture con el esquema Zod del dominio, igual que hará
 * la implementación real con la respuesta del SDK: el contrato es el esquema,
 * no la fuente.
 */
export class MockCostExplorerClient implements CostExplorerClient {
  async getOrganization(): Promise<Organization> {
    return organizationSchema.parse(organizationFixture)
  }

  async getCostSummary(): Promise<CostSummary> {
    return costSummarySchema.parse(costSummaryFixture)
  }

  async getMonthlyTrend(): Promise<MonthlyCostPoint[]> {
    return monthlyCostPointSchema.array().parse(monthlyTrendFixture)
  }

  async getStackSeries(): Promise<CostStackSeries[]> {
    return costStackSeriesSchema.array().parse(costStackSeriesFixture)
  }

  async getBreakdown(dimension: CostDimension): Promise<CostRecord[]> {
    return costRecordSchema.array().parse(breakdownFixtures[dimension])
  }

  async getCommitmentCoverage(): Promise<CommitmentCoverage[]> {
    return commitmentCoverageSchema.array().parse(commitmentCoverageFixture)
  }

  async getAnomalies(): Promise<Anomaly[]> {
    return anomalySchema.array().parse(anomaliesFixture)
  }
}

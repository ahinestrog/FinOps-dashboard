import type {
  CommitmentCoverage,
  CostDimension,
  CostRecord,
  CostStackSeries,
  CostSummary,
  MonthlyCostPoint,
  Organization,
} from '@finops/types'

export const organizationFixture: Organization = {
  id: 'o-9f3k',
  name: 'Acme Corp',
  accountCount: 14,
  regionCount: 6,
  monthlyBudget: 500_000,
  periodLabel: '1 – 31 Ago 2026',
}

export const monthlyTrendFixture: MonthlyCostPoint[] = [
  { month: 'Sep', amountK: 402 },
  { month: 'Oct', amountK: 418 },
  { month: 'Nov', amountK: 431 },
  { month: 'Dic', amountK: 455 },
  { month: 'Ene', amountK: 441 },
  { month: 'Feb', amountK: 462 },
  { month: 'Mar', amountK: 470 },
  { month: 'Abr', amountK: 478 },
  { month: 'May', amountK: 466 },
  { month: 'Jun', amountK: 489 },
  { month: 'Jul', amountK: 495 },
  { month: 'Ago', amountK: 487 },
]

export const costSummaryFixture: CostSummary = {
  amortizedMtd: 487_320,
  amortizedDeltaPct: 4.2,
  amortizedDeltaAmount: 19_600,
  previousMonthLabel: 'julio',
  forecast: 512_400,
  budget: 500_000,
  identifiedSavings: 63_480,
  openRecommendations: 18,
  activeAnomalies: 3,
  criticalAnomalies: 2,
  anomalyDailyImpact: 9_140,
}

/** Series del gráfico apilado de Cost Explorer (share sobre el total del mes). */
export const costStackSeriesFixture: CostStackSeries[] = [
  { name: 'EC2', share: 0.385 },
  { name: 'S3', share: 0.128 },
  { name: 'RDS', share: 0.113 },
  { name: 'EKS', share: 0.086 },
  { name: 'Otros', share: 0.288 },
]

/** Cobertura SP/RI por fila, en orden de la tabla. */
const coverageByRow = [72, 61, 68, 44, 55, 12, 39]
const FORECAST_FACTOR = 1.052

type RawRow = readonly [key: string, name: string, amount: number, deltaPct: number]

const rawBreakdowns: Record<CostDimension, readonly RawRow[]> = {
  service: [
    ['Amazon EC2', 'Amazon EC2', 187_400, 3.1],
    ['Amazon S3', 'Amazon S3', 62_100, -1.4],
    ['Amazon RDS', 'Amazon RDS', 54_800, 0.8],
    ['Amazon EKS', 'Amazon EKS', 41_900, 11.2],
    ['AWS Lambda', 'AWS Lambda', 31_200, 2.0],
    ['CloudFront', 'CloudFront', 24_600, -3.6],
    ['DynamoDB', 'DynamoDB', 19_300, 1.1],
  ],
  account: [
    ['prod-core', 'prod-core (4471…8820)', 214_800, 2.4],
    ['data-platform', 'data-platform (9932…1104)', 96_400, 14.6],
    ['prod-eu', 'prod-eu (2210…7745)', 71_200, 1.2],
    ['staging', 'staging (8814…3390)', 43_600, -6.8],
    ['shared-services', 'shared-services (5567…2201)', 30_200, 0.4],
    ['sandbox', 'sandbox (1180…9934)', 18_900, 22.1],
    ['security-tooling', 'security-tooling (7745…0012)', 12_100, -0.9],
  ],
  region: [
    ['us-east-1', 'us-east-1', 226_300, 2.9],
    ['eu-west-1', 'eu-west-1', 104_700, 1.6],
    ['us-west-2', 'us-west-2', 68_400, 5.4],
    ['eu-central-1', 'eu-central-1', 41_200, -2.1],
    ['ap-southeast-1', 'ap-southeast-1', 28_600, 8.8],
    ['sa-east-1', 'sa-east-1', 12_300, 0.6],
    ['global', 'global (CloudFront/R53)', 5_820, -1.1],
  ],
  tag: [
    ['platform', 'Team: platform', 168_900, 2.2],
    ['data', 'Team: data', 112_400, 13.9],
    ['payments', 'Team: payments', 74_600, 0.7],
    ['growth', 'Team: growth', 48_300, -4.2],
    ['ml-research', 'Team: ml-research', 39_800, 18.4],
    ['corp-it', 'Team: corp-it', 21_100, 1.0],
    ['untagged', 'Sin tag', 22_200, 6.1],
  ],
}

function toRecords(dimension: CostDimension, rows: readonly RawRow[]): CostRecord[] {
  return rows.map(([key, name, amount, deltaPct], i) => ({
    id: `${dimension}:${key}`,
    dimension,
    key,
    name,
    amountMtd: amount,
    deltaPct,
    forecast: amount * FORECAST_FACTOR,
    coveragePct: coverageByRow[i % coverageByRow.length]!,
  }))
}

export const breakdownFixtures: Record<CostDimension, CostRecord[]> = {
  service: toRecords('service', rawBreakdowns.service),
  account: toRecords('account', rawBreakdowns.account),
  region: toRecords('region', rawBreakdowns.region),
  tag: toRecords('tag', rawBreakdowns.tag),
}

/** Compromisos del dashboard: cobertura baja (61%, 12%) y utilización alta. */
export const commitmentCoverageFixture: CommitmentCoverage[] = [
  {
    id: 'sp-coverage',
    name: 'Cobertura Compute SP',
    pct: 61,
    targetPct: 85,
    note: 'objetivo 85% · $16.9k/mes en juego',
  },
  {
    id: 'sp-utilization',
    name: 'Utilización SP',
    pct: 96,
    targetPct: null,
    note: 'sin desperdicio de compromiso',
  },
  {
    id: 'ri-utilization',
    name: 'Utilización RI',
    pct: 88,
    targetPct: null,
    note: '4 RDS RI vencen en 41 días',
  },
  {
    id: 'spot-share',
    name: 'Gasto en Spot',
    pct: 12,
    targetPct: 25,
    note: 'objetivo 25% en cargas batch',
  },
]

/** Cobertura por familia de compromiso, en la pantalla de Optimización. */
export const commitmentTargetsFixture: CommitmentCoverage[] = [
  { id: 'compute-sp', name: 'Compute SP', pct: 61, targetPct: 85, note: 'objetivo 85%' },
  { id: 'rds-ri', name: 'RDS RI', pct: 78, targetPct: 75, note: 'objetivo 75%' },
  { id: 'elasticache-ri', name: 'ElastiCache RI', pct: 44, targetPct: 70, note: 'objetivo 70%' },
]

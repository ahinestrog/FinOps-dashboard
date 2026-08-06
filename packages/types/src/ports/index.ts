/**
 * Puertos de las fuentes de datos AWS.
 *
 * Cada puerto es la interfaz mínima que la app necesita de un servicio de AWS,
 * ya normalizada al modelo de dominio. Las implementaciones (`Mock*Client` hoy,
 * SDK real mañana) viven fuera de este paquete: cambiar de una a otra no toca
 * ni pantallas ni componentes.
 */
import type {
  AdvisorCategory,
  AdvisorCategoryKey,
  Anomaly,
  Budget,
  CommitmentCoverage,
  CostDimension,
  CostRecord,
  CostStackSeries,
  CostSummary,
  MonthlyCostPoint,
  Organization,
  Recommendation,
  SavingsSummary,
  ServiceInventory,
  ServiceKey,
  TrailEvent,
  TrailSummary,
  UtilizationSeries,
} from '../domain'

/**
 * AWS Cost Explorer.
 * Real: `GetCostAndUsage`, `GetCostForecast`, `GetSavingsPlansCoverage`,
 * `GetSavingsPlansUtilization`, `GetReservationUtilization`, `GetAnomalies`.
 * CUR en Athena para el detalle por recurso.
 */
export interface CostExplorerClient {
  getOrganization(): Promise<Organization>
  getCostSummary(): Promise<CostSummary>
  getMonthlyTrend(): Promise<MonthlyCostPoint[]>
  getStackSeries(): Promise<CostStackSeries[]>
  getBreakdown(dimension: CostDimension): Promise<CostRecord[]>
  getCommitmentCoverage(): Promise<CommitmentCoverage[]>
  getAnomalies(): Promise<Anomaly[]>
}

/**
 * AWS Budgets.
 * Real: `DescribeBudgets` / `DescribeBudgetPerformanceHistory`.
 */
export interface BudgetsClient {
  listBudgets(): Promise<Budget[]>
}

/**
 * AWS CloudTrail.
 * Real: `LookupEvents`, o Athena sobre el trail de la organización cuando el
 * volumen no cabe en la API directa.
 */
export interface CloudTrailClient {
  getSummary(): Promise<TrailSummary>
  lookupEvents(): Promise<TrailEvent[]>
  /** Registro crudo del evento, tal cual lo entrega CloudTrail. */
  getEventRecord(eventId: string): Promise<Record<string, unknown> | null>
}

/**
 * AWS Trusted Advisor (Support API).
 * Real: `DescribeTrustedAdvisorChecks` / `DescribeTrustedAdvisorCheckResult`.
 * Requiere plan Business o Enterprise.
 */
export interface TrustedAdvisorClient {
  listCategories(): Promise<AdvisorCategory[]>
  getCategory(key: AdvisorCategoryKey): Promise<AdvisorCategory | null>
}

/**
 * AWS Compute Optimizer + Cost Optimization Hub.
 * Real: `GetEC2InstanceRecommendations`, `GetEBSVolumeRecommendations`,
 * `GetLambdaFunctionRecommendations`.
 */
export interface ComputeOptimizerClient {
  getSavingsSummary(): Promise<SavingsSummary>
  listRecommendations(): Promise<Recommendation[]>
}

/**
 * Inventario de recursos: CUR en Athena cruzado con Compute Optimizer.
 * Es la fuente de la pantalla Top recursos.
 */
export interface ResourceInventoryClient {
  listServices(): Promise<ServiceInventory[]>
  getService(service: ServiceKey): Promise<ServiceInventory | null>
}

/**
 * Amazon CloudWatch.
 * Real: `GetMetricData` / `GetMetricStatistics` (CPUUtilization, memoria vía
 * agente, IOPS, accesos S3…), 90 días de media diaria.
 */
export interface CloudWatchClient {
  getUtilizationSeries(input: {
    resourceId: string
    /** Baseline de 14 d del recurso; ancla la serie. */
    baseline: number
    /** Δ mensual del recurso, para la deriva de la curva. */
    deltaPct: number
  }): Promise<UtilizationSeries>
}

/** Contenedor de puertos: único punto de composición de la app. */
export interface FinOpsDataSources {
  costExplorer: CostExplorerClient
  budgets: BudgetsClient
  cloudTrail: CloudTrailClient
  trustedAdvisor: TrustedAdvisorClient
  computeOptimizer: ComputeOptimizerClient
  resources: ResourceInventoryClient
  cloudWatch: CloudWatchClient
}

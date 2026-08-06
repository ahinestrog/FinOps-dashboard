import type { Anomaly, AnomalyAction, Budget } from '@finops/types'

/** Dos anomalías críticas y una media: la UI tiene que verse en ambos tonos. */
export const anomaliesFixture: Anomaly[] = [
  {
    id: 'anom-eks',
    title: 'Pico de gasto en Amazon EKS',
    severity: 'Crítica',
    account: 'data-platform',
    region: 'eu-west-1',
    detectedLabel: 'detectado hace 6 h',
    cause: 'Nuevo node group m6i.8xlarge escalado a 40 nodos por el pipeline de ingesta',
    dailyImpact: 5_840,
    series: [8, 10, 9, 11, 12, 14, 26, 38, 41],
    evidence: 'RunInstances y CreateNodegroup por role/data-pipeline',
  },
  {
    id: 'anom-nat',
    title: 'Transferencia de datos NAT Gateway',
    severity: 'Crítica',
    account: 'prod-core',
    region: 'us-east-1',
    detectedLabel: 'detectado hace 14 h',
    cause: 'Tráfico inter-AZ sin VPC endpoint para S3 desde el clúster de payments',
    dailyImpact: 3_300,
    series: [12, 13, 12, 14, 18, 22, 25, 31, 34],
    evidence: 'Aumento del 240% en GB procesados',
  },
  {
    id: 'anom-sandbox',
    title: 'Sandbox por encima de lo habitual',
    severity: 'Media',
    account: 'sandbox',
    region: 'us-east-1',
    detectedLabel: 'detectado hace 2 d',
    cause: 'Instancias GPU g5.12xlarge encendidas fuera de horario laboral',
    dailyImpact: 980,
    series: [4, 5, 4, 6, 7, 9, 8, 11, 12],
    evidence: 'RunInstances por user/r.pons sin tag de proyecto',
  },
]

export const anomalyActionsFixture: AnomalyAction[] = [
  {
    name: 'Reducir node group a 12 nodos',
    meta: 'reversible · owner platform',
    dailySaving: 4_200,
  },
  { name: 'Añadir VPC endpoint para S3', meta: 'cambio de red · 1 sprint', dailySaving: 3_100 },
  { name: 'Scheduler de apagado 20:00–07:00', meta: 'automatizable', dailySaving: 780 },
]

/** Un budget excedido, dos en aviso y uno holgado. */
export const budgetsFixture: Budget[] = [
  {
    id: 'budget-org',
    name: 'Organización · mensual',
    spent: 487_300,
    limit: 500_000,
    spentLabel: '$487.3k',
    limitLabel: '$500k',
    status: 'warn',
    note: '97% consumido · forecast 102%',
  },
  {
    id: 'budget-prod-core',
    name: 'prod-core',
    spent: 214_800,
    limit: 240_000,
    spentLabel: '$214.8k',
    limitLabel: '$240k',
    status: 'warn',
    note: '89% consumido',
  },
  {
    id: 'budget-data-platform',
    name: 'data-platform',
    spent: 96_400,
    limit: 85_000,
    spentLabel: '$96.4k',
    limitLabel: '$85k',
    status: 'exceeded',
    note: 'Excedido en $11.4k',
  },
  {
    id: 'budget-sandbox',
    name: 'sandbox',
    spent: 18_900,
    limit: 40_000,
    spentLabel: '$18.9k',
    limitLabel: '$40k',
    status: 'ok',
    note: '47% consumido',
  },
]

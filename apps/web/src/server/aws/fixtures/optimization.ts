import type { Recommendation, SavingsSummary } from '@finops/types'

export const savingsSummaryFixture: SavingsSummary = {
  annualized: 761_760,
  monthly: 63_480,
  openRecommendations: 18,
  sources: [
    { name: 'Compute Optimizer', monthlySaving: 22_160 },
    { name: 'Savings Plans', monthlySaving: 16_900 },
    { name: 'Recursos ociosos', monthlySaving: 16_940 },
    { name: 'Almacenamiento', monthlySaving: 7_480 },
  ],
}

export const recommendationsFixture: Recommendation[] = [
  {
    id: 'rec-graviton',
    source: 'Compute Optimizer',
    title: 'Rightsizing de 62 instancias m5 → m6g',
    description:
      'Migración a Graviton con el mismo perfil de memoria; ahorro sostenido sin cambios de arquitectura.',
    monthlySaving: 18_240,
    effort: 'Medio',
    account: 'prod-core',
  },
  {
    id: 'rec-compute-sp',
    source: 'Savings Plans',
    title: 'Compute Savings Plan a 1 año',
    description:
      'Cobertura actual 61%; comprometer $9.8k/h eleva la cobertura al 84% del gasto elegible.',
    monthlySaving: 16_900,
    effort: 'Bajo',
    account: 'shared-services',
  },
  {
    id: 'rec-idle',
    source: 'Idle Resources',
    title: 'Apagar 184 instancias con CPU < 10%',
    description: 'Instancias de dev y batch encendidas 24/7 sin actividad relevante en 14 días.',
    monthlySaving: 11_320,
    effort: 'Bajo',
    account: '6 cuentas',
  },
  {
    id: 'rec-s3-tiering',
    source: 'Storage',
    title: 'Ciclo de vida S3 a Intelligent-Tiering',
    description: '412 TB en Standard sin accesos en 90 días; transición automática por edad.',
    monthlySaving: 7_480,
    effort: 'Bajo',
    account: 'data-platform',
  },
  {
    id: 'rec-idle-lb',
    source: 'Trusted Advisor',
    title: 'Eliminar 31 load balancers ociosos',
    description: 'ALB/NLB sin requests en 7 días, la mayoría de entornos de test ya retirados.',
    monthlySaving: 5_620,
    effort: 'Bajo',
    account: 'staging',
  },
  {
    id: 'rec-gp3',
    source: 'Compute Optimizer',
    title: 'Reducir 412 volúmenes EBS gp2 → gp3',
    description: 'Mismo rendimiento con menor coste por GB y IOPS base incluidas.',
    monthlySaving: 3_920,
    effort: 'Medio',
    account: '7 cuentas',
  },
]

/** Recursos incluidos que muestra el modal de una recomendación. */
export const recommendationResourcesFixture = [
  { name: 'i-0a3f19c74b2e8d551', meta: 'm5.4xlarge → m6g.4xlarge', value: '$620/mes' },
  { name: 'i-07bb2f5c1099ae431', meta: 'm5.2xlarge → m6g.2xlarge', value: '$410/mes' },
  { name: 'i-0dd41c8827fa3b019', meta: 'm5.xlarge → m6g.xlarge', value: '$205/mes' },
]

import { Suspense } from 'react'
import { CostScreen } from '@/components/screens/cost-screen'
import { dataSources } from '@/server/aws'

// Las pantallas leen su estado de la URL con nuqs: render dinámico para que
// el HTML llegue ya con los filtros aplicados.
export const dynamic = 'force-dynamic'

export const metadata = { title: 'Cost Explorer · LedgerOps' }

export default async function CostPage() {
  const ce = dataSources.costExplorer
  const [trend, stackSeries, service, account, region, tag] = await Promise.all([
    ce.getMonthlyTrend(),
    ce.getStackSeries(),
    ce.getBreakdown('service'),
    ce.getBreakdown('account'),
    ce.getBreakdown('region'),
    ce.getBreakdown('tag'),
  ])

  return (
    <Suspense>
      <CostScreen
        trend={trend}
        stackSeries={stackSeries}
        breakdowns={{ service, account, region, tag }}
      />
    </Suspense>
  )
}

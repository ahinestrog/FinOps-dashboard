import { Suspense } from 'react'
import { DashboardScreen } from '@/components/screens/dashboard-screen'
import { dataSources } from '@/server/aws'
import { getAllServiceRows } from '@/server/queries'

// Las pantallas leen su estado de la URL con nuqs: render dinámico para que
// el HTML llegue ya con los filtros aplicados.
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [summary, trend, coverage, services] = await Promise.all([
    dataSources.costExplorer.getCostSummary(),
    dataSources.costExplorer.getMonthlyTrend(),
    dataSources.costExplorer.getCommitmentCoverage(),
    getAllServiceRows(),
  ])

  return (
    <Suspense>
      <DashboardScreen summary={summary} trend={trend} coverage={coverage} services={services} />
    </Suspense>
  )
}

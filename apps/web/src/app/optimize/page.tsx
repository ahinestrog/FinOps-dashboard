import { OptimizeScreen } from '@/components/screens/optimize-screen'
import { dataSources } from '@/server/aws'
import { commitmentTargetsFixture } from '@/server/aws/fixtures/cost'
import { recommendationResourcesFixture } from '@/server/aws/fixtures/optimization'

export const metadata = { title: 'Optimización · LedgerOps' }

export default async function OptimizePage() {
  const [savings, recommendations] = await Promise.all([
    dataSources.computeOptimizer.getSavingsSummary(),
    dataSources.computeOptimizer.listRecommendations(),
  ])

  return (
    <OptimizeScreen
      savings={savings}
      coverage={commitmentTargetsFixture}
      recommendations={recommendations}
      recommendationResources={recommendationResourcesFixture}
    />
  )
}

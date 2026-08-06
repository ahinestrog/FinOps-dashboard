import { Suspense } from 'react'
import { AdvisorScreen } from '@/components/screens/advisor-screen'
import { dataSources } from '@/server/aws'
import { advisorCheckResourcesFixture } from '@/server/aws/fixtures/advisor'

// Las pantallas leen su estado de la URL con nuqs: render dinámico para que
// el HTML llegue ya con los filtros aplicados.
export const dynamic = 'force-dynamic'

export const metadata = { title: 'Trusted Advisor · LedgerOps' }

export default async function TrustedAdvisorPage() {
  const categories = await dataSources.trustedAdvisor.listCategories()
  return (
    <Suspense>
      <AdvisorScreen categories={categories} checkResources={advisorCheckResourcesFixture} />
    </Suspense>
  )
}

import { Suspense } from 'react'
import { ResourcesScreen } from '@/components/screens/resources-screen'
import { getAllServiceRows } from '@/server/queries'

// Las pantallas leen su estado de la URL con nuqs: render dinámico para que
// el HTML llegue ya con los filtros aplicados.
export const dynamic = 'force-dynamic'

export const metadata = { title: 'Top recursos · LedgerOps' }

export default async function ResourcesPage() {
  const services = await getAllServiceRows()
  return (
    <Suspense>
      <ResourcesScreen services={services} />
    </Suspense>
  )
}

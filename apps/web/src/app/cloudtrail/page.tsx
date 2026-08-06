import { Suspense } from 'react'
import { TrailScreen } from '@/components/screens/trail-screen'
import { dataSources } from '@/server/aws'

// Las pantallas leen su estado de la URL con nuqs: render dinámico para que
// el HTML llegue ya con los filtros aplicados.
export const dynamic = 'force-dynamic'

export const metadata = { title: 'CloudTrail · LedgerOps' }

export default async function CloudTrailPage() {
  const [summary, events] = await Promise.all([
    dataSources.cloudTrail.getSummary(),
    dataSources.cloudTrail.lookupEvents(),
  ])

  const entries = await Promise.all(
    events.map(async (e) => [e.id, await dataSources.cloudTrail.getEventRecord(e.id)] as const),
  )
  const records = Object.fromEntries(entries.filter(([, record]) => record !== null))

  return (
    <Suspense>
      <TrailScreen summary={summary} events={events} records={records} />
    </Suspense>
  )
}

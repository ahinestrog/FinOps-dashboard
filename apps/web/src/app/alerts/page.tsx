import { AlertsScreen } from '@/components/screens/alerts-screen'
import { dataSources } from '@/server/aws'
import { anomalyActionsFixture } from '@/server/aws/fixtures/alerts'

export const metadata = { title: 'Alertas y anomalías · LedgerOps' }

export default async function AlertsPage() {
  const [anomalies, budgets] = await Promise.all([
    dataSources.costExplorer.getAnomalies(),
    dataSources.budgets.listBudgets(),
  ])

  return <AlertsScreen anomalies={anomalies} budgets={budgets} actions={anomalyActionsFixture} />
}

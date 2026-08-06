import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { AppShell } from '@/components/shell/app-shell'
import type { PaletteData } from '@/components/shell/command-palette'
import { themeBootstrapScript } from '@/lib/use-theme'
import { dataSources } from '@/server/aws'
import './globals.css'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'LedgerOps · Consola FinOps AWS',
  description:
    'Consola FinOps multi-cuenta: coste, anomalías, recomendaciones y top consumidores de una organización AWS.',
}

async function loadPaletteData(): Promise<PaletteData> {
  const [services, events] = await Promise.all([
    dataSources.resources.listServices(),
    dataSources.cloudTrail.lookupEvents(),
  ])
  return {
    resources: services.flatMap((s) =>
      s.resources.map((r) => ({
        id: r.id,
        name: r.name,
        type: r.type,
        account: r.account,
        service: s.service,
        serviceName: s.name,
      })),
    ),
    events: events.map((e) => ({
      time: e.time,
      eventName: e.eventName,
      identity: e.identity,
      region: e.region,
    })),
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [organization, paletteData] = await Promise.all([
    dataSources.costExplorer.getOrganization(),
    loadPaletteData(),
  ])

  return (
    <html lang="es" data-t="dark" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: fija el tema antes del primer pintado */}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body>
        <NuqsAdapter>
          <AppShell organization={organization} paletteData={paletteData}>
            {children}
          </AppShell>
        </NuqsAdapter>
      </body>
    </html>
  )
}

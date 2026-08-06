'use client'

import type { EvaluationWindow } from '@finops/types'
import { Button, Card, KpiCard, Segmented } from '@finops/ui'
import { useQueryState } from 'nuqs'
import { ResourceTable } from '@/components/resources/resource-table'
import { ServiceChips } from '@/components/resources/service-chips'
import { money } from '@/lib/finops/format'
import type { ServiceRows } from '@/lib/finops/types'
import { serviceParser, windowParser } from '@/lib/search-params'

const windowOptions = [
  { value: 14 as const, label: '14 d' },
  { value: 30 as const, label: '30 d' },
  { value: 90 as const, label: '90 d' },
]

export function ResourcesScreen({ services }: { services: ServiceRows[] }) {
  const [svc, setSvc] = useQueryState('svc', serviceParser)
  const [win, setWin] = useQueryState('win', windowParser)
  const active = services.find((s) => s.service === svc) ?? services[0]!
  const { summary } = active

  return (
    <section className="flex flex-col gap-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <ServiceChips
          services={services}
          value={active.service}
          onChange={(next) => setSvc(next)}
        />
        <div className="flex-1" />
        <span className="text-[11.5px] text-s-t2">Ventana de evaluación</span>
        <Segmented
          name="win"
          value={win as EvaluationWindow}
          options={windowOptions}
          onChange={(next) => setWin(next)}
          aria-label="Ventana de evaluación"
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        <KpiCard
          size="sm"
          label="Gasto del servicio (MTD)"
          value={money(summary.spend)}
          sub={`${summary.sharePct}% del gasto total`}
        />
        <KpiCard
          size="sm"
          label="Recursos analizados"
          value={summary.resourceCountLabel}
          sub={summary.accountsLabel}
        />
        <KpiCard
          size="sm"
          label={`Top 10 = ${summary.topTenSharePct}%`}
          value={money(summary.topTenSpend)}
          sub="concentración del gasto"
        />
        <KpiCard
          size="sm"
          ring="warn"
          label="Desperdicio detectado"
          value={money(summary.waste)}
          color="var(--s-warn)"
          sub={`${summary.wasteCount} recursos infrautilizados`}
        />
      </div>

      <Card className="px-1.5 pb-1.5 pt-3.5">
        <div className="flex items-baseline justify-between px-3 pb-1.5">
          <div>
            <div className="text-base font-medium">Top consumidores · {active.name}</div>
            <div className="text-xs text-s-t2">
              Ordenado por coste mensual · métricas de CloudWatch · clic para ver el histórico de 3
              meses
            </div>
            <div className="mt-1.5 flex items-center gap-3.5 text-[11.5px]">
              <span className="text-s-t2">Umbrales sobre {win} d:</span>
              <span className="flex items-center gap-1.5 text-s-bad">
                <span className="block h-[7px] w-[7px] rounded-full bg-s-bad" />
                Infrautilizado &lt; 20%
              </span>
              <span className="flex items-center gap-1.5 text-s-ok">
                <span className="block h-[7px] w-[7px] rounded-full bg-s-ok" />
                Óptimo 20 – 60%
              </span>
              <span className="flex items-center gap-1.5 text-s-warn">
                <span className="block h-[7px] w-[7px] rounded-full bg-s-warn" />
                Revisión &gt; 60%
              </span>
            </div>
          </div>
          <Button variant="secondary" className="text-[12.5px]">
            Exportar lista
          </Button>
        </div>
        <ResourceTable service={active} win={win as EvaluationWindow} />
      </Card>
    </section>
  )
}

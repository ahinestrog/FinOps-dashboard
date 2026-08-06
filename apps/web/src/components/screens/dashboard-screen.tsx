'use client'

import type {
  CommitmentCoverage,
  CostSummary,
  EvaluationWindow,
  MonthlyCostPoint,
} from '@finops/types'
import { Button, Card, KpiCard, MeterBar, StatusDot, TrendAreaChart } from '@finops/ui'
import { Sparkle } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { useQueryState } from 'nuqs'
import { ResourceTable } from '@/components/resources/resource-table'
import { ServiceChips } from '@/components/resources/service-chips'
import { useAgentPanel } from '@/components/shell/agent-context'
import { money, moneyK } from '@/lib/finops/format'
import type { ServiceRows } from '@/lib/finops/types'
import { serviceParser, windowParser } from '@/lib/search-params'

export interface DashboardScreenProps {
  summary: CostSummary
  trend: MonthlyCostPoint[]
  coverage: CommitmentCoverage[]
  services: ServiceRows[]
}

const toneFor = (c: CommitmentCoverage) =>
  c.targetPct !== null && c.pct < c.targetPct ? 'warn' : 'ok'

export function DashboardScreen({ summary, trend, coverage, services }: DashboardScreenProps) {
  const [pillar, setPillar] = useQueryState('pillar', serviceParser)
  const [win] = useQueryState('win', windowParser)
  const { openAgent } = useAgentPanel()

  const active = services.find((s) => s.service === pillar) ?? services[0]!
  const overBudget = summary.forecast - summary.budget
  const budgetPct = Math.round((summary.forecast / summary.budget) * 100)

  return (
    <section className="flex max-w-[1560px] flex-col gap-3.5">
      {/* Barra de estado: una línea con el titular, la causa y el siguiente paso. */}
      <Card radius="lg" className="flex items-center gap-3.5 px-[18px] py-3.5">
        <StatusDot color={overBudget > 0 ? 'var(--s-warn)' : 'var(--s-ok)'} pulse />
        <div className="min-w-0 flex-1">
          {overBudget > 0 ? (
            <>
              <span className="text-[14.5px] text-s-warn">
                Vas a superar el budget en {moneyK(overBudget)}
              </span>
              <span className="text-[13px] text-s-t2">
                {' '}
                — forecast {moneyK(summary.forecast)} sobre {moneyK(summary.budget)}, con{' '}
                {summary.criticalAnomalies} anomalías activas que explican{' '}
                {moneyK(summary.anomalyDailyImpact)}/día.
              </span>
            </>
          ) : (
            <>
              <span className="text-[14.5px] text-s-ok">Dentro del budget del mes</span>
              <span className="text-[13px] text-s-t2">
                {' '}
                — forecast {moneyK(summary.forecast)} sobre {moneyK(summary.budget)}.
              </span>
            </>
          )}
        </div>
        <Button variant="ghost" asChild className="flex-none text-[12.5px]">
          <Link href="/alerts">Ver anomalías →</Link>
        </Button>
      </Card>

      <div className="grid grid-cols-4 gap-3.5">
        <KpiCard
          label="Coste amortizado MTD"
          value={money(summary.amortizedMtd)}
          sub={`+${summary.amortizedDeltaPct}% vs. ${summary.previousMonthLabel} · ${moneyK(summary.amortizedDeltaAmount)} más`}
        />
        <KpiCard
          label="Forecast fin de mes"
          value={money(summary.forecast)}
          color={overBudget > 0 ? 'var(--s-warn)' : 'var(--s-ok)'}
          sub={`${budgetPct}% del budget de ${moneyK(summary.budget)}`}
        />
        <KpiCard
          label="Ahorro identificado"
          value={money(summary.identifiedSavings)}
          color="var(--s-ok)"
          sub={`${summary.openRecommendations} recomendaciones abiertas`}
        />
        <KpiCard
          label="Anomalías activas"
          value={String(summary.activeAnomalies)}
          color="var(--s-bad)"
          sub={`${summary.criticalAnomalies} críticas · ${money(summary.anomalyDailyImpact)}/día`}
        />
      </div>

      <div className="grid grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-3.5">
        <Card radius="lg" className="px-5 pb-3 pt-[18px]">
          <div className="mb-2.5 flex items-start justify-between gap-3.5">
            <div>
              <div className="text-base font-medium">Tendencia de gasto</div>
              <div className="mt-0.5 text-xs text-s-t2">12 meses · coste amortizado</div>
            </div>
            <div className="flex items-center gap-3.5 text-[11.5px] text-s-t2">
              <span className="flex items-center gap-1.5">
                <span className="block h-0.5 w-3.5 bg-s-acc" />
                Gasto
              </span>
              <span className="flex items-center gap-1.5">
                <span className="block w-3.5 border-t-[1.5px] border-dashed border-s-warn" />
                Budget
              </span>
            </div>
          </div>
          <TrendAreaChart
            values={trend.map((p) => p.amountK)}
            months={trend.map((p) => p.month)}
            min={380}
            max={530}
            budget={summary.budget / 1000}
            gridValues={[420, 450, 480, 510]}
          />
        </Card>

        <Card radius="lg" className="flex flex-col px-5 py-[18px]">
          <div className="text-base font-medium">Compromisos</div>
          <div className="mb-[18px] mt-0.5 text-xs text-s-t2">
            Cobertura y uso sobre gasto elegible
          </div>
          <div className="flex flex-col gap-4">
            {coverage.map((c) => {
              const tone = toneFor(c)
              return (
                <div key={c.id}>
                  <div className="mb-[7px] flex items-baseline justify-between text-[12.5px]">
                    <span className="text-s-t1">{c.name}</span>
                    <span
                      className="text-[15px] font-medium tabular-nums"
                      style={{ color: tone === 'ok' ? 'var(--s-ok)' : 'var(--s-warn)' }}
                    >
                      {c.pct}%
                    </span>
                  </div>
                  <MeterBar value={c.pct} tone={tone} height={5} aria-label={c.name} />
                </div>
              )
            })}
          </div>
          <div className="mt-auto flex items-baseline justify-between pt-[18px]">
            <span className="text-[12.5px] text-s-t2">Ahorro pendiente</span>
            <span className="text-[17px] font-medium text-s-ok">
              {money(summary.identifiedSavings)}/mes
            </span>
          </div>
        </Card>
      </div>

      <Card radius="lg" className="px-2 pb-2 pt-[18px]">
        <div className="flex flex-wrap items-center gap-2.5 px-3 pb-3">
          <div>
            <div className="text-base font-medium">Top consumidores</div>
            <div className="mt-0.5 text-xs text-s-t2">
              Utilización a {win} d · &lt;20% infrautilizado · &gt;60% revisión
            </div>
          </div>
          <div className="flex-1" />
          <ServiceChips
            services={services}
            value={active.service}
            onChange={(next) => setPillar(next)}
            showCount={false}
          />
          <Button variant="ghost" asChild className="text-xs">
            <Link href="/resources">Ver todo →</Link>
          </Button>
        </div>
        <ResourceTable service={active} win={win as EvaluationWindow} compact limit={5} />
      </Card>

      <Card radius="lg" ring="accent" className="flex items-center gap-4 px-[18px] py-3.5">
        <div className="grid h-8 w-8 flex-none place-items-center rounded-[9px] border border-s-acc-b text-s-acc-soft">
          <Sparkle size={17} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-[9px]">
            <span className="text-sm font-medium">FinOps Agent</span>
            <span className="rounded-[5px] border border-s-acc-b px-1.5 py-px text-[9.5px] uppercase tracking-[0.07em] text-s-acc-soft">
              AWS Preview
            </span>
          </div>
          <div className="mt-0.5 text-[12.5px] text-s-t2">
            Hueco reservado sobre los mismos datos del CUR: preguntas en lenguaje natural sobre
            coste y anomalías.
          </div>
        </div>
        <Button variant="secondary" className="flex-none" onClick={openAgent}>
          Abrir panel
        </Button>
      </Card>
    </section>
  )
}

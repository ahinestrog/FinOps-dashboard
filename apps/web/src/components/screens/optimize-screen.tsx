'use client'

import type { CommitmentCoverage, Recommendation, SavingsSummary } from '@finops/types'
import { Card, MeterBar, Modal, ModalBody, ModalList, Tag } from '@finops/ui'
import { useState } from 'react'
import { money } from '@/lib/finops/format'

export interface OptimizeScreenProps {
  savings: SavingsSummary
  coverage: CommitmentCoverage[]
  recommendations: Recommendation[]
  recommendationResources: { name: string; meta: string; value: string }[]
}

/** Color por distancia al objetivo: cumplido, cerca o lejos. */
function coverageColor(c: CommitmentCoverage): { color: string; tone: 'ok' | 'warn' | 'bad' } {
  if (c.targetPct === null || c.pct >= c.targetPct) return { color: 'var(--s-ok)', tone: 'ok' }
  if (c.targetPct - c.pct <= 25) return { color: 'var(--s-warn)', tone: 'warn' }
  return { color: 'var(--s-bad)', tone: 'bad' }
}

export function OptimizeScreen({
  savings,
  coverage,
  recommendations,
  recommendationResources,
}: OptimizeScreenProps) {
  const [selected, setSelected] = useState<Recommendation | null>(null)
  const topSource = Math.max(...savings.sources.map((s) => s.monthlySaving))

  return (
    <section className="flex flex-col gap-3.5">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-3">
        <div className="rounded-lg bg-gradient-to-br from-s-card to-s-surf2 px-[18px] py-4 shadow-ring-acc">
          <div className="text-[12.5px] text-s-t2">Ahorro potencial anualizado</div>
          <div className="mb-0.5 mt-1.5 text-[34px] font-medium tracking-[-0.02em] text-s-ok">
            {money(savings.annualized)}
          </div>
          <div className="text-xs text-s-t2">
            {money(savings.monthly)} al mes · {savings.openRecommendations} recomendaciones abiertas
          </div>
          <div className="hr my-3.5" />
          <div className="flex flex-col gap-[9px]">
            {savings.sources.map((s) => (
              <div key={s.name} className="flex items-center gap-2.5 text-[12.5px]">
                <span className="flex-1 text-s-t1">{s.name}</span>
                <span className="tabular-nums">{money(s.monthlySaving)}</span>
                <MeterBar
                  value={(s.monthlySaving / topSource) * 100}
                  tone="ok"
                  height={4}
                  className="w-[54px]"
                  aria-label={`Ahorro de ${s.name}`}
                />
              </div>
            ))}
          </div>
        </div>

        <Card className="px-[18px] py-4">
          <div className="mb-1 text-base font-medium">Cobertura de compromisos</div>
          <div className="mb-4 text-xs text-s-t2">
            Savings Plans y Reserved Instances sobre gasto elegible
          </div>
          <div className="grid grid-cols-3 gap-4">
            {coverage.map((c) => {
              const tone = coverageColor(c)
              return (
                <div key={c.id}>
                  <div className="mb-1.5 flex items-baseline justify-between text-[12.5px]">
                    <span className="text-s-t1">{c.name}</span>
                    <span className="text-[15px] font-medium" style={{ color: tone.color }}>
                      {c.pct}%
                    </span>
                  </div>
                  <MeterBar value={c.pct} tone={tone.tone} height={6} aria-label={c.name} />
                  <div className="mt-1.5 text-[11px] text-s-t3">objetivo {c.targetPct}%</div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {recommendations.map((r) => (
          <button
            type="button"
            key={r.id}
            onClick={() => setSelected(r)}
            className="flex flex-col gap-[9px] rounded-lg bg-s-card px-4 py-[15px] text-left shadow-ring hover:shadow-ring-acc"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] uppercase tracking-[0.09em] text-s-acc-soft">
                {r.source}
              </span>
              <Tag
                tone={
                  r.effort === 'Bajo'
                    ? { fg: 'var(--s-ok)', bg: 'var(--s-ok-t)' }
                    : { fg: 'var(--s-warn)', bg: 'var(--s-warn-t)' }
                }
              >
                Esfuerzo {r.effort.toLowerCase()}
              </Tag>
            </div>
            <div className="text-[15px] font-medium leading-[1.25]">{r.title}</div>
            <div className="text-[12.5px] leading-[1.45] text-s-t2">{r.description}</div>
            <div className="mt-0.5 flex items-baseline justify-between">
              <span className="text-xl font-medium text-s-ok">{money(r.monthlySaving)}/mes</span>
              <span className="text-[11px] text-s-t3">{r.account}</span>
            </div>
          </button>
        ))}
      </div>

      {selected ? (
        <Modal
          open
          onOpenChange={(open) => {
            if (!open) setSelected(null)
          }}
          kicker={`Optimización · ${selected.source}`}
          title={selected.title}
          sub={`${selected.account} · recomendación abierta hace 3 días`}
          stats={[
            {
              label: 'Ahorro mensual',
              value: `${money(selected.monthlySaving)}/mes`,
              color: 'var(--s-ok)',
            },
            {
              label: 'Esfuerzo',
              value: selected.effort,
              color: selected.effort === 'Bajo' ? 'var(--s-ok)' : 'var(--s-warn)',
            },
            {
              label: 'Riesgo',
              value: selected.effort === 'Bajo' ? 'Bajo' : 'Medio · requiere ventana',
            },
          ]}
          action="Aplicar recomendación"
          onAction={() => setSelected(null)}
        >
          <ModalBody>
            {selected.description} El plan propuesto se ejecuta por lotes del 20% de los recursos,
            con 48 h de observación de métricas de CloudWatch entre lotes y rollback automático si
            p95 de latencia sube más del 10%.
          </ModalBody>
          <ModalList title="Recursos incluidos" items={recommendationResources} />
        </Modal>
      ) : null}
    </section>
  )
}

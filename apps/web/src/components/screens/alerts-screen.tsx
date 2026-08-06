'use client'

import type { Anomaly, AnomalyAction, Budget } from '@finops/types'
import { Button, Card, MeterBar, Modal, ModalBody, ModalList, Sparkline, Tag } from '@finops/ui'
import { Warning } from '@phosphor-icons/react/dist/ssr'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { money } from '@/lib/finops/format'

export interface AlertsScreenProps {
  anomalies: Anomaly[]
  budgets: Budget[]
  actions: AnomalyAction[]
}

const severityColor = (a: Anomaly) => (a.severity === 'Crítica' ? 'var(--s-bad)' : 'var(--s-warn)')
const severityBg = (a: Anomaly) => (a.severity === 'Crítica' ? 'var(--s-bad-t)' : 'var(--s-warn-t)')

const budgetTone = {
  ok: { color: 'var(--s-ok)', tone: 'ok' as const },
  warn: { color: 'var(--s-warn)', tone: 'warn' as const },
  exceeded: { color: 'var(--s-bad)', tone: 'bad' as const },
}

export function AlertsScreen({ anomalies, budgets, actions }: AlertsScreenProps) {
  const [selected, setSelected] = useState<Anomaly | null>(null)
  const router = useRouter()

  return (
    <section className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-3">
        {anomalies.map((a) => (
          <Card
            key={a.id}
            ring={a.severity === 'Crítica' ? 'bad' : 'line'}
            className="flex items-center gap-5 px-[18px] py-[15px]"
          >
            <div
              className="grid h-[34px] w-[34px] flex-none place-items-center rounded-[9px]"
              style={{ background: severityBg(a), color: severityColor(a) }}
            >
              <Warning size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-[3px] flex items-center gap-[9px]">
                <span className="text-[15px] font-medium">{a.title}</span>
                <Tag tone={{ fg: severityColor(a), bg: severityBg(a) }}>{a.severity}</Tag>
              </div>
              <div className="text-[12.5px] text-s-t2">
                {a.account} · {a.region} · {a.detectedLabel}
              </div>
              <div className="mt-[5px] text-[12.5px] text-s-t1">Causa probable: {a.cause}</div>
            </div>
            <Sparkline
              values={a.series}
              width={120}
              height={44}
              scale="auto"
              color={severityColor(a)}
              strokeWidth={1.8}
            />
            <div className="flex-none text-right">
              <div className="text-xl font-medium" style={{ color: severityColor(a) }}>
                +{money(a.dailyImpact)}/día
              </div>
              <div className="text-[11px] text-s-t3">impacto estimado</div>
            </div>
            <Button variant="primary" className="flex-none" onClick={() => setSelected(a)}>
              Investigar
            </Button>
          </Card>
        ))}
      </div>

      <Card className="px-[18px] py-4">
        <div className="mb-3.5 flex items-baseline justify-between">
          <div>
            <div className="text-base font-medium">Budgets</div>
            <div className="text-xs text-s-t2">AWS Budgets · alertas al 80% y 100%</div>
          </div>
          <Button variant="secondary" className="text-[12.5px]">
            Nuevo budget
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-x-[26px] gap-y-4">
          {budgets.map((b) => {
            const tone = budgetTone[b.status]
            return (
              <div key={b.id}>
                <div className="mb-1.5 flex items-baseline justify-between text-[13px]">
                  <span>{b.name}</span>
                  <span className="tabular-nums text-s-t2">
                    {b.spentLabel} / {b.limitLabel}
                  </span>
                </div>
                <MeterBar
                  value={Math.min(100, (b.spent / b.limit) * 100)}
                  tone={tone.tone}
                  height={6}
                  aria-label={b.name}
                />
                <div className="mt-[5px] text-[11px]" style={{ color: tone.color }}>
                  {b.note}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {selected ? (
        <Modal
          open
          onOpenChange={(open) => {
            if (!open) setSelected(null)
          }}
          kicker="Cost Anomaly Detection"
          title={selected.title}
          sub={`${selected.account} · ${selected.region} · ${selected.detectedLabel}`}
          stats={[
            { label: 'Severidad', value: selected.severity, color: severityColor(selected) },
            {
              label: 'Impacto',
              value: `+${money(selected.dailyImpact)}/día`,
              color: severityColor(selected),
            },
            { label: 'Evidencia CloudTrail', value: '4 eventos', color: 'var(--s-acc-soft)' },
          ]}
          action="Ver evidencia en CloudTrail"
          onAction={() => {
            setSelected(null)
            router.push('/cloudtrail?cost=true')
          }}
        >
          <ModalBody>
            Causa probable: {selected.cause}. La detección compara el gasto diario con la banda
            esperada de los últimos 60 días por servicio, cuenta y región. Evidencia correlacionada:{' '}
            {selected.evidence}.
          </ModalBody>
          <ModalList
            title="Acciones sugeridas"
            items={actions.map((a) => ({
              name: a.name,
              meta: a.meta,
              value: `${money(a.dailySaving)}/día`,
            }))}
          />
        </Modal>
      ) : null}
    </section>
  )
}

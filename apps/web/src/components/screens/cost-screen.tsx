'use client'

import type { CostDimension, CostRecord, CostStackSeries, MonthlyCostPoint } from '@finops/types'
import {
  Button,
  Card,
  ClickableRow,
  MeterBar,
  Modal,
  ModalBody,
  ModalList,
  Segmented,
  StackedBarChart,
  Table,
} from '@finops/ui'
import { DownloadSimple } from '@phosphor-icons/react/dist/ssr'
import { useQueryState } from 'nuqs'
import { useState } from 'react'
import { deltaColor, money } from '@/lib/finops/format'
import { groupParser } from '@/lib/search-params'

export interface CostScreenProps {
  trend: MonthlyCostPoint[]
  stackSeries: CostStackSeries[]
  breakdowns: Record<CostDimension, CostRecord[]>
}

const groupOptions = [
  { value: 'service' as const, label: 'Servicio' },
  { value: 'account' as const, label: 'Cuenta' },
  { value: 'region' as const, label: 'Región' },
  { value: 'tag' as const, label: 'Tag: Team' },
]

const periodOptions = [
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: '12m', label: '12m' },
]

const groupLabels: Record<CostDimension, string> = {
  service: 'servicio',
  account: 'cuenta',
  region: 'región',
  tag: 'tag',
}

const seriesFills = [
  'var(--s-acc)',
  'var(--s-acc2)',
  'var(--s-acc3)',
  'var(--s-acc-soft)',
  'var(--s-ring)',
]

export function CostScreen({ trend, stackSeries, breakdowns }: CostScreenProps) {
  const [group, setGroup] = useQueryState('group', groupParser)
  const [period, setPeriod] = useState('12m')
  const [selected, setSelected] = useState<CostRecord | null>(null)

  const rows = breakdowns[group]
  const total = rows.reduce((acc, r) => acc + r.amountMtd, 0)
  const topCost = rows[0]?.amountMtd ?? 1
  const label = groupLabels[group]
  const series = stackSeries.map((s, i) => ({ ...s, fill: seriesFills[i] ?? 'var(--s-ring)' }))

  return (
    <section className="flex flex-col gap-3.5">
      <div className="flex flex-wrap items-center gap-2.5">
        <Segmented
          name="grp"
          value={group}
          options={groupOptions}
          onChange={(next) => setGroup(next)}
          aria-label="Agrupar por"
        />
        <div className="flex-1" />
        <Segmented
          name="per"
          value={period}
          options={periodOptions}
          onChange={setPeriod}
          aria-label="Periodo"
        />
        <Button variant="secondary">
          <DownloadSimple size={15} />
          Exportar CSV
        </Button>
      </div>

      <Card className="px-[18px] pb-3 pt-4">
        <div className="mb-3.5 flex items-center justify-between gap-3">
          <div>
            <div className="text-base font-medium">Gasto mensual por servicio</div>
            <div className="text-xs text-s-t2">Amortizado · 14 cuentas · sin impuestos</div>
          </div>
          <div className="flex flex-wrap items-center gap-[13px] text-[11.5px] text-s-t2">
            {series.map((s) => (
              <span key={s.name} className="flex items-center gap-1.5">
                <span className="block h-[9px] w-[9px] rounded-sm" style={{ background: s.fill }} />
                {s.name}
              </span>
            ))}
          </div>
        </div>
        <StackedBarChart
          values={trend.map((p) => p.amountK)}
          months={trend.map((p) => p.month)}
          series={series}
          max={540}
        />
      </Card>

      <Card className="px-1.5 pb-1.5 pt-3.5">
        <div className="flex items-baseline justify-between px-3 pb-1.5">
          <div className="text-base font-medium">Desglose por {label}</div>
          <div className="text-xs text-s-t2">Clic en una fila para el detalle</div>
        </div>
        <Table>
          <thead>
            <tr>
              <th className="capitalize">{label}</th>
              <th className="text-right">Gasto MTD</th>
              <th className="text-right">Δ mes anterior</th>
              <th>Share</th>
              <th className="text-right">Forecast</th>
              <th className="text-right">Cobertura SP/RI</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const delta = `${r.deltaPct > 0 ? '+' : ''}${r.deltaPct.toFixed(1)}%`
              return (
                <ClickableRow key={r.id} onActivate={() => setSelected(r)}>
                  <td className="text-[13.5px]">{r.name}</td>
                  <td className="text-right tabular-nums">{money(r.amountMtd)}</td>
                  <td className="text-right tabular-nums" style={{ color: deltaColor(delta) }}>
                    {delta}
                  </td>
                  <td style={{ width: 150 }}>
                    <div className="flex items-center gap-2">
                      <MeterBar
                        value={(r.amountMtd / topCost) * 100}
                        tone="acc2"
                        height={4}
                        className="flex-1"
                        aria-label={`Share de ${r.name}`}
                      />
                      <span className="w-8 text-right text-[11px] text-s-t2">
                        {Math.round((r.amountMtd / total) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="text-right tabular-nums text-s-t1">{money(r.forecast)}</td>
                  <td
                    className="text-right tabular-nums"
                    style={{ color: r.coveragePct < 55 ? 'var(--s-warn)' : 'var(--s-ok)' }}
                  >
                    {r.coveragePct}%
                  </td>
                </ClickableRow>
              )
            })}
          </tbody>
        </Table>
      </Card>

      {selected ? (
        <Modal
          open
          onOpenChange={(open) => {
            if (!open) setSelected(null)
          }}
          kicker={`Cost Explorer · ${label}`}
          title={selected.name}
          sub={`Gasto MTD ${money(selected.amountMtd)} · ${Math.round((selected.amountMtd / total) * 100)}% del total`}
          stats={[
            {
              label: 'Δ mes anterior',
              value: `${selected.deltaPct > 0 ? '+' : ''}${selected.deltaPct.toFixed(1)}%`,
              color: selected.deltaPct > 0 ? 'var(--s-warn)' : 'var(--s-ok)',
            },
            { label: 'Forecast fin de mes', value: money(selected.forecast) },
            {
              label: 'Ahorro identificado',
              value: money(selected.amountMtd * 0.13),
              color: 'var(--s-ok)',
            },
          ]}
          action="Crear informe"
          onAction={() => setSelected(null)}
        >
          <ModalBody>
            El desglose se calcula sobre coste amortizado, con los créditos y los Savings Plans
            repartidos entre las cuentas de la organización. La variación se compara con el mismo
            número de días del mes anterior para evitar falsos picos.
          </ModalBody>
          <ModalList
            title="Principales contribuyentes"
            items={[
              {
                name: 'i-0a3f19c74b2e8d551',
                meta: 'm6i.4xlarge · us-east-1',
                value: money(selected.amountMtd * 0.18),
              },
              {
                name: 'i-04c81ba9de7712f30',
                meta: 'm5.2xlarge · us-east-1',
                value: money(selected.amountMtd * 0.12),
              },
              {
                name: 'eks/data-ingest-prod',
                meta: 'node group · eu-west-1',
                value: money(selected.amountMtd * 0.09),
              },
              {
                name: 'rds/payments-primary',
                meta: 'db.r6g.4xlarge · us-east-1',
                value: money(selected.amountMtd * 0.07),
              },
            ]}
          />
        </Modal>
      ) : null}
    </section>
  )
}

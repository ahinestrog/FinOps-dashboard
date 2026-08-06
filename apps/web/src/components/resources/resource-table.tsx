'use client'

import type { EvaluationWindow } from '@finops/types'
import { ClickableRow, MeterBar, Sparkline, Table, Tag } from '@finops/ui'
import { useState } from 'react'
import { deltaColor, money } from '@/lib/finops/format'
import type { ResourceRow, ServiceRows } from '@/lib/finops/types'
import { resolveUtilization, utilizationState } from '@/lib/finops/utilization'
import { ResourceModal } from './resource-modal'

export interface ResourceTableProps {
  service: ServiceRows
  win: EvaluationWindow
  /** Versión del dashboard: sin Δ y con el sparkline dentro de la utilización. */
  compact?: boolean
  limit?: number
}

/** Sparkline de 90 d: un punto de cada tres, sobre el eje 0–100. */
const sparkValues = (points: number[]) => points.filter((_, i) => i % 3 === 0)

export function ResourceTable({ service, win, compact = false, limit }: ResourceTableProps) {
  const [selected, setSelected] = useState<ResourceRow | null>(null)
  const rows = limit ? service.rows.slice(0, limit) : service.rows

  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>Recurso</th>
            <th>{compact ? 'Tipo' : service.typeLabel}</th>
            <th>Cuenta · región</th>
            <th>
              {compact ? 'Utilización' : service.metricLabel} · {win} d
            </th>
            {compact ? null : <th>90 d</th>}
            <th className="text-right">Coste/mes</th>
            {compact ? null : <th className="text-right">Δ</th>}
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const { resource, series } = row
            const utilization = resolveUtilization(resource.utilization, series, win)
            const state = utilizationState(utilization, service.kind, resource.actionSaving)
            return (
              <ClickableRow key={resource.id} onActivate={() => setSelected(row)}>
                <td>
                  <div className="font-mono text-[13px]">{resource.id}</div>
                  {compact ? null : <div className="text-[11.5px] text-s-t2">{resource.name}</div>}
                </td>
                <td>
                  <Tag variant="outline" className="font-mono text-[11px]">
                    {resource.type}
                  </Tag>
                </td>
                <td className="text-[12.5px] text-s-t1">
                  {resource.account} · {resource.region}
                </td>
                <td style={{ width: compact ? 190 : 170 }}>
                  <div className="flex items-center gap-[9px]">
                    <MeterBar
                      value={utilization}
                      tone={state.tone}
                      height={4}
                      className="flex-1"
                      aria-label={`${service.metricLabel} ${utilization}%`}
                    />
                    <span className="w-11 text-right text-[11.5px] tabular-nums text-s-t2">
                      {utilization}%
                    </span>
                    {compact ? (
                      <Sparkline
                        values={sparkValues(series.points)}
                        width={60}
                        height={18}
                        color={state.fg}
                        className="w-[52px]"
                      />
                    ) : null}
                  </div>
                </td>
                {compact ? null : (
                  <td style={{ width: 66 }}>
                    <Sparkline
                      values={sparkValues(series.points)}
                      width={60}
                      height={18}
                      color={state.fg}
                    />
                  </td>
                )}
                <td className="text-right tabular-nums">{money(resource.monthlyCost)}</td>
                {compact ? null : (
                  <td
                    className="text-right tabular-nums"
                    style={{ color: deltaColor(resource.deltaLabel) }}
                  >
                    {resource.deltaLabel}
                  </td>
                )}
                <td>
                  <Tag tone={{ fg: state.fg, bg: state.bg }}>{state.label}</Tag>
                  {!compact && resource.action !== 'Sin acción' ? (
                    <div className="mt-1 text-[11px] text-s-t3">{resource.action}</div>
                  ) : null}
                </td>
              </ClickableRow>
            )
          })}
        </tbody>
      </Table>
      <ResourceModal
        row={selected}
        onClose={() => setSelected(null)}
        serviceName={service.name}
        kind={service.kind}
        metricLabel={service.metricLabel}
        win={win}
      />
    </>
  )
}

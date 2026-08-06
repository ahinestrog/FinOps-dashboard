'use client'

import type { EvaluationWindow, MetricKind } from '@finops/types'
import { HistoryChart, Modal, ModalBody, ModalList } from '@finops/ui'
import { money } from '@/lib/finops/format'
import type { ResourceRow } from '@/lib/finops/types'
import { resolveUtilization, utilizationState } from '@/lib/finops/utilization'
import { buildVerdict, historyStats } from '@/lib/finops/verdict'

export interface ResourceModalProps {
  row: ResourceRow | null
  onClose: () => void
  serviceName: string
  kind: MetricKind
  metricLabel: string
  win: EvaluationWindow
}

/** Detalle de un recurso: histórico de 90 días, veredicto y acción propuesta. */
export function ResourceModal({
  row,
  onClose,
  serviceName,
  kind,
  metricLabel,
  win,
}: ResourceModalProps) {
  if (!row) return null

  const { resource, series } = row
  const utilization = resolveUtilization(resource.utilization, series, win)
  const state = utilizationState(utilization, kind, resource.actionSaving)
  const verdict = buildVerdict({ resource, series, utilization, kind, metricLabel, win })
  const hasAction = resource.actionSaving > 0

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      kicker={`${serviceName} · recurso`}
      title={resource.id}
      sub={`${resource.name} · ${resource.type} · ${resource.account} · ${resource.region}`}
      stats={[
        { label: 'Coste mensual', value: money(resource.monthlyCost) },
        { label: `${metricLabel} · ${win} d`, value: `${utilization}%`, color: state.fg },
        { label: 'Estado', value: state.label, color: state.fg },
      ]}
      action={
        hasAction
          ? kind === 'compute'
            ? 'Aplicar rightsizing'
            : 'Aplicar acción'
          : 'Marcar como revisado'
      }
      onAction={onClose}
    >
      <ModalBody>{resource.explanation}</ModalBody>
      <HistoryChart
        points={series.points}
        title={`${metricLabel.split(' ')[0]} · media diaria · 90 días · ${resource.type}`}
        stats={historyStats(series, state)}
        monthLabels={['May', 'Jun', 'Jul', 'Ago']}
        verdict={verdict}
      />
      <ModalList
        title={hasAction ? 'Detalle y acción propuesta' : 'Detalle del recurso'}
        items={[
          ...(hasAction
            ? [
                {
                  name: resource.action,
                  meta: `recomendación ${kind === 'compute' ? 'Compute Optimizer' : 'LedgerOps'}`,
                  value: `${money(resource.actionSaving)}/mes`,
                },
              ]
            : []),
          {
            name: hasAction ? 'Ventana de cambio' : 'Última revisión',
            meta: hasAction ? 'sábado 02:00–04:00 UTC' : 'hace 6 días · sin desperdicio detectado',
            value: hasAction ? 'sin downtime' : 'al día',
          },
          { name: 'Owner', meta: 'tag Team · rollback automático', value: 'platform' },
        ]}
      />
    </Modal>
  )
}

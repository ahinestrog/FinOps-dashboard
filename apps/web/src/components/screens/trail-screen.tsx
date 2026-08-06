'use client'

import type { TrailEvent, TrailSummary } from '@finops/types'
import {
  Button,
  Card,
  ClickableRow,
  cn,
  KpiCard,
  Modal,
  ModalBody,
  ModalJson,
  Table,
  Tag,
} from '@finops/ui'
import { MagnifyingGlass, MagnifyingGlassMinus } from '@phosphor-icons/react/dist/ssr'
import { useQueryState } from 'nuqs'
import { useState } from 'react'
import { boolFilterParser, queryParser } from '@/lib/search-params'

export interface TrailScreenProps {
  summary: TrailSummary
  events: TrailEvent[]
  /** Registro crudo de CloudTrail por id de evento. */
  records: Record<string, unknown>
}

const resultColor = (result: TrailEvent['result']) =>
  result === 'Success'
    ? 'var(--s-ok)'
    : result === 'AccessDenied'
      ? 'var(--s-warn)'
      : 'var(--s-bad)'

const resultBg = (result: TrailEvent['result']) =>
  result === 'Success'
    ? 'var(--s-ok-t)'
    : result === 'AccessDenied'
      ? 'var(--s-warn-t)'
      : 'var(--s-bad-t)'

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'btn border',
        active
          ? 'border-s-acc bg-s-acc-t text-s-acc-strong'
          : 'border-s-fill bg-transparent text-s-t1',
      )}
    >
      {children}
    </button>
  )
}

export function TrailScreen({ summary, events, records }: TrailScreenProps) {
  const [query, setQuery] = useQueryState('q', queryParser)
  const [writes, setWrites] = useQueryState('writes', boolFilterParser)
  const [errors, setErrors] = useQueryState('errors', boolFilterParser)
  const [costOnly, setCostOnly] = useQueryState('cost', boolFilterParser)
  const [selected, setSelected] = useState<TrailEvent | null>(null)

  const q = query.trim().toLowerCase()
  const filtered = events.filter((e) => {
    const haystack =
      `${e.eventName} ${e.identity} ${e.account} ${e.sourceIp} ${e.region}`.toLowerCase()
    if (q && !haystack.includes(q)) return false
    if (writes && !e.isWrite) return false
    if (errors && e.result === 'Success') return false
    if (costOnly && !e.costImpact) return false
    return true
  })

  const clearFilters = () => {
    setQuery('')
    setWrites(false)
    setErrors(false)
    setCostOnly(false)
  }

  return (
    <section className="flex flex-col gap-3.5">
      <div className="grid grid-cols-4 gap-3">
        <KpiCard size="sm" label="Eventos 24 h" value={summary.events24h.toLocaleString('en-US')} />
        <KpiCard size="sm" label="AccessDenied" value={summary.accessDenied} color="var(--s-bad)" />
        <KpiCard size="sm" label="Identidades activas" value={summary.activeIdentities} />
        <KpiCard
          size="sm"
          ring="accent"
          label="Eventos con impacto en coste"
          value={summary.costImpactEvents}
          color="var(--s-acc-soft)"
        />
      </div>

      <div className="flex flex-wrap items-center gap-[9px]">
        <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-lg bg-s-card px-3 py-2 shadow-ring">
          <MagnifyingGlass size={15} className="text-s-t3" />
          <input
            className="input min-h-0 border-0 bg-transparent p-0 font-mono text-[13px]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filtrar por eventName, usuario, IP o cuenta…"
            aria-label="Filtrar eventos"
          />
        </div>
        <FilterChip active={writes} onClick={() => setWrites(!writes)}>
          Solo escrituras
        </FilterChip>
        <FilterChip active={errors} onClick={() => setErrors(!errors)}>
          Con error
        </FilterChip>
        <FilterChip active={costOnly} onClick={() => setCostOnly(!costOnly)}>
          Impacto en coste
        </FilterChip>
        <span className="text-xs text-s-t2">{filtered.length} eventos</span>
      </div>

      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center gap-2.5 px-5 py-11 text-center">
          <MagnifyingGlassMinus size={26} className="text-s-t3" />
          <div className="text-[15px] font-medium">Ningún evento coincide con los filtros</div>
          <div className="max-w-[380px] text-[12.5px] text-s-t2">
            Prueba con otro eventName o identidad, o amplía los filtros activos para volver a ver la
            actividad de las últimas 24 h.
          </div>
          <Button variant="primary" className="mt-1" onClick={clearFilters}>
            Limpiar filtros
          </Button>
        </Card>
      ) : (
        <Card className="px-1.5 pb-1 pt-1.5">
          <Table className="font-mono text-[12.5px]">
            <thead>
              <tr>
                <th>Hora (UTC)</th>
                <th>eventName</th>
                <th>Identidad</th>
                <th>Cuenta</th>
                <th>Región</th>
                <th>IP origen</th>
                <th className="text-right">Resultado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <ClickableRow key={e.id} onActivate={() => setSelected(e)}>
                  <td className="whitespace-nowrap text-s-t2">{e.time}</td>
                  <td>
                    <span style={{ color: resultColor(e.result) }}>{e.eventName}</span>
                    <span className="text-s-t3">
                      {' '}
                      · {e.eventSource.replace('.amazonaws.com', '')}
                    </span>
                  </td>
                  <td className="text-s-t1">{e.identity}</td>
                  <td className="text-s-t2">{e.account}</td>
                  <td className="text-s-t2">{e.region}</td>
                  <td className="text-s-t2">{e.sourceIp}</td>
                  <td className="text-right">
                    <Tag tone={{ fg: resultColor(e.result), bg: resultBg(e.result) }}>
                      {e.result}
                    </Tag>
                  </td>
                </ClickableRow>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {selected ? (
        <Modal
          open
          onOpenChange={(open) => {
            if (!open) setSelected(null)
          }}
          kicker="CloudTrail · evento"
          title={selected.eventName}
          sub={`${selected.eventSource} · ${selected.time} UTC · ${selected.account}`}
          stats={[
            { label: 'Identidad', value: selected.identity },
            {
              label: 'Resultado',
              value: selected.result,
              color: resultColor(selected.result),
            },
            {
              label: 'Impacto en coste',
              value: selected.costImpact ? 'Sí — recurso facturable' : 'No',
              color: selected.costImpact ? 'var(--s-warn)' : 'var(--s-t2)',
            },
          ]}
          action="Correlacionar con coste"
          onAction={() => setSelected(null)}
        >
          <ModalBody>
            {selected.costImpact
              ? `Este evento crea o modifica recursos facturables. LedgerOps lo correlaciona con el gasto de las 24 h siguientes en ${selected.account} para atribuir variaciones de coste a un cambio concreto.`
              : 'Evento de solo lectura: no genera cargos directos. Se conserva para auditoría de acceso.'}
          </ModalBody>
          <ModalJson json={JSON.stringify(records[selected.id] ?? {}, null, 2)} />
        </Modal>
      ) : null}
    </section>
  )
}

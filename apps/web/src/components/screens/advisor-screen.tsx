'use client'

import type { AdvisorCategory, AdvisorCheck, Severity } from '@finops/types'
import { Button, Card, ClickableRow, cn, Modal, ModalBody, ModalList, Table } from '@finops/ui'
import { useQueryState } from 'nuqs'
import { useState } from 'react'
import { advisorCategoryParser } from '@/lib/search-params'

export interface AdvisorScreenProps {
  categories: AdvisorCategory[]
  /** Recursos de ejemplo que lista el modal de un check. */
  checkResources: { name: string; meta: string; value: string }[]
}

const severityColor: Record<Severity, string> = {
  bad: 'var(--s-bad)',
  warn: 'var(--s-warn)',
  ok: 'var(--s-ok)',
}

const severityLabel: Record<Severity, string> = {
  bad: 'Acción requerida',
  warn: 'Investigar',
  ok: 'Correcto',
}

export function AdvisorScreen({ categories, checkResources }: AdvisorScreenProps) {
  const [cat, setCat] = useQueryState('cat', advisorCategoryParser)
  const [selected, setSelected] = useState<AdvisorCheck | null>(null)
  const active = categories.find((c) => c.key === cat) ?? categories[0]!

  return (
    <section className="flex flex-col gap-3.5">
      <div className="grid grid-cols-5 gap-3">
        {categories.map((c) => {
          const isActive = c.key === active.key
          const dot = c.error ? 'var(--s-bad)' : c.warn ? 'var(--s-warn)' : 'var(--s-ok)'
          return (
            <button
              type="button"
              key={c.key}
              onClick={() => setCat(c.key)}
              aria-pressed={isActive}
              className={cn(
                'rounded-lg px-[15px] py-3.5 text-left',
                isActive ? 'bg-s-surf2 shadow-ring-acc' : 'bg-s-card shadow-ring',
              )}
            >
              <div className="mb-2.5 flex items-center justify-between gap-2">
                <span className="text-[12.5px] text-s-t1">{c.name}</span>
                <span className="h-[7px] w-[7px] rounded-full" style={{ background: dot }} />
              </div>
              <div className="text-[25px] font-medium">{c.error + c.warn}</div>
              <div className="mt-[3px] text-[11px] text-s-t2">
                {c.error} error · {c.warn} warn · {c.ok} ok
              </div>
            </button>
          )
        })}
      </div>

      <Card className="px-1.5 pb-1.5 pt-3.5">
        <div className="flex items-baseline justify-between px-3 pb-2">
          <div>
            <div className="text-base font-medium">{active.name}</div>
            <div className="text-xs text-s-t2">Última evaluación hace 42 min · 14 cuentas</div>
          </div>
          <Button variant="secondary" className="text-[12.5px]">
            Refrescar checks
          </Button>
        </div>
        <Table>
          <thead>
            <tr>
              <th style={{ width: 26 }} />
              <th>Check</th>
              <th>Cuentas afectadas</th>
              <th className="text-right">Recursos</th>
              <th className="text-right">Ahorro estimado</th>
              <th className="text-right" />
            </tr>
          </thead>
          <tbody>
            {active.checks.map((check) => (
              <ClickableRow key={check.id} onActivate={() => setSelected(check)}>
                <td>
                  <span
                    className="block h-[7px] w-[7px] rounded-full"
                    style={{ background: severityColor[check.severity] }}
                  />
                </td>
                <td>
                  <div className="text-[13.5px]">{check.name}</div>
                  <div className="text-[11.5px] text-s-t2">{check.description}</div>
                </td>
                <td className="text-[12.5px] text-s-t1">{check.accountsLabel}</td>
                <td className="text-right tabular-nums">{check.resourcesLabel}</td>
                <td className="text-right tabular-nums text-s-ok">{check.savingLabel}</td>
                <td className="text-right text-s-t3">
                  <span className="row-go">→</span>
                </td>
              </ClickableRow>
            ))}
          </tbody>
        </Table>
      </Card>

      {selected ? (
        <Modal
          open
          onOpenChange={(open) => {
            if (!open) setSelected(null)
          }}
          kicker={`Trusted Advisor · ${active.name}`}
          title={selected.name}
          sub={`${selected.description} · ${selected.accountsLabel}`}
          stats={[
            {
              label: 'Severidad',
              value: severityLabel[selected.severity],
              color: severityColor[selected.severity],
            },
            { label: 'Recursos afectados', value: selected.resourcesLabel },
            { label: 'Ahorro estimado', value: selected.savingLabel, color: 'var(--s-ok)' },
          ]}
          action="Crear change request"
          onAction={() => setSelected(null)}
        >
          <ModalBody>
            Trusted Advisor evalúa este check en las 14 cuentas de la organización cada 24 h. Los
            recursos listados se han detectado en la última evaluación; aplicar la corrección desde
            aquí abre un change request en el backlog del equipo propietario según el tag Team.
          </ModalBody>
          <ModalList title="Recursos detectados" items={checkResources} />
        </Modal>
      ) : null}
    </section>
  )
}

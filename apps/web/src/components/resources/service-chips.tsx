'use client'

import type { ServiceKey } from '@finops/types'
import { cn } from '@finops/ui'

export interface ServiceChipsProps {
  services: { service: ServiceKey; name: string; count: number }[]
  value: ServiceKey
  onChange: (service: ServiceKey) => void
  /** Muestra el recuento de recursos del servicio. */
  showCount?: boolean
}

/** Selector de servicio: seis chips conmutables. */
export function ServiceChips({ services, value, onChange, showCount = true }: ServiceChipsProps) {
  return (
    <>
      {services.map((s) => {
        const active = s.service === value
        return (
          <button
            type="button"
            key={s.service}
            onClick={() => onChange(s.service)}
            aria-pressed={active}
            className={cn(
              'btn border text-[12.5px]',
              active
                ? 'border-s-acc bg-s-acc-t text-s-acc-strong'
                : 'border-s-fill bg-transparent text-s-t1',
            )}
          >
            {s.name}
            {showCount ? (
              <span className="opacity-60"> · {s.count.toLocaleString('en-US')}</span>
            ) : null}
          </button>
        )
      })}
    </>
  )
}

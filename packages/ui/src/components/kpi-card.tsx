import type * as React from 'react'
import { cn } from '../lib/cn'
import { Card } from './card'

export interface KpiCardProps {
  label: React.ReactNode
  value: React.ReactNode
  sub?: React.ReactNode
  /** Color de la cifra: token semántico completo, p. ej. `var(--s-warn)`. */
  color?: string
  /** `lg` = KPI del dashboard (30px). `sm` = KPI compacto de pantalla (23px). */
  size?: 'lg' | 'sm'
  ring?: 'line' | 'accent' | 'warn' | 'bad'
  className?: string
}

export function KpiCard({
  label,
  value,
  sub,
  color = 'var(--s-t)',
  size = 'lg',
  ring = 'line',
  className,
}: KpiCardProps) {
  const lg = size === 'lg'
  return (
    <Card
      ring={ring}
      radius={lg ? 'lg' : 'sm'}
      className={cn(lg ? 'px-5 py-[18px]' : 'px-[15px] py-[13px]', className)}
    >
      <div className={cn('text-s-t2', lg ? 'text-[12.5px]' : 'text-xs')}>{label}</div>
      <div
        className={cn(
          'font-medium tabular-nums',
          lg ? 'my-2 text-[30px] tracking-[-0.02em]' : 'mt-1 text-[23px]',
        )}
        style={{ color }}
      >
        {value}
      </div>
      {sub ? (
        <div className={cn('text-s-t3', lg ? 'text-[11.5px]' : 'mt-0.5 text-[11px]')}>{sub}</div>
      ) : null}
    </Card>
  )
}

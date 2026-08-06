import type * as React from 'react'
import { cn } from '../lib/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Anillo de 1px en lugar de sombra apilada: la elevación del sistema. */
  ring?: 'line' | 'accent' | 'warn' | 'bad'
  radius?: 'sm' | 'lg'
}

const ringClass = {
  line: 'shadow-ring',
  accent: 'shadow-ring-acc',
  warn: 'shadow-ring-warn',
  bad: 'shadow-ring-bad',
} as const

export function Card({ className, ring = 'line', radius = 'sm', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-s-card',
        radius === 'lg' ? 'rounded-[10px]' : 'rounded-lg',
        ringClass[ring],
        className,
      )}
      {...props}
    />
  )
}

/** Cabecera de tarjeta: título 16/500 + subtítulo 12px `--s-t2`. */
export function CardHeading({
  title,
  sub,
  className,
  children,
}: {
  title: React.ReactNode
  sub?: React.ReactNode
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={cn('flex items-start justify-between gap-3.5', className)}>
      <div>
        <div className="text-base font-medium">{title}</div>
        {sub ? <div className="mt-0.5 text-xs text-s-t2">{sub}</div> : null}
      </div>
      {children}
    </div>
  )
}

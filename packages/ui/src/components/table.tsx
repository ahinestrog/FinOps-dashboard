'use client'

import type * as React from 'react'
import { cn } from '../lib/cn'

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn('table', className)} {...props} />
}

export interface ClickableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  onActivate: () => void
}

/**
 * Fila de tabla activable con ratón y teclado: `tabindex="0"`, Enter y Espacio
 * abren el detalle. La afordancia "→" aparece con `.row-go` en hover.
 */
export function ClickableRow({ onActivate, className, ...props }: ClickableRowProps) {
  return (
    <tr
      tabIndex={0}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onActivate()
        }
      }}
      className={cn('cursor-pointer', className)}
      {...props}
    />
  )
}

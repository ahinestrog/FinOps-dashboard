import { cn } from '../lib/cn'

export interface StatusDotProps {
  color: string
  size?: number
  pulse?: boolean
  className?: string
}

/** Punto de estado. `pulse` es la única animación permitida junto a `popIn`. */
export function StatusDot({ color, size = 7, pulse, className }: StatusDotProps) {
  return (
    <span
      aria-hidden
      className={cn('block flex-none rounded-full', pulse && 'animate-pulseDot', className)}
      style={{ width: size, height: size, background: color }}
    />
  )
}

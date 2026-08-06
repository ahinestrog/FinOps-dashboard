import { ProgressBar } from '@tremor/react'
import { cn } from '../lib/cn'

/** Tonos semánticos de la barra; se resuelven a los tokens `--s-*`. */
export type MeterTone = 'ok' | 'warn' | 'bad' | 'acc' | 'acc2'

export interface MeterBarProps {
  /** Porcentaje 0–100. */
  value: number
  tone?: MeterTone
  /** Alto de la barra en px. El sistema usa 4, 5 y 6. */
  height?: 4 | 5 | 6
  className?: string
  'aria-label'?: string
}

// Clases estáticas: el color del relleno y la pista se imponen sobre los de
// Tremor con selectores de hijo, sin depender de su paleta.
const toneClass = {
  ok: '[&>div>div]:bg-s-ok',
  warn: '[&>div>div]:bg-s-warn',
  bad: '[&>div>div]:bg-s-bad',
  acc: '[&>div>div]:bg-s-acc',
  acc2: '[&>div>div]:bg-s-acc2',
} as const

const heightClass = {
  4: '[&>div]:h-[4px] [&>div]:rounded-[3px] [&>div>div]:rounded-[3px]',
  5: '[&>div]:h-[5px] [&>div]:rounded-[3px] [&>div>div]:rounded-[3px]',
  6: '[&>div]:h-[6px] [&>div]:rounded-[4px] [&>div>div]:rounded-[4px]',
} as const

/**
 * Barra de medida (share, cobertura, budget, utilización).
 *
 * Envuelve el `ProgressBar` de Tremor y le impone la pista, el alto y el color
 * del sistema: la pista es `--s-line`, no el tinte del propio color.
 */
export function MeterBar({ value, tone = 'acc', height = 4, className, ...rest }: MeterBarProps) {
  return (
    <ProgressBar
      value={Math.max(0, Math.min(value, 100))}
      aria-label={rest['aria-label']}
      className={cn(
        '[&>div]:bg-s-line [&>div]:bg-opacity-100',
        heightClass[height],
        toneClass[tone],
        className,
      )}
    />
  )
}

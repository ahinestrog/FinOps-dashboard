import { cn } from '../../lib/cn'

export interface SparklineProps {
  values: number[]
  width: number
  height: number
  color: string
  strokeWidth?: number
  /**
   * `percent`: el eje Y va de 0 a 100 (utilización).
   * `auto`: se normaliza entre el mínimo y el máximo de la serie (gasto).
   */
  scale?: 'percent' | 'auto'
  className?: string
}

export function sparklinePath(
  values: number[],
  width: number,
  height: number,
  scale: 'percent' | 'auto',
): string {
  if (values.length === 0) return ''
  if (scale === 'percent') {
    return values
      .map((v, i) => {
        const x = (i / (values.length - 1)) * width
        const y = height - (v / 100) * height
        return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ')
  }
  const max = Math.max(...values)
  const min = Math.min(...values)
  const innerW = width - 2
  const top = height - 4
  const innerH = height - 10
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * innerW + 1
      const y = top - ((v - min) / (max - min || 1)) * innerH
      return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

/** Curva sin ejes ni etiquetas: la forma, dentro de la celda. */
export function Sparkline({
  values,
  width,
  height,
  color,
  strokeWidth = 1.3,
  scale = 'percent',
  className,
}: SparklineProps) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn('block flex-none overflow-visible', className)}
      aria-hidden
    >
      <title>Serie histórica</title>
      <path
        d={sparklinePath(values, width, height, scale)}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  )
}

export interface TrendAreaChartProps {
  /** Valores mensuales, en miles de USD. */
  values: number[]
  months: string[]
  /** Escala del eje Y. */
  min: number
  max: number
  /** Línea de budget punteada. */
  budget?: number
  /** Valores donde se pintan las líneas de rejilla. */
  gridValues?: number[]
  gradientId?: string
}

const W = 920
const H = 220

/**
 * Tendencia de gasto: área con gradiente vertical del acento, línea de 2px y
 * punto relleno solo en el último mes. Sin librería de charting: la forma es
 * simple y así el SVG hereda los tokens de tema.
 */
export function TrendAreaChart({
  values,
  months,
  min,
  max,
  budget,
  gridValues = [],
  gradientId = 'trend-gradient',
}: TrendAreaChartProps) {
  const px = (i: number) => (i / (values.length - 1)) * W
  const py = (v: number) => H - ((v - min) / (max - min)) * H
  const line = values
    .map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)},${py(v).toFixed(1)}`)
    .join(' ')
  const area = `${line} L${W},${H} L0,${H} Z`

  return (
    <>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={230}
        preserveAspectRatio="none"
        className="overflow-visible"
        role="img"
        aria-label="Tendencia de gasto de los últimos 12 meses"
      >
        <title>Tendencia de gasto de los últimos 12 meses</title>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--s-acc)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--s-acc)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {gridValues.map((v) => (
          <line
            key={v}
            x1="0"
            x2={W}
            y1={py(v).toFixed(1)}
            y2={py(v).toFixed(1)}
            stroke="var(--s-line)"
            strokeWidth="1"
          />
        ))}
        {budget !== undefined ? (
          <line
            x1="0"
            x2={W}
            y1={py(budget).toFixed(1)}
            y2={py(budget).toFixed(1)}
            stroke="var(--s-warn)"
            strokeWidth="1.3"
            strokeDasharray="5 5"
          />
        ) : null}
        <path d={area} fill={`url(#${gradientId})`} />
        <path d={line} fill="none" stroke="var(--s-acc)" strokeWidth="2" strokeLinejoin="round" />
        {values.map((v, i) =>
          i === values.length - 1 ? (
            <circle
              key={months[i] ?? i}
              cx={px(i).toFixed(1)}
              cy={py(v).toFixed(1)}
              r={4.5}
              fill="var(--s-bg)"
              stroke="var(--s-acc)"
              strokeWidth="2"
            />
          ) : null,
        )}
      </svg>
      <div className="flex justify-between py-1.5 text-[11px] text-s-t3">
        {months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </>
  )
}

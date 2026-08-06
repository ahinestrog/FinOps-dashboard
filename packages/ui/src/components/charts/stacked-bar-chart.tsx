export interface StackedSeries {
  name: string
  /** Proporción del total de cada barra (0–1). */
  share: number
  fill: string
}

export interface StackedBarChartProps {
  /** Total de cada barra, en las mismas unidades que `max`. */
  values: number[]
  series: StackedSeries[]
  months: string[]
  /** Tope del eje Y. */
  max: number
  gridLines?: number[]
}

const W = 920
const H = 240

/** Gasto mensual apilado por serie. Ancho de barra 56% del paso, centrada. */
export function StackedBarChart({
  values,
  series,
  months,
  max,
  gridLines = [60, 120, 180, 240],
}: StackedBarChartProps) {
  const step = W / values.length
  const barW = step * 0.56
  const offset = step * 0.22

  return (
    <>
      <svg
        viewBox={`0 0 ${W} 250`}
        width="100%"
        height={250}
        role="img"
        aria-label="Gasto mensual apilado por servicio"
      >
        <title>Gasto mensual apilado por servicio</title>
        {gridLines.map((y) => (
          <line key={y} x1="0" x2={W} y1={y} y2={y} stroke="var(--s-line)" />
        ))}
        {values.map((v, i) => {
          let acc = 0
          return series.map((s) => {
            const part = v * s.share
            const h = (part / max) * H
            const y = H - (acc / max) * H - h
            acc += part
            return (
              <rect
                key={`${months[i] ?? i}-${s.name}`}
                x={(i * step + offset).toFixed(1)}
                y={y.toFixed(1)}
                width={barW.toFixed(1)}
                height={Math.max(h, 1).toFixed(1)}
                fill={s.fill}
              />
            )
          })
        })}
      </svg>
      <div className="flex justify-between pt-1.5 text-[11px] text-s-t3">
        {months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </>
  )
}

export interface HistoryStat {
  label: string
  value: string
  color: string
}

export interface HistoryVerdict {
  title: string
  body: string
  color: string
  bg: string
}

export interface HistoryChartProps {
  /** 90 puntos de utilización diaria, en porcentaje. */
  points: number[]
  title: string
  stats: HistoryStat[]
  monthLabels: string[]
  verdict: HistoryVerdict
}

const W = 640
const H = 150

/**
 * Histórico de 90 días con los dos umbrales punteados (60% y 20%), las cuatro
 * estadísticas derivadas y el veredicto al pie.
 *
 * La serie es siempre la misma para un recurso: no depende de la ventana de
 * evaluación activa, solo el veredicto y el badge lo hacen.
 */
export function HistoryChart({ points, title, stats, monthLabels, verdict }: HistoryChartProps) {
  const path = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * W
      const y = H - (v / 100) * H
      return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  const area = `${path} L${W},${H} L0,${H} Z`

  return (
    <div className="mt-[18px] rounded-lg bg-s-line px-4 pb-3 pt-3.5 shadow-ring">
      <div className="mb-2.5 flex items-start justify-between gap-3.5">
        <div>
          <div className="text-[13.5px] font-medium">{title}</div>
          <div className="text-[11.5px] text-s-t2">
            Últimos 90 días · media diaria de CloudWatch
          </div>
        </div>
        <div className="flex gap-[18px]">
          {stats.map((s) => (
            <div className="text-right" key={s.label}>
              <div className="text-[10px] uppercase tracking-[0.05em] text-s-t3">{s.label}</div>
              <div className="text-sm font-medium tabular-nums" style={{ color: s.color }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        preserveAspectRatio="none"
        className="overflow-visible"
        role="img"
        aria-label={title}
      >
        <title>{title}</title>
        <line
          x1="0"
          x2={W}
          y1={(H - 0.6 * H).toFixed(1)}
          y2={(H - 0.6 * H).toFixed(1)}
          stroke="var(--s-warn)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <line
          x1="0"
          x2={W}
          y1={(H - 0.2 * H).toFixed(1)}
          y2={(H - 0.2 * H).toFixed(1)}
          stroke="var(--s-bad)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <path d={area} fill="var(--s-acc-t)" />
        <path d={path} fill="none" stroke="var(--s-acc)" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      <div className="flex justify-between pt-1.5 text-[11px] text-s-t3">
        {monthLabels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
      <div
        className="mt-3 flex items-center gap-[11px] rounded-lg px-3 py-2.5"
        style={{ background: verdict.bg }}
      >
        <span
          aria-hidden
          className="block h-[7px] w-[7px] flex-none rounded-full"
          style={{ background: verdict.color }}
        />
        <div className="min-w-0">
          <div className="text-[13px] font-medium" style={{ color: verdict.color }}>
            {verdict.title}
          </div>
          <div className="mt-0.5 text-xs leading-[1.45] text-s-t1">{verdict.body}</div>
        </div>
      </div>
    </div>
  )
}

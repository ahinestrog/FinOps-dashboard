/** `$487,320` — enteros, separador de millar en-US, como en el diseño. */
export function money(value: number): string {
  return `$${Math.round(value).toLocaleString('en-US')}`
}

/** `$487.3k` — para budgets y etiquetas compactas. */
export function moneyK(value: number): string {
  return `$${(value / 1000).toFixed(1)}k`
}

/** `78%` a partir de un número. */
export function percent(value: number): string {
  return `${Math.round(value)}%`
}

/** `+4.2%` / `-1.4%` / `—` para los Δ de las tablas. */
export function deltaLabel(pct: number): string {
  if (!Number.isFinite(pct)) return '—'
  return `${pct > 0 ? '+' : ''}${pct.toFixed(1).replace(/\.0$/, '.0')}%`
}

/** Color de un Δ: subir cuesta dinero, bajar lo ahorra. */
export function deltaColor(label: string): string {
  if (label === '—') return 'var(--s-t3)'
  return label.startsWith('+') ? 'var(--s-warn)' : 'var(--s-ok)'
}

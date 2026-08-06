import type { Icon } from '@phosphor-icons/react'
import {
  Bell,
  ChartBar,
  HardDrives,
  Lightning,
  ListBullets,
  ShieldCheck,
  SquaresFour,
} from '@phosphor-icons/react/dist/ssr'

export interface NavItem {
  href: string
  label: string
  title: string
  subtitle: string
  icon: Icon
  /** Badge de la barra lateral (alertas activas). */
  badge?: string
}

/** Los siete destinos de la consola. El FinOps Agent es un drawer, no una ruta. */
export const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Dashboard',
    title: 'Dashboard',
    subtitle: 'Estado del gasto, compromisos y mayores consumidores',
    icon: SquaresFour,
  },
  {
    href: '/cost',
    label: 'Cost Explorer',
    title: 'Cost Explorer',
    subtitle: 'Desglose de gasto por servicio, cuenta, región y tag',
    icon: ChartBar,
  },
  {
    href: '/cloudtrail',
    label: 'CloudTrail',
    title: 'CloudTrail',
    subtitle: 'Eventos de API con foco en los que mueven el coste',
    icon: ListBullets,
  },
  {
    href: '/trusted-advisor',
    label: 'Trusted Advisor',
    title: 'Trusted Advisor',
    subtitle: 'Checks por categoría en las 14 cuentas',
    icon: ShieldCheck,
  },
  {
    href: '/optimize',
    label: 'Optimización',
    title: 'Optimización',
    subtitle: 'Recomendaciones de ahorro y cobertura de compromisos',
    icon: Lightning,
  },
  {
    href: '/resources',
    label: 'Top recursos',
    title: 'Top recursos',
    subtitle: 'Qué recursos concretos consumen el gasto, servicio por servicio',
    icon: HardDrives,
  },
  {
    href: '/alerts',
    label: 'Alertas',
    title: 'Alertas y anomalías',
    subtitle: 'Detección de anomalías de coste y estado de budgets',
    icon: Bell,
    badge: '3',
  },
]

export function navItemFor(pathname: string): NavItem {
  const exact = navItems.find((item) => item.href === pathname)
  if (exact) return exact
  const nested = navItems.find((item) => item.href !== '/' && pathname.startsWith(item.href))
  return nested ?? navItems[0]!
}

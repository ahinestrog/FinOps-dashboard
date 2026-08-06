'use client'

import type { Organization } from '@finops/types'
import { cn } from '@finops/ui'
import { CaretDown, CaretLeft, ChartBar, Sparkle } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navItems } from '@/lib/navigation'

export interface SidebarProps {
  open: boolean
  onToggle: () => void
  onOpenAgent: () => void
  organization: Organization
}

export function Sidebar({ open, onToggle, onOpenAgent, organization }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className="flex flex-none flex-col bg-s-side shadow-line-r transition-[width] duration-150 ease-out"
      style={{ width: open ? 236 : 64 }}
    >
      <div className="flex items-center gap-2.5 px-4 pb-3.5 pt-[18px]">
        <div className="grid h-[30px] w-[30px] flex-none place-items-center rounded-lg border border-s-acc text-s-acc">
          <ChartBar size={17} weight="regular" />
        </div>
        {open ? (
          <div>
            <div className="text-[15px] font-medium tracking-[-0.01em]">
              Ledger<span className="text-s-acc">Ops</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.09em] text-s-t3">FinOps · AWS</div>
          </div>
        ) : null}
      </div>

      {open ? (
        <div className="px-4 pb-2 pt-1.5 text-[10px] uppercase tracking-[0.1em] text-s-t3">
          Análisis
        </div>
      ) : (
        <div className="h-3.5" />
      )}

      <nav className="flex flex-col gap-px pr-2.5">
        {navItems.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex w-full items-center gap-2.5 rounded-r-lg border-l-2 py-[9px] text-left text-[13.5px]',
                open ? 'px-3.5' : 'px-3',
                active
                  ? 'border-s-acc bg-s-acc-t text-s-acc-strong'
                  : 'border-transparent text-s-t1 hover:bg-s-fill/40',
              )}
            >
              <Icon size={17} weight="regular" className="flex-none" />
              {open ? <span className="flex-1">{item.label}</span> : null}
              {item.badge && open ? (
                <span className="tag bg-s-bad-t px-[7px] py-px text-[10px] text-s-bad">
                  {item.badge}
                </span>
              ) : null}
              {item.badge && !open ? (
                <span className="absolute right-[9px] top-1.5 h-1.5 w-1.5 rounded-full bg-s-bad" />
              ) : null}
            </Link>
          )
        })}
      </nav>

      {open ? (
        <div className="px-4 pb-2 pt-[18px] text-[10px] uppercase tracking-[0.1em] text-s-t3">
          Asistente
        </div>
      ) : (
        <div className="h-[26px]" />
      )}
      <div className="pr-2.5">
        <button
          type="button"
          onClick={onOpenAgent}
          title="FinOps Agent"
          aria-label="FinOps Agent"
          className={cn(
            'relative flex w-full items-center gap-2.5 rounded-r-lg border-l-2 border-transparent py-[9px] text-left text-[13.5px] text-s-t1 hover:bg-s-acc-t',
            open ? 'px-3.5' : 'px-3',
          )}
        >
          <Sparkle size={17} weight="regular" className="flex-none" />
          {open ? (
            <>
              <span className="flex-1">FinOps Agent</span>
              <span className="rounded-[5px] border border-s-acc-b px-[5px] py-px text-[9px] uppercase tracking-[0.06em] text-s-acc-soft">
                Preview
              </span>
            </>
          ) : null}
        </button>
      </div>

      <div className="mt-auto flex flex-col gap-2 px-3 pb-3 pt-3.5">
        {open ? (
          <div className="rounded-lg bg-s-card px-3 py-[11px] shadow-ring">
            <div className="mb-1.5 text-[10px] uppercase tracking-[0.09em] text-s-t3">
              Organización
            </div>
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-[13px]">
                  {organization.name} · {organization.id}
                </div>
                <div className="text-[11px] text-s-t2">
                  {organization.accountCount} cuentas · {organization.regionCount} regiones
                </div>
              </div>
              <CaretDown size={14} className="text-s-t3" />
            </div>
          </div>
        ) : null}
        <button
          type="button"
          onClick={onToggle}
          title={open ? 'Colapsar menú' : 'Expandir menú'}
          aria-label={open ? 'Colapsar menú' : 'Expandir menú'}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] text-[12.5px] text-s-t2 hover:bg-s-fill hover:text-s-t"
        >
          <span className="grid w-[17px] flex-none place-items-center">
            <CaretLeft
              size={16}
              weight="bold"
              style={{ transform: open ? 'none' : 'rotate(180deg)' }}
            />
          </span>
          {open ? <span>Colapsar</span> : null}
        </button>
      </div>
    </aside>
  )
}

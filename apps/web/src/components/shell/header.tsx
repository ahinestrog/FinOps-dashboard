'use client'

import { Button } from '@finops/ui'
import { Bell, CalendarBlank, MagnifyingGlass, Moon, Sun } from '@phosphor-icons/react/dist/ssr'
import { usePathname } from 'next/navigation'
import { navItemFor } from '@/lib/navigation'
import { useTheme } from '@/lib/use-theme'

export interface HeaderProps {
  periodLabel: string
  onOpenPalette: () => void
}

export function Header({ periodLabel, onOpenPalette }: HeaderProps) {
  const pathname = usePathname()
  const item = navItemFor(pathname)
  const { isDark, toggle } = useTheme()

  return (
    <header className="flex flex-none items-center gap-4 px-[26px] pb-3.5 pt-[18px] shadow-line-b">
      <div className="min-w-0">
        <h3 className="mb-0.5 text-[23px] font-normal">{item.title}</h3>
        <div className="text-[12.5px] text-s-t2">{item.subtitle}</div>
      </div>
      <div className="flex-1" />
      <button
        type="button"
        onClick={onOpenPalette}
        className="flex w-[250px] cursor-pointer items-center gap-[9px] rounded-lg bg-s-card px-[11px] py-2 text-left text-[13px] text-s-t2 shadow-ring hover:text-s-t1 hover:shadow-ring-acc"
      >
        <MagnifyingGlass size={15} />
        <span className="flex-1">Buscar o ir a…</span>
        <span className="rounded-[5px] border border-s-fill px-[5px] py-px text-[10.5px] tracking-[0.04em] text-s-t2">
          ⌘K
        </span>
      </button>
      <div className="flex cursor-pointer items-center gap-[7px] rounded-lg bg-s-card px-[11px] py-[7px] text-[13px] shadow-ring">
        <CalendarBlank size={15} className="text-s-acc" />
        {periodLabel}
      </div>
      <Button
        variant="secondary"
        size="icon"
        className="flex-none"
        onClick={toggle}
        title="Cambiar tema"
        aria-label="Cambiar tema"
      >
        {isDark ? <Sun size={17} /> : <Moon size={17} />}
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="relative flex-none"
        title="Notificaciones"
        aria-label="Notificaciones"
      >
        <Bell size={17} />
        <span className="absolute right-2 top-[7px] h-1.5 w-1.5 rounded-full bg-s-bad" />
      </Button>
      <div className="flex items-center gap-[9px]">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-s-acc-fill text-xs font-medium text-s-acc-strong">
          EG
        </div>
        <div className="leading-[1.25]">
          <div className="text-[13px]">Esteban Gómez</div>
          <div className="text-[11px] text-s-t3">Líder operaciones</div>
        </div>
      </div>
    </header>
  )
}

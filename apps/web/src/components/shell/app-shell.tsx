'use client'

import type { Organization } from '@finops/types'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AgentProvider } from './agent-context'
import { AgentDrawer } from './agent-drawer'
import { CommandPalette, type PaletteData } from './command-palette'
import { Header } from './header'
import { Sidebar } from './sidebar'

const SIDE_KEY = 'ledgerops:sidebar'

export interface AppShellProps {
  organization: Organization
  paletteData: PaletteData
  children: React.ReactNode
}

/**
 * Shell de la consola: altura fija de viewport, sin scroll de documento. El
 * contenido es la única zona que scrollea, y vuelve arriba al cambiar de
 * pantalla.
 */
export function AppShell({ organization, paletteData, children }: AppShellProps) {
  const [sideOpen, setSideOpen] = useState(true)
  const [agentOpen, setAgentOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const stored = window.localStorage.getItem(SIDE_KEY)
    if (stored === 'closed') setSideOpen(false)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen(true)
        return
      }
      if (e.key === 'Escape') setPaletteOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // El scroll del contenido vuelve arriba al cambiar de pantalla.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `pathname` es el disparador, no una dependencia del efecto
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 })
  }, [pathname])

  const toggleSide = () => {
    setSideOpen((prev) => {
      window.localStorage.setItem(SIDE_KEY, prev ? 'closed' : 'open')
      return !prev
    })
  }

  const openAgent = useCallback(() => setAgentOpen(true), [])
  const agentValue = useMemo(() => ({ openAgent }), [openAgent])

  return (
    <div className="flex h-screen min-h-[640px] overflow-hidden">
      <Sidebar
        open={sideOpen}
        onToggle={toggleSide}
        onOpenAgent={openAgent}
        organization={organization}
      />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header periodLabel={organization.periodLabel} onOpenPalette={() => setPaletteOpen(true)} />
        <div ref={contentRef} className="flex-1 overflow-auto px-[26px] pb-10 pt-5">
          <AgentProvider value={agentValue}>{children}</AgentProvider>
        </div>
      </main>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} data={paletteData} />
      <AgentDrawer open={agentOpen} onClose={() => setAgentOpen(false)} />
    </div>
  )
}

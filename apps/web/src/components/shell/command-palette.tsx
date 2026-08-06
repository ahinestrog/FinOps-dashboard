'use client'

import type { ServiceKey } from '@finops/types'
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { navItems } from '@/lib/navigation'

export interface PaletteResource {
  id: string
  name: string
  type: string
  account: string
  service: ServiceKey
  serviceName: string
}

export interface PaletteEvent {
  time: string
  eventName: string
  identity: string
  region: string
}

export interface PaletteData {
  resources: PaletteResource[]
  events: PaletteEvent[]
}

export interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  data: PaletteData
}

const itemClass =
  'flex w-full cursor-pointer items-center gap-[11px] rounded-lg px-2.5 py-[9px] text-left text-s-t data-[selected=true]:bg-s-acc-t'

/**
 * Paleta de comandos (⌘K).
 *
 * Pantallas siempre visibles; recursos y eventos solo con query, acotados a 6 y
 * 5 resultados. Cada resultado navega a la pantalla con su filtro ya puesto.
 */
export function CommandPalette({ open, onClose, data }: CommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  if (!open) return null

  const q = query.trim().toLowerCase()
  const hit = (text: string) => !q || text.toLowerCase().includes(q)

  const screens = navItems.filter((item) => hit(item.title))
  const resources = q
    ? data.resources
        .filter((r) => hit(r.id) || hit(r.name) || hit(r.type) || hit(r.account))
        .slice(0, 6)
    : []
  const events = q
    ? data.events.filter((e) => hit(e.eventName) || hit(e.identity) || hit(e.region)).slice(0, 5)
    : []

  const empty = screens.length === 0 && resources.length === 0 && events.length === 0

  const go = (href: string) => {
    setQuery('')
    onClose()
    router.push(href)
  }

  return (
    <div className="fixed inset-0 z-[60] flex justify-center bg-[rgba(22,24,38,0.7)] px-6 pb-6 pt-24">
      {/* Fondo clicable: un botón, no un div con handler, para que también
          responda a teclado y lo anuncien los lectores de pantalla. */}
      <button
        type="button"
        aria-label="Cerrar búsqueda"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div
        className="relative w-[min(620px,100%)] animate-popIn self-start overflow-hidden rounded-xl bg-s-card shadow-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Buscar o ir a"
      >
        <Command shouldFilter={false} loop label="Buscar en LedgerOps">
          <div className="flex items-center gap-2.5 px-4 py-3.5 shadow-line-b">
            <MagnifyingGlass size={16} className="text-s-t3" />
            <Command.Input
              autoFocus
              value={query}
              onValueChange={setQuery}
              placeholder="Ir a una pantalla, recurso, cuenta o evento…"
              className="input min-h-0 flex-1 border-0 bg-transparent p-0 text-[14.5px] shadow-none focus-visible:border-0"
            />
            <span className="rounded-[5px] border border-s-fill px-[5px] py-px text-[10.5px] text-s-t2">
              Esc
            </span>
          </div>
          <Command.List className="max-h-[min(58vh,420px)] overflow-auto p-2">
            {empty ? (
              <Command.Empty className="px-3 py-[26px] text-center text-[13px] text-s-t2">
                Sin resultados para esa búsqueda
              </Command.Empty>
            ) : null}

            {screens.length ? (
              <Command.Group
                heading="Pantallas"
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.1em] [&_[cmdk-group-heading]]:text-s-t3"
              >
                {screens.map((item) => (
                  <Command.Item
                    key={item.href}
                    value={`screen:${item.href}`}
                    onSelect={() => go(item.href)}
                    className={itemClass}
                  >
                    <Badge>{item.title.charAt(0)}</Badge>
                    <span className="min-w-0 flex-1 truncate text-[13.5px]">{item.title}</span>
                    <span className="text-[11.5px] text-s-t3">pantalla</span>
                  </Command.Item>
                ))}
              </Command.Group>
            ) : null}

            {resources.length ? (
              <Command.Group
                heading="Recursos"
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.1em] [&_[cmdk-group-heading]]:text-s-t3"
              >
                {resources.map((r) => (
                  <Command.Item
                    key={r.id}
                    value={`resource:${r.id}`}
                    onSelect={() => go(`/resources?svc=${r.service}`)}
                    className={itemClass}
                  >
                    <Badge>{r.serviceName.slice(0, 2)}</Badge>
                    <span className="min-w-0 flex-1 truncate text-[13.5px]">
                      {r.id} · {r.name}
                    </span>
                    <span className="text-[11.5px] text-s-t3">{r.type}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            ) : null}

            {events.length ? (
              <Command.Group
                heading="Eventos CloudTrail"
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.1em] [&_[cmdk-group-heading]]:text-s-t3"
              >
                {events.map((e) => (
                  <Command.Item
                    key={`${e.time}-${e.eventName}`}
                    value={`event:${e.time}-${e.eventName}`}
                    onSelect={() => go(`/cloudtrail?q=${encodeURIComponent(e.eventName)}`)}
                    className={itemClass}
                  >
                    <Badge>CT</Badge>
                    <span className="min-w-0 flex-1 truncate text-[13.5px]">
                      {e.eventName} · {e.identity}
                    </span>
                    <span className="text-[11.5px] text-s-t3">
                      {e.time} · {e.region}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            ) : null}
          </Command.List>
          <div className="flex gap-3.5 px-4 py-2.5 text-[11px] text-s-t3 shadow-line-t">
            <span>↑↓ moverse</span>
            <span>↵ abrir</span>
            <span>⌘K en cualquier pantalla</span>
          </div>
        </Command>
      </div>
    </div>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid h-[22px] w-[22px] flex-none place-items-center rounded-md bg-s-acc-t text-[11px] text-s-acc-soft">
      {children}
    </span>
  )
}

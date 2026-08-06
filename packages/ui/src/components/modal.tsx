'use client'

import { X } from '@phosphor-icons/react'
import * as Dialog from '@radix-ui/react-dialog'
import type * as React from 'react'
import { cn } from '../lib/cn'
import { Button } from './button'

export interface ModalStat {
  label: string
  value: React.ReactNode
  color?: string
}

export interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  kicker: string
  title: string
  sub?: string
  stats?: ModalStat[]
  /** Etiqueta del botón primario. */
  action?: string
  onAction?: () => void
  children?: React.ReactNode
}

/**
 * Modal de detalle. Un solo tamaño, un solo patrón: kicker + título + subtítulo,
 * tres stats, cuerpo variable y dos acciones. Cierra con Esc y con clic fuera.
 */
export function Modal({
  open,
  onOpenChange,
  kicker,
  title,
  sub,
  stats,
  action,
  onAction,
  children,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[rgba(22,24,38,0.72)]" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 max-h-[82vh] w-[min(700px,calc(100vw-64px))]',
            '-translate-x-1/2 -translate-y-1/2 overflow-auto rounded-[14px] bg-s-card',
            'px-[22px] py-5 shadow-modal',
          )}
        >
          <div className="mb-1 flex items-start gap-3.5">
            <div className="min-w-0 flex-1">
              <div className="mb-[5px] text-[10px] uppercase tracking-[0.1em] text-s-acc-soft">
                {kicker}
              </div>
              <Dialog.Title className="text-xl font-medium leading-[1.2]">{title}</Dialog.Title>
              <Dialog.Description className="mt-1 text-[12.5px] text-s-t2">
                {sub}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button variant="secondary" size="icon" className="flex-none" aria-label="Cerrar">
                <X size={15} weight="bold" />
              </Button>
            </Dialog.Close>
          </div>
          <div className="hr" />
          {stats?.length ? (
            <div className="grid grid-cols-3 gap-3.5">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-[11px] uppercase tracking-[0.05em] text-s-t3">{s.label}</div>
                  <div
                    className="mt-[3px] text-[17px] font-medium"
                    style={{ color: s.color ?? 'var(--s-t)' }}
                  >
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          {children}
          <div className="mt-5 flex justify-end gap-[9px]">
            <Dialog.Close asChild>
              <Button variant="secondary">Cerrar</Button>
            </Dialog.Close>
            {action ? (
              <Button
                variant="primary"
                onClick={() => (onAction ? onAction() : onOpenChange(false))}
              >
                {action}
              </Button>
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

/** Párrafo de cuerpo del modal. */
export function ModalBody({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 text-[13px] leading-[1.6] text-s-t1">{children}</div>
}

export interface ModalListItem {
  name: string
  meta: string
  value: string
}

/** Lista de recursos / acciones del modal. */
export function ModalList({ title, items }: { title: string; items: ModalListItem[] }) {
  return (
    <div className="mt-4">
      <div className="mb-[9px] text-[10px] uppercase tracking-[0.1em] text-s-t3">{title}</div>
      <div className="flex flex-col gap-[7px]">
        {items.map((i) => (
          <div
            key={i.name}
            className="flex items-center gap-2.5 rounded-lg bg-s-line px-3 py-[9px] text-[12.5px]"
          >
            <span className="flex-1 font-mono">{i.name}</span>
            <span className="text-s-t2">{i.meta}</span>
            <span className="tabular-nums text-s-ok">{i.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Registro crudo de CloudTrail. */
export function ModalJson({ json }: { json: string }) {
  return (
    <div className="mt-4">
      <div className="mb-2 text-[10px] uppercase tracking-[0.1em] text-s-t3">
        Registro CloudTrail
      </div>
      <pre className="m-0 max-h-[260px] overflow-auto rounded-lg bg-s-bg px-3.5 py-[13px] font-mono text-[11.5px] leading-[1.6] text-s-t shadow-ring">
        {json}
      </pre>
    </div>
  )
}

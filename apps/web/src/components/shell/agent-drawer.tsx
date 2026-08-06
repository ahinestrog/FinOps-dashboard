'use client'

import { Button, Tag } from '@finops/ui'
import { Sparkle, X } from '@phosphor-icons/react/dist/ssr'

const questions = [
  '¿Por qué subió el gasto de EKS en data-platform esta semana?',
  'Dame las 5 acciones con mayor ahorro y menor riesgo para este trimestre',
  '¿Qué cambios de CloudTrail explican el pico del martes en us-east-1?',
  'Simula el impacto de un Compute Savings Plan de 1 año al 85% de cobertura',
]

const context = [
  'Cost Explorer',
  'CloudTrail',
  'Trusted Advisor',
  'Budgets',
  'Compute Optimizer',
  'CloudWatch',
  'Tags de asignación',
]

/**
 * Panel del FinOps Agent de AWS.
 *
 * Inerte a propósito: documenta qué contexto recibirá y qué responderá. El
 * composer está deshabilitado y **no se cablea a ningún LLM**; este panel es el
 * punto de integración cuando AWS libere la API.
 */
export function AgentDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null

  return (
    <aside
      className="fixed bottom-0 right-0 top-0 z-40 flex w-[390px] flex-col bg-s-side shadow-drawer"
      aria-label="FinOps Agent"
    >
      <div className="flex items-center gap-[11px] px-[18px] py-4 shadow-line-b">
        <div className="grid h-[30px] w-[30px] flex-none place-items-center rounded-lg border border-s-acc-b text-s-acc-soft">
          <Sparkle size={16} />
        </div>
        <div className="flex-1">
          <div className="text-[14.5px] font-medium">FinOps Agent</div>
          <div className="text-[11px] text-s-t2">No conectado · AWS preview</div>
        </div>
        <Button variant="secondary" size="icon" onClick={onClose} aria-label="Cerrar panel">
          <X size={15} weight="bold" />
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-3.5 overflow-auto p-[18px]">
        <div className="rounded-lg bg-s-acc-t px-3.5 py-[13px] text-[12.5px] leading-[1.5] text-s-t1 shadow-ring-acc">
          El agente FinOps de AWS está en{' '}
          <strong className="font-medium text-s-acc-soft">preview limitada</strong>. Este panel
          queda reservado: cuando esté disponible en la cuenta, se conecta aquí y el equipo pregunta
          en lenguaje natural sobre el gasto sin salir de la consola.
        </div>

        <div>
          <div className="mb-[9px] text-[10px] uppercase tracking-[0.1em] text-s-t3">
            Preguntas que podrá responder
          </div>
          <div className="flex flex-col gap-2">
            {questions.map((q) => (
              <div
                key={q}
                className="rounded-lg bg-s-card px-[13px] py-[11px] text-[12.5px] text-s-t2 opacity-75 shadow-ring"
              >
                “{q}”
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-[9px] text-[10px] uppercase tracking-[0.1em] text-s-t3">
            Contexto que recibirá
          </div>
          <div className="flex flex-wrap gap-[7px]">
            {context.map((c) => (
              <Tag key={c} variant="neutral">
                {c}
              </Tag>
            ))}
          </div>
        </div>
      </div>

      <div className="px-[18px] pb-[18px] pt-3.5 shadow-line-t">
        <div className="flex items-center gap-2 opacity-50">
          <input className="input" disabled placeholder="Pregunta al agente…" />
          <Button variant="primary" disabled className="flex-none">
            Enviar
          </Button>
        </div>
        <Button variant="secondary" size="block" className="mt-[9px]">
          Solicitar acceso a la preview
        </Button>
      </div>
    </aside>
  )
}

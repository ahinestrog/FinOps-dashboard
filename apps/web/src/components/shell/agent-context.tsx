'use client'

import { createContext, useContext } from 'react'

const AgentContext = createContext<{ openAgent: () => void }>({ openAgent: () => {} })

export const AgentProvider = AgentContext.Provider

/** Abre el drawer del FinOps Agent desde cualquier pantalla. */
export function useAgentPanel() {
  return useContext(AgentContext)
}

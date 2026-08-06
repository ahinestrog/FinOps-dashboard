'use client'

import { useCallback, useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'ledgerops:theme'

/**
 * Tema persistido en localStorage y aplicado como `data-t` en el root: todos
 * los tokens se reevalúan de golpe, sin recalcular clases.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const current = document.documentElement.dataset.t
    if (current === 'light' || current === 'dark') setTheme(current)
  }, [])

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      document.documentElement.dataset.t = next
      window.localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  return { theme, toggle, isDark: theme === 'dark' }
}

/** Script inline: fija el tema antes de pintar para evitar el parpadeo. */
export const themeBootstrapScript = `
try {
  var t = localStorage.getItem('${STORAGE_KEY}');
  document.documentElement.dataset.t = t === 'light' ? 'light' : 'dark';
} catch (e) {
  document.documentElement.dataset.t = 'dark';
}
`

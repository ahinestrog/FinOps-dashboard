import type * as React from 'react'
import { cn } from '../lib/cn'

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'accent' | 'neutral' | 'outline' | 'tone'
  /** Con `variant="tone"`: color de texto y fondo desde tokens semánticos. */
  tone?: { fg: string; bg: string }
}

export function Tag({ className, variant = 'neutral', tone, style, ...props }: TagProps) {
  return (
    <span
      className={cn(
        'tag',
        variant === 'accent' && 'tag-accent',
        variant === 'neutral' && 'tag-neutral',
        variant === 'outline' && 'tag-outline',
        className,
      )}
      style={tone ? { color: tone.fg, background: tone.bg, ...style } : style}
      {...props}
    />
  )
}

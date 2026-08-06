'use client'

import { cn } from '../lib/cn'

export interface SegmentedOption<T extends string | number> {
  value: T
  label: string
}

export interface SegmentedProps<T extends string | number> {
  name: string
  value: T
  options: readonly SegmentedOption<T>[]
  onChange: (value: T) => void
  className?: string
  'aria-label'?: string
}

/** Control segmentado del design system: radios reales, estado por `:checked`. */
export function Segmented<T extends string | number>({
  name,
  value,
  options,
  onChange,
  className,
  ...rest
}: SegmentedProps<T>) {
  return (
    <div className={cn('seg', className)} role="group" aria-label={rest['aria-label']}>
      {options.map((opt) => (
        <label className="seg-opt" key={String(opt.value)}>
          <input
            type="radio"
            name={name}
            checked={opt.value === value}
            onChange={() => onChange(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  )
}

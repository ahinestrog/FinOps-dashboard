import preset from '@finops/config/tailwind/preset'
import type { Config } from 'tailwindcss'

export default {
  presets: [preset as Config],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    './node_modules/@tremor/react/dist/**/*.js',
  ],
} satisfies Config

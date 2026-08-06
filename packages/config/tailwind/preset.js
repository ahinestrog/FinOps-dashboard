/**
 * Preset Tailwind compartido — LedgerOps.
 *
 * Todo el color pasa por los tokens `--s-*` declarados en
 * `@finops/ui/styles/tokens.css`. Aquí solo se exponen a Tailwind (y a Tremor,
 * que lee `colors.tremor.*` y las escalas `-500`), de forma que un cambio de
 * tema (`data-t="light"`) reevalúa toda la UI sin recompilar clases.
 */

/** @type {import('tailwindcss').Config} */
const preset = {
  darkMode: ['selector', '[data-t="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        s: {
          bg: 'var(--s-bg)',
          card: 'var(--s-card)',
          side: 'var(--s-side)',
          surf2: 'var(--s-surf2)',
          t: 'var(--s-t)',
          t1: 'var(--s-t1)',
          t2: 'var(--s-t2)',
          t3: 'var(--s-t3)',
          line: 'var(--s-line)',
          fill: 'var(--s-fill)',
          ring: 'var(--s-ring)',
          acc: 'var(--s-acc)',
          acc2: 'var(--s-acc2)',
          acc3: 'var(--s-acc3)',
          'acc-soft': 'var(--s-acc-soft)',
          'acc-strong': 'var(--s-acc-strong)',
          'acc-fill': 'var(--s-acc-fill)',
          'acc-t': 'var(--s-acc-t)',
          'acc-b': 'var(--s-acc-b)',
          ok: 'var(--s-ok)',
          warn: 'var(--s-warn)',
          bad: 'var(--s-bad)',
          'ok-t': 'var(--s-ok-t)',
          'warn-t': 'var(--s-warn-t)',
          'bad-t': 'var(--s-bad-t)',
        },
        // Tonos que consume Tremor vía `color="ok" | "warn" | ...`. Necesitan
        // `DEFAULT` y `500` porque Tremor emite `bg-ok` o `bg-ok-500` según el
        // color esté o no en su propia paleta.
        ok: { DEFAULT: 'var(--s-ok)', 500: 'var(--s-ok)' },
        warn: { DEFAULT: 'var(--s-warn)', 500: 'var(--s-warn)' },
        bad: { DEFAULT: 'var(--s-bad)', 500: 'var(--s-bad)' },
        acc: { DEFAULT: 'var(--s-acc)', 500: 'var(--s-acc)' },
        acc2: { DEFAULT: 'var(--s-acc2)', 500: 'var(--s-acc2)' },
        // Tokens que Tremor espera por nombre.
        tremor: {
          brand: {
            faint: 'var(--s-acc-t)',
            muted: 'var(--s-acc-t)',
            subtle: 'var(--s-acc3)',
            DEFAULT: 'var(--s-acc)',
            emphasis: 'var(--s-acc-soft)',
            inverted: 'var(--s-bg)',
          },
          background: {
            muted: 'var(--s-side)',
            subtle: 'var(--s-surf2)',
            DEFAULT: 'var(--s-card)',
            emphasis: 'var(--s-t2)',
          },
          border: { DEFAULT: 'var(--s-line)' },
          ring: { DEFAULT: 'var(--s-line)' },
          content: {
            subtle: 'var(--s-t3)',
            DEFAULT: 'var(--s-t2)',
            emphasis: 'var(--s-t1)',
            strong: 'var(--s-t)',
            inverted: 'var(--s-bg)',
          },
        },
      },
      borderRadius: {
        'tremor-small': '0.375rem',
        'tremor-default': '0.5rem',
        'tremor-full': '9999px',
      },
      fontSize: {
        'tremor-label': ['0.6875rem', {}],
        'tremor-default': ['0.8125rem', { lineHeight: '1.25rem' }],
        'tremor-title': ['1rem', { lineHeight: '1.5rem' }],
        'tremor-metric': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      boxShadow: {
        ring: '0 0 0 1px var(--s-line)',
        'ring-acc': '0 0 0 1px var(--s-acc-b)',
        'ring-warn': '0 0 0 1px var(--s-warn-t)',
        'ring-bad': '0 0 0 1px var(--s-bad-t)',
        modal: '0 0 0 1px var(--s-ring), 0 24px 60px rgba(0,0,0,0.65)',
        palette: '0 0 0 1px var(--s-acc-b), 0 26px 70px rgba(0,0,0,0.6)',
        drawer: '-1px 0 0 var(--s-acc-b), -24px 0 60px rgba(0,0,0,0.5)',
        'line-b': '0 1px 0 var(--s-line)',
        'line-t': '0 -1px 0 var(--s-line)',
        'line-r': '1px 0 0 var(--s-line)',
      },
      keyframes: {
        pulseDot: { '0%,100%': { opacity: '1' }, '50%': { opacity: '.25' } },
        popIn: {
          from: { opacity: '0', transform: 'translateY(-6px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 2.4s ease-in-out infinite',
        popIn: 'popIn .14s ease',
      },
    },
  },
  plugins: [],
}

module.exports = preset

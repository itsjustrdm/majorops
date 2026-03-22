/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        heading: ['Saira Condensed', 'sans-serif'],
        body:    ['IBM Plex Sans', 'sans-serif'],
        mono:    ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        ops: {
          // ── Themeable surfaces ─────────────────────────────────────────
          // Values are RGB channels (no #).  CSS vars defined in global.css.
          // Supports opacity modifiers: bg-ops-bg/50, border-ops-border/40, etc.
          bg:      'rgb(var(--ops-bg)      / <alpha-value>)',
          surface: 'rgb(var(--ops-surface) / <alpha-value>)',
          muted:   'rgb(var(--ops-muted)   / <alpha-value>)',
          border:  'rgb(var(--ops-border)  / <alpha-value>)',
          // Text tokens resolve to a full rgba() string — no opacity modifier needed
          text:    'var(--ops-text)',
          dim:     'var(--ops-dim)',
          // ── Brand (theme-independent) ──────────────────────────────────
          red:      '#CC0000',
          'red-hi': '#FF3333',
          green400: '#008800',
          green:    '#22C55E',
          amber:    '#F59E0B',
          orange:   '#EA580C',
          blue:     '#3B82F6',
          yellow:   '#EAB308',
        },
      },
      borderRadius: {
        DEFAULT: '0',
        none: '0',
        sm: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        full: '9999px',
      },
      animation: {
        'pulse-slow':    'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink':         'blink 1.2s step-end infinite',
        'border-pulse':  'border-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0' },
        },
        'border-pulse': {
          '0%, 100%': { borderColor: '#CC0000' },
          '50%':       { borderColor: 'rgba(204,0,0,0.3)' },
        },
      },
    },
  },
  plugins: [],
}

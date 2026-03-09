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
          bg:       '#0A0A0A',
          surface:  '#111111',
          muted:    '#1A1A1A',
          border:   '#2A2A2A',
          text:     'rgba(242,242,242,0.87)',
          dim:      'rgba(136,136,136,0.54)',
          // Brand
          red:      '#CC0000',
          'red-hi': '#FF3333',
          // AS/400 green (peacetime logo)
          green400: '#008800',
          green:    '#22C55E',
          // Semantic urgency
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
        full: '9999px', // keep full for circular avatars/indicators only
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1.2s step-end infinite',
        'border-pulse': 'border-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'border-pulse': {
          '0%, 100%': { borderColor: '#CC0000' },
          '50%': { borderColor: 'rgba(204,0,0,0.3)' },
        },
      },
    },
  },
  plugins: [],
}

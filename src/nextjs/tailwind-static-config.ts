export const tailwindStaticConfig = {
  content: ['./src/**/*.tsx'],

  theme: {
    borderRadius: {
      4: 'calc(4 * 1rem / 16)',
      full: '9999px',
      none: '0',
    },

    colors: {
      '000000': '#000000',
      '2196f3': '#2196f3',
      ffffff: '#ffffff',
      current: 'currentColor',
      transparent: 'transparent',
    },

    extend: {
      gridTemplateColumns: {
        '1fr/auto': '1fr auto',
        '1fr/minmax(0/360)/1fr': '1fr minmax(0, calc(360 * .25rem)) 1fr',
        'auto/1fr': 'auto 1fr',
        'auto/1fr/auto': 'auto 1fr auto',
      },

      gridTemplateRows: {
        '1fr/auto': '1fr auto',
        'auto/1fr': 'auto 1fr',
        'auto/1fr/auto': 'auto 1fr auto',
      },

      spacing: {
        25: 'calc(25 * .25rem)',
        '9/16': 'calc(9 * 100% / 16)',
        full: '100%',
        'screen-x': '100vw',
        'screen-y': '100vh',
      },

      transitionProperty: {
        'transform/opacity': 'transform, opacity',
        'visibility/opacity': 'visibility, opacity',
      },

      width: {
        'max-content': 'max-content',
      },
    },

    fontFamily: {
      main: ['"Open Sans", sans-serif'],
    },

    fontSize: {
      12: 'calc(12 * 1rem / 16)',
      24: 'calc(24 * 1rem / 16)',
    },

    transitionDuration: {
      DEFAULT: '200ms',
    },
  },
}

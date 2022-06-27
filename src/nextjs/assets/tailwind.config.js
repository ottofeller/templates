const plugin = require('tailwindcss/plugin')

const mirrorHexColors = (colors) =>
  Object.fromEntries(
    colors.map((color, index) => {
      if (!/#[a-f0-9]{6}/.test(color)) {
        throw new Error(
          'All colors should be lowercase hexadecimal strings 7 characters long with "#" sign at the beginning',
        )
      }

      if (colors.indexOf(color) !== index) {
        throw new Error('Colors should be unique')
      }

      if (colors[index - 1] > color) {
        throw new Error('Colors should be sorted alphabetically')
      }

      return [color.substring(1), color]
    }),
  )

module.exports = {
  content: ['./pages/**/*.tsx'],

  plugins: [
    require('@tailwindcss/line-clamp'),

    plugin(({addUtilities}) =>
      addUtilities({
        '.area-span-full': {gridArea: '1/1/-1/-1'},
        '.scrollbar-hidden': {'&::-webkit-scrollbar': {display: 'none'}, scrollbarWidth: 'none'},
      }),
    ),
  ],

  theme: {
    borderRadius: {
      4: 'calc(4 * 1rem / 16)',
      full: '9999px',
      none: '0',
    },

    colors: {
      ...mirrorHexColors(['#000000', '#2196f3', '#ffffff']),

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

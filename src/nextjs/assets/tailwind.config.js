const plugin = require('tailwindcss/plugin')
const staticConfig = require('./tailwind.config.json')

module.exports = {
  ...staticConfig,

  plugins: [
    require('@tailwindcss/line-clamp'),

    plugin(({addUtilities}) =>
      addUtilities({
        '.area-span-full': {gridArea: '1/1/-1/-1'},
        '.scrollbar-hidden': {'&::-webkit-scrollbar': {display: 'none'}, scrollbarWidth: 'none'},
      }),
    ),
  ],
}

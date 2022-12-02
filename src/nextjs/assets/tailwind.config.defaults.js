const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['./src/**/*.tsx'],

  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/container-queries'),
    plugin(({addUtilities}) => addUtilities({'.area-span-full': {gridArea: '1/1/-1/-1'}}, ['responsive'])),
  ],
}

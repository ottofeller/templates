const jsonConfig = require('./next.config.json')
delete jsonConfig['//']

/**
 * Picks env variables with keys starting with `term`.
 * @param {string} [term] - A starting term of a key to pick.
 * @returns {Record<string, string>}
 */
function pickEnvironmentByKey(term) {
  return Object.entries(process.env).reduce(
    (result, [key, value]) => {
      if (key.startsWith(term)) {
        result[key] = value
      }

      return result
    },

    {},
  )
}

/**
 * @type {import('next').NextConfig}
 */
const config = {
  ...jsonConfig,
  serverRuntimeConfig: pickEnvironmentByKey('NEXT_SERVER_'),
}

config.publicRuntimeConfig = {
  ...(config.publicRuntimeConfig || {}),
  ...pickEnvironmentByKey('NEXT_PUBLIC_'),
}

module.exports = config

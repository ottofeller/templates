const jsonConfig = require('./next.config.json')
const plugins = jsonConfig['plugins']
delete jsonConfig['//']
delete jsonConfig['plugins']

/**
 * Transpile json to js object
 * #### input
 *     { "foo": "RegExp(/^foo/)", "bar": "require('react')" }
 * #### output
 *     { foo: /^foo/, bar: require('react') }
 *
 * @param {object} pluginConfig
 * @returns {object}
 */
function transpilePluginConfig(pluginConfig) {
  const transpileValue = (value) => {
    // NOTE: RegExp literal
    if (/^RegExp\(.*\)$/.test(value)) {
      return new RegExp(value.match(/RegExp\((.*)\)/)[1])
    }

    // NOTE: require literal
    if (/^require\(.*\)$/.test(value)) {
      return require(value.match(/^require\((.*)\)$/)[1].replace(/^['"]|['"]$/g, ''))
    }

    return value
  }

  const transipleEntry = ([key, value]) => {
    if (typeof value === 'object') {
      return [key, transpilePluginConfig(value)]
    }

    if (Array.isArray(value)) {
      return [key, value.map(transipleEntry)]
    }

    return [key, transpileValue(value)]
  }

  return Object.fromEntries(Object.entries(pluginConfig).map(transipleEntry))
}

/**
 * Applies plugins from jsonConfig
 * @param {object} originalConfig
 * @param {Record<string, object>} pluginList
 * @returns {object}
 */
function withPlugins(originalConfig, pluginList = {}) {
  return Object.entries(pluginList).reduce((resultConfig, [pluginName, pluginConfig]) => {
    return require(pluginName)(transpilePluginConfig(pluginConfig))(resultConfig)
  }, originalConfig)
}

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

module.exports = withPlugins(config, plugins)

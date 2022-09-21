export type PluginConfig<T = any> = {[key: string]: T}

export type ConfiguredPlugin = {
  [name: string]: PluginConfig
}

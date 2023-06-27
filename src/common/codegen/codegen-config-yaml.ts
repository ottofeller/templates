import type {Project, YamlFileOptions} from 'projen'
import {YamlFile} from 'projen'
import type {MaybePlural} from '../MaybePlural'
import type {CodegenConfig, ConfiguredPlugin, PluginConfig, Schema} from './types'

/**
 * A wrapper around YamlFile. Represents a codegen config file.
 */
export class CodegenConfigYaml {
  private file: YamlFile

  constructor(project: Project, config: CodegenConfig, options?: YamlFileOptions) {
    this.file = new YamlFile(project, 'codegen.yml', {...options, obj: config})
  }

  /**
   * Adds an override to the global `schema` property of the config.
   * With empty value deletes the property.
   *
   * @param value - The value. Could be a single value or an array.
   */
  overrideSchema(value?: MaybePlural<Schema>): CodegenConfigYaml {
    this.file.addOverride('schema', value)
    return this
  }

  /**
   * Adds an override to the global `overwrite` property of the config.
   * With empty value deletes the property.
   *
   * @param value - The value.
   */
  overrideOverwrite(value?: boolean): CodegenConfigYaml {
    this.file.addOverride('overwrite', value)
    return this
  }

  /**
   * Adds an override to the `documents` property an outputPath within `generates` object.
   * With empty value deletes the documents property.
   *
   * @param outputPath The path to the generated file.
   * @param documents An instance or an array of pointers to your GraphQL documents.
   */
  overrideDocumentsForOutput(outputPath: string, documents?: string | Array<string>): CodegenConfigYaml {
    this.file.addOverride(`generates.${outputPath.replace(/\./g, '\\.')}.documents`, documents)
    return this
  }

  /**
   * Adds an override to the `plugins` property an outputPath within `generates` object.
   * With empty value deletes the plugins property.
   *
   * @param outputPath The path to the generated file.
   * @param plugins An array of plugins.
   */
  overridePluginsForOutput(outputPath: string, plugins?: Array<string | ConfiguredPlugin>): CodegenConfigYaml {
    this.file.addOverride(`generates.${outputPath.replace(/\./g, '\\.')}.plugins`, plugins)
    return this
  }

  /**
   * Adds an override to the `config` property an outputPath within `generates` object.
   * With empty value deletes the config property.
   *
   * @param outputPath The path to the generated file.
   * @param config A plugin config.
   */
  overrideConfigForOutput(outputPath: string, config?: PluginConfig): CodegenConfigYaml {
    this.file.addOverride(`generates.${outputPath.replace(/\./g, '\\.')}.config`, config)
    return this
  }

  /**
   * Adds an override to the `preset` property an outputPath within `generates` object.
   * With empty value deletes the preset property.
   *
   * @param outputPath The path to the generated file.
   * @param preset A plugin preset.
   */
  overridePresetForOutput(outputPath: string, preset?: string): CodegenConfigYaml {
    this.file.addOverride(`generates.${outputPath.replace(/\./g, '\\.')}.preset`, preset)
    return this
  }

  /**
   * Adds an override to the `preset-config` property an outputPath within `generates` object.
   * With empty value deletes the preset-config property.
   *
   * @param outputPath The path to the generated file.
   * @param presetConfig A plugin preset config.
   */
  overridePresetConfigForOutput(outputPath: string, presetConfig?: {[key: string]: any}): CodegenConfigYaml {
    this.file.addOverride(`generates.${outputPath.replace(/\./g, '\\.')}.presetConfig`, presetConfig)
    return this
  }
}

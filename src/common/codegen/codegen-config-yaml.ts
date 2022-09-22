import type {Project, YamlFileOptions} from 'projen'
import {YamlFile} from 'projen'
import type {CodegenConfig, ConfiguredPlugin, MaybePlural, Schema} from './types'

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
}

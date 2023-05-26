import type {MaybePlural} from '../../MaybePlural'
import type {ConfiguredPlugin, PluginConfig} from './Plugin'

export interface ConfiguredOutput {
  /**
   * @type array
   * @items { "$ref": "#/definitions/GeneratedPluginsMap" }
   * @description List of plugins to apply to this current output file.
   *
   * You can either specify plugins from the community using the NPM package name (after you installed it in your project), or you can use a path to a local file for custom plugins.
   *
   * You can find a list of available plugins here: https://graphql-code-generator.com/docs/plugins/index
   * Need a custom plugin? read this: https://graphql-code-generator.com/docs/custom-codegen/index
   */
  readonly plugins: Array<string | ConfiguredPlugin>

  /**
   * @description If your setup uses Preset to have a more dynamic setup and output, set the name of your preset here.
   *
   * Presets are a way to have more than one file output, for example: https://graphql-code-generator.com/docs/presets/near-operation-file
   *
   * You can either specify a preset from the community using the NPM package name (after you installed it in your project), or you can use a path to a local file for a custom preset.
   *
   * List of available presets: https://graphql-code-generator.com/docs/presets/presets-index
   */
  readonly preset?: string

  /**
   * @description If your setup uses Preset to have a more dynamic setup and output, set the configuration object of your preset here.
   *
   * List of available presets: https://graphql-code-generator.com/docs/presets/presets-index
   */
  readonly presetConfig?: {[key: string]: any}

  /**
   * @description A flag to overwrite files if they already exist when generating code (`true` by default).
   *
   * For more details: https://graphql-code-generator.com/docs/config-reference/codegen-config
   */
  readonly overwrite?: boolean

  /**
   * @description A pointer(s) to your GraphQL documents: query, mutation, subscription and fragment. These documents will be loaded into for all your output files.
   * You can use one of the following:
   *
   * - Path to a local `.graphql` file
   * - Path to a code file (for example: `.js` or `.tsx`) containing GraphQL operation strings.
   * - Glob expression pointing to multiple `.graphql` files
   * - Glob expression pointing to multiple code files
   * - Inline string containing GraphQL SDL operation definition
   *
   * You can specify either a single file, or multiple.
   *
   * For more details: https://graphql-code-generator.com/docs/config-reference/documents-field
   */
  readonly documents?: MaybePlural<string>

  /**
   * @description A pointer(s) to your GraphQL schema. This schema will be available only for this specific `generates` record.
   * You can use one of the following:
   *
   * - URL pointing to a GraphQL endpoint
   * - Path to a local `.json` file
   * - Path to a local `.graphql` file
   * - Glob expression pointing to multiple `.graphql` files
   * - Path to a local code file (for example: `.js`) that exports `GraphQLSchema` object
   * - Inline string containing GraphQL SDL schema definition
   *
   * You can specify either a single schema, or multiple, and GraphQL Code Generator will merge the schemas into a single schema.
   *
   * For more details: https://graphql-code-generator.com/docs/config-reference/schema-field
   */
  readonly schema?: MaybePlural<string>

  /**
   * @description Configuration object containing key => value that will be passed to the plugins.
   * Specifying configuration in this level of your configuration file will pass it to all plugins, in all outputs.
   *
   * The options may vary depends on what plugins you are using.
   *
   * For more details: https://graphql-code-generator.com/docs/config-reference/config-field
   */
  readonly config?: PluginConfig
}

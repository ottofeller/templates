// NOTE: These types duplicate graphql-codegen types. Importing those from the original package causes jsii to fail upon building.

export interface UrlSchemaWithOptions {
  [url: string]: UrlSchemaOptions
}

export interface UrlSchemaOptions {
  /**
   * @description HTTP headers you wish to add to the HTTP request sent by codegen to fetch your GraphQL remote schema.
   */
  readonly headers?: {[headerName: string]: string}

  /**
   * @description Specify a Node module name, or a custom file, to be used instead of standard `fetch`
   */
  readonly customFetch?: string

  /**
   * @description HTTP Method to use, either POST (default) or GET.
   */
  readonly method?: string
}

/**
 * @description A URL to your GraphQL endpoint, a local path to `.graphql` file, a glob pattern to your GraphQL schema files, or a JavaScript file that exports the schema to generate code from. This can also be an array which specifies multiple schemas to generate code from. You can read more about the supported formats [here](schema-field#available-formats).
 */
export type Schema = string | UrlSchemaWithOptions
export type PluginConfig<T = any> = {[key: string]: T}
export interface ConfiguredPlugin {
  [name: string]: PluginConfig
}

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
  readonly documents?: string | Array<string>

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
  readonly schema?: string | Array<string>

  /**
   * @description Configuration object containing key => value that will be passes to the plugins.
   * Specifying configuration in this level of your configuration file will pass it to all plugins, in all outputs.
   *
   * The options may vary depends on what plugins you are using.
   *
   * For more details: https://graphql-code-generator.com/docs/config-reference/config-field
   */
  readonly config?: PluginConfig
}

export interface CodegenConfig {
  /**
   * @description A pointer(s) to your GraphQL schema. This schema will be the base schema for all your outputs.
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
  readonly schema?: Schema | Array<Schema>

  /**
   * @description A map where the key represents an output path for the generated code and the value represents a set of options which are relevant for that specific file.
   *
   * For more details: https://graphql-code-generator.com/docs/config-reference/codegen-config
   */
  readonly generates: {
    [outputPath: string]: ConfiguredOutput
  }

  /**
   * @description A flag to overwrite files if they already exist when generating code (`true` by default).
   *
   * For more details: https://graphql-code-generator.com/docs/config-reference/codegen-config
   */
  readonly overwrite?: boolean
}

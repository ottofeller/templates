import type {MaybePlural} from '../../MaybePlural'
import type {ConfiguredOutput} from './ConfiguredOutput'
import type {Schema} from './Schema'

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
  readonly schema?: MaybePlural<Schema>

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

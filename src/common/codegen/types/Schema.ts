// NOTE: The UrlSchemaOptions and UrlSchemaWithOptions types are used only in this file. However exporting them is essential. Otherwise JSII warns that all used types shall be exported from a project.

export type UrlSchemaOptions = {
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

export interface UrlSchemaWithOptions {
  /**
   * NOTE: updated jsii does not allow index signatures
   * @jsii ignore
   */
  [url: string]: UrlSchemaOptions
}

/**
 * @description A URL to your GraphQL endpoint, a local path to `.graphql` file, a glob pattern to your GraphQL schema files, or a JavaScript file that exports the schema to generate code from. This can also be an array which specifies multiple schemas to generate code from. You can read more about the supported formats [here](schema-field#available-formats).
 */
export type Schema = string | UrlSchemaWithOptions

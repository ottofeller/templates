import type {CodegenConfig} from '@graphql-codegen/cli'

const codegenConfig: CodegenConfig = {
  overwrite: true,
  schema: './schema.json',

  generates: {
    // Generates types and requests for hasura
    'generated/index.ts': {
      documents: ['src/**/(*).ts'],
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
    },
  },
}

export default codegenConfig

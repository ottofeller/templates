import type {CodegenConfig} from '@graphql-codegen/cli'


//FIXME - Change to Codegen from app-backend-user
const codegenConfig: CodegenConfig = {
  overwrite: true,
  schema: './schema.json',

  // The following paths and corresponding output settings are defaults for the nextjs project.
  generates: {
    'generated/types.ts': {
      documents: ['pages/**/graphql/*.{ts,tsx}'],
      plugins: ['typescript', 'typescript-operations'],
    },

    'generated/frontend.ts': {
      documents: ['pages/**/graphql/*.tsx'],
      preset: 'import-types',
      presetConfig: {typesPath: './types'},
      plugins: ['typescript-react-apollo'],
    },

    'generated/api.ts': {
      documents: ['pages/**/graphql/*.ts'],
      preset: 'import-types',
      presetConfig: {typesPath: './types'},
      plugins: ['typescript-operations', 'typescript-graphql-request'],
    },

    './schema.json': {plugins: ['introspection']},
  },
}

export default codegenConfig

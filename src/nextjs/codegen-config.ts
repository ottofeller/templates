// eslint-disable-next-line import/no-relative-parent-imports -- types are not bundled and therefore are not correctly exported with path aliases
import type {CodegenConfig} from '../common/codegen/types'

export const codegenConfig: CodegenConfig = {
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

// eslint-disable-next-line import/no-relative-parent-imports -- types are not bundled and therefore are not correctly exported with path aliases
import type {CodegenConfig} from '../common/codegen/types'

export const codegenConfig: CodegenConfig = {
  schema: {'${APP_URL}': {headers: {'x-access-token': '${ACCESS_TOKEN}'}}},

  generates: {
    // Generates types for local apollo server resolvers only
    './generated/resolvers.ts': {
      plugins: [{add: {placement: 'prepend', content: '/* eslint-disable */'}}, 'typescript', 'typescript-resolvers'],
      config: {useIndexSignature: true, contextType: 'common/types/app-context#AppContext'},
    },

    // Generates types and requests to external services
    './generated/index.ts': {
      documents: 'src/**/!(*.generated).ts',
      plugins: [
        {add: {placement: 'prepend', content: '/* eslint-disable */'}},
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
      ],
    },
  },
}

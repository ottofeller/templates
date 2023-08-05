import type {CodegenConfig} from '@graphql-codegen/cli'

const codegenConfig: CodegenConfig = {
  schema: {'${APP_URL}': {headers: {'x-access-token': '${ACCESS_TOKEN}'}}},

  // The following paths and corresponding output settings are defaults for the apollo-server project.
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

export default codegenConfig

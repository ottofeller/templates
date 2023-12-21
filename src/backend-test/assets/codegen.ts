import {CodegenConfig} from '@graphql-codegen/cli'
import * as dotenv from 'dotenv'

dotenv.config({path: '.env.local'})
dotenv.config({path: '.env.development'})

if (!process.env.HASURA_GRAPHQL_URL || !process.env.HASURA_GRAPHQL_ADMIN_SECRET) {
  throw new Error('HASURA_GRAPHQL_URL or HASURA_GRAPHQL_ADMIN_SECRET does not exist. Check your .env files')
}

const config: CodegenConfig = {
  overwrite: true,

  config: {
    defaultScalarType: 'unknown',
    scalars: {
      uuid: 'string',
      _uuid: 'Array<string>',
      timestamp: 'string',
      timestamptz: 'string',
      numeric: 'string',
      jsonb: 'any',
      json: 'any',
      bigint: 'string',
      AWSDate: 'string',
      AWSTime: 'string',
      AWSDateTime: 'string',
      AWSTimestamp: 'string',
      AWSEmail: 'string',
      AWSJSON: 'string',
      AWSURL: 'string',
      AWSPhone: 'string',
      AWSIPAddress: 'string',
      interval: 'string',
      date: 'string',
      float8: 'string',
    },
  },

  generates: {
    // Generate common types
    'generated/index.ts': {
      schema: [
        {
          [process.env.HASURA_GRAPHQL_URL]: {
            headers: {
              'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
              'x-hasura-user-id': 'service',
              'x-hasura-user-role': 'service',
            },
          },
        },
      ],
      plugins: [
        'typescript',
        {
          add: {
            placement: 'prepend',
            content: '/* eslint-disable -- Generated */ // @ts-nocheck',
          },
        },
      ],
      config: {
        strictScalars: true,
        skipDocumentsValidation: {
          OverlappingFieldsCanBeMergedRule: true,
        },
      },
    },

    // Generate types for graphql requests
    src: {
      schema: [
        {
          [process.env.HASURA_GRAPHQL_URL]: {
            headers: {
              'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
              'x-hasura-user-id': 'service',
              'x-hasura-user-role': 'service',
            },
          },
        },
      ],
      documents: ['common/graphql/**/*.ts', '!common/graphql/**/*.generated.ts'],
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.ts',
        baseTypesPath: '~generated',
      },
      plugins: ['typescript-operations', 'typescript-graphql-request'],
      config: {
        skipTypename: true,
        useTypeImports: true,
        directiveArgumentAndInputFieldMappings: 'Model',
      },
    },

    // Generate schema file for e2e
    'schema.graphql': {
      schema: [
        {
          [process.env.HASURA_GRAPHQL_URL]: {
            headers: {
              'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
            },
          },
        },
      ],
      plugins: ['schema-ast'],
    },
  },
}

export default config

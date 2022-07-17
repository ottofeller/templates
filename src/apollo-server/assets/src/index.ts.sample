import {mergeResolvers, mergeTypeDefs} from '@graphql-tools/merge'
import {makeExecutableSchema} from '@graphql-tools/schema'
import {ApolloServer, gql} from 'apollo-server'
import tracer from 'dd-trace'
import dotenv from 'dotenv'
import sourceMapSupport from 'source-map-support'

// ANCHOR Logger
const createLogger = () => ({error: console.error, info: console.log})

// ANCHOR Tracer
if (process.env.NODE_ENV === 'production') {
  tracer.init({logInjection: true, service: process.env.SERVICE_NAME})
}

sourceMapSupport.install({environment: 'node'})
dotenv.config({path: './.env.local'})
dotenv.config({path: './.env.development'})

// ANCHOR Schema
const schema = makeExecutableSchema({
  resolvers: mergeResolvers([]),

  typeDefs: mergeTypeDefs([
    gql`
      type Query {
        _emptyQuery: String
      }
      type Mutation {
        _emptyMutation: String
      }
    `,
  ]),
})

// ANCHOR The server
type AppContext = {
  logger: ReturnType<typeof createLogger>
}
;(async () => {
  const logger = await createLogger()

  const info = await new ApolloServer({
    // Context function is called every request
    context: async (params): Promise<AppContext> => {
      if (params.req.headers['x-access-token'] !== process.env.ACCESS_TOKEN) {
        throw new Error('Wrong or missing x-access-token header.')
      }

      return {
        logger,
      }
    },

    csrfPrevention: true,

    // Hasura's remote schema requires introspection enabled
    introspection: true,
    schema,
  }).listen({port: process.env.APP_PORT || 3000})

  console.log(`🚀 Server ready at ${info.url}`)
})()

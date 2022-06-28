require('dotenv').config({path: './.env.development'})

// See https://www.apollographql.com/docs/devtools/apollo-config/
module.exports = {
  client: {
    excludes: ['**/*.generated.ts'],
    includes: ['**/graphql/**/*.ts'],

    service: {
      headers: {
        'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
      },

      name: 'hasura',
      url: process.env.HASURA_GRAPHQL_URL,
    },
  },
}

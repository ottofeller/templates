import {TextFile, web} from 'projen'

export const DEFAULT_CONFIG_FILENAME = 'jest.project.json'

/**
 * Removes default jest config and creates custom config and other required files.
 */
export function configureJest(project: web.NextJsTypeScriptProject) {
  project.tryRemoveFile(DEFAULT_CONFIG_FILENAME)

  new TextFile(project, 'jest.config.js', {
    lines: jestConfig.split('\n'),
    marker: true,
  })

  new TextFile(project, 'jest.setup.js', {
    lines: jestSetup.split('\n'),
    marker: true,
  })

  new TextFile(project, 'config/graphql.js', {
    lines: graphqlConfig.split('\n'),
    marker: true,
  })
}

/**
 * Source code for the jest config.
 */
const jestConfig = `const nextJest = require('next/jest')

const createJestConfig = nextJest({dir: './'})

module.exports = createJestConfig({
  coveragePathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
  ],

  moduleDirectories   : ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleNameMapper    : {'generated/(.*)': '<rootDir>/generated/$1'},
  setupFiles          : ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv  : ['<rootDir>/jest.setup.js'],
  testEnvironment     : 'jsdom',

  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
  ],

  testRegex: '/__tests__/index.tsx?$',

  transform: {
    '\\.(?:gql|graphql)$': '<rootDir>/config/graphql.js',
  },
})
`

/**
 * Source code for the jest setup.
 */
const jestSetup = `const fetch = require('jest-fetch-mock')
jest.setMock('node-fetch', fetch) 
`

/**
 * Source code for the GraphQL test config.
 */
const graphqlConfig = `const loader = require('graphql-tag/loader')

module.exports = {
  process(source) {
    // Call directly the webpack loader with a mocked context as graphql-tag/loader leverages \`this.cacheable()\`.
    return loader.call({cacheable() {}}, source)
  },
}
`

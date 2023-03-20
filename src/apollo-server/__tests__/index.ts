import {execSync} from 'child_process'
import {synthSnapshot} from 'projen/lib/util/synth'
import {OttofellerApolloServerProject, OttofellerApolloServerProjectOptions} from '..'

jest.mock('child_process')

describe('Apollo server template', () => {
  test('sets defaults', () => {
    const project = new TestApolloServerProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot).toMatchSnapshot()
  })

  test('is set to type module', () => {
    const project = new TestApolloServerProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['package.json'].type).toEqual('module')
  })

  test('has GraphQL-related packages and scripts', () => {
    const project = new TestApolloServerProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['package.json'].dependencies).toHaveProperty('apollo-server')
    expect(snapshot['package.json'].dependencies).toHaveProperty('graphql')
    expect(snapshot['package.json'].devDependencies).toHaveProperty('@graphql-codegen/cli')
    expect(snapshot['package.json'].scripts).toHaveProperty('generate-graphql-schema')
    expect(snapshot['package.json'].scripts).toHaveProperty('gql-to-ts')
    expect(snapshot['apollo.config.cjs']).toBeDefined()
    expect(snapshot['codegen.yml']).toBeDefined()
  })

  test('has prettier and eslint configs written to package.json', () => {
    const project = new TestApolloServerProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['package.json'].prettier).toEqual('@ottofeller/prettier-config-ofmt')
    expect(snapshot['package.json'].eslintConfig).toBeDefined()

    const extendingConfigs = snapshot['package.json'].eslintConfig.extends
    expect(extendingConfigs).toHaveLength(2)
    expect(extendingConfigs).toContainEqual('@ottofeller/eslint-config-ofmt/eslint.quality.cjs')
    expect(extendingConfigs).toContainEqual('@ottofeller/eslint-config-ofmt/eslint.formatting.cjs')
  })

  describe('has tests', () => {
    test('included by default', () => {
      const project = new TestApolloServerProject()
      const snapshot = synthSnapshot(project)
      expect(snapshot['src/logger/__tests__/index.ts']).toBeDefined()
      expect(snapshot['package.json'].scripts).toHaveProperty('test')
    })

    test('excluded if opted out', () => {
      const project = new TestApolloServerProject({jest: false})
      const snapshot = synthSnapshot(project)
      expect(snapshot['src/logger/__tests__/index.ts']).not.toBeDefined()
      expect(snapshot['package.json'].scripts).not.toHaveProperty('test')
    })
  })

  describe('has default test workflow', () => {
    test('included by default', () => {
      const project = new TestApolloServerProject()
      const snapshot = synthSnapshot(project)
      expect(snapshot['.github/workflows/test.yml']).toBeDefined()
      expect(snapshot['.github/workflows/test.yml']).toMatchSnapshot()
    })

    test('excluded if opted out', () => {
      const project = new TestApolloServerProject({hasDefaultGithubWorkflows: false})
      const snapshot = synthSnapshot(project)
      expect(snapshot['.github/workflows/test.yml']).not.toBeDefined()
    })
  })

  test('includes VSCode settings', () => {
    const project = new TestApolloServerProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['.vscode/settings.json']).toBeDefined()
  })

  test('formats ".projenrc.mjs" file after synthesis', () => {
    const mockedExecSync = execSync as unknown as jest.Mock<Buffer, [string]>
    const project = new TestApolloServerProject()
    project.postSynthesize()
    expect(mockedExecSync).toBeCalledTimes(1)
    expect(mockedExecSync).toBeCalledWith('ofmt .projenrc.mjs')
  })

  test('has gitignore file extended', () => {
    const project = new TestApolloServerProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['.gitignore']).toContain('.DS_Store')
    expect(snapshot['.gitignore']).toContain('.env.local')
  })

  describe('has sample code', () => {
    test('included by default', () => {
      const project = new TestApolloServerProject()
      const snapshot = synthSnapshot(project)
      expect(snapshot['src/index.ts']).toBeDefined()
      expect(snapshot['src/logger/create-logger.ts']).toBeDefined()
      expect(snapshot['src/logger/__tests__/index.ts']).toBeDefined()
    })

    test('excluded with an option', () => {
      const project = new TestApolloServerProject({sampleCode: false})
      const snapshot = synthSnapshot(project)
      expect(snapshot['src/index.ts']).not.toBeDefined()
      expect(snapshot['src/logger/create-logger.ts']).not.toBeDefined()
      expect(snapshot['src/logger/__tests__/index.ts']).not.toBeDefined()
    })
  })
})

class TestApolloServerProject extends OttofellerApolloServerProject {
  constructor(options: Partial<OttofellerApolloServerProjectOptions> = {}) {
    super({
      ...options,
      name: 'test-apollo-server-project',
      defaultReleaseBranch: 'main',
    })
  }
}

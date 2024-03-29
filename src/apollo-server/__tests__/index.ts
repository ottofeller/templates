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

  describe('has husky', () => {
    const commitMsgFileName = '.husky/commit-msg'

    test('omitted by default', () => {
      const project = new TestApolloServerProject()
      const snapshot = synthSnapshot(project)
      expect(snapshot['package.json'].devDependencies).not.toHaveProperty('husky')
      expect(snapshot[commitMsgFileName]).not.toBeDefined()
    })

    test('set up if enabled with hasGitHooks option', () => {
      const project = new TestApolloServerProject({hasGitHooks: true})
      const snapshot = synthSnapshot(project)
      expect(snapshot['package.json'].devDependencies).toHaveProperty('husky')
      expect(snapshot[commitMsgFileName]).toBeDefined()
    })
  })

  test('has GraphQL-related packages and scripts', () => {
    const project = new TestApolloServerProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['package.json'].dependencies).toHaveProperty('@apollo/server')
    expect(snapshot['package.json'].dependencies).toHaveProperty('graphql')
    expect(snapshot['package.json'].dependencies).toHaveProperty('graphql-tag')
    expect(snapshot['package.json'].devDependencies).toHaveProperty('@graphql-codegen/cli')
    expect(snapshot['package.json'].scripts).toHaveProperty('generate-graphql-schema')
    expect(snapshot['package.json'].scripts).toHaveProperty('gql-to-ts')
    expect(snapshot['apollo.config.cjs']).toBeDefined()
    expect(snapshot['codegen.ts']).toBeDefined()
  })

  test('has prettier and eslint configs', () => {
    const project = new TestApolloServerProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['.prettierrc.json']).toBeDefined()
    expect(snapshot['.eslintrc.json']).toBeDefined()
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
      expect(snapshot['.github/workflows/ts-test.yml']).toBeDefined()
      expect(snapshot['.github/workflows/ts-test.yml']).toMatchSnapshot()
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
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- TS is not aware of the Jest mock, thus casting is needed
    const mockedExecSync = execSync as unknown as jest.Mock<Buffer, [string]>
    const project = new TestApolloServerProject()
    project.postSynthesize()
    expect(mockedExecSync).toHaveBeenCalledTimes(2)
    expect(mockedExecSync).toHaveBeenCalledWith('prettier --write .projenrc.mjs')
    expect(mockedExecSync).toHaveBeenCalledWith('eslint --fix .projenrc.mjs')
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

  describe('has docker integration', () => {
    test('included by default', () => {
      const project = new TestApolloServerProject()
      const snapshot = synthSnapshot(project)
      expect(snapshot['.dockerignore']).toBeDefined()
      expect(snapshot['Dockerfile']).toBeDefined()
    })

    test('excluded with an option', () => {
      const project = new TestApolloServerProject({hasDocker: false})
      const snapshot = synthSnapshot(project)
      expect(snapshot['.dockerignore']).not.toBeDefined()
      expect(snapshot['Dockerfile']).not.toBeDefined()
    })
  })

  test('when ejected contains only tasks created by projen', () => {
    const PROJEN_EJECTING = process.env
    process.env.PROJEN_EJECTING = '1'

    const project = new TestApolloServerProject({hasGitHooks: true})
    const snapshot = synthSnapshot(project)
    const internalTasks = ['default', 'eject', 'projen', 'install', 'install:ci']
    const {tasks} = snapshot['.projen/tasks.json']
    const createdTasks = Object.keys(tasks).filter((task) => !internalTasks.includes(task))
    expect(createdTasks).toHaveLength(0)

    if (PROJEN_EJECTING !== undefined) {
      delete process.env.PROJEN_EJECTING
    }
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

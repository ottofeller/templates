import {execSync} from 'child_process'
import {synthSnapshot} from 'projen/lib/util/synth'
import {OttofellerCDKProject, OttofellerCDKProjectOptions} from '..'

jest.mock('child_process')

describe('CDK template', () => {
  test('sets defaults', () => {
    const project = new TestCDKProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot).toMatchSnapshot()
  })

  test('is set to CommonJS not ESM', () => {
    const project = new TestCDKProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['tsconfig.json']).toBeDefined()
    expect(snapshot['tsconfig.json'].compilerOptions).toBeDefined()
    expect(snapshot['tsconfig.json'].compilerOptions.module).toEqual('CommonJS')
  })

  describe('has husky', () => {
    const commitMsgFileName = '.husky/commit-msg'

    test('omitted by default', () => {
      const project = new TestCDKProject()
      const snapshot = synthSnapshot(project)
      expect(snapshot['package.json'].devDependencies).not.toHaveProperty('husky')
      expect(snapshot[commitMsgFileName]).not.toBeDefined()
    })

    test('set up if enabled with hasGitHooks option', () => {
      const project = new TestCDKProject({hasGitHooks: true})
      const snapshot = synthSnapshot(project)
      expect(snapshot['package.json'].devDependencies).toHaveProperty('husky')
      expect(snapshot[commitMsgFileName]).toBeDefined()
    })
  })

  test('has cdk-nag package installed', () => {
    const project = new TestCDKProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['package.json'].dependencies).toHaveProperty('cdk-nag')
  })

  describe('sets initial release version', () => {
    test('to 0.0.1 by default', () => {
      const defaultVersion = '0.0.1'
      const project = new TestCDKProject()
      expect(project.initialReleaseVersion).toEqual(defaultVersion)
      const snapshot = synthSnapshot(project)
      expect(snapshot['.github/workflows/release.yml']).toContain(`initial-version: ${defaultVersion}`)
    })

    test('to the value provided', () => {
      const initialReleaseVersion = '1.2.3'
      const project = new TestCDKProject({initialReleaseVersion})
      expect(project.initialReleaseVersion).toEqual(initialReleaseVersion)
      const snapshot = synthSnapshot(project)
      expect(snapshot['.github/workflows/release.yml']).toContain(`initial-version: ${initialReleaseVersion}`)
    })
  })

  test('has prettier and eslint configs', () => {
    const project = new TestCDKProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['.prettierrc.json']).toBeDefined()
    expect(snapshot['.eslintrc.json']).toBeDefined()
  })

  describe('has default test workflow', () => {
    test('included by default', () => {
      const project = new TestCDKProject()
      const snapshot = synthSnapshot(project)
      expect(snapshot['.github/workflows/test.yml']).toBeDefined()
      expect(snapshot['.github/workflows/test.yml']).toMatchSnapshot()
    })

    test('excluded if opted out', () => {
      const project = new TestCDKProject({hasDefaultGithubWorkflows: false})
      const snapshot = synthSnapshot(project)
      expect(snapshot['.github/workflows/test.yml']).not.toBeDefined()
    })
  })

  test('includes VSCode settings', () => {
    const project = new TestCDKProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['.vscode/settings.json']).toBeDefined()
  })

  test('has gitignore file extended', () => {
    const project = new TestCDKProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['.gitignore']).toContain('.DS_Store')
    expect(snapshot['.gitignore']).toContain('.env.local')
  })

  test('formats ".projenrc.ts" file after synthesis', () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- TS is not aware of the Jest mock, thus casting is needed
    const mockedExecSync = execSync as unknown as jest.Mock<Buffer, [string]>
    const project = new TestCDKProject()
    project.postSynthesize()
    expect(mockedExecSync).toBeCalledTimes(2)
    expect(mockedExecSync).toBeCalledWith('prettier --write .projenrc.ts')
    expect(mockedExecSync).toBeCalledWith('eslint --fix .projenrc.ts')
  })

  test('when ejected contains only tasks created by projen', () => {
    const PROJEN_EJECTING = process.env
    process.env.PROJEN_EJECTING = '1'

    const project = new TestCDKProject()
    const snapshot = synthSnapshot(project)
    const internalTasks = ['default', 'eject', 'projen', 'install', 'install:ci', 'bundle']
    const {tasks} = snapshot['.projen/tasks.json']
    const createdTasks = Object.keys(tasks).filter((task) => !internalTasks.includes(task))
    expect(createdTasks).toHaveLength(0)

    if (PROJEN_EJECTING !== undefined) {
      delete process.env.PROJEN_EJECTING
    }
  })

  test('enables test tasks with jest option', () => {
    const project = new TestCDKProject({jest: true})
    const snapshot = synthSnapshot(project)
    const {tasks} = snapshot['.projen/tasks.json']
    expect(tasks).toHaveProperty('test')
    expect(tasks).toHaveProperty('test:watch')
  })
})

class TestCDKProject extends OttofellerCDKProject {
  constructor(options: Partial<OttofellerCDKProjectOptions> = {}) {
    super({
      ...options,
      name: 'test-cdk-project',
      defaultReleaseBranch: 'main',
      cdkVersion: '2.1.0',
    })
  }
}

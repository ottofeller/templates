import {execSync} from 'child_process'
import {synthSnapshot} from 'projen/lib/util/synth'
import {OttofellerSSTProject, OttofellerSSTProjectOptions} from '..'

jest.mock('child_process')

describe('SST template', () => {
  test('sets defaults', () => {
    const project = new TestSSTProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot).toMatchSnapshot()
    const {devDependencies} = snapshot['package.json']
    expect(devDependencies).toHaveProperty('sst')
    expect(devDependencies).toHaveProperty('aws-cdk-lib')
    expect(devDependencies).toHaveProperty('constructs')
  })

  describe('has husky', () => {
    const commitMsgFileName = '.husky/commit-msg'

    test('omitted by default', () => {
      const project = new TestSSTProject()
      const snapshot = synthSnapshot(project)
      expect(snapshot['package.json'].devDependencies).not.toHaveProperty('husky')
      expect(snapshot[commitMsgFileName]).not.toBeDefined()
    })

    test('set up if enabled with hasGitHooks option', () => {
      const project = new TestSSTProject({hasGitHooks: true})
      const snapshot = synthSnapshot(project)
      expect(snapshot['package.json'].devDependencies).toHaveProperty('husky')
      expect(snapshot[commitMsgFileName]).toBeDefined()
    })
  })

  describe('sets initial release version', () => {
    test('to 0.0.1 by default', () => {
      const defaultVersion = '0.0.1'
      const project = new TestSSTProject()
      const snapshot = synthSnapshot(project)
      expect(snapshot['.github/workflows/release.yml']).toContain(`initial-version: ${defaultVersion}`)
    })

    test('to the value provided', () => {
      const initialReleaseVersion = '1.2.3'
      const project = new TestSSTProject({initialReleaseVersion})
      const snapshot = synthSnapshot(project)
      expect(snapshot['.github/workflows/release.yml']).toContain(`initial-version: ${initialReleaseVersion}`)
    })
  })

  test('has prettier and eslint configs', () => {
    const project = new TestSSTProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['.prettierrc.json']).toBeDefined()
    expect(snapshot['.eslintrc.json']).toBeDefined()
  })

  describe('has default test workflow', () => {
    test('included by default', () => {
      const project = new TestSSTProject()
      const snapshot = synthSnapshot(project)
      expect(snapshot['.github/workflows/test.yml']).toBeDefined()
      expect(snapshot['.github/workflows/test.yml']).toMatchSnapshot()
    })

    test('excluded if opted out', () => {
      const project = new TestSSTProject({hasDefaultGithubWorkflows: false})
      const snapshot = synthSnapshot(project)
      expect(snapshot['.github/workflows/test.yml']).not.toBeDefined()
    })
  })

  test('includes VSCode settings', () => {
    const project = new TestSSTProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['.vscode/settings.json']).toBeDefined()
  })

  test('has gitignore file extended', () => {
    const project = new TestSSTProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['.gitignore']).toContain('.sst')
    expect(snapshot['.gitignore']).toContain('.build')
    expect(snapshot['.gitignore']).toContain('.open-next')
  })

  test('formats ".projenrc.ts" file after synthesis', () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- TS is not aware of the Jest mock, thus casting is needed
    const mockedExecSync = execSync as unknown as jest.Mock<Buffer, [string]>
    const project = new TestSSTProject()
    project.postSynthesize()
    expect(mockedExecSync).toBeCalledTimes(2)
    expect(mockedExecSync).toBeCalledWith('prettier --write .projenrc.ts')
    expect(mockedExecSync).toBeCalledWith('eslint --fix .projenrc.ts')
  })

  test('when ejected contains only tasks created by projen', () => {
    const PROJEN_EJECTING = process.env
    process.env.PROJEN_EJECTING = '1'

    const project = new TestSSTProject({hasGitHooks: true})
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

class TestSSTProject extends OttofellerSSTProject {
  constructor(options: Partial<OttofellerSSTProjectOptions> = {}) {
    super({
      ...options,
      name: 'test-sst-project',
      defaultReleaseBranch: 'main',
    })
  }
}

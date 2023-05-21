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
    const mockedExecSync = execSync as unknown as jest.Mock<Buffer, [string]>
    const project = new TestCDKProject()
    project.postSynthesize()
    expect(mockedExecSync).toBeCalledTimes(2)
    expect(mockedExecSync).toBeCalledWith('prettier --write .projenrc.ts')
    expect(mockedExecSync).toBeCalledWith('eslint --fix .projenrc.ts')
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

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

  test('has prettier and eslint configs written to package.json', () => {
    const project = new TestCDKProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['package.json'].prettier).toEqual('@ottofeller/prettier-config-ofmt')
    expect(snapshot['package.json'].eslintConfig).toBeDefined()

    const extendingConfigs = snapshot['package.json'].eslintConfig.extends
    expect(extendingConfigs).toHaveLength(2)
    expect(extendingConfigs).toContainEqual('@ottofeller/eslint-config-ofmt/eslint.quality.cjs')
    expect(extendingConfigs).toContainEqual('@ottofeller/eslint-config-ofmt/eslint.formatting.cjs')
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
    expect(mockedExecSync).toBeCalledTimes(1)
    expect(mockedExecSync).toBeCalledWith('ofmt .projenrc.ts')
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

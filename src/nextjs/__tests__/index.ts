import {execSync} from 'child_process'
import {synthSnapshot} from 'projen/lib/util/synth'
import {OttofellerNextjsProject, OttofellerNextjsProjectOptions} from '..'

jest.mock('child_process')

describe('NextJS template', () => {
  test('sets defaults', () => {
    const project = new TestNextJsTypeScriptProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot).toMatchSnapshot()
  })

  test('has tailwind enabled', () => {
    const project = new TestNextJsTypeScriptProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['tailwind.config.js']).toBeDefined()
    expect(snapshot['tailwind.config.defaults.js']).toBeDefined()
    expect(snapshot['postcss.config.json']).toBeDefined()

    expect(snapshot['tsconfig.json'].compilerOptions.paths).toHaveProperty(['tailwind.config.js', 0])
  })

  test('includes two NextJS config files', () => {
    const project = new TestNextJsTypeScriptProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['next.config.js']).toBeDefined()
    expect(snapshot['next.config.defaults.js']).toBeDefined()
  })

  test('is set to CommonJS not ESnext', () => {
    const project = new TestNextJsTypeScriptProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['tsconfig.json']).toBeDefined()
    expect(snapshot['tsconfig.json'].compilerOptions).toBeDefined()
    expect(snapshot['tsconfig.json'].compilerOptions.module).toEqual('CommonJS')
  })

  test('has prettier and eslint configs written to package.json', () => {
    const project = new TestNextJsTypeScriptProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['package.json'].prettier).toEqual('@ottofeller/prettier-config-ofmt')
    expect(snapshot['package.json'].eslintConfig).toBeDefined()

    expect(snapshot['package.json'].eslintConfig.extends).toContainEqual(
      '@ottofeller/eslint-config-ofmt/eslint.quality.cjs',
    )
  })

  describe('has default test workflow', () => {
    test('included by default', () => {
      const project = new TestNextJsTypeScriptProject()
      const snapshot = synthSnapshot(project)
      expect(snapshot['.github/workflows/test.yml']).toBeDefined()
      expect(snapshot['.github/workflows/test.yml']).toMatchSnapshot()
    })

    test('excluded if opted out', () => {
      const project = new TestNextJsTypeScriptProject({hasDefaultGithubWorkflows: false})
      const snapshot = synthSnapshot(project)
      expect(snapshot['.github/workflows/test.yml']).not.toBeDefined()
    })
  })

  describe('has GraphQL', () => {
    test('enabled by default', () => {
      const project = new TestNextJsTypeScriptProject()
      const snapshot = synthSnapshot(project)
      expect(snapshot['package.json'].dependencies).toHaveProperty('graphql')
      expect(snapshot['package.json'].scripts).toHaveProperty('generate-graphql-schema')
      expect(snapshot['package.json'].scripts).toHaveProperty('gql-to-ts')
      expect(snapshot['codegen.yml']).toBeDefined()
    })

    test('disabled with an option', () => {
      const project = new TestNextJsTypeScriptProject({isGraphqlEnabled: false})
      const snapshot = synthSnapshot(project)
      expect(snapshot['package.json'].dependencies).not.toHaveProperty('graphql')
      expect(snapshot['package.json'].scripts).not.toHaveProperty('generate-graphql-schema')
      expect(snapshot['package.json'].scripts).not.toHaveProperty('gql-to-ts')
      expect(snapshot['codegen.yml']).not.toBeDefined()
    })
  })

  test('includes VSCode settings', () => {
    const project = new TestNextJsTypeScriptProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['.vscode/settings.json']).toBeDefined()
  })

  test('formats ".projenrc.ts" file after synthesis', () => {
    const mockedExecSync = execSync as unknown as jest.Mock<Buffer, [string]>
    const project = new TestNextJsTypeScriptProject()
    project.postSynthesize()
    expect(mockedExecSync).toBeCalledTimes(1)
    expect(mockedExecSync).toBeCalledWith('ofmt .projenrc.ts')
  })
})

class TestNextJsTypeScriptProject extends OttofellerNextjsProject {
  constructor(options: Partial<OttofellerNextjsProjectOptions> = {}) {
    super({
      ...options,
      name: 'test-nextjs-project',
      defaultReleaseBranch: 'main',
    })
  }
}

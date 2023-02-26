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

  describe('has UI-related packages', () => {
    test('installed by default', () => {
      const project = new TestNextJsTypeScriptProject()
      const snapshot = synthSnapshot(project)
      expect(snapshot['package.json'].dependencies).toHaveProperty('@next/font')
      expect(snapshot['package.json'].dependencies).toHaveProperty('@headlessui/react')
      expect(snapshot['package.json'].devDependencies).toHaveProperty('tailwindcss')
      expect(snapshot['postcss.config.json']).toBeDefined()
      expect(snapshot['tailwind.config.defaults.js']).toBeDefined()
      expect(snapshot['tailwind.config.js']).toBeDefined()
    })

    test('excluded if the option is set to false', () => {
      const project = new TestNextJsTypeScriptProject({ui: false})
      const snapshot = synthSnapshot(project)
      expect(snapshot['package.json'].dependencies).not.toHaveProperty('@next/font')
      expect(snapshot['package.json'].dependencies).not.toHaveProperty('@headlessui/react')
      expect(snapshot['package.json'].devDependencies).not.toHaveProperty('tailwindcss')
      expect(snapshot['postcss.config.json']).not.toBeDefined()
      expect(snapshot['tailwind.config.defaults.js']).not.toBeDefined()
      expect(snapshot['tailwind.config.js']).not.toBeDefined()
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

  test('has gitignore file extended', () => {
    const project = new TestNextJsTypeScriptProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['.gitignore']).toContain('.DS_Store')
    expect(snapshot['.gitignore']).toContain('.env.local')
    expect(snapshot['.gitignore']).toContain('.next/')
    expect(snapshot['.gitignore']).toContain('.idea/')
    expect(snapshot['.gitignore']).toContain('debug/')
    expect(snapshot['.gitignore']).toContain('.vscode/tasks.json')
    expect(snapshot['.gitignore']).toContain('build/')
  })

  describe('has jest and an example test', () => {
    test('setup by default', () => {
      const project = new TestNextJsTypeScriptProject()
      const snapshot = synthSnapshot(project)
      expect(snapshot['package.json'].devDependencies).toHaveProperty('jest')
      expect(snapshot['package.json'].devDependencies).toHaveProperty('@types/jest')
      expect(snapshot['package.json'].devDependencies).toHaveProperty('jest-environment-jsdom')
      expect(snapshot['package.json'].devDependencies).toHaveProperty('@testing-library/react')
      expect(snapshot['package.json'].scripts).toHaveProperty('test')
      expect(snapshot['.projen/tasks.json'].tasks.test.steps).toHaveLength(1)
      expect(snapshot['.projen/tasks.json'].tasks.test.steps[0].exec).toEqual('jest --no-cache --all')
      expect(snapshot['package.json'].scripts).toHaveProperty('test:watch')
      expect(snapshot['jest.config.defaults.js']).toBeDefined()
      expect(snapshot['jest.config.js']).toBeDefined()
    })

    test('excluded if the option is set to false', () => {
      const project = new TestNextJsTypeScriptProject({jest: false})
      const snapshot = synthSnapshot(project)
      expect(snapshot['package.json'].devDependencies).not.toHaveProperty('jest')
      expect(snapshot['package.json'].devDependencies).not.toHaveProperty('@types/jest')
      expect(snapshot['package.json'].devDependencies).not.toHaveProperty('jest-environment-jsdom')
      expect(snapshot['package.json'].devDependencies).not.toHaveProperty('@testing-library/react')
      expect(snapshot['package.json'].scripts).toHaveProperty('test')
      expect(snapshot['.projen/tasks.json'].tasks.test).not.toHaveProperty('steps')
      expect(snapshot['package.json'].scripts).not.toHaveProperty('test:watch')
      expect(snapshot['jest.config.defaults.js']).not.toBeDefined()
      expect(snapshot['jest.config.js']).not.toBeDefined()
    })
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

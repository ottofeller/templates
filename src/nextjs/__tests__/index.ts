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

  test('has prettier and eslint configs', () => {
    const project = new TestNextJsTypeScriptProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['.prettierrc.json']).toBeDefined()
    expect(snapshot['.eslintrc.json']).toBeDefined()
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
      expect(snapshot['package.json'].dependencies).toHaveProperty('@apollo/client')
      expect(snapshot['package.json'].dependencies).toHaveProperty('graphql')
      expect(snapshot['package.json'].scripts).toHaveProperty('generate-graphql-schema')
      expect(snapshot['package.json'].scripts).toHaveProperty('gql-to-ts')
      expect(snapshot['codegen.yml']).toBeDefined()
    })

    test('disabled with an option', () => {
      const project = new TestNextJsTypeScriptProject({isGraphqlEnabled: false})
      const snapshot = synthSnapshot(project)
      expect(snapshot['package.json'].dependencies).not.toHaveProperty('@apollo/client')
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
      expect(snapshot['package.json'].dependencies).toHaveProperty('@headlessui/react')
      expect(snapshot['package.json'].devDependencies).toHaveProperty('tailwindcss')
      expect(snapshot['postcss.config.json']).toBeDefined()
      expect(snapshot['tailwind.config.defaults.ts']).toBeDefined()
      expect(snapshot['tailwind.config.ts']).toBeDefined()
      expect(snapshot['.eslintrc.json'].plugins).toContain('tailwindcss')
    })

    test('excluded if the option is set to false', () => {
      const project = new TestNextJsTypeScriptProject({isUiConfigEnabled: false})
      const snapshot = synthSnapshot(project)
      expect(snapshot['package.json'].dependencies).not.toHaveProperty('@headlessui/react')
      expect(snapshot['package.json'].devDependencies).not.toHaveProperty('tailwindcss')
      expect(snapshot['postcss.config.json']).not.toBeDefined()
      expect(snapshot['tailwind.config.defaults.ts']).not.toBeDefined()
      expect(snapshot['tailwind.config.ts']).not.toBeDefined()
      expect(snapshot['.eslintrc.json'].plugins).not.toContain('tailwindcss')
      expect(project.postSynthFormattingPaths).not.toContain('pages/_app.tsx')
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
    expect(project.postSynthFormattingPaths).toHaveLength(2)
    const formattingPaths = project.postSynthFormattingPaths.join(' ')
    project.postSynthesize()
    expect(mockedExecSync).toBeCalledTimes(2)
    expect(mockedExecSync).toBeCalledWith(`prettier --write ${formattingPaths}`)
    expect(mockedExecSync).toBeCalledWith(`eslint --fix ${formattingPaths}`)
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

  describe('has sample code', () => {
    test('included by default', () => {
      const project = new TestNextJsTypeScriptProject()
      const snapshot = synthSnapshot(project)
      expect(snapshot['src/Home/index.tsx']).toBeDefined()
      expect(snapshot['pages/index.tsx']).toBeDefined()
      expect(snapshot['pages/_app.tsx']).toBeDefined()
      expect(snapshot['src/assets/global.css']).toBeDefined()
      expect(snapshot['src/Home/__tests__/index.tsx']).toBeDefined()
    })

    test('excluded with an option', () => {
      const project = new TestNextJsTypeScriptProject({sampleCode: false})
      const snapshot = synthSnapshot(project)
      expect(snapshot['src/Home/index.tsx']).not.toBeDefined()
      expect(snapshot['pages/index.tsx']).not.toBeDefined()
      expect(snapshot['pages/_app.tsx']).not.toBeDefined()
      expect(snapshot['src/assets/global.css']).not.toBeDefined()
      expect(snapshot['src/Home/__tests__/index.tsx']).not.toBeDefined()
    })
  })

  describe('has docker integration', () => {
    test('included by default', () => {
      const project = new TestNextJsTypeScriptProject()
      const snapshot = synthSnapshot(project)
      expect(snapshot['.dockerignore']).toBeDefined()
      expect(snapshot['Dockerfile.dev']).toBeDefined()
      expect(snapshot['Dockerfile.production']).toBeDefined()
    })

    test('excluded with an option', () => {
      const project = new TestNextJsTypeScriptProject({hasDocker: false})
      const snapshot = synthSnapshot(project)
      expect(snapshot['.dockerignore']).not.toBeDefined()
      expect(snapshot['Dockerfile.dev']).not.toBeDefined()
      expect(snapshot['Dockerfile.production']).not.toBeDefined()
    })
  })

  test('has "start" task instead of "server"', () => {
    const project = new TestNextJsTypeScriptProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['.projen/tasks.json'].tasks).not.toHaveProperty('server')
    expect(snapshot['.projen/tasks.json'].tasks).toHaveProperty('start')
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

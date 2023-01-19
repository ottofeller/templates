import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {synthSnapshot} from 'projen/lib/util/synth'
import * as YAML from 'yaml'
import {CodegenConfig, CodegenConfigYaml} from '..'

describe('Codegen utils', () => {
  const generatedIndex = './generated/index.ts'

  const config: CodegenConfig = {
    schema: {'${APP_URL}': {headers: {'x-access-token': '${ACCESS_TOKEN}'}}},

    generates: {
      [generatedIndex]: {
        documents: 'src/**/!(*.generated).ts',
        plugins: ['typescript', 'typescript-operations'],
      },
    },
  }

  test('adds codegen.yml file with provided config', () => {
    const project = new TestProject()
    new CodegenConfigYaml(project, config)
    const snapshot = synthSnapshot(project)
    const generatedConfig = snapshot['codegen.yml']
    expect(generatedConfig).toBeDefined()
    expect(YAML.parse(generatedConfig)).toStrictEqual(config)
  })

  test('allows schema override', () => {
    const project = new TestProject()
    const configFile = new CodegenConfigYaml(project, config)
    const schema: CodegenConfig['schema'] = ['schema1', 'schema2']
    configFile.overrideSchema(schema)
    const snapshot = synthSnapshot(project)
    const expectedConfig: CodegenConfig = {...config, schema}
    expect(YAML.parse(snapshot['codegen.yml'])).toStrictEqual(expectedConfig)
  })

  test('allows overwrite override', () => {
    const project = new TestProject()
    const configFile = new CodegenConfigYaml(project, config)
    const overwrite: CodegenConfig['overwrite'] = true
    configFile.overrideOverwrite(overwrite)
    const snapshot = synthSnapshot(project)
    const expectedConfig: CodegenConfig = {...config, overwrite}
    expect(YAML.parse(snapshot['codegen.yml'])).toStrictEqual(expectedConfig)
  })

  test('allows output documents override', () => {
    const project = new TestProject()
    const configFile = new CodegenConfigYaml(project, config)
    const documents = 'src/documents/*.ts'
    configFile.overrideDocumentsForOutput(generatedIndex, documents)
    const snapshot = synthSnapshot(project)

    const expectedConfig: CodegenConfig = {
      ...config,
      generates: {
        ...config.generates,
        [generatedIndex]: {
          ...config.generates[generatedIndex],
          documents,
        },
      },
    }

    expect(YAML.parse(snapshot['codegen.yml'])).toStrictEqual(expectedConfig)
  })

  test('allows output plugins override', () => {
    const project = new TestProject()
    const configFile = new CodegenConfigYaml(project, config)
    const plugins = ['typescript-resolvers']
    configFile.overridePluginsForOutput(generatedIndex, plugins)
    const snapshot = synthSnapshot(project)

    const expectedConfig: CodegenConfig = {
      ...config,
      generates: {
        ...config.generates,
        [generatedIndex]: {
          ...config.generates[generatedIndex],
          plugins,
        },
      },
    }

    expect(YAML.parse(snapshot['codegen.yml'])).toStrictEqual(expectedConfig)
  })
})

class TestProject extends NodeProject {
  constructor(options: Partial<NodeProjectOptions> = {}) {
    super({
      ...options,
      name: 'test-project',
      defaultReleaseBranch: 'main',
    })
  }
}

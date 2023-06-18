import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {synthSnapshot} from 'projen/lib/util/synth'
import {addVsCode} from '..'

describe('addVsCode function', () => {
  const settingsPath = '.vscode/settings.json'
  const extensionsPath = '.vscode/extensions.json'

  test('adds predefined settings and extensions to a project', () => {
    const project = new TestProject()
    addVsCode(project)
    const snapshot = synthSnapshot(project)
    expect(snapshot[settingsPath]).toBeDefined()
    expect(snapshot[settingsPath]['[dockerfile]']).toBeDefined()
    expect(snapshot[settingsPath]['typescript.tsdk']).toBeDefined()
    expect(snapshot[settingsPath]['path-autocomplete.extensionOnImport']).toBeDefined()
    expect(snapshot[settingsPath]['json.schemaDownload.enable']).toBeDefined()
    expect(snapshot[extensionsPath].recommendations).toBeDefined()
    expect(snapshot[extensionsPath].unwantedRecommendations).toBeDefined()
  })

  test('can be opted out', () => {
    const project = new TestProject({vscode: false})
    addVsCode(project)
    const snapshot = synthSnapshot(project)
    expect(snapshot[settingsPath]).not.toBeDefined()
    expect(snapshot[extensionsPath]).not.toBeDefined()
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

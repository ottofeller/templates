import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {synthSnapshot} from 'projen/lib/util/synth'
import {VsCodeSettings} from '..'

describe('VsCodeSettings utils', () => {
  const settingsPath = '.vscode/settings.json'

  test('creates a settings file', () => {
    const project = new TestProject()
    new VsCodeSettings(project)
    const snapshot = synthSnapshot(project)
    expect(snapshot[settingsPath]).toBeDefined()
  })

  test('allows to add settings', () => {
    const project = new TestProject()
    new VsCodeSettings(project, {'typescript.tsdk': 'node_modules/typescript/lib'})
    const settings = VsCodeSettings.of(project)
    expect(settings).toBeDefined()
    settings!.add({'some.prop.enable': true})
    const snapshot = synthSnapshot(project)
    expect(snapshot[settingsPath]['typescript.tsdk']).toBeDefined()
    expect(snapshot[settingsPath]['some.prop.enable']).toBeDefined()
  })

  test('adds predefined settings and extensions to a project', () => {
    const project = new TestProject()
    VsCodeSettings.addToProject(project)
    const snapshot = synthSnapshot(project)
    expect(snapshot[settingsPath]).toBeDefined()
    expect(snapshot[settingsPath]['[dockerfile]']).toBeDefined()
    expect(snapshot[settingsPath]['typescript.tsdk']).toBeDefined()
    expect(snapshot[settingsPath]['path-autocomplete.extensionOnImport']).toBeDefined()
    expect(snapshot[settingsPath]['json.schemaDownload.enable']).toBeDefined()
    const extensionsPath = '.vscode/extensions.json'
    expect(snapshot[extensionsPath].recommendations).toBeDefined()
    expect(snapshot[extensionsPath].unwantedRecommendations).toBeDefined()
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

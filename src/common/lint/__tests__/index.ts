import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {synthSnapshot} from 'projen/lib/util/synth'
import {addLintScripts} from '..'

describe('lint function', () => {
  test('adds linting scripts for provided paths to gitignore', () => {
    const project = new TestProject()
    addLintScripts(project, ['folderPath', 'file/path.ts', 'pattern/path/*.ts'])
    const snapshot = synthSnapshot(project)
    const scriptNames = Object.keys(snapshot['package.json'].scripts)
    expect(scriptNames).toContain('format')
    expect(scriptNames).toContain('typecheck')
    expect(scriptNames).toContain('lint')
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

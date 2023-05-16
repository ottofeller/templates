import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {synthSnapshot} from 'projen/lib/util/synth'
import {extendGitignore} from '..'

describe('extendGitignore function', () => {
  const gitignoreFilePath = '.gitignore'

  test('adds default patterns to gitignore', () => {
    const project = new TestProject()
    extendGitignore(project)
    const snapshot = synthSnapshot(project)
    expect(snapshot[gitignoreFilePath]).toBeDefined()
    expect(snapshot[gitignoreFilePath]).toContain('.DS_Store')
    expect(snapshot[gitignoreFilePath]).toContain('.env.local')
    expect(snapshot[gitignoreFilePath]).toContain('target/')
    expect(snapshot[gitignoreFilePath]).toContain('.idea/')
  })

  test('adds provided patterns to gitignore', () => {
    const project = new TestProject()
    const patterns = ['test-entry1', 'test-entry2']
    extendGitignore(project, patterns)
    const snapshot = synthSnapshot(project)
    expect(snapshot[gitignoreFilePath]).toBeDefined()
    expect(snapshot[gitignoreFilePath]).toContain(patterns[0])
    expect(snapshot[gitignoreFilePath]).toContain(patterns[1])
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

import * as fs from 'fs'
import * as path from 'path'
import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {synthSnapshot} from 'projen/lib/util/synth'
import {addHusky, extendGitignore} from '..'

describe('extendGitignore function', () => {
  const gitignoreFilePath = '.gitignore'

  test('adds default patterns to gitignore', () => {
    const project = new TestProject()
    extendGitignore(project)
    const snapshot = synthSnapshot(project)
    expect(snapshot[gitignoreFilePath]).toBeDefined()
    expect(snapshot[gitignoreFilePath]).toContain('.DS_Store')
    expect(snapshot[gitignoreFilePath]).toContain('.env.local')
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

describe('addHusky function', () => {
  const commitMsgFileName = '.husky/commit-msg'
  const assetFilePath = path.resolve('src/common/git/assets/commit-msg')
  const assetFileContents = fs.readFileSync(assetFilePath, {encoding: 'utf-8'})
  expect(assetFileContents).toBeDefined()

  test('sets up husky with a commit-msg hook', () => {
    const project = new TestProject()
    addHusky(project, {})
    const snapshot = synthSnapshot(project)
    expect(snapshot['package.json'].devDependencies).toHaveProperty('husky')

    const commitMsgFile = snapshot[commitMsgFileName]
    expect(commitMsgFile).toBeDefined()
    expect(commitMsgFile).toEqual(assetFileContents)
  })

  test('has disabled commit-msg hook with hasDefaultCommitHook option', () => {
    const project = new TestProject()
    addHusky(project, {hasDefaultCommitHook: false})
    const snapshot = synthSnapshot(project)
    expect(snapshot['package.json'].devDependencies).toHaveProperty('husky')
    expect(snapshot[commitMsgFileName]).not.toBeDefined()
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

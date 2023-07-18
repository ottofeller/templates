import * as fs from 'fs'
import * as path from 'path'
import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {synthSnapshot} from 'projen/lib/util/synth'
import {HuskyRule, addHusky} from '..'

describe('addHusky function', () => {
  const sourceFolder = 'src/common/git/husky/assets'
  const destinationFolder = '.husky'
  const nodeScriptFileName = 'check-commit-msg.js'
  const templatePath = path.join(sourceFolder, 'husky-shell-script-template')
  const templateContents = fs.readFileSync(templatePath, {encoding: 'utf-8'})
  const commitMsgShellScriptDestinationPath = path.join(destinationFolder, 'commit-msg')
  const nodeScriptDestinationPath = path.join(destinationFolder, nodeScriptFileName)
  const preCommitShellScriptDestinationPath = path.join(destinationFolder, 'pre-commit')

  test('sets up husky with a commit-msg hook', () => {
    const project = new TestProject()
    addHusky(project, {})
    const snapshot = synthSnapshot(project)
    expect(snapshot['package.json'].devDependencies).toHaveProperty('husky')

    const checkMessageCommand = 'node .husky/check-commit-msg.js "$(head -1 $@)"'
    const commitMsgShellScriptContents = templateContents.replace('{{COMMAND}}', checkMessageCommand)
    expect(commitMsgShellScriptContents).toBeDefined()
    expect(snapshot[commitMsgShellScriptDestinationPath]).toEqual(commitMsgShellScriptContents)

    const nodeScriptSourcePath = path.join(sourceFolder, nodeScriptFileName)
    const nodeScriptContents = fs.readFileSync(nodeScriptSourcePath, {encoding: 'utf-8'})
    expect(nodeScriptContents).toBeDefined()
    expect(snapshot[nodeScriptDestinationPath]).toEqual(nodeScriptContents)
  })

  test('has disabled commit-msg hook with empty rules list', () => {
    const project = new TestProject()
    addHusky(project, {huskyRules: {}})
    const snapshot = synthSnapshot(project)
    expect(snapshot['package.json'].devDependencies).toHaveProperty('husky')
    expect(snapshot[commitMsgShellScriptDestinationPath]).not.toBeDefined()
    expect(snapshot[nodeScriptDestinationPath]).not.toBeDefined()
  })

  test('adds hooks from a user-defined list', () => {
    const project = new TestProject()
    addHusky(project, {huskyRules: {checkCargo: {isFormatting: false}}})
    const snapshot = synthSnapshot(project)
    expect(snapshot[commitMsgShellScriptDestinationPath]).not.toBeDefined()
    expect(snapshot[nodeScriptDestinationPath]).not.toBeDefined()

    expect(snapshot[preCommitShellScriptDestinationPath]).toBeDefined()
    const preCommitShellScriptContents = templateContents.replace('{{COMMAND}}', 'cargo check')
    expect(preCommitShellScriptContents).toBeDefined()
    expect(snapshot[preCommitShellScriptDestinationPath]).toEqual(preCommitShellScriptContents)
  })

  test('does not handle valid falsy values', () => {
    const project = new TestProject()
    addHusky(project, {huskyRules: {checkCargo: undefined, commitMsg: false}})
    const snapshot = synthSnapshot(project)
    expect(snapshot[commitMsgShellScriptDestinationPath]).not.toBeDefined()
    expect(snapshot[nodeScriptDestinationPath]).not.toBeDefined()
    expect(snapshot[preCommitShellScriptDestinationPath]).not.toBeDefined()
  })

  test('throws if unknown rule is provided', () => {
    const project = new TestProject()

    expect(
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- cast in order to test unexpected behavior
      () => addHusky(project, {huskyRules: {unknown: {}} as HuskyRule}),
    ).toThrow()
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

import * as fs from 'fs'
import * as path from 'path'
import {NodeProject, type NodeProjectOptions} from 'projen/lib/javascript'
import {synthSnapshot} from 'projen/lib/util/synth'
import {addHusky, type CheckCargoOptions} from '..'
import type {CustomRuleOptions} from '../custom-rule-options'

describe('addHusky function', () => {
  const sourceFolder = 'src/common/git/husky/assets'
  const destinationFolder = '.husky'
  const nodeScriptFileName = 'check-commit-msg.js'
  const templatePath = path.join(sourceFolder, 'husky-shell-script-template')
  const templateContents = fs.readFileSync(templatePath, {encoding: 'utf-8'})
  const commitMsgShellScriptDestinationPath = path.join(destinationFolder, 'commit-msg')
  const nodeScriptDestinationPath = path.join(destinationFolder, nodeScriptFileName)
  const preCommitShellScriptDestinationPath = path.join(destinationFolder, 'pre-commit')

  describe('sets up husky with a commit-msg hook', () => {
    test('with default settings', () => {
      const project = new TestProject()
      addHusky(project, {})
      const snapshot = synthSnapshot(project)
      expect(snapshot['package.json'].devDependencies).toHaveProperty('husky')

      const checkMessageCommand = [
        `if check_branch "main" "dev"; then`,
        '  node .husky/check-commit-msg.js "$(head -1 $@)"',
        'fi',
        '',
      ].join('\n')

      const commitMsgShellScriptContents = templateContents.replace('{{COMMAND}}', checkMessageCommand)
      expect(commitMsgShellScriptContents).toBeDefined()
      expect(snapshot[commitMsgShellScriptDestinationPath]).toEqual(commitMsgShellScriptContents)

      const nodeScriptSourcePath = path.join(sourceFolder, nodeScriptFileName)
      const nodeScriptContents = fs.readFileSync(nodeScriptSourcePath, {encoding: 'utf-8'})

      expect(nodeScriptContents).toBeDefined()
      expect(snapshot[nodeScriptDestinationPath]).toEqual(nodeScriptContents)
    })

    test('is disabled with empty rules list', () => {
      const project = new TestProject()
      addHusky(project, {huskyRules: {}})
      const snapshot = synthSnapshot(project)
      expect(snapshot['package.json'].devDependencies).toHaveProperty('husky')
      expect(snapshot[commitMsgShellScriptDestinationPath]).not.toBeDefined()
      expect(snapshot[nodeScriptDestinationPath]).not.toBeDefined()
    })

    test('checks all branches with empty branch list', () => {
      const project = new TestProject()
      addHusky(project, {huskyRules: {commitMsg: {ignoreBranches: []}}})
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

    test('allows to ignore particular branches', () => {
      const project = new TestProject()
      const ignoredBranch = 'special-branch'
      const customCommand = 'echo test'

      const huskyCustomRules: Array<CustomRuleOptions> = [
        {trigger: 'commit-msg', command: customCommand, ignoreBranches: [ignoredBranch]},
      ]

      addHusky(project, {huskyRules: {commitMsg: {ignoreBranches: [ignoredBranch]}, huskyCustomRules}})
      const snapshot = synthSnapshot(project)
      expect(snapshot['package.json'].devDependencies).toHaveProperty('husky')

      const allCommands = [
        `if check_branch "${ignoredBranch}"; then`,
        '  node .husky/check-commit-msg.js "$(head -1 $@)"',
        'fi',
        '',
        `if check_branch "${ignoredBranch}"; then`,
        `  ${customCommand}`,
        'fi',
        '',
      ].join('\n')

      const shellScriptContents = templateContents.replace('{{COMMAND}}', allCommands)
      expect(shellScriptContents).toBeDefined()
      expect(snapshot[commitMsgShellScriptDestinationPath]).toEqual(shellScriptContents)

      const nodeScriptSourcePath = path.join(sourceFolder, nodeScriptFileName)
      const nodeScriptContents = fs.readFileSync(nodeScriptSourcePath, {encoding: 'utf-8'})

      expect(nodeScriptContents).toBeDefined()
      expect(snapshot[nodeScriptDestinationPath]).toEqual(nodeScriptContents)
    })
  })

  describe('pre-commit hook with checkCargo rule', () => {
    const cargoCheckCommand = 'cargo check'

    test('is skiped by default', () => {
      const project = new TestProject()
      addHusky(project, {})
      const snapshot = synthSnapshot(project)
      expect(snapshot['package.json'].devDependencies).toHaveProperty('husky')
      expect(snapshot[preCommitShellScriptDestinationPath]).not.toBeDefined()
    })

    test('runs check and formatting commands with default settings', () => {
      const project = new TestProject()
      addHusky(project, {huskyRules: {checkCargo: {ignoreBranches: []}}})
      const snapshot = synthSnapshot(project)
      const fullCommand = ['cargo fmt --all', cargoCheckCommand].join('\n')
      const shellScriptContents = templateContents.replace('{{COMMAND}}', fullCommand)
      expect(snapshot[preCommitShellScriptDestinationPath]).toEqual(shellScriptContents)
    })

    test('checks all branches with empty branch list', () => {
      const project = new TestProject()
      addHusky(project, {huskyRules: {checkCargo: {ignoreBranches: [], isFormatting: false}}})
      const snapshot = synthSnapshot(project)
      const shellScriptContents = templateContents.replace('{{COMMAND}}', cargoCheckCommand)
      expect(snapshot[preCommitShellScriptDestinationPath]).toEqual(shellScriptContents)
    })

    test('allows to ignore particular branches', () => {
      const project = new TestProject()
      const ignoredBranch = 'special-branch'
      addHusky(project, {huskyRules: {checkCargo: {ignoreBranches: [ignoredBranch], isFormatting: false}}})
      const snapshot = synthSnapshot(project)
      const fullCommand = `if check_branch "${ignoredBranch}"; then\n  ${cargoCheckCommand}\nfi\n`
      const shellScriptContents = templateContents.replace('{{COMMAND}}', fullCommand)
      expect(snapshot[preCommitShellScriptDestinationPath]).toEqual(shellScriptContents)
    })

    test('performs the check in the specified workingDirectory', () => {
      const project = new TestProject()
      const workingDirectory = 'testDir'
      addHusky(project, {huskyRules: {checkCargo: {ignoreBranches: [], isFormatting: false, workingDirectory}}})
      const snapshot = synthSnapshot(project)
      const fullCommand = [`cd ${workingDirectory}`, cargoCheckCommand, 'cd ..'].join('\n')
      const shellScriptContents = templateContents.replace('{{COMMAND}}', fullCommand)
      expect(snapshot[preCommitShellScriptDestinationPath]).toEqual(shellScriptContents)
    })
  })

  test('adds hooks from a user-defined list', () => {
    const project = new TestProject()
    const checkCargo: CheckCargoOptions = {isFormatting: false}
    const customPrecommitCommand = 'npm run format'
    const huskyCustomRule: Array<CustomRuleOptions> = [{command: customPrecommitCommand, trigger: 'pre-commit'}]
    addHusky(project, {huskyRules: {checkCargo, huskyCustomRules: huskyCustomRule}})
    const snapshot = synthSnapshot(project)
    expect(snapshot[commitMsgShellScriptDestinationPath]).not.toBeDefined()
    expect(snapshot[nodeScriptDestinationPath]).not.toBeDefined()

    expect(snapshot[preCommitShellScriptDestinationPath]).toBeDefined()
    const expectedPrecommitCommand = `cargo check\n${customPrecommitCommand}`
    const preCommitShellScriptContents = templateContents.replace('{{COMMAND}}', expectedPrecommitCommand)
    expect(snapshot[preCommitShellScriptDestinationPath]).toEqual(preCommitShellScriptContents)
  })

  test('does not handle valid falsy values', () => {
    const project = new TestProject()
    addHusky(project, {huskyRules: {checkCargo: undefined, commitMsg: false, huskyCustomRules: undefined}})
    const snapshot = synthSnapshot(project)
    expect(snapshot[commitMsgShellScriptDestinationPath]).not.toBeDefined()
    expect(snapshot[nodeScriptDestinationPath]).not.toBeDefined()
    expect(snapshot[preCommitShellScriptDestinationPath]).not.toBeDefined()
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

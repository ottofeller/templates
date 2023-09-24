import * as path from 'path'
import type {NodeProject} from 'projen/lib/javascript'
import {AssetFile} from '../../files/AssetFile'
import type {WithGitHooks} from '../with-git-hooks'
import {commitMessage, preCommit} from './create-hook'
import type {CustomRuleOptions} from './custom-rule-options'
import {destinationFolder, sourceFolder} from './template-path'
import {defaultIgnoreBranches} from './with-ignore-branches'

const wrapCommandWithBranchCheck = (command: string, ignoreBranches: Array<string>) => `if check_branch ${ignoreBranches
  .map((b) => `"${b}"`)
  .join(' ')}; then
  ${command}
fi
`

export const addHusky = (project: NodeProject, options: WithGitHooks): void => {
  project.addDevDeps('husky')
  project.addScripts({prepare: 'husky install'})
  const {commitMsg, checkCargo, huskyCustomRules: huskyCustomRule} = options.huskyRules ?? {commitMsg: true}
  const commitMessageCommands: Array<string> = []
  const preCommitCommands: Array<string> = []

  // ANCHOR Pre-defined rule for commit message formatting
  if (commitMsg) {
    const ignoreBranches = typeof commitMsg === 'object' ? commitMsg.ignoreBranches : defaultIgnoreBranches
    const runNodeScriptCommand = 'node .husky/check-commit-msg.js "$(head -1 $@)"'

    const fullCommitMsgCommand =
      ignoreBranches && ignoreBranches.length > 0
        ? wrapCommandWithBranchCheck(runNodeScriptCommand, ignoreBranches)
        : runNodeScriptCommand

    commitMessageCommands.push(fullCommitMsgCommand)
    const nodeScriptFilename = 'check-commit-msg.js'

    new AssetFile(project, path.join(destinationFolder, nodeScriptFilename), {
      sourcePath: path.join(sourceFolder, nodeScriptFilename),
      executable: true,
    })
  }

  // ANCHOR Pre-defined rule for cargo checking on pre-commit
  if (checkCargo) {
    const checkCargoCommands = ['cargo check']
    const isFormatting = checkCargo.isFormatting ?? true
    const workingDirectory = checkCargo.workingDirectory

    if (isFormatting) {
      checkCargoCommands.unshift('cargo fmt --all')
    }

    if (workingDirectory) {
      checkCargoCommands.unshift(`cd ${workingDirectory}`)
      const pathLength = workingDirectory.split('/').length
      const returnPath = Array(pathLength).fill('..').join('/')
      checkCargoCommands.push(`cd ${returnPath}`)
    }

    const {ignoreBranches} = checkCargo

    const fullCheckCargoCommand =
      ignoreBranches && ignoreBranches.length > 0
        ? wrapCommandWithBranchCheck(checkCargoCommands.join('\n  '), ignoreBranches)
        : checkCargoCommands.join('\n')

    preCommitCommands.push(fullCheckCargoCommand)
  }

  // ANCHOR Any custom rules added to corresponding hooks
  if (huskyCustomRule) {
    const renderCommand = ({command, ignoreBranches}: CustomRuleOptions) =>
      ignoreBranches && ignoreBranches.length > 0 ? wrapCommandWithBranchCheck(command, ignoreBranches) : command

    const customCommitMessageCommands = huskyCustomRule
      .filter(({trigger}) => trigger === 'commit-msg')
      .map(renderCommand)

    const customPreCommitCommands = huskyCustomRule.filter(({trigger}) => trigger === 'pre-commit').map(renderCommand)

    commitMessageCommands.push(...customCommitMessageCommands)
    preCommitCommands.push(...customPreCommitCommands)
  }

  // ANCHOR Render the hooks if necessary
  if (commitMessageCommands.length > 0) {
    commitMessage(project, commitMessageCommands.join('\n'))
  }

  if (preCommitCommands.length > 0) {
    preCommit(project, preCommitCommands.join('\n'))
  }
}

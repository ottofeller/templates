import * as path from 'path'
import type {NodeProject} from 'projen/lib/javascript'
import {AssetFile} from '../../files/AssetFile'
import {WithGitHooks} from '../with-git-hooks'
import {commitMessage, preCommit} from './create-hook'
import {destinationFolder, sourceFolder} from './template-path'

export const addHusky = (project: NodeProject, options: WithGitHooks): void => {
  project.addDevDeps('husky')
  project.addTask('prepare', {exec: 'husky install'})
  const {commitMsg, checkCargo, huskyCustomRules: huskyCustomRule} = options.huskyRules ?? {commitMsg: true}
  const commitMessageCommands: Array<string> = []
  const preCommitCommands: Array<string> = []

  // ANCHOR Pre-defined rule for commit message formatting
  if (commitMsg) {
    commitMessageCommands.push('node .husky/check-commit-msg.js "$(head -1 $@)"')
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

    preCommitCommands.push(...checkCargoCommands)
  }

  // ANCHOR Any custom rules added to corresponding hooks
  if (huskyCustomRule) {
    const customCommitMessageCommands = huskyCustomRule
      .filter(({trigger}) => trigger === 'commit-msg')
      .map(({command}) => command)

    const customPreCommitCommands = huskyCustomRule
      .filter(({trigger}) => trigger === 'pre-commit')
      .map(({command}) => command)

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

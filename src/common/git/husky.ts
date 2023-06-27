import * as path from 'path'
import type {NodeProject} from 'projen/lib/javascript'
import {AssetFile} from '../files/AssetFile'
import type {WithGitHooks} from './with-git-hooks'

export const addHusky = (project: NodeProject, options: WithGitHooks): void => {
  project.addDevDeps('husky')
  project.addTask('prepare', {exec: 'husky install'})

  if (options.hasDefaultCommitHook === false) {
    return
  }

  const sourceFolder = path.join(__dirname, '../../..', 'src/common/git/assets')
  const destinationFolder = '.husky'
  const shellScriptFilename = 'commit-msg'
  const nodeScriptFilename = 'check-commit-msg.js'

  new AssetFile(project, path.join(destinationFolder, shellScriptFilename), {
    sourcePath: path.join(sourceFolder, shellScriptFilename),
    executable: true,
    readonly: false,
  })

  new AssetFile(project, path.join(destinationFolder, nodeScriptFilename), {
    sourcePath: path.join(sourceFolder, nodeScriptFilename),
    executable: true,
    readonly: false,
  })
}

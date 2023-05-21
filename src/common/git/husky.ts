/* eslint-disable import/no-relative-parent-imports -- JSII project rewrites tsconfig thus always overriding introduced aliases */
import * as path from 'path'
import type {NodeProject} from 'projen/lib/javascript'
import {AssetFile} from '../files/AssetFile'
import {WithGitHooks} from './with-git-hooks'

export const addHusky = (project: NodeProject, options: WithGitHooks): void => {
  project.addDevDeps('husky')
  project.addTask('prepare', {exec: 'husky install'})

  if (options.hasDefaultCommitHook === false) {
    return
  }

  const commitMsgFilePath = path.join(__dirname, '../../..', 'src/common/git/assets/commit-msg')
  new AssetFile(project, '.husky/commit-msg', {sourcePath: commitMsgFilePath, executable: true, readonly: false})
}

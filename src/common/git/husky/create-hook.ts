import * as path from 'path'
import type {NodeProject} from 'projen/lib/javascript'
import {AssetFile} from '../../files/AssetFile'
import type {GitHook} from './custom-rule-options'
import {destinationFolder, sourceFolder, templateFile, templateString} from './template-path'

const createHook = (hookName: GitHook) => (project: NodeProject, command: string) => {
  new AssetFile(project, path.join(destinationFolder, hookName), {
    sourcePath: path.join(sourceFolder, templateFile),
    template: {templateString, replacement: command},
    executable: true,
  })
}

export const commitMessage = createHook('commit-msg')
export const preCommit = createHook('pre-commit')

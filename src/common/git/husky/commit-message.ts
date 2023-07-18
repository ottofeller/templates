import * as path from 'path'
import type {NodeProject} from 'projen/lib/javascript'
import {AssetFile} from '../../files/AssetFile'
import {destinationFolder, sourceFolder, templateFile, templateString} from './template-path'

export const commitMessage = (project: NodeProject) => {
  const shellScriptFilename = 'commit-msg'
  const nodeScriptFilename = 'check-commit-msg.js'

  new AssetFile(project, path.join(destinationFolder, shellScriptFilename), {
    sourcePath: path.join(sourceFolder, templateFile),
    template: {templateString, replacement: 'node .husky/check-commit-msg.js "$(head -1 $@)"'},
    executable: true,
    readonly: false,
  })

  new AssetFile(project, path.join(destinationFolder, nodeScriptFilename), {
    sourcePath: path.join(sourceFolder, nodeScriptFilename),
    executable: true,
    readonly: false,
  })
}

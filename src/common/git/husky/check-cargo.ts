import * as path from 'path'
import type {NodeProject} from 'projen/lib/javascript'
import {AssetFile} from '../../files/AssetFile'
import type {CheckCargoOptions} from './check-cargo-options'
import {destinationFolder, sourceFolder, templateFile, templateString} from './template-path'

export const checkCargo = (project: NodeProject, options: CheckCargoOptions) => {
  const commands: Array<string> = ['cargo check']
  const isFormatting = options.isFormatting ?? true
  const workingDirectory = options.workingDirectory

  if (isFormatting) {
    commands.unshift('cargo fmt --all')
  }

  if (workingDirectory) {
    commands.unshift(`cd ${workingDirectory}`)
    const pathLength = workingDirectory.split('/').length
    const returnPath = Array(pathLength).fill('..').join('/')
    commands.push(`cd ${returnPath}`)
  }

  new AssetFile(project, path.join(destinationFolder, 'pre-commit'), {
    sourcePath: path.join(sourceFolder, templateFile),
    template: {templateString, replacement: commands.join('\n')},
    executable: true,
  })
}

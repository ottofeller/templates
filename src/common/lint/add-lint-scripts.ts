import {NodeProject} from 'projen/lib/javascript'

export const addLintScripts = (project: NodeProject, lintPaths: Array<string>): void => {
  const joinedPaths = lintPaths.join(' ')
  project.setScript('format', `ofmt "${joinedPaths}"`)
  project.setScript('typecheck', 'tsc --noEmit --project tsconfig.dev.json')
  project.setScript('lint', `ofmt --lint "${joinedPaths}" && olint ${joinedPaths}`)
}

import {NodeProject} from 'projen/lib/javascript'

export const addLintScripts = (project: NodeProject, lintPaths: Array<string>): void => {
  project.setScript('format', lintPaths.map((lintPath) => `ofmt ${lintPath}`).join(' && '))
  project.setScript('typecheck', 'tsc --noEmit --project tsconfig.dev.json')

  // TODO Update to a single call with multiple inputs when the ofmt package is able to handle it.
  const ofmtLint = lintPaths.map((lintPath) => `ofmt --lint ${lintPath}`).join(' && ')
  project.setScript('lint', `${ofmtLint} && olint ${lintPaths.join(' ')}`)
}

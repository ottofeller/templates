import {NodeProject} from 'projen/lib/javascript'

export const addLintScripts = (project: NodeProject, lintPaths: Array<string>): void => {
  const filterPredicate = project.parent ? (path: string) => !/.projenrc.(js|mjs|ts|json)/.test(path) : Boolean
  const filteredPaths = lintPaths.filter(filterPredicate).join(' ')
  project.setScript('format', `ofmt "${filteredPaths}"`)
  project.setScript('typecheck', 'tsc --noEmit --project tsconfig.dev.json')
  project.setScript('lint', `ofmt --lint "${filteredPaths}" && olint ${filteredPaths}`)
}

import {NodeProject} from 'projen/lib/javascript'
import {addLintConfigs} from './add-lint-configs'
import {addLintScripts} from './add-lint-scripts'

export const addOfmt = (
  project: NodeProject,
  lintPaths: Array<string>,
  extraEslintConfigs: Array<string> = [],
): void => {
  project.addDevDeps(
    '@ottofeller/eslint-config-ofmt@1.7.2',
    '@ottofeller/ofmt@1.7.2',
    '@ottofeller/prettier-config-ofmt@1.7.2',
    'eslint@>=8',
  )

  addLintScripts(project, lintPaths)
  addLintConfigs(project, extraEslintConfigs)
}

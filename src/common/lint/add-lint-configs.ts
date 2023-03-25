import {NodeProject} from 'projen/lib/javascript'

export const addLintConfigs = (project: NodeProject, extraEslintConfigs: Array<string> = []): void => {
  project.package.addField('prettier', '@ottofeller/prettier-config-ofmt')

  const commonConfigs = project.parent
    ? [] // NOTE For a subproject we assume the parent is created from one of our templates and thus has the configs.
    : ['@ottofeller/eslint-config-ofmt/eslint.quality.cjs', '@ottofeller/eslint-config-ofmt/eslint.formatting.cjs']

  project.package.addField('eslintConfig', {extends: [...commonConfigs, ...extraEslintConfigs]})
}

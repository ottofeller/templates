import {NodeProject} from 'projen/lib/javascript'

export const addLintConfigs = (project: NodeProject, extraEslintConfigs: Array<string> = []): void => {
  project.package.addField('prettier', '@ottofeller/prettier-config-ofmt')

  project.package.addField('eslintConfig', {
    extends: [
      '@ottofeller/eslint-config-ofmt/eslint.quality.cjs',
      '@ottofeller/eslint-config-ofmt/eslint.formatting.cjs',
      ...extraEslintConfigs,
    ],
  })
}

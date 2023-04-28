import type {Linter} from 'eslint'
import {JsonFile} from 'projen'
import {NodeProject} from 'projen/lib/javascript'
import {deepMerge} from 'projen/lib/util'
import {eslintConfigFormatting} from './configs/eslint-config-formatting'
import {eslintConfigQuality} from './configs/eslint-config-quality'
import {prettierConfig} from './configs/prettier'

const arrayEslintConfigProperties = ['extends', 'overrides', 'plugins'] as const
type LinterConfigArrayProperties = Pick<Linter.Config, (typeof arrayEslintConfigProperties)[number]>

type AddLintersProps = {
  readonly project: NodeProject
  readonly lintPaths: Array<string>
  readonly extraEslintConfigs?: Array<Linter.Config>
}

export const linterDependencies = [
  '@ottofeller/eslint-plugin-ottofeller@0.1.3',
  '@typescript-eslint/eslint-plugin@5.58.0',
  '@typescript-eslint/parser@5.58.0',
  '@typescript-eslint/typescript-estree@5.58.0',
  'eslint-plugin-eslint-comments@3.2.0',
  'eslint-plugin-import@2.27.5',
  'eslint-plugin-react@7.32.2',
  'eslint-plugin-react-hooks@4.6.0',
  'eslint-plugin-tailwindcss@3.11.0',
  'eslint@8',
  'prettier@2.8.7',
  'prettier-plugin-organize-imports@3.2.2',
]

export const addLinters = (props: AddLintersProps): void => {
  const {project, lintPaths, extraEslintConfigs = []} = props

  // ANCHOR Dependencies
  project.addDevDeps(...linterDependencies)

  // ANCHOR Scripts
  const projenrcRegex = /.projenrc.(js|mjs|ts|json)/
  const filterPredicate = project.parent ? (path: string) => !projenrcRegex.test(path) : Boolean
  const filteredPaths = lintPaths.filter(filterPredicate).join(' ')
  const eslintRunCommand = `eslint --ext .js,.jsx,.ts,.tsx ${filteredPaths}`

  project.addTask('typecheck', {exec: 'tsc --noEmit --project tsconfig.dev.json'})

  project.addTask('format', {
    steps: [{exec: `prettier --write ${filteredPaths}`}, {exec: `${eslintRunCommand} --fix`}],
  })

  project.addTask('lint', {
    steps: [{exec: `prettier --check ${filteredPaths}`}, {exec: eslintRunCommand}],
  })

  // ANCHOR Prettier config
  new JsonFile(project, '.prettierrc.json', {obj: prettierConfig, marker: false})

  // ANCHOR Eslint config
  const commonConfigs = project.parent
    ? [] // NOTE For a subproject we assume the parent is created from one of our templates and thus has the configs.
    : [eslintConfigFormatting, eslintConfigQuality]

  const allConfigs = [...commonConfigs, ...extraEslintConfigs]

  if (allConfigs.length === 0) {
    return
  }

  // NOTE deepMerge does not merge array properties, so we need to handle them manually.
  const mergedArrayProperties = arrayEslintConfigProperties.reduce<LinterConfigArrayProperties>((accumulator, prop) => {
    const value = allConfigs
      .map((config) => config[prop])
      .flat()
      .filter(Boolean)

    if (value.length > 0) {
      Object.assign(accumulator, {[prop]: value})
    }

    return accumulator
  }, {})

  const finalConfig = deepMerge([{}, ...allConfigs, mergedArrayProperties])
  new JsonFile(project, '.eslintrc.json', {obj: finalConfig, marker: false})
}

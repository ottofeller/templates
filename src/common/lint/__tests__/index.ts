import type {Linter} from 'eslint'
import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {synthSnapshot} from 'projen/lib/util/synth'
import {addLinters, linterDependencies} from '..'
import {eslintConfigFormatting} from '../configs/eslint-config-formatting'
import {eslintConfigQuality} from '../configs/eslint-config-quality'
import {prettierConfig} from '../configs/prettier'

describe('addLinters function', () => {
  test('installs eslint, prettier and required plugins as devDependencies', () => {
    const project = new TestProject()
    addLinters({project, lintPaths: ['src']})
    const snapshot = synthSnapshot(project)
    const {devDependencies} = snapshot['package.json']

    linterDependencies.forEach((dep) => {
      const versionSplitterIndex = dep.lastIndexOf('@')
      const depName = versionSplitterIndex === 0 ? dep : dep.slice(0, versionSplitterIndex)
      expect(devDependencies).toHaveProperty(depName)
    })
  })

  test('adds linting scripts for provided paths to package.json', () => {
    const project = new TestProject()
    addLinters({project, lintPaths: ['folderPath', 'file/path.ts', 'pattern/path/*.ts']})
    const snapshot = synthSnapshot(project)
    const scriptNames = Object.keys(snapshot['package.json'].scripts)
    expect(scriptNames).toContain('format')
    expect(scriptNames).toContain('typecheck')
    expect(scriptNames).toContain('lint')
  })

  test('ignores projenrc in lint paths for subprojects', () => {
    const parent = new TestProject()
    const subproject = new TestProject({parent, outdir: 'subproject'})
    const projenrcPath = '.projenrc.ts'
    addLinters({project: subproject, lintPaths: [projenrcPath, 'src/index.ts']})
    const snapshot = synthSnapshot(subproject)
    expect(snapshot['package.json'].scripts['format']).not.toContain(projenrcPath)
    expect(snapshot['package.json'].scripts['lint']).not.toContain(projenrcPath)
  })

  test('creates prettier and eslint configs', () => {
    const project = new TestProject()
    addLinters({project, lintPaths: []})
    const snapshot = synthSnapshot(project)
    const eslintrc = snapshot['.eslintrc.json']
    expect(eslintrc).toBeDefined()
    const {rules} = eslintrc
    expect(rules).toMatchObject<Partial<Linter.RulesRecord>>(eslintConfigFormatting.rules!)
    expect(rules).toMatchObject<Partial<Linter.RulesRecord>>(eslintConfigQuality.rules!)

    const prettierrc = snapshot['.prettierrc.json']
    expect(prettierrc).toBeDefined()
    expect(prettierrc).toMatchObject(prettierConfig)
  })

  test('writes extra eslint configs to .eslintrc.json of the project', () => {
    const project = new TestProject()
    const extraConfig: Linter.Config = {rules: {testRule: 0}, extends: 'baseConfig'}
    addLinters({project, lintPaths: [], extraEslintConfigs: [extraConfig]})
    const snapshot = synthSnapshot(project)
    const eslintrc = snapshot['.eslintrc.json']
    expect(eslintrc).toBeDefined()

    const {extends: extendingConfigs, rules} = eslintrc
    expect(extendingConfigs).toHaveLength(3)
    expect(extendingConfigs).toContainEqual(extraConfig.extends)
    expect(rules).toHaveProperty('testRule')
  })

  test('does not create eslint config for subprojects if no additional configs are specified', () => {
    const parent = new TestProject()
    const subproject = new TestProject({parent, outdir: 'subproject'})
    addLinters({project: subproject, lintPaths: [], extraEslintConfigs: []})
    const snapshot = synthSnapshot(subproject)
    expect(snapshot['.eslintrc.json']).not.toBeDefined()
  })

  test('creates eslint config for subprojects with only the extra settings', () => {
    const parent = new TestProject()
    const subproject = new TestProject({parent, outdir: 'subproject'})
    const extraConfig: Linter.Config = {rules: {}, extends: ['baseConfig']}
    addLinters({project: subproject, lintPaths: [], extraEslintConfigs: [extraConfig]})
    const snapshot = synthSnapshot(subproject)
    expect(snapshot['.eslintrc.json']).toEqual(extraConfig)
  })

  test('creates cspell config', () => {
    const project = new TestProject()
    addLinters({project, lintPaths: []})
    const snapshot = synthSnapshot(project)
    expect(snapshot['cspell.json']).toBeDefined()
  })
})

class TestProject extends NodeProject {
  constructor(options: Partial<NodeProjectOptions> = {}) {
    super({
      ...options,
      name: 'test-project',
      defaultReleaseBranch: 'main',
    })
  }
}

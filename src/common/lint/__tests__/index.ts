import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {synthSnapshot} from 'projen/lib/util/synth'
import {addLintConfigs, addLintScripts, addOfmt} from '..'

describe('addLintScripts function', () => {
  test('adds linting scripts for provided paths to gitignore', () => {
    const project = new TestProject()
    addLintScripts(project, ['folderPath', 'file/path.ts', 'pattern/path/*.ts'])
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
    addLintScripts(subproject, [projenrcPath, 'src/index.ts'])
    const snapshot = synthSnapshot(subproject)
    expect(snapshot['package.json'].scripts['format']).not.toContain(projenrcPath)
    expect(snapshot['package.json'].scripts['lint']).not.toContain(projenrcPath)
  })
})

describe('addLintConfigs function', () => {
  test('writes default prettier and eslint configs to package.json of the project', () => {
    const project = new TestProject()
    addLintConfigs(project)
    const snapshot = synthSnapshot(project)
    expect(snapshot['package.json'].prettier).toEqual('@ottofeller/prettier-config-ofmt')
    expect(snapshot['package.json'].eslintConfig).toBeDefined()

    const extendingConfigs = snapshot['package.json'].eslintConfig.extends
    expect(extendingConfigs).toHaveLength(2)
    expect(extendingConfigs).toContainEqual('@ottofeller/eslint-config-ofmt/eslint.quality.cjs')
    expect(extendingConfigs).toContainEqual('@ottofeller/eslint-config-ofmt/eslint.formatting.cjs')
  })

  test('writes extra eslint configs to package.json of the project', () => {
    const project = new TestProject()
    const extraConfig = 'extraConfig'
    addLintConfigs(project, [extraConfig])
    const snapshot = synthSnapshot(project)
    expect(snapshot['package.json'].eslintConfig).toBeDefined()

    const extendingConfigs = snapshot['package.json'].eslintConfig.extends
    expect(extendingConfigs).toHaveLength(3)
    expect(extendingConfigs).toContainEqual(extraConfig)
  })

  test('does not write default eslint configs to package.json of a subproject', () => {
    const parent = new TestProject()
    const subproject = new TestProject({parent, outdir: 'subproject'})
    const extraConfig = 'extraConfig'
    addLintConfigs(subproject, [extraConfig])
    const snapshot = synthSnapshot(subproject)
    expect(snapshot['package.json'].eslintConfig).toBeDefined()

    const extendingConfigs = snapshot['package.json'].eslintConfig.extends
    expect(extendingConfigs).toHaveLength(1)
    expect(extendingConfigs).toEqual([extraConfig])
  })
})

describe('addOfmt function', () => {
  test('installs ofmt packages and eslint as devDependencies', () => {
    const project = new TestProject()
    addOfmt(project, ['src'])
    const snapshot = synthSnapshot(project)
    const devDependencies = Object.keys(snapshot['package.json'].devDependencies)
    expect(devDependencies).toContain('@ottofeller/eslint-config-ofmt')
    expect(devDependencies).toContain('@ottofeller/ofmt')
    expect(devDependencies).toContain('@ottofeller/prettier-config-ofmt')
    expect(devDependencies).toContain('eslint')
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

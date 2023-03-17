import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {synthSnapshot} from 'projen/lib/util/synth'
import {addLintConfigs, addLintScripts} from '..'

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

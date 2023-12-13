import {synthSnapshot} from 'projen/lib/util/synth'
import { OttofellerBackendTestProject, OttofellerBackendTestProjectOptions } from '..'

jest.mock('child_process')

describe('Backend-test template', () => {

  test('has prettier and eslint configs', () => {
    const project = new TestNextJsTypeScriptProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot['.prettierrc.json']).toBeDefined()
    expect(snapshot['.eslintrc.json']).toBeDefined()
  })
})

class TestNextJsTypeScriptProject extends OttofellerBackendTestProject {
  constructor(options: Partial<OttofellerBackendTestProjectOptions> = {}) {
    super({
      ...options,
      name: 'test-nextjs-project',
      defaultReleaseBranch: 'main',
    })
  }
}

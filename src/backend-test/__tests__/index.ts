import {synthSnapshot} from 'projen/lib/util/synth'
import {OttofellerBackendTestProject, OttofellerBackendTestProjectOptions} from '..'

describe('Backend-test template', () => {
  test('sets defaults', () => {
    const project = new TestBackendTestProject({hasGitHooks: true})
    const snapshot = synthSnapshot(project)
    expect(snapshot).toMatchSnapshot()
  })
})

class TestBackendTestProject extends OttofellerBackendTestProject {
  constructor(options: Partial<OttofellerBackendTestProjectOptions> = {}) {
    super({
      ...options,
      name: 'test-backend-test-project',
      defaultReleaseBranch: 'main',
    })
  }
}
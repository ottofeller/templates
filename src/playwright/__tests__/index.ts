import {synthSnapshot} from 'projen/lib/util/synth'
import {OttofellerPlaywrightProject, OttofellerPlaywrightProjectOptions} from '..'

describe('Playwright template', () => {
  test('contains only tasks created by projen', () => {
    const project = new TestPlaywrightProject({hasGitHooks: true})
    const snapshot = synthSnapshot(project)
    const internalTasks = ['default', 'eject', 'projen', 'install', 'install:ci']
    const {tasks} = snapshot['.projen/tasks.json']
    const createdTasks = Object.keys(tasks).filter((task) => !internalTasks.includes(task))
    expect(createdTasks).toHaveLength(0)
  })
})

class TestPlaywrightProject extends OttofellerPlaywrightProject {
  constructor(options: Partial<OttofellerPlaywrightProjectOptions> = {}) {
    super({
      ...options,
      name: 'test-playwright-project',
      defaultReleaseBranch: 'main',
    })
  }
}

import {synthSnapshot} from 'projen/lib/util/synth'
import {OttofellerPlaywrightProject, OttofellerPlaywrightProjectOptions} from '..'

describe('Playwright template', () => {
  test('when ejected contains only tasks created by projen', () => {
    const PROJEN_EJECTING = process.env
    process.env.PROJEN_EJECTING = '1'

    const project = new TestPlaywrightProject({hasGitHooks: true})
    const snapshot = synthSnapshot(project)
    const internalTasks = ['default', 'eject', 'projen', 'install', 'install:ci']
    const {tasks} = snapshot['.projen/tasks.json']
    const createdTasks = Object.keys(tasks).filter((task) => !internalTasks.includes(task))
    expect(createdTasks).toHaveLength(0)

    if (PROJEN_EJECTING !== undefined) {
      delete process.env.PROJEN_EJECTING
    }
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

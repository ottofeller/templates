import {execSync} from 'child_process'
import {synthSnapshot} from 'projen/lib/util/synth'
import {OttofellerPlaywrightProject, OttofellerPlaywrightProjectOptions} from '..'

jest.mock('child_process')

describe('Playwright template', () => {
  describe('has sample code', () => {
    test('included by default', () => {
      const project = new TestPlaywrightProject()
      const snapshot = synthSnapshot(project)
      expect(snapshot['.env.development']).toBeDefined()
      expect(snapshot['common/index.ts']).toBeDefined()
      expect(snapshot['data/index.ts']).toBeDefined()
      expect(snapshot['pages/index.ts']).toBeDefined()
      expect(snapshot['specs/auth.spec.ts']).toBeDefined()
    })

    test('excluded with an option', () => {
      const project = new TestPlaywrightProject({sampleCode: false})
      const snapshot = synthSnapshot(project)
      expect(snapshot['.env.development']).not.toBeDefined()
      expect(snapshot['common']).not.toBeDefined()
      expect(snapshot['data']).not.toBeDefined()
      expect(snapshot['pages']).not.toBeDefined()
      expect(snapshot['specs']).not.toBeDefined()
    })
  })

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

  test('formats ".projenrc.ts" file after synthesis', () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- TS is not aware of the Jest mock, thus casting is needed
    const mockedExecSync = execSync as unknown as jest.Mock<Buffer, [string]>
    const project = new TestPlaywrightProject()
    project.postSynthesize()
    expect(mockedExecSync).toHaveBeenCalledTimes(2)
    expect(mockedExecSync).toHaveBeenCalledWith('prettier --write .projenrc.ts')
    expect(mockedExecSync).toHaveBeenCalledWith('eslint --fix .projenrc.ts')
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

import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {synthSnapshot} from 'projen/lib/util/synth'
import {addTaskOrScript} from '..'

describe('addTaskOrScript function', () => {
  test('adds a task to a project', () => {
    const project = new TestProject()
    const taskName = 'do-some-work'
    const taskCommand = 'dig'
    addTaskOrScript(project, taskName, {exec: taskCommand})

    const snapshot = synthSnapshot(project)
    const {scripts} = snapshot['package.json']
    expect(scripts[taskName]).toEqual(`npx projen ${taskName}`)
    const {tasks} = snapshot['.projen/tasks.json']
    expect(tasks[taskName].steps[0].exec).toEqual(taskCommand)
  })

  test('adds a multistep task to a project', () => {
    const project = new TestProject()
    const taskName = 'do-some-work'
    const step1 = 'dig'
    const step2 = 'rest'
    addTaskOrScript(project, taskName, {steps: [{exec: step1}, {exec: step2}]})

    const snapshot = synthSnapshot(project)
    const {scripts} = snapshot['package.json']
    expect(scripts[taskName]).toEqual(`npx projen ${taskName}`)
    const {tasks} = snapshot['.projen/tasks.json']
    expect(tasks[taskName].steps[0].exec).toEqual(step1)
    expect(tasks[taskName].steps[1].exec).toEqual(step2)
  })

  test('adds a script to package.json of an ejected project', () => {
    const PROJEN_EJECTING = process.env
    process.env.PROJEN_EJECTING = '1'

    const project = new TestProject()
    const taskName = 'do-some-work'
    const taskCommand = 'dig'
    addTaskOrScript(project, taskName, {exec: taskCommand})

    const snapshot = synthSnapshot(project)
    const {scripts} = snapshot['package.json']
    expect(scripts[taskName]).toEqual(taskCommand)

    if (PROJEN_EJECTING !== undefined) {
      delete process.env.PROJEN_EJECTING
    }
  })

  test('adds a multistep script to package.json of an ejected project', () => {
    const PROJEN_EJECTING = process.env
    process.env.PROJEN_EJECTING = '1'

    const project = new TestProject()
    const taskName = 'do-some-work'
    const step1 = 'dig'
    const step2 = 'rest'
    addTaskOrScript(project, taskName, {steps: [{exec: step1}, {spawn: step2}]})

    const snapshot = synthSnapshot(project)
    const {scripts} = snapshot['package.json']
    expect(scripts[taskName]).toEqual(`${step1} && ${step2}`)

    if (PROJEN_EJECTING !== undefined) {
      delete process.env.PROJEN_EJECTING
    }
  })

  test('adds an empty script to package.json of an ejected project as a final fallback', () => {
    const PROJEN_EJECTING = process.env
    process.env.PROJEN_EJECTING = '1'

    const project = new TestProject()
    const taskName = 'do-some-work'
    addTaskOrScript(project, taskName, {})

    const snapshot = synthSnapshot(project)
    const {scripts} = snapshot['package.json']
    expect(scripts[taskName]).toEqual('')

    if (PROJEN_EJECTING !== undefined) {
      delete process.env.PROJEN_EJECTING
    }
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

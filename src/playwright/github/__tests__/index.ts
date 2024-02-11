import * as projen from 'projen'
import type {Job} from 'projen/lib/github/workflows-model'
import {JavaProject} from 'projen/lib/java'
import {NodePackageManager, NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {synthSnapshot} from 'projen/lib/util/synth'
import * as YAML from 'yaml'
import {OttofellerPlaywrightProjectOptions} from '../..'
import {PlaywrightWorkflowTest, PlaywrightWorkflowTestOptions} from '../playwright-workflow'

describe('PlaywrightWorkflowTest', () => {
  const testWorkflowPath = '.github/workflows/e2e-tests.yml'

  test('throws if called with a project not derived from NodeProject', () => {
    const project = new JavaProject({name: 'java', groupId: 'java', artifactId: 'app', version: '0', github: true})
    expect(() => new PlaywrightWorkflowTest(project.github!)).toThrow()
  })

  test('creates a playwright test workflow', () => {
    const project = new TestProject()
    new PlaywrightWorkflowTest(project.github!)
    const snapshot = synthSnapshot(project)
    expect(snapshot).toMatchSnapshot()
    expect(snapshot[testWorkflowPath]).toBeDefined()
  })

  test('configures the test workflow to be run on workflow dispatches and upd completion of Deploy Staging workflow ', () => {
    const project = new TestProject()
    new PlaywrightWorkflowTest(project.github!)
    const snapshot = synthSnapshot(project)
    const workflow = YAML.parse(snapshot[testWorkflowPath])

    expect(workflow.on).toEqual({
      workflow_dispatch: {},
      workflow_run: {workflows: ['Deploy Staging'], types: ['completed']},
    })
  })

  test('adds a test job to the workflow', () => {
    const project = new TestProject()
    new PlaywrightWorkflowTest(project.github!)
    const snapshot = synthSnapshot(project)
    const workflow = YAML.parse(snapshot[testWorkflowPath])
    const jobs = Object.values<projen.github.workflows.Job>(workflow.jobs).map((j) => j.steps.at(-1)!.run)
    expect(jobs).toHaveLength(1)
    expect(jobs).toContain('npm run test:e2e')
  })

  // FIXME Need to update the logic to allow this override
  test('does not allows setting pnpm as a package manager', () => {
    const project = new TestProject({packageManager: NodePackageManager.PNPM})
    new PlaywrightWorkflowTest(project.github!)
    const snapshot = synthSnapshot(project)
    const workflow = YAML.parse(snapshot[testWorkflowPath])
    const jobs = Object.values<projen.github.workflows.Job>(workflow.jobs).map((j) => j.steps.at(-1)!.run)
    expect(jobs).toHaveLength(1)
    expect(jobs).toContain('npm run test:e2e')
  })

  test('allows runsOn override', () => {
    const project = new TestProject()
    const runsOn = ['test-env1', 'test-env2']
    new PlaywrightWorkflowTest(project.github!, {runsOn})
    const snapshot = synthSnapshot(project)
    const workflow = YAML.parse(snapshot[testWorkflowPath])

    Object.values<Record<string, unknown>>(workflow.jobs).forEach((j) => {
      expect(j['runs-on']).toEqual(runsOn)
    })
  })

  describe('allows setting nodeVersion', () => {
    const nodeVersion = '18.15.0'

    test('from workflow options', () => {
      const project = new TestProject()
      new PlaywrightWorkflowTest(project.github!, {workflowNodeVersion: nodeVersion})
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[testWorkflowPath])

      Object.values<Job>(workflow.jobs)
        .map((job) => job.steps.find((step) => step.uses === `actions/setup-node@v4`))
        .forEach((job) => {
          expect(job!.with!['node-version']).toEqual(nodeVersion)
        })
    })

    test('from project package', () => {
      const project = new TestProject({minNodeVersion: nodeVersion})
      new PlaywrightWorkflowTest(project.github!)
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[testWorkflowPath])

      Object.values<Job>(workflow.jobs)
        .map((job) => job.steps.find((step) => step.uses === `actions/setup-node@v4`))
        .forEach((job) => {
          expect(job!.with!['node-version']).toEqual(nodeVersion)
        })
    })
  })

  describe('addToProject', () => {
    const name = 'subproject'
    const subprojectTestWorkflowPath = `.github/workflows/test-${name}.yml`

    test('does nothing when opted out with hasDefaultGithubWorkflows option', () => {
      const project = new TestProjectWithPlaywrightWorkflowTest({hasDefaultGithubWorkflows: false})
      const snapshot = synthSnapshot(project)
      expect(snapshot[testWorkflowPath]).not.toBeDefined()
    })

    test('does nothing if github disabled', () => {
      const project = new TestProjectWithPlaywrightWorkflowTest({github: false})
      const snapshot = synthSnapshot(project)
      expect(snapshot[testWorkflowPath]).not.toBeDefined()
    })

    test('adds a PlaywrightWorkflowTest component to the project with github by default', () => {
      const project = new TestProjectWithPlaywrightWorkflowTest()
      const snapshot = synthSnapshot(project)
      expect(snapshot[testWorkflowPath]).toBeDefined()
    })

    test('for subprojects does nothing if parent has github disabled', () => {
      const parent = new TestProjectWithPlaywrightWorkflowTest({github: false})
      const subproject = new TestProjectWithPlaywrightWorkflowTest({parent, outdir: 'sub', name})
      const subprojectSnapshot = synthSnapshot(subproject)
      const parentSnapshot = synthSnapshot(parent)
      expect(subprojectSnapshot[testWorkflowPath]).not.toBeDefined()
      expect(subprojectSnapshot[subprojectTestWorkflowPath]).not.toBeDefined()
      expect(subprojectSnapshot[testWorkflowPath]).not.toBeDefined()
      expect(parentSnapshot[subprojectTestWorkflowPath]).not.toBeDefined()
    })

    test('for subprojects creates a test workflow within the parent project', () => {
      const parent = new TestProjectWithPlaywrightWorkflowTest()
      const outdir = 'sub'
      const subproject = new TestProjectWithPlaywrightWorkflowTest({parent, outdir, name})
      const subprojectSnapshot = synthSnapshot(subproject)
      const parentSnapshot = synthSnapshot(parent)
      expect(subprojectSnapshot[testWorkflowPath]).not.toBeDefined()
      expect(subprojectSnapshot[subprojectTestWorkflowPath]).not.toBeDefined()
      expect(parentSnapshot[testWorkflowPath]).toBeDefined()
      expect(parentSnapshot[subprojectTestWorkflowPath]).toBeDefined()
      const subprojectWorkflow = YAML.parse(parentSnapshot[subprojectTestWorkflowPath])

      expect(subprojectWorkflow.on).toEqual({
        workflow_dispatch: {},
        workflow_run: {workflows: ['Deploy Staging'], types: ['completed']},
      })
    })

    describe('picks nodeVersion', () => {
      const nodeVersion = '16.15.1'

      test('from workflow options first', () => {
        const project = new TestProject({workflowNodeVersion: '18.15.0'})
        PlaywrightWorkflowTest.addToProject(project, {workflowNodeVersion: nodeVersion})
        const snapshot = synthSnapshot(project)
        const workflow = YAML.parse(snapshot[testWorkflowPath])

        Object.values<Job>(workflow.jobs)
          .map((job) => job.steps.find((step) => step.uses === `actions/setup-node@v4`))
          .forEach((job) => {
            expect(job!.with!['node-version']).toEqual(nodeVersion)
          })
      })

      test('from project package as a fallback', () => {
        const project = new TestProject({minNodeVersion: nodeVersion})
        PlaywrightWorkflowTest.addToProject(project, {})
        const snapshot = synthSnapshot(project)
        const workflow = YAML.parse(snapshot[testWorkflowPath])

        Object.values<Job>(workflow.jobs)
          .map((job) => job.steps.find((step) => step.uses === `actions/setup-node@v4`))
          .forEach((job) => {
            expect(job!.with!['node-version']).toEqual(nodeVersion)
          })
      })
    })
  })
})

class TestProject extends NodeProject {
  constructor(options: Partial<NodeProjectOptions & PlaywrightWorkflowTestOptions> = {}) {
    super({
      name: 'test-project',
      defaultReleaseBranch: 'main',
      packageManager: options.packageManager ?? NodePackageManager.NPM,
      ...options,
    })
  }
}

class TestProjectWithPlaywrightWorkflowTest extends NodeProject {
  constructor(options: Partial<NodeProjectOptions & OttofellerPlaywrightProjectOptions> = {}) {
    super({
      name: 'test-project',
      defaultReleaseBranch: 'main',
      packageManager: options.packageManager ?? NodePackageManager.NPM,
      ...options,
    })

    PlaywrightWorkflowTest.addToProject(this, options)
  }
}

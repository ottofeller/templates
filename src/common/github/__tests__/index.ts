import * as projen from 'projen'
import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {synthSnapshot} from 'projen/lib/util/synth'
import * as YAML from 'yaml'
import {job, npmRunJob, PullRequestTest, ReleaseWorkflow, WithDefaultWorkflow} from '..'

describe('GitHub utils', () => {
  test('job function creates a job object', () => {
    const steps = [
      {name: 'first step', run: 'node firstStep.js'},
      {name: 'second step', run: 'node secondStep.js'},
    ]

    const jobObject = job(steps)

    expect(jobObject).toStrictEqual({
      runsOn: ['ubuntu-latest'],
      permissions: {contents: 'read'},
      steps,
    })
  })

  test('npmRunJob function creates a job object', () => {
    const command = 'command'
    const jobObject = npmRunJob(command)

    expect(jobObject).toStrictEqual({
      uses: 'ottofeller/github-actions/npm-run@main',
      with: {'node-version': 16, command: `npm run ${command}`},
    })
  })

  describe('PullRequestTest', () => {
    const testWorkflowPath = '.github/workflows/test.yml'

    test('creates a test workflow', () => {
      const project = new TestProject()
      new PullRequestTest(project.github!)
      const snapshot = synthSnapshot(project)
      expect(snapshot).toMatchSnapshot()
      expect(snapshot[testWorkflowPath]).toBeDefined()
    })

    test('configures the test workflow to be run on pushes to all branches, all paths', () => {
      const project = new TestProject()
      new PullRequestTest(project.github!)
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[testWorkflowPath])
      expect(workflow.on).toEqual({push: {}})
    })

    test('adds basic checks to the test workflow', () => {
      const project = new TestProject()
      new PullRequestTest(project.github!)
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[testWorkflowPath])

      const jobs = Object.values<projen.github.workflows.Job>(workflow.jobs).map((j) => j.steps[0].with!.command)
      expect(jobs).toHaveLength(3)
      expect(jobs).toContain('npm run typecheck')
      expect(jobs).toContain('npm run lint')
      expect(jobs).toContain('npm run test')
    })

    test('allows runsOn override', () => {
      const project = new TestProject()
      const runsOn = ['test-env1', 'test-env2']
      new PullRequestTest(project.github!, {runsOn})
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[testWorkflowPath])

      Object.values<Record<string, unknown>>(workflow.jobs).forEach((j) => {
        expect(j['runs-on']).toEqual(runsOn)
      })
    })

    describe('addToProject', () => {
      const name = 'subproject'
      const subprojectTestWorkflowPath = `.github/workflows/test-${name}.yml`

      test('does nothing when opted out with hasDefaultGithubWorkflows option', () => {
        const project = new TestProjectWithTestWorkflow({hasDefaultGithubWorkflows: false})
        const snapshot = synthSnapshot(project)
        expect(snapshot[testWorkflowPath]).not.toBeDefined()
      })

      test('does nothing if github disabled', () => {
        const project = new TestProjectWithTestWorkflow({github: false})
        const snapshot = synthSnapshot(project)
        expect(snapshot[testWorkflowPath]).not.toBeDefined()
      })

      test('add a PullRequestTest component to the project with github by default', () => {
        const project = new TestProjectWithTestWorkflow()
        const snapshot = synthSnapshot(project)
        expect(snapshot[testWorkflowPath]).toBeDefined()
      })

      test('for subprojects does nothing if parent has github disabled', () => {
        const parent = new TestProjectWithTestWorkflow({github: false})
        const subproject = new TestProjectWithTestWorkflow({parent, outdir: 'sub', name})
        const subprojectSnapshot = synthSnapshot(subproject)
        const parentSnapshot = synthSnapshot(parent)
        expect(subprojectSnapshot[testWorkflowPath]).not.toBeDefined()
        expect(subprojectSnapshot[subprojectTestWorkflowPath]).not.toBeDefined()
        expect(subprojectSnapshot[testWorkflowPath]).not.toBeDefined()
        expect(parentSnapshot[subprojectTestWorkflowPath]).not.toBeDefined()
      })

      test('for subprojects creates a test workflow within the parent project', () => {
        const parent = new TestProjectWithTestWorkflow()
        const subproject = new TestProjectWithTestWorkflow({parent, outdir: 'sub', name})
        const subprojectSnapshot = synthSnapshot(subproject)
        const parentSnapshot = synthSnapshot(parent)
        expect(subprojectSnapshot[testWorkflowPath]).not.toBeDefined()
        expect(subprojectSnapshot[subprojectTestWorkflowPath]).not.toBeDefined()
        expect(parentSnapshot[testWorkflowPath]).toBeDefined()
        expect(parentSnapshot[subprojectTestWorkflowPath]).toBeDefined()
      })
    })
  })

  describe('ReleaseWorkflow', () => {
    const releaseWorkflowPath = '.github/workflows/release.yml'

    test('creates a release workflow', () => {
      const project = new TestProject({release: false})
      new ReleaseWorkflow(project.github!)
      const snapshot = synthSnapshot(project)
      expect(snapshot).toMatchSnapshot()
      expect(snapshot[releaseWorkflowPath]).toBeDefined()
    })

    test('adds a job that creates release', () => {
      const project = new TestProject({release: false})
      new ReleaseWorkflow(project.github!)
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[releaseWorkflowPath])

      const createJob = workflow.jobs.create
      expect(createJob).toBeDefined()
      expect(createJob.steps[0].uses).toEqual('ottofeller/github-actions/create-release@main')
    })

    test('allows initialReleaseVersion and releaseBranch override', () => {
      const project = new TestProject({release: false})
      const initialReleaseVersion = 'test-version'
      const releaseBranch = 'main'
      new ReleaseWorkflow(project.github!, {initialReleaseVersion, releaseBranch})
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[releaseWorkflowPath])
      expect(workflow.jobs.create.steps[0].with['initial-version']).toEqual(initialReleaseVersion)
      expect(workflow.jobs.create.steps[0].with['release-branches']).toEqual(releaseBranch)
    })

    test('throws when default release workflow is not disabled', () => {
      const project = new TestProject()
      expect(() => new ReleaseWorkflow(project.github!)).toThrow()
    })
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

class TestProjectWithTestWorkflow extends NodeProject {
  constructor(options: Partial<NodeProjectOptions & WithDefaultWorkflow> = {}) {
    super({
      name: 'test-project-with-test-workflow',
      defaultReleaseBranch: 'main',
      ...options,
    })

    PullRequestTest.addToProject(this, options)
  }
}

import * as projen from 'projen'
import {JavaProject} from 'projen/lib/java'
import {NodePackageManager, NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {synthSnapshot} from 'projen/lib/util/synth'
import * as YAML from 'yaml'
import {PullRequestTest, ReleaseWorkflow, WithDefaultWorkflow} from '..'

describe('GitHub utils', () => {
  describe('PullRequestTest', () => {
    const testWorkflowPath = '.github/workflows/test.yml'

    test('throws if called with a project not derived from NodeProject', () => {
      const project = new JavaProject({name: 'java', groupId: 'java', artifactId: 'app', version: '0', github: true})
      expect(() => new PullRequestTest(project.github!)).toThrow()
    })

    test('creates a test workflow', () => {
      const project = new TestProject()
      new PullRequestTest(project.github!)
      const snapshot = synthSnapshot(project)
      expect(snapshot).toMatchSnapshot()
      expect(snapshot[testWorkflowPath]).toBeDefined()
    })

    test('configures the test workflow to be run on pull requests and pushes to main branch, all paths', () => {
      const project = new TestProject()
      new PullRequestTest(project.github!)
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[testWorkflowPath])

      expect(workflow.on).toEqual({
        pull_request: {types: ['opened', 'synchronize']},
        push: {branches: ['main']},
      })
    })

    test('allows to be run on pushes to specified branches', () => {
      const project = new TestProject()
      const branches = ['main', 'dev']
      new PullRequestTest(project.github!, {triggerOnPushToBranches: branches})
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[testWorkflowPath])

      expect(workflow.on).toEqual({
        pull_request: {types: ['opened', 'synchronize']},
        push: {branches},
      })
    })

    test('adds basic checks to the test workflow', () => {
      const project = new TestProject()
      new PullRequestTest(project.github!)
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[testWorkflowPath])

      const jobs = Object.values<projen.github.workflows.Job>(workflow.jobs).map((j) => j.steps.at(-1)!.run)
      expect(jobs).toHaveLength(3)
      expect(jobs).toContain('npm run typecheck')
      expect(jobs).toContain('npm run lint')
      expect(jobs).toContain('npm run test')
    })

    test('allows setting pnpm as a package manager', () => {
      const project = new TestProject({packageManager: NodePackageManager.PNPM})
      new PullRequestTest(project.github!)
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[testWorkflowPath])

      const jobs = Object.values<projen.github.workflows.Job>(workflow.jobs).map((j) => j.steps.at(-1)!.run)
      expect(jobs).toHaveLength(3)
      expect(jobs).toContain('pnpm run typecheck')
      expect(jobs).toContain('pnpm run lint')
      expect(jobs).toContain('pnpm run test')
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

      test('adds a PullRequestTest component to the project with github by default', () => {
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
        const outdir = 'sub'
        const subproject = new TestProjectWithTestWorkflow({parent, outdir, name})
        const subprojectSnapshot = synthSnapshot(subproject)
        const parentSnapshot = synthSnapshot(parent)
        expect(subprojectSnapshot[testWorkflowPath]).not.toBeDefined()
        expect(subprojectSnapshot[subprojectTestWorkflowPath]).not.toBeDefined()
        expect(parentSnapshot[testWorkflowPath]).toBeDefined()
        expect(parentSnapshot[subprojectTestWorkflowPath]).toBeDefined()
        const subprojectWorkflow = YAML.parse(parentSnapshot[subprojectTestWorkflowPath])
        const paths = [`${outdir}/**`]

        expect(subprojectWorkflow.on).toEqual({
          pull_request: {paths, types: ['opened', 'synchronize']},
          push: {paths, branches: ['main']},
        })
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
      github: true,
      packageManager: options.packageManager ?? NodePackageManager.NPM,
    })
  }
}

class TestProjectWithTestWorkflow extends NodeProject {
  constructor(options: Partial<NodeProjectOptions & WithDefaultWorkflow> = {}) {
    super({
      name: 'test-project-with-test-workflow',
      defaultReleaseBranch: 'main',
      packageManager: options.packageManager ?? NodePackageManager.NPM,
      ...options,
    })

    PullRequestTest.addToProject(this, options)
  }
}

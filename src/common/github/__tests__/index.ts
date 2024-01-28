import * as projen from 'projen'
import type {Job} from 'projen/lib/github/workflows-model'
import {JavaProject} from 'projen/lib/java'
import {NodePackageManager, NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {synthSnapshot} from 'projen/lib/util/synth'
import * as YAML from 'yaml'
import {
  CodeOwners,
  PatternOwners,
  ProjenDriftCheckWorkflow,
  PullRequestTest,
  ReleaseWorkflow,
  RustTestWorkflow,
  WithCodeOwners,
  WithDefaultWorkflow,
  WithRustTestWorkflow,
} from '..'

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
      expect(jobs).toHaveLength(2)
      expect(jobs).toContain('npm run typecheck')
      expect(jobs).toContain('npm run lint')
    })

    test('adds test job to the test workflow if jest is enabled', () => {
      const options: Partial<NodeProjectOptions> = {jest: true}
      const project = new TestProject(options)
      new PullRequestTest(project.github!, options)
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[testWorkflowPath])
      const jobs = Object.values<projen.github.workflows.Job>(workflow.jobs).map((j) => j.steps.at(-1)!.run)
      expect(jobs).toHaveLength(3)
      expect(jobs).toContain('npm run test')
    })

    test('allows setting pnpm as a package manager', () => {
      const project = new TestProject({packageManager: NodePackageManager.PNPM})
      new PullRequestTest(project.github!)
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[testWorkflowPath])
      const jobs = Object.values<projen.github.workflows.Job>(workflow.jobs).map((j) => j.steps.at(-1)!.run)
      expect(jobs).toHaveLength(2)
      expect(jobs).toContain('pnpm run typecheck')
      expect(jobs).toContain('pnpm run lint')
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

    describe('allows setting nodeVersion', () => {
      const nodeVersion = '18.15.0'

      test('from workflow options', () => {
        const project = new TestProject()
        new PullRequestTest(project.github!, {workflowNodeVersion: nodeVersion})
        const snapshot = synthSnapshot(project)
        const workflow = YAML.parse(snapshot[testWorkflowPath])

        Object.values<Job>(workflow.jobs)
          .map((job) => job.steps.find((step) => step.uses === `actions/setup-node@v3`))
          .forEach((job) => {
            expect(job!.with!['node-version']).toEqual(nodeVersion)
          })
      })

      test('from project package', () => {
        const project = new TestProject({minNodeVersion: nodeVersion})
        new PullRequestTest(project.github!)
        const snapshot = synthSnapshot(project)
        const workflow = YAML.parse(snapshot[testWorkflowPath])

        Object.values<Job>(workflow.jobs)
          .map((job) => job.steps.find((step) => step.uses === `actions/setup-node@v3`))
          .forEach((job) => {
            expect(job!.with!['node-version']).toEqual(nodeVersion)
          })
      })
    })

    test('includes lighthouse job when requested', () => {
      const project = new TestProject()
      new PullRequestTest(project.github!, {isLighthouseEnabled: true})
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[testWorkflowPath])
      expect(workflow.jobs.lighthouse.steps.at(-2).run).toEqual('npm run lighthouse')
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

      describe('picks nodeVersion', () => {
        const nodeVersion = '16.15.1'

        test('from workflow options first', () => {
          const project = new TestProject({workflowNodeVersion: '18.15.0'})
          PullRequestTest.addToProject(project, {workflowNodeVersion: nodeVersion})
          const snapshot = synthSnapshot(project)
          const workflow = YAML.parse(snapshot[testWorkflowPath])

          Object.values<Job>(workflow.jobs)
            .map((job) => job.steps.find((step) => step.uses === `actions/setup-node@v3`))
            .forEach((job) => {
              expect(job!.with!['node-version']).toEqual(nodeVersion)
            })
        })

        test('from project package as a fallback', () => {
          const project = new TestProject({minNodeVersion: nodeVersion})
          PullRequestTest.addToProject(project, {})
          const snapshot = synthSnapshot(project)
          const workflow = YAML.parse(snapshot[testWorkflowPath])

          Object.values<Job>(workflow.jobs)
            .map((job) => job.steps.find((step) => step.uses === `actions/setup-node@v3`))
            .forEach((job) => {
              expect(job!.with!['node-version']).toEqual(nodeVersion)
            })
        })
      })

      test('does not add test job only if jest is disabled', () => {
        const project = new TestProjectWithTestWorkflow({jest: false})
        const snapshot = synthSnapshot(project)
        const workflow = YAML.parse(snapshot[testWorkflowPath])
        expect(workflow.jobs.test).not.toBeDefined()
      })

      test('propagates isLighthouseEnabled option to constructor', () => {
        const project = new TestProjectWithTestWorkflow({isLighthouseEnabled: true})
        const snapshot = synthSnapshot(project)
        const workflow = YAML.parse(snapshot[testWorkflowPath])
        expect(workflow.jobs.lighthouse.steps.at(-2).run).toEqual('npm run lighthouse')
      })
    })
  })

  describe('ProjenDriftCheckWorkflow', () => {
    const workflowPath = '.github/workflows/projen-drift-check.yml'

    test('throws if called with a project not derived from NodeProject', () => {
      const project = new JavaProject({name: 'java', groupId: 'java', artifactId: 'app', version: '0', github: true})
      expect(() => new ProjenDriftCheckWorkflow(project.github!)).toThrow()
    })

    test('creates a workflow', () => {
      const project = new TestProject()
      new ProjenDriftCheckWorkflow(project.github!)
      const snapshot = synthSnapshot(project)
      expect(snapshot).toMatchSnapshot()
      expect(snapshot[workflowPath]).toBeDefined()
    })

    test('configures the workflow to be run on pull requests and pushes to main branch with changes to projenrc file', () => {
      const project = new TestProject()
      const paths = ['.projenrc.js']
      new ProjenDriftCheckWorkflow(project.github!)
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[workflowPath])

      expect(workflow.on).toEqual({
        pull_request: {paths, types: ['opened', 'synchronize']},
        push: {paths, branches: ['main']},
      })
    })

    test('allows setting additional paths to trigger the workflow', () => {
      const additionalPaths = ['some/additional/path', 'another/additional/path']
      const project = new TestProject()
      const paths = ['.projenrc.js', ...additionalPaths]
      new ProjenDriftCheckWorkflow(project.github!, {additionalPaths})
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[workflowPath])

      expect(workflow.on).toEqual({
        pull_request: {paths, types: ['opened', 'synchronize']},
        push: {paths, branches: ['main']},
      })
    })

    test('allows to be run on pushes to specified branches', () => {
      const project = new TestProject()
      const branches = ['main', 'dev']
      const paths = ['.projenrc.js']
      new ProjenDriftCheckWorkflow(project.github!, {triggerOnPushToBranches: branches})
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[workflowPath])

      expect(workflow.on).toEqual({
        pull_request: {paths, types: ['opened', 'synchronize']},
        push: {paths, branches},
      })
    })

    test('adds a check for uncomitted changes to the workflow', () => {
      const project = new TestProject()
      new ProjenDriftCheckWorkflow(project.github!)
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[workflowPath])
      const jobs = Object.values<projen.github.workflows.Job>(workflow.jobs).map((j) => j.steps.at(-1)!.name)
      expect(jobs).toHaveLength(1)
      expect(jobs[0]).toEqual('Check git')
    })

    describe('allows setting nodeVersion', () => {
      const nodeVersion = '18.15.0'

      test('from workflow options', () => {
        const project = new TestProject()
        new ProjenDriftCheckWorkflow(project.github!, {workflowNodeVersion: nodeVersion})
        const snapshot = synthSnapshot(project)
        const workflow = YAML.parse(snapshot[workflowPath])

        Object.values<Job>(workflow.jobs)
          .map((job) => job.steps.find((step) => step.uses === `actions/setup-node@v3`))
          .forEach((job) => {
            expect(job!.with!['node-version']).toEqual(nodeVersion)
          })
      })

      test('from project package', () => {
        const project = new TestProject({minNodeVersion: nodeVersion})
        new ProjenDriftCheckWorkflow(project.github!)
        const snapshot = synthSnapshot(project)
        const workflow = YAML.parse(snapshot[workflowPath])

        Object.values<Job>(workflow.jobs)
          .map((job) => job.steps.find((step) => step.uses === `actions/setup-node@v3`))
          .forEach((job) => {
            expect(job!.with!['node-version']).toEqual(nodeVersion)
          })
      })
    })

    describe('addToProject', () => {
      const name = 'subproject'

      test('does nothing when opted out with hasDefaultGithubWorkflows option', () => {
        const project = new TestProjectWithProjenDriftCheckWorkflow({hasDefaultGithubWorkflows: false})
        const snapshot = synthSnapshot(project)
        expect(snapshot[workflowPath]).not.toBeDefined()
      })

      test('does nothing if github disabled', () => {
        const project = new TestProjectWithProjenDriftCheckWorkflow({github: false})
        const snapshot = synthSnapshot(project)
        expect(snapshot[workflowPath]).not.toBeDefined()
      })

      test('adds a ProjenDriftCheckWorkflow component to the project with github by default', () => {
        const project = new TestProjectWithProjenDriftCheckWorkflow()
        const snapshot = synthSnapshot(project)
        expect(snapshot[workflowPath]).toBeDefined()
      })

      test('for subprojects does nothing', () => {
        const parent = new TestProjectWithProjenDriftCheckWorkflow({github: false})
        const subproject = new TestProjectWithProjenDriftCheckWorkflow({parent, outdir: 'sub', name})
        const subprojectSnapshot = synthSnapshot(subproject)
        const parentSnapshot = synthSnapshot(parent)
        expect(subprojectSnapshot[workflowPath]).not.toBeDefined()
        expect(parentSnapshot[workflowPath]).not.toBeDefined()
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

  describe('RustTestWorkflow', () => {
    const workflowPath = '.github/workflows/rust-test.yml'

    test('creates a workflow', () => {
      const project = new TestProject()
      new RustTestWorkflow(project.github!)
      const snapshot = synthSnapshot(project)
      expect(snapshot).toMatchSnapshot()
      expect(snapshot[workflowPath]).toBeDefined()
    })

    test('configures the workflow to be run on pull requests and pushes to main branch with changes any file', () => {
      const project = new TestProject()
      new RustTestWorkflow(project.github!)
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[workflowPath])

      expect(workflow.on).toEqual({
        pull_request: {types: ['opened', 'synchronize']},
        push: {branches: ['main']},
      })
    })

    test('allows setting custom paths to trigger the workflow', () => {
      const paths = ['some/path', 'another/path']
      const project = new TestProject()
      new RustTestWorkflow(project.github!, {triggerOnPaths: paths})
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[workflowPath])

      expect(workflow.on).toEqual({
        pull_request: {paths, types: ['opened', 'synchronize']},
        push: {paths, branches: ['main']},
      })
    })

    test('allows to be run on pushes to specified branches', () => {
      const project = new TestProject()
      const branches = ['main', 'dev']
      new RustTestWorkflow(project.github!, {triggerOnBranches: branches})
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[workflowPath])

      expect(workflow.on).toEqual({
        pull_request: {types: ['opened', 'synchronize']},
        push: {branches},
      })
    })

    test('uses rust nightly toolchain with required components', () => {
      const project = new TestProject()
      new RustTestWorkflow(project.github!)
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[workflowPath])
      const jobs = Object.values<projen.github.workflows.Job>(workflow.jobs)

      jobs.forEach((job) => {
        const {toolchain: toolchainSetup, components} = job.steps[1]!.with!
        expect(toolchainSetup).toEqual('nightly')
        expect(components).toEqual('rustfmt, clippy')
        const toolchainUse = job.steps[2]!.with!.toolchain
        expect(toolchainUse).toEqual('nightly')
      })
    })

    test('adds four checks to the workflow', () => {
      const project = new TestProject()
      new RustTestWorkflow(project.github!)
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[workflowPath])
      const jobs = Object.values<projen.github.workflows.Job>(workflow.jobs)
      expect(jobs).toHaveLength(4)
      const commands = jobs.map((j) => j.steps[2]!.with!.command)
      expect(commands).toContain('clippy')
      expect(commands).toContain('check')
      expect(commands).toContain('fmt')
      expect(commands).toContain('test')
    })

    test('enables additional lints in cargo check', () => {
      const project = new TestProject()
      new RustTestWorkflow(project.github!)
      const snapshot = synthSnapshot(project)
      const workflow = YAML.parse(snapshot[workflowPath])
      const {name, env} = workflow.jobs.check.steps.at(-1)!
      expect(name).toEqual('Run check')
      expect(env!.RUSTFLAGS).toEqual('-D unused_crate_dependencies')
    })

    describe('addToProject', () => {
      test('does nothing by default', () => {
        const project = new TestProjectWithRustTestWorkflow({})
        const snapshot = synthSnapshot(project)
        expect(snapshot[workflowPath]).not.toBeDefined()
      })

      test('does nothing when opted out explicitly', () => {
        const project = new TestProjectWithRustTestWorkflow({hasRustTestWorkflow: false})
        const snapshot = synthSnapshot(project)
        expect(snapshot[workflowPath]).not.toBeDefined()
      })

      test('does nothing if github disabled', () => {
        const project = new TestProjectWithRustTestWorkflow({github: false, hasRustTestWorkflow: true})
        const snapshot = synthSnapshot(project)
        expect(snapshot[workflowPath]).not.toBeDefined()
      })

      test('adds a RustTestWorkflow component to the project with github and explicit option', () => {
        const project = new TestProjectWithRustTestWorkflow({hasRustTestWorkflow: true})
        const snapshot = synthSnapshot(project)
        expect(snapshot[workflowPath]).toBeDefined()
      })
    })
  })

  describe('CodeOwners', () => {
    const codeOwnersFilePath = 'CODEOWNERS'

    test('creates CODEOWNERS file', () => {
      const project = new TestProject({})
      new CodeOwners(project.github!)
      const snapshot = synthSnapshot(project)
      expect(snapshot).toMatchSnapshot()
      expect(snapshot[codeOwnersFilePath]).toBeDefined()
    })

    test('adds owners via constructor option', () => {
      const project = new TestProject({})
      const codeOwners: Array<PatternOwners> = [{pattern: '/apps/', owners: ['@ottofeller']}, {pattern: '/apps/github'}]
      new CodeOwners(project.github!, {codeOwners})
      const snapshot = synthSnapshot(project)
      const ownersFile: Array<string> = snapshot[codeOwnersFilePath].split('\n')
      expect(ownersFile).toHaveLength(4)
      const [marker, apps, appsGithub] = ownersFile
      expect(marker.startsWith('#')).toEqual(true)
      expect(apps).toEqual('/apps/ @ottofeller')
      expect(appsGithub).toEqual('/apps/github')
    })

    test('adds owners via a method', () => {
      const project = new TestProject({})
      const codeOwners = new CodeOwners(project.github!)
      codeOwners.addOwners({pattern: '/apps/', owners: ['@ottofeller']}, {pattern: '/apps/github'})
      const snapshot = synthSnapshot(project)
      const ownersFile: Array<string> = snapshot[codeOwnersFilePath].split('\n')
      expect(ownersFile).toHaveLength(4)
      const [marker, apps, appsGithub] = ownersFile
      expect(marker.startsWith('#')).toEqual(true)
      expect(apps).toEqual('/apps/ @ottofeller')
      expect(appsGithub).toEqual('/apps/github')
    })

    describe('addToProject', () => {
      const name = 'subproject'

      test('does nothing when not requested with option', () => {
        const project = new TestProjectWithCodeOwners()
        const snapshot = synthSnapshot(project)
        expect(snapshot[codeOwnersFilePath]).not.toBeDefined()
      })

      test('does nothing if github disabled', () => {
        const project = new TestProjectWithCodeOwners({github: false})
        const snapshot = synthSnapshot(project)
        expect(snapshot[codeOwnersFilePath]).not.toBeDefined()
      })

      test('adds a CodeOwners component to the project with codeOwners option', () => {
        const project = new TestProjectWithCodeOwners({codeOwners: [{pattern: '*', owners: ['@ottofeller']}]})
        const snapshot = synthSnapshot(project)
        expect(snapshot[codeOwnersFilePath]).toBeDefined()
      })

      test('for subprojects does nothing', () => {
        const parent = new TestProjectWithCodeOwners({github: false})
        const subproject = new TestProjectWithCodeOwners({parent, outdir: 'sub', name})
        const subprojectSnapshot = synthSnapshot(subproject)
        const parentSnapshot = synthSnapshot(parent)
        expect(subprojectSnapshot[codeOwnersFilePath]).not.toBeDefined()
        expect(parentSnapshot[codeOwnersFilePath]).not.toBeDefined()
      })
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
  constructor(options: Partial<NodeProjectOptions & WithDefaultWorkflow & {isLighthouseEnabled: boolean}> = {}) {
    super({
      name: 'test-project-with-test-workflow',
      defaultReleaseBranch: 'main',
      packageManager: options.packageManager ?? NodePackageManager.NPM,
      ...options,
    })

    PullRequestTest.addToProject(this, options)
  }
}

class TestProjectWithProjenDriftCheckWorkflow extends NodeProject {
  constructor(options: Partial<NodeProjectOptions & WithDefaultWorkflow> = {}) {
    super({
      name: 'test-project-with-test-workflow',
      defaultReleaseBranch: 'main',
      packageManager: options.packageManager ?? NodePackageManager.NPM,
      ...options,
    })

    ProjenDriftCheckWorkflow.addToProject(this, options)
  }
}

class TestProjectWithRustTestWorkflow extends NodeProject {
  constructor(options: Partial<NodeProjectOptions & WithRustTestWorkflow> = {}) {
    super({
      name: 'test-project-with-rust-test-workflow',
      defaultReleaseBranch: 'main',
      packageManager: options.packageManager ?? NodePackageManager.NPM,
      ...options,
    })

    RustTestWorkflow.addToProject(this, options)
  }
}

class TestProjectWithCodeOwners extends NodeProject {
  constructor(options: Partial<NodeProjectOptions & WithCodeOwners> = {}) {
    super({
      name: 'test-project-with-test-workflow',
      defaultReleaseBranch: 'main',
      packageManager: options.packageManager ?? NodePackageManager.NPM,
      ...options,
    })

    CodeOwners.addToProject(this, options)
  }
}

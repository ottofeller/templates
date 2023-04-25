import {Component, github, javascript} from 'projen'
import {WithDefaultWorkflow} from './with-default-workflow'
import {JobStep} from 'projen/lib/github/workflows-model'

/**
 * Options for PullRequestLint
 */
export interface PullRequestTestOptions {
  /**
   * Github Runner selection labels
   * @default ['ubuntu-latest']
   */
  readonly runsOn?: string[]

  /**
   * The workflow name
   * @default 'test'
   */
  readonly name?: string

  /**
   * Relative output directory of the project.
   */
  readonly outdir?: string

  /**
   * A list of branches on pushes to which the workflow will run.
   * @default ['main']
   */
  readonly triggerOnPushToBranches?: Array<string>

  /**
   * Setup Lighthouse audit job.
   *
   * @default true
   */
  readonly lighthouse?: boolean
}

/**
 * Configure a testing workflow with basic checks to run on GitHub pull requests.
 */
export class PullRequestTest extends Component {
  constructor(githubInstance: github.GitHub, options: PullRequestTestOptions = {}) {
    super(githubInstance.project)

    const workflowName = options.name ?? 'test'
    const directory = options.outdir
    const paths = directory ? [`${directory}/**`] : undefined
    const workflow = githubInstance.addWorkflow(workflowName)
    const branches = options.triggerOnPushToBranches ?? ['main']

    workflow.on({
      pullRequest: {paths, types: ['opened', 'synchronize']},
      push: {paths, branches},
    })

    const job = (command: string): github.workflows.Job => ({
      runsOn: options.runsOn ?? ['ubuntu-latest'],
      permissions: {contents: github.workflows.JobPermission.READ},
      steps: [{uses: 'ottofeller/github-actions/npm-run@main', with: {'node-version': 16, command, directory}}],
    })

    const customJob = (steps: JobStep[]): github.workflows.Job => ({
      runsOn: options.runsOn ?? ['ubuntu-latest'],
      permissions: {contents: github.workflows.JobPermission.READ},
      steps,
    })

    workflow.addJobs({
      lint: job('npm run lint'),
      typecheck: job('npm run typecheck'),
      test: job('npm run test'),
    })

    if (options.lighthouse) {
      workflow.addJobs({
        lighthouse: customJob([
          {uses: 'actions/checkout@v3'},
          {uses: 'actions/setup-node@v3', with: {'node-version': 16}},
          {name: 'Install dependencies', run: 'npm instapp'},
          {name: 'Copy environment variables', run: 'cp .env.development .env.local'},
          {name: 'Build Next.js application', run: 'npm run build'},
          {name: 'Run Lighthouse audit', run: 'npm run lighthouse'},
          {
            name: 'Save Lighthouse report as an artifact',
            uses: 'actions/upload-artifact@v3',
            if: 'always()',
            with: {name: 'lighthouse-report', path: '.lighthouseci/'},
          },
        ]),
      })
    }
  }

  /**
   * Optionally creates a workflow within the given project
   * or within the project parent (for subprojects).
   *
   * `hasDefaultGithubWorkflows` option disables workflow creation making the method a simple noop.
   *
   * NOTE: Use this method if the described conditional logic is needed.
   * Otherwise just use the constructor.
   */
  static addToProject(project: javascript.NodeProject, options: PullRequestTestOptions & WithDefaultWorkflow) {
    const hasDefaultGithubWorkflows = options.hasDefaultGithubWorkflows ?? true

    if (!hasDefaultGithubWorkflows) {
      return
    }

    if (project.github) {
      new PullRequestTest(project.github)
      return
    }

    if (project.parent && project.parent instanceof javascript.NodeProject && project.parent.github) {
      new PullRequestTest(project.parent.github, {
        runsOn: options.runsOn,
        name: `test-${options.name}`,
        outdir: options.outdir,
        lighthouse: options.lighthouse,
      })
    }
  }
}

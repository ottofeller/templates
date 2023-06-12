import {Component, github, javascript} from 'projen'
import {JobStep} from 'projen/lib/github/workflows-model'
import {WithDefaultWorkflow} from './with-default-workflow'

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
  readonly isLighthouseEnabled?: boolean

  /**
   * Setup Playwright end-to-end tests job.
   *
   * @default true
   */
  readonly isPlaywrightEnabled?: boolean
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

    const job = (steps: Array<JobStep>): github.workflows.Job => ({
      runsOn: options.runsOn ?? ['ubuntu-latest'],
      permissions: {contents: github.workflows.JobPermission.READ},
      steps,
    })

    workflow.addJobs({
      lint: job([
        {
          uses: 'ottofeller/github-actions/npm-run@main',
          with: {'node-version': 16, command: 'npm run lint', directory},
        },
      ]),
      typecheck: job([
        {
          uses: 'ottofeller/github-actions/npm-run@main',
          with: {'node-version': 16, command: 'npm run typecheck', directory},
        },
      ]),
      'unit-tests': job([
        {
          uses: 'ottofeller/github-actions/npm-run@main',
          with: {'node-version': 16, command: 'npm run test', directory},
        },
      ]),
    })

    if (options.isLighthouseEnabled) {
      workflow.addJobs({
        lighthouse: job([
          {uses: 'actions/checkout@v3', workingDirectory: directory},
          {uses: 'actions/setup-node@v3', with: {'node-version': 16}, workingDirectory: directory},
          {name: 'Install dependencies', run: 'npm install', workingDirectory: directory},
          {name: 'Copy environment variables', run: 'cp .env.development .env.local', workingDirectory: directory},
          {name: 'Build Next.js application', run: 'npm run build', workingDirectory: directory},
          {name: 'Run Lighthouse audit', run: 'npm run lighthouse', workingDirectory: directory},
          {
            name: 'Save Lighthouse report as an artifact',
            uses: 'actions/upload-artifact@v3',
            if: 'always()',
            with: {name: 'lighthouse-report', path: '.lighthouseci/'},
            workingDirectory: directory,
          },
        ]),
      })
    }

    if (options.isPlaywrightEnabled) {
      workflow.addJobs({
        'e2e-tests': job([
          {uses: 'actions/checkout@v3', workingDirectory: directory},
          {uses: 'actions/setup-node@v3', with: {'node-version': 16}, workingDirectory: directory},
          {name: 'Install dependencies', run: 'npm install', workingDirectory: directory},
          {name: 'Copy environment variables', run: 'cp .env.development .env.local', workingDirectory: directory},
          {name: 'Build Next.js application', run: 'npm run build', workingDirectory: directory},
          {name: 'Run end-to-end tests', run: 'npm run test:e2e', workingDirectory: directory},
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
    const isLighthouseEnabled = options.isLighthouseEnabled ?? true
    const isPlaywrightEnabled = options.isPlaywrightEnabled ?? true

    if (!hasDefaultGithubWorkflows) {
      return
    }

    if (project.github) {
      new PullRequestTest(project.github, {isLighthouseEnabled, isPlaywrightEnabled})
      return
    }

    if (project.parent && project.parent instanceof javascript.NodeProject && project.parent.github) {
      new PullRequestTest(project.parent.github, {
        runsOn: options.runsOn,
        name: `test-${options.name}`,
        outdir: options.outdir,
        isLighthouseEnabled,
        isPlaywrightEnabled,
      })
    }
  }
}

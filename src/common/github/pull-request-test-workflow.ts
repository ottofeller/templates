import {Component, github, javascript} from 'projen'
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

    workflow.addJobs({
      lint: job('npm run lint'),
      typecheck: job('npm run typecheck'),
      test: job('npm run test'),
    })
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
      })
    }
  }
}

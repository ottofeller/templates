import {Component, github, javascript} from 'projen'
import {NodeProject} from 'projen/lib/javascript'
import {lighthouseJob, NodeJobOptions, runScriptJob} from './jobs'
import type {WithDefaultWorkflow} from './with-default-workflow'

/**
 * Options for PullRequestLint
 */
export interface PullRequestTestOptions
  extends Partial<Pick<javascript.NodeProject, 'runScriptCommand'>>,
    Partial<Pick<javascript.NodePackage, 'installCommand'>> {
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
    const {project} = githubInstance

    if (!(project instanceof NodeProject)) {
      throw new Error('PullRequestTest works only with instances of NodeProject.')
    }

    const workflowName = options.name ?? 'test'
    const workingDirectory = options.outdir
    const paths = workingDirectory ? [`${workingDirectory}/**`] : undefined
    const workflow = githubInstance.addWorkflow(workflowName)
    const branches = options.triggerOnPushToBranches ?? ['main']

    workflow.on({
      pullRequest: {paths, types: ['opened', 'synchronize']},
      push: {paths, branches},
    })

    const commonJobProps: NodeJobOptions = {
      runsOn: options.runsOn,
      workingDirectory,
      projectPackage: project.package,
      runScriptCommand: project.runScriptCommand,
    }

    workflow.addJobs({
      lint: runScriptJob({command: 'lint', ...commonJobProps}),
      test: runScriptJob({command: 'test', ...commonJobProps}),
      typecheck: runScriptJob({command: 'typecheck', ...commonJobProps}),
    })

    if (options.lighthouse) {
      workflow.addJobs({lighthouse: lighthouseJob(commonJobProps)})
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
    const lighthouse = options.lighthouse ?? true

    if (!hasDefaultGithubWorkflows) {
      return
    }

    if (project.github) {
      new PullRequestTest(project.github, {lighthouse, runsOn: options.runsOn})

      return
    }

    if (project.parent && project.parent instanceof javascript.NodeProject && project.parent.github) {
      new PullRequestTest(project.parent.github, {
        lighthouse,
        name: `test-${options.name}`,
        outdir: options.outdir,
        runsOn: options.runsOn,
      })
    }
  }
}

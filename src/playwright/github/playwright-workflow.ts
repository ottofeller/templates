import {github, javascript} from 'projen'
import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {NodeJobOptions} from '../../common/github/jobs'
import type {WithDefaultWorkflow} from '../../common/github/with-default-workflow'
import {playwrightJob} from './playwright-job'

/**
 * Options for PullRequestLint
 */
export interface PlaywrightWorkflowTestOptions
  extends Partial<Pick<javascript.NodeProject, 'runScriptCommand'>>,
    Partial<Pick<javascript.NodePackage, 'installCommand'>>,
    Pick<NodeProjectOptions, 'workflowNodeVersion'> {
  /**
   * Github Runner selection labels
   * @default ['ubuntu-latest']
   */
  readonly runsOn?: string[]

  /**
   * The workflow name
   * @default 'e2e-tests'
   */
  readonly name?: string

  /**
   * Relative output directory of the project.
   * @default ['e2e']
   */
  readonly outdir?: string
}

/**
 * Configure a testing workflow with basic checks to run on GitHub pull requests.
 */
export class PlaywrightWorkflowTest extends github.GithubWorkflow {
  constructor(githubInstance: github.GitHub, options: PlaywrightWorkflowTestOptions = {}) {
    const workflowName = options.name ?? 'e2e-tests'
    super(githubInstance, workflowName)
    const {project} = githubInstance

    if (!(project instanceof NodeProject)) {
      throw new Error('PullRequestTest works only with instances of NodeProject.')
    }

    const workingDirectory = options.outdir ?? 'e2e'
    const nodeVersion = options.workflowNodeVersion ?? project.package.minNodeVersion

    this.on({
      workflowDispatch: {},
      workflowRun: {workflows: ['Deploy Staging'], types: ['completed']},
    })

    const commonJobProps: NodeJobOptions = {
      runsOn: options.runsOn,
      workingDirectory,
      projectPackage: project.package,
      runScriptCommand: project.runScriptCommand,
      nodeVersion,
    }

    this.addJobs({playwright: playwrightJob(commonJobProps)})
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
  static addToProject(project: javascript.NodeProject, options: PlaywrightWorkflowTestOptions & WithDefaultWorkflow) {
    const hasDefaultGithubWorkflows = options.hasDefaultGithubWorkflows ?? true
    const {runsOn, outdir, workflowNodeVersion} = options

    if (!hasDefaultGithubWorkflows) {
      return
    }

    if (project.github) {
      return new PlaywrightWorkflowTest(project.github, {runsOn, workflowNodeVersion})
    }

    if (project.parent && project.parent instanceof javascript.NodeProject && project.parent.github) {
      return new PlaywrightWorkflowTest(project.parent.github, {
        name: `test-${options.name}`,
        outdir,
        runsOn,
        workflowNodeVersion,
      })
    }

    return
  }
}

import {Component, github, javascript} from 'projen'
import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import type {WithDefaultWorkflow} from '../../common/github/with-default-workflow'
import {NodeJobOptions, playwrightJob} from './jobs'

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
export class PlaywrightWorkflowTest extends Component {
  constructor(githubInstance: github.GitHub, options: PlaywrightWorkflowTestOptions = {}) {
    super(githubInstance.project)
    const {project} = githubInstance

    if (!(project instanceof NodeProject)) {
      throw new Error('PullRequestTest works only with instances of NodeProject.')
    }

    const workflowName = options.name ?? 'e2e-tests'
    const workingDirectory = options.outdir ?? 'e2e'
    const workflow = githubInstance.addWorkflow(workflowName)
    const nodeVersion = options.workflowNodeVersion ?? project.package.minNodeVersion

    workflow.on({
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

    workflow.addJobs({playwright: playwrightJob(commonJobProps)})
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
      new PlaywrightWorkflowTest(project.github, {runsOn, workflowNodeVersion})
      return
    }

    if (project.parent && project.parent instanceof javascript.NodeProject && project.parent.github) {
      new PlaywrightWorkflowTest(project.parent.github, {
        name: `test-${options.name}`,
        outdir,
        runsOn,
        workflowNodeVersion,
      })
    }
  }
}

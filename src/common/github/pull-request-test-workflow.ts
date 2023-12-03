import {Component, github, javascript} from 'projen'
import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {NodeJobOptions, lighthouseJob, runScriptJob} from './jobs'
import type {WithDefaultWorkflow} from './with-default-workflow'

/**
 * Options for PullRequestLint
 */
export interface PullRequestTestOptions
  extends Partial<Pick<javascript.NodeProject, 'runScriptCommand'>>,
    Partial<Pick<javascript.NodePackage, 'installCommand'>>,
    Pick<NodeProjectOptions, 'workflowNodeVersion' | 'jest'> {
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
   * Setup Lighthouse audit script & GitHub job.
   *
   * @default true
   */
  readonly isLighthouseEnabled?: boolean
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
    const nodeVersion = options.workflowNodeVersion ?? project.package.minNodeVersion

    workflow.on({
      pullRequest: {paths, types: ['opened', 'synchronize']},
      push: {paths, branches},
    })

    const commonJobProps: NodeJobOptions = {
      runsOn: options.runsOn,
      workingDirectory,
      projectPackage: project.package,
      runScriptCommand: project.runScriptCommand,
      nodeVersion,
    }

    workflow.addJobs({
      lint: runScriptJob({command: 'lint', ...commonJobProps}),
      typecheck: runScriptJob({command: 'typecheck', ...commonJobProps}),
    })

    if (options.jest) {
      workflow.addJob('unit-tests', runScriptJob({command: 'test', ...commonJobProps}))
    }

    if (options.isLighthouseEnabled) {
      workflow.addJob('lighthouse', lighthouseJob(commonJobProps))
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
    const isLighthouseEnabled = options.isLighthouseEnabled ?? false
    const jest = options.jest ?? true
    const {runsOn, outdir, workflowNodeVersion} = options

    if (!hasDefaultGithubWorkflows) {
      return
    }

    if (project.github) {
      new PullRequestTest(project.github, {isLighthouseEnabled, jest, runsOn, workflowNodeVersion})
      return
    }

    if (project.parent && project.parent instanceof javascript.NodeProject && project.parent.github) {
      new PullRequestTest(project.parent.github, {
        isLighthouseEnabled,
        jest,
        name: `test-${options.name}`,
        outdir,
        runsOn,
        workflowNodeVersion,
      })
    }
  }
}

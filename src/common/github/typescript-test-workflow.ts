import {github, javascript} from 'projen'
import {GithubWorkflow} from 'projen/lib/github'
import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {NodeJobOptions, lighthouseJob, runScriptJob} from './jobs'
import type {WithDefaultWorkflow} from './with-default-workflow'

/**
 * Options for PullRequestLint
 */
export interface TypeScriptTestWorkflowOptions
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
   * @default false
   */
  readonly isLighthouseEnabled?: boolean
}

/**
 * Configure a testing workflow with basic checks to run on GitHub pull requests.
 */
export class TypeScriptTestWorkflow extends GithubWorkflow {
  constructor(githubInstance: github.GitHub, options: TypeScriptTestWorkflowOptions = {}) {
    const workflowName = options.name ?? 'ts-test'
    super(githubInstance, workflowName)
    const {project} = githubInstance

    if (!(project instanceof NodeProject)) {
      throw new Error('PullRequestTest works only with instances of NodeProject.')
    }

    const workingDirectory = options.outdir
    const paths = workingDirectory ? [`${workingDirectory}/**`] : undefined
    const branches = options.triggerOnPushToBranches ?? ['main']
    const nodeVersion = options.workflowNodeVersion ?? project.package.minNodeVersion

    this.on({
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

    this.addJobs({
      lint: runScriptJob({command: 'lint', ...commonJobProps}),
      typecheck: runScriptJob({command: 'typecheck', ...commonJobProps}),
    })

    if (options.jest) {
      this.addJob('unit-tests', runScriptJob({command: 'test', ...commonJobProps}))
    }

    if (options.isLighthouseEnabled) {
      this.addJob('lighthouse', lighthouseJob(commonJobProps))
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
  static addToProject(project: javascript.NodeProject, options: TypeScriptTestWorkflowOptions & WithDefaultWorkflow) {
    const hasDefaultGithubWorkflows = options.hasDefaultGithubWorkflows ?? true
    const isLighthouseEnabled = options.isLighthouseEnabled ?? false
    const jest = options.jest ?? true
    const {runsOn, outdir, workflowNodeVersion} = options

    if (!hasDefaultGithubWorkflows) {
      return
    }

    if (project.github) {
      return new TypeScriptTestWorkflow(project.github, {isLighthouseEnabled, jest, runsOn, workflowNodeVersion})
    }

    if (project.parent && project.parent instanceof javascript.NodeProject && project.parent.github) {
      return new TypeScriptTestWorkflow(project.parent.github, {
        isLighthouseEnabled,
        jest,
        name: `test-${options.name}`,
        outdir,
        runsOn,
        workflowNodeVersion,
      })
    }

    return
  }
}

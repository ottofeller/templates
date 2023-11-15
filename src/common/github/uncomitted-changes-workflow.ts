import {Component, ProjenrcFile, github, javascript} from 'projen'
import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {runScriptJob} from './jobs'
import type {WithDefaultWorkflow} from './with-default-workflow'

/**
 * Options for UncomittedChangesWorkflow
 */
export interface UncomittedChangesOptions
  extends Partial<Pick<javascript.NodeProject, 'runScriptCommand'>>,
    Pick<NodeProjectOptions, 'workflowNodeVersion'> {
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
 * Configure a workflow that runs projen default task and checks for any generated but uncomitted changes.
 */
export class UncomittedChangesWorkflow extends Component {
  constructor(githubInstance: github.GitHub, options: UncomittedChangesOptions = {}) {
    const {project} = githubInstance
    super(project)

    if (!(project instanceof NodeProject)) {
      throw new Error('UncomittedChangesWorkflow works only with instances of NodeProject.')
    }

    const workflowName = options.name ?? 'uncomitted-changes'
    const workingDirectory = options.outdir
    const paths = [ProjenrcFile.of(project)!.filePath]
    const workflow = githubInstance.addWorkflow(workflowName)
    const branches = options.triggerOnPushToBranches ?? ['main']
    const nodeVersion = options.workflowNodeVersion ?? project.package.minNodeVersion

    workflow.on({
      pullRequest: {paths, types: ['opened', 'synchronize']},
      push: {paths, branches},
    })

    const uncomittedChangesJob = runScriptJob({
      command: 'default',
      runsOn: options.runsOn,
      workingDirectory,
      projectPackage: project.package,
      runScriptCommand: project.runScriptCommand,
      nodeVersion,
    })

    const checkChangesCommand = 'CHANGES=$(git status --porcelain) && [ -z $CHANGES ] || { echo $CHANGES; exit 1; }'
    uncomittedChangesJob.steps.push({name: 'Check git', run: checkChangesCommand})
    workflow.addJob('uncomitted-changes', uncomittedChangesJob)
  }

  /**
   * Optionally creates a workflow within the given project.
   * Does nothing for subprojects since only a single project has the projenrc config.
   *
   * `hasDefaultGithubWorkflows` option disables workflow creation making the method a simple noop.
   *
   * NOTE: Use this method if the described conditional logic is needed.
   * Otherwise just use the constructor.
   */
  static addToProject(project: javascript.NodeProject, options: UncomittedChangesOptions & WithDefaultWorkflow) {
    const hasDefaultGithubWorkflows = options.hasDefaultGithubWorkflows ?? true

    if (!hasDefaultGithubWorkflows || !project.github) {
      return
    }

    new UncomittedChangesWorkflow(project.github, options)
  }
}

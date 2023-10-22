import {Component, ProjenrcFile} from 'projen'
import type {GitHub} from 'projen/lib/github'
import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {runScriptJob} from '../github'
import {telemetryEnableEnvVar} from './collect-telemetry'

/**
 * Options for PullRequestLint
 */
export interface TelemetryWorkflowOptions
  extends Partial<Pick<NodeProject, 'runScriptCommand'>>,
    Pick<NodeProjectOptions, 'workflowNodeVersion'> {
  /**
   * Project name - used to construct workflow name for subprojects
   */
  readonly name?: string

  /**
   * Relative output directory of the project.
   */
  readonly outdir?: string
}

/**
 * Configure a telemetry workflow to run on GitHub pull requests.
 */
export class TelemetryWorkflow extends Component {
  constructor(githubInstance: GitHub, options: TelemetryWorkflowOptions = {}) {
    const {project} = githubInstance

    if (!(project instanceof NodeProject)) {
      throw new Error('TelemetryWorkflow works only with instances of NodeProject.')
    }

    super(project)

    const workingDirectory = options.outdir
    const rcFile = ProjenrcFile.of(project)?.filePath
    const paths = rcFile ? [rcFile] : undefined
    const nodeVersion = options.workflowNodeVersion ?? project.package.minNodeVersion
    const workflow = githubInstance.addWorkflow('telemetry')
    workflow.on({pullRequest: {paths, types: ['opened', 'synchronize']}})

    const telemetryJob = runScriptJob({
      command: `${telemetryEnableEnvVar}=1 npm run default`,
      workingDirectory,
      projectPackage: project.package,
      runScriptCommand: project.runScriptCommand,
      nodeVersion,
    })

    workflow.addJob('telemetry', telemetryJob)
  }

  /**
   * Creates a workflow within the given project
   * or within the project parent (for subprojects).
   */
  static addToProject(project: NodeProject, options: TelemetryWorkflowOptions) {
    const {outdir, workflowNodeVersion} = options

    if (project.github) {
      new TelemetryWorkflow(project.github, {outdir, workflowNodeVersion})
      return
    }

    if (project.parent && project.parent instanceof NodeProject && project.parent.github) {
      new TelemetryWorkflow(project.parent.github, {
        name: `telemetry-${options.name}`,
        outdir,
        workflowNodeVersion,
      })
    }
  }
}

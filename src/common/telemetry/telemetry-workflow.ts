import {Component, ProjenrcFile} from 'projen'
import type {GitHub} from 'projen/lib/github'
import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {runScriptJob} from '../github'
import {reportTargetAuthToken, telemetryEnableEnvVar} from './collect-telemetry'
import type {WithTelemetry} from './with-telemetry'

/**
 * Options for PullRequestLint
 */
export interface TelemetryWorkflowOptions
  extends Partial<Pick<NodeProject, 'runScriptCommand'>>,
    Pick<NodeProjectOptions, 'workflowNodeVersion'>,
    Pick<WithTelemetry, 'reportTargetAuthTokenVar'> {
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

    const rcFilePath = ProjenrcFile.of(project)?.filePath

    if (!rcFilePath) {
      throw new Error('TelemetryWorkflow works only with projects that have a ProjenrcFile component.')
    }

    super(project)

    const workingDirectory = options.outdir
    const nodeVersion = options.workflowNodeVersion ?? project.package.minNodeVersion
    const workflow = githubInstance.addWorkflow('telemetry')
    workflow.on({pullRequest: {paths: [rcFilePath], types: ['opened', 'synchronize']}})

    const env: Record<string, string> = {[telemetryEnableEnvVar]: '1'}
    const {reportTargetAuthTokenVar} = options

    if (reportTargetAuthTokenVar) {
      env[reportTargetAuthToken] = `\${{ secrets.${reportTargetAuthTokenVar} }}`
    }

    workflow.addJob('telemetry', {
      env,
      ...runScriptJob({
        command: 'default',
        workingDirectory,
        projectPackage: project.package,
        runScriptCommand: project.runScriptCommand,
        nodeVersion,
      }),
    })
  }

  /**
   * Creates a workflow within the given project
   * or within the project parent (for subprojects).
   */
  static addToProject(project: NodeProject, options: TelemetryWorkflowOptions) {
    if (!project.github) {
      return
    }

    new TelemetryWorkflow(project.github, options)
  }
}

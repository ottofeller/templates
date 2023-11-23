import {Component, ProjenrcFile} from 'projen'
import type {GitHub} from 'projen/lib/github'
import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {runScriptJob} from '../github'
import {telemetryAuthToken, telemetryEnableEnvVar} from './collect-telemetry'
import type {WithTelemetry} from './with-telemetry'

/**
 * Options for PullRequestLint
 */
export interface TelemetryWorkflowOptions
  extends Partial<Pick<NodeProject, 'runScriptCommand'>>,
    Pick<NodeProjectOptions, 'workflowNodeVersion'>,
    Pick<WithTelemetry, 'telemetryAuthTokenVar'> {
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
      command: 'default',
      workingDirectory,
      projectPackage: project.package,
      runScriptCommand: project.runScriptCommand,
      nodeVersion,
    })

    const env: Record<string, string> = {[telemetryEnableEnvVar]: '1'}
    const {telemetryAuthTokenVar} = options

    if (telemetryAuthTokenVar) {
      env[telemetryAuthToken] = `\${{ secrets.${telemetryAuthTokenVar} }}`
    }

    workflow.addJob('telemetry', {...telemetryJob, env})
  }

  /**
   * Creates a workflow within the given project
   * or within the project parent (for subprojects).
   */
  static addToProject(project: NodeProject, options: TelemetryWorkflowOptions) {
    const {outdir, workflowNodeVersion, telemetryAuthTokenVar} = options
    const commonOptions = {outdir, workflowNodeVersion, telemetryAuthTokenVar}

    if (project.github) {
      new TelemetryWorkflow(project.github, commonOptions)
      return
    }

    if (project.parent && project.parent instanceof NodeProject && project.parent.github) {
      new TelemetryWorkflow(project.parent.github, {
        name: `telemetry-${options.name}`,
        ...commonOptions,
      })
    }
  }
}

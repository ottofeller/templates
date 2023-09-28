import type {NodeProject} from 'projen/lib/javascript'
import {TelemetryWorkflow, TelemetryWorkflowOptions} from './telemetry-workflow'
import type {IWithTelemetryReportUrl, WithTelemetry} from './with-telemetry'

type Writeable<T extends object> = {-readonly [P in keyof T]: T[P]}

export const setupTelemetry = (
  project: NodeProject & Writeable<IWithTelemetryReportUrl>,
  options: WithTelemetry & TelemetryWorkflowOptions,
) => {
  const reportUrl = options.telemetry?.reportUrl

  if (!reportUrl) {
    return
  }

  project.telemetryReportUrl = reportUrl
  TelemetryWorkflow.addToProject(project, options)
}

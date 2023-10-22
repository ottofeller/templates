import type {NodeProject} from 'projen/lib/javascript'
import type {IWithTelemetryReportUrl} from './i-with-telemetry-report-url'
import {TelemetryWorkflow, TelemetryWorkflowOptions} from './telemetry-workflow'
import type {WithTelemetry} from './with-telemetry'

type Writeable<T extends object> = {-readonly [P in keyof T]: T[P]}

/**
 * Check options for telemetry being requested
 * and configure the project to have:
 * - a URL available for telemetry code;
 * - a special GitHub workflow that runs telemetry collection and sends the data to the predefined URL.
 */
export const setupTelemetry = (
  project: NodeProject & Writeable<IWithTelemetryReportUrl>,
  options: WithTelemetry & TelemetryWorkflowOptions,
) => {
  const {isTelemetryEnabled = false, telemetryUrl} = options

  if (!isTelemetryEnabled && telemetryUrl) {
    throw Error('Telemetry is disabled, thus "telemetryUrl" won\'t have any effect.')
  }

  if (!isTelemetryEnabled) {
    return
  }

  if (!telemetryUrl) {
    throw Error('A valid URL is required to be set for telemetry.')
  }

  project.telemetryReportUrl = telemetryUrl
  TelemetryWorkflow.addToProject(project, options)
}

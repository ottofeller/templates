import type {NodeProject} from 'projen/lib/javascript'
import type {IWithTelemetryReportUrl} from './i-with-telemetry-report-url'
import {TelemetryWorkflow} from './telemetry-workflow'
import type {WithTelemetry} from './with-telemetry'

type Writeable<T extends object> = {-readonly [P in keyof T]: T[P]}

/**
 * Check options for telemetry being requested
 * and configure the project to have:
 * - a URL available for telemetry code;
 * - a special GitHub workflow that runs telemetry collection and sends the data to the predefined URL.
 */
export const setupTelemetry = (project: NodeProject & Writeable<IWithTelemetryReportUrl>, options: WithTelemetry) => {
  const {isTelemetryEnabled = false, telemetryOptions} = options

  if (!isTelemetryEnabled && telemetryOptions) {
    throw new Error('Telemetry is disabled, thus "telemetryOptions" won\'t have any effect.')
  }

  if (!isTelemetryEnabled) {
    return
  }

  if (!telemetryOptions) {
    throw new Error('telemetryOptions with a valid URL is required to be set for telemetry.')
  }

  const {reportTargetUrl, reportTargetAuthHeaderName, reportTargetAuthTokenVar} = telemetryOptions

  if (
    (reportTargetAuthHeaderName && !reportTargetAuthTokenVar) ||
    (!reportTargetAuthHeaderName && reportTargetAuthTokenVar)
  ) {
    throw new Error('"telemetryAuthHeader" and "telemetryAuthTokenVar" options should be set together')
  }

  project.reportTargetUrl = reportTargetUrl

  if (reportTargetAuthHeaderName) {
    project.reportTargetAuthHeaderName = reportTargetAuthHeaderName
  }

  TelemetryWorkflow.addToProject(project, telemetryOptions)
}

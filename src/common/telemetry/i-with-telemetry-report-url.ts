export interface IWithTelemetryReportUrl {
  /**
   * URL used for telemetry.
   */
  readonly telemetryReportUrl?: string

  /**
   * Authorization header name for telemetry
   */
  readonly telemetryAuthHeader?: string
}

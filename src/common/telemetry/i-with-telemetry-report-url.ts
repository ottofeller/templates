export interface IWithTelemetryReportUrl {
  /**
   * URL used for telemetry.
   */
  readonly reportTargetUrl?: string

  /**
   * Authorization header name for telemetry
   */
  readonly reportTargetAuthHeaderName?: string
}

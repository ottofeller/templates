export interface WithTelemetry {
  /**
   * Enable template usage telemetry.
   * Collects the data on the template package version, connected git remotes,
   * applied escape hatches, configured GitHub workflows.
   *
   * @default false
   */
  readonly isTelemetryEnabled?: boolean

  /**
   * Endpoint URL to send telemetry data to.
   */
  readonly reportTargetUrl?: string

  /**
   * Authorization header name for telemetry
   */
  readonly reportTargetAuthHeaderName?: string

  /**
   * The name of env var to extract header value from.
   * The value is expected to be stored in a CI secret.
   */
  readonly reportTargetAuthTokenVar?: string
}

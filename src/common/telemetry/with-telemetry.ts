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
  readonly telemetryUrl?: string
}

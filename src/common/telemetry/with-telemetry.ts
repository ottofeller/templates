export interface TelemetryOptions {
  readonly reportUrl: string
}

export interface WithTelemetry {
  readonly telemetry?: TelemetryOptions
}

export interface IWithTelemetryReportUrl {
  readonly telemetryReportUrl?: string
}

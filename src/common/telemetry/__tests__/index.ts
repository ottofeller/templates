import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {synthSnapshot} from 'projen/lib/util/synth'
import {IWithTelemetryReportUrl, WithTelemetry, setupTelemetry} from '..'

describe('setupTelemetry function', () => {
  test('does nothing if telemetry options are not provided', () => {
    const project = new TestProject()
    setupTelemetry(project, {})
    expect(project.telemetryReportUrl).toBeUndefined()

    const snapshot = synthSnapshot(project)
    const telemetryWorkflow = snapshot['.github/workflows/telemetry.yml']
    expect(telemetryWorkflow).toBeUndefined()
  })

  test('sets up telemetry if requested in options', () => {
    const project = new TestProject({})
    setupTelemetry(project, {telemetry: {reportUrl: 'http://localhost:3000/telemetry'}})
    expect(project.telemetryReportUrl).toBeDefined()

    const snapshot = synthSnapshot(project)
    const telemetryWorkflow = snapshot['.github/workflows/telemetry.yml']
    expect(telemetryWorkflow).toBeDefined()
  })
})

class TestProject extends NodeProject implements IWithTelemetryReportUrl {
  readonly telemetryReportUrl?: string

  constructor(options: Partial<NodeProjectOptions & WithTelemetry> = {}) {
    super({
      ...options,
      name: 'test-project',
      defaultReleaseBranch: 'main',
    })
  }
}

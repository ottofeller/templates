import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {synthSnapshot} from 'projen/lib/util/synth'
import * as YAML from 'yaml'
import {IWithTelemetryReportUrl, WithTelemetry, setupTelemetry} from '..'
import {reportTargetAuthToken} from '../collect-telemetry'

describe('setupTelemetry function', () => {
  const telemetryWorkflowPath = '.github/workflows/telemetry.yml'

  test('does nothing if telemetry options are not provided', () => {
    const project = new TestProject()
    setupTelemetry(project, {})
    expect(project.reportTargetUrl).toBeUndefined()

    const snapshot = synthSnapshot(project)
    const telemetryWorkflow = snapshot[telemetryWorkflowPath]
    expect(telemetryWorkflow).toBeUndefined()
  })

  test('sets up telemetry if requested in options', () => {
    const project = new TestProject({})
    const telemetryOptions = {reportTargetUrl: 'http://localhost:3000/telemetry'}
    setupTelemetry(project, {isTelemetryEnabled: true, telemetryOptions})
    expect(project.reportTargetUrl).toBeDefined()

    const snapshot = synthSnapshot(project)
    const telemetryWorkflow = snapshot[telemetryWorkflowPath]
    expect(telemetryWorkflow).toBeDefined()
    const {IS_OTTOFELLER_TEMPLATES_TELEMETRY_COLLECTED} = YAML.parse(telemetryWorkflow).jobs.telemetry.env
    expect(IS_OTTOFELLER_TEMPLATES_TELEMETRY_COLLECTED).toBeTruthy()
  })

  test('sets up telemetry authorization', () => {
    const project = new TestProject({})
    const reportTargetAuthHeaderName = 'Some-Header'
    const reportTargetAuthTokenVar = 'Some-Secret'

    setupTelemetry(project, {
      isTelemetryEnabled: true,
      telemetryOptions: {
        reportTargetUrl: 'http://localhost:3000/telemetry',
        reportTargetAuthHeaderName,
        reportTargetAuthTokenVar,
      },
    })

    expect(project.reportTargetUrl).toBeDefined()
    expect(project.reportTargetAuthHeaderName).toBeDefined()

    const snapshot = synthSnapshot(project)
    const telemetryWorkflow = snapshot[telemetryWorkflowPath]
    expect(telemetryWorkflow).toBeDefined()
    const {env} = YAML.parse(telemetryWorkflow).jobs.telemetry
    expect(env[reportTargetAuthToken]).toEqual(`\${{ secrets.${reportTargetAuthTokenVar} }}`)
  })
})

class TestProject extends NodeProject implements IWithTelemetryReportUrl {
  readonly reportTargetUrl?: string
  readonly reportTargetAuthHeaderName?: string

  constructor(options: Partial<NodeProjectOptions & WithTelemetry> = {}) {
    super({
      ...options,
      name: 'test-project',
      defaultReleaseBranch: 'main',
    })
  }
}

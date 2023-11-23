import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {synthSnapshot} from 'projen/lib/util/synth'
import * as YAML from 'yaml'
import {IWithTelemetryReportUrl, WithTelemetry, setupTelemetry} from '..'
import {telemetryAuthToken} from '../collect-telemetry'

describe('setupTelemetry function', () => {
  const telemetryWorkflowPath = '.github/workflows/telemetry.yml'

  test('does nothing if telemetry options are not provided', () => {
    const project = new TestProject()
    setupTelemetry(project, {})
    expect(project.telemetryReportUrl).toBeUndefined()

    const snapshot = synthSnapshot(project)
    const telemetryWorkflow = snapshot[telemetryWorkflowPath]
    expect(telemetryWorkflow).toBeUndefined()
  })

  test('sets up telemetry if requested in options', () => {
    const project = new TestProject({})
    setupTelemetry(project, {isTelemetryEnabled: true, telemetryUrl: 'http://localhost:3000/telemetry'})
    expect(project.telemetryReportUrl).toBeDefined()

    const snapshot = synthSnapshot(project)
    const telemetryWorkflow = snapshot[telemetryWorkflowPath]
    expect(telemetryWorkflow).toBeDefined()
    const {IS_OTTOFELLER_TEMPLATES_TELEMETRY_COLLECTED} = YAML.parse(telemetryWorkflow).jobs.telemetry.env
    expect(IS_OTTOFELLER_TEMPLATES_TELEMETRY_COLLECTED).toBeTruthy()
  })

  test('sets up telemetry authorization', () => {
    const project = new TestProject({})
    const telemetryAuthHeader = 'Some-Header'
    const telemetryAuthTokenVar = 'Some-Secret'

    setupTelemetry(project, {
      isTelemetryEnabled: true,
      telemetryUrl: 'http://localhost:3000/telemetry',
      telemetryAuthHeader,
      telemetryAuthTokenVar,
    })

    expect(project.telemetryReportUrl).toBeDefined()
    expect(project.telemetryAuthHeader).toBeDefined()

    const snapshot = synthSnapshot(project)
    const telemetryWorkflow = snapshot[telemetryWorkflowPath]
    expect(telemetryWorkflow).toBeDefined()
    const {env} = YAML.parse(telemetryWorkflow).jobs.telemetry
    expect(env[telemetryAuthToken]).toEqual(`\${{ secrets.${telemetryAuthTokenVar} }}`)
  })
})

class TestProject extends NodeProject implements IWithTelemetryReportUrl {
  readonly telemetryReportUrl?: string
  readonly telemetryAuthHeader?: string

  constructor(options: Partial<NodeProjectOptions & WithTelemetry> = {}) {
    super({
      ...options,
      name: 'test-project',
      defaultReleaseBranch: 'main',
    })
  }
}

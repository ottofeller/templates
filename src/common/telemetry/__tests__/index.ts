import {JavaProject} from 'projen/lib/java'
import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {synthSnapshot} from 'projen/lib/util/synth'
import * as YAML from 'yaml'
import {IWithTelemetryReportUrl, WithTelemetry, setupTelemetry} from '..'
import {reportTargetAuthToken} from '../collect-telemetry'
import {TelemetryWorkflow} from '../telemetry-workflow'

const telemetryWorkflowPath = '.github/workflows/telemetry.yml'

describe('setupTelemetry function', () => {
  test('does nothing if telemetry options are not provided', () => {
    const project = new TestProject()
    setupTelemetry(project, {})
    expect(project.reportTargetUrl).toBeUndefined()

    const snapshot = synthSnapshot(project)
    const telemetryWorkflow = snapshot[telemetryWorkflowPath]
    expect(telemetryWorkflow).toBeUndefined()
  })

  describe('throws in case if unexpected usage', () => {
    test('if telemetryOptions are set without enabling telemetry', () => {
      const project = new TestProject()
      const telemetryOptions = {reportTargetUrl: 'http://localhost:3000/telemetry'}
      expect(() => setupTelemetry(project, {telemetryOptions})).toThrow()
    })

    test('if telemetry enabling without any options', () => {
      const project = new TestProject()
      expect(() => setupTelemetry(project, {isTelemetryEnabled: true})).toThrow()
    })

    test('if reportTargetAuthHeaderName set without reportTargetAuthTokenVar', () => {
      const project = new TestProject()

      const telemetryOptions = {
        reportTargetUrl: 'http://localhost:3000/telemetry',
        reportTargetAuthHeaderName: 'auth',
      }

      expect(() => setupTelemetry(project, {telemetryOptions})).toThrow()
    })

    test('if reportTargetAuthTokenVar set without reportTargetAuthHeaderName', () => {
      const project = new TestProject()

      const telemetryOptions = {
        reportTargetUrl: 'http://localhost:3000/telemetry',
        reportTargetAuthTokenVar: 'auth',
      }

      expect(() => setupTelemetry(project, {telemetryOptions})).toThrow()
    })
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

describe('TelemetryWorkflow', () => {
  test('throws for projects other than NodeProject', () => {
    const project = new JavaProject({name: 'java', groupId: 'java', artifactId: 'app', version: '0', github: true})
    expect(() => new TelemetryWorkflow(project.github!)).toThrow()
  })

  test('throws for projects without projenrc file', () => {
    const parent = new TestProject()
    const subproject = new TestProject({parent, name: 'subproject', outdir: 'sub'})
    expect(() => new TelemetryWorkflow(subproject.github!)).toThrow()
  })

  test('is not added to projects without github', () => {
    const project = new TestProject({github: false})
    TelemetryWorkflow.addToProject(project, {})
    const snapshot = synthSnapshot(project)
    expect(snapshot[telemetryWorkflowPath]).not.toBeDefined()
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

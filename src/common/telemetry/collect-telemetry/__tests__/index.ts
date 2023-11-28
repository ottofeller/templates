import {execSync} from 'child_process'
import {readFileSync} from 'fs'
import fetch, {RequestInfo, RequestInit, Response} from 'node-fetch'
import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {collectTelemetry} from '..'
import {IWithTelemetryReportUrl, WithTelemetry, setupTelemetry} from '../..'
import {TelemetryOptions} from '../../with-telemetry'
import {reportTargetAuthToken, telemetryEnableEnvVar} from '../collect-telemetry'

jest.mock('child_process')
jest.mock('node-fetch')

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readFileSync: jest.fn<string, [string, BufferEncoding]>(),
}))

describe('collectTelemetry function', () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- TS is not aware of the Jest mock, thus casting is needed
  const mockedNodeFetch = fetch as unknown as jest.Mock<Promise<Response>, [url: RequestInfo, init: RequestInit]>
  const telemetryOptions: TelemetryOptions = {reportTargetUrl: 'http://localhost:3000/telemetry'}
  const projectOptionsWithTelemetry: WithTelemetry = {isTelemetryEnabled: true, telemetryOptions}

  const mockStringify = jest.fn<
    string,
    [
      value: any,
      replacer?: (number | string)[] | null | ((this: any, key: string, value: any) => any),
      space?: string | number,
    ]
  >()

  const testStringifyValue = 'stringifiedPayload'
  JSON.stringify = mockStringify
  const fetchOptions = {method: 'post', body: testStringifyValue, headers: {}}
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- TS is not aware of the Jest mock, thus casting is needed
  const mockedExecSync = execSync as unknown as jest.Mock<string, [string]>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- TS is not aware of the Jest mock, thus casting is needed
  const mockedReadFileSync = readFileSync as unknown as jest.Mock<string, [string, BufferEncoding]>

  beforeEach(() => {
    Object.assign(process.env, {[telemetryEnableEnvVar]: '1'})
    mockStringify.mockReturnValue(testStringifyValue)
  })

  afterEach(() => {
    jest.resetAllMocks()
    delete process.env[telemetryEnableEnvVar]
  })

  test('does nothing if telemetryReportUrl not set', () => {
    const project = new TestProject()
    collectTelemetry(project)

    expect(mockedNodeFetch).not.toBeCalled()
  })

  test('does nothing if IS_OTTOFELLER_TEMPLATES_TELEMETRY_COLLECTED env var not set', () => {
    delete process.env[telemetryEnableEnvVar]
    const project = new TestProject(projectOptionsWithTelemetry)
    collectTelemetry(project)

    expect(mockedNodeFetch).not.toBeCalled()
  })

  test('sets auth header if it is defined in options', () => {
    const telemetryAuthHeader = 'Auth'
    const telemetryAuthTokenVar = 'TELEMETRY_TOKEN'
    const telemetryAuthTokenValue = 'some-token'
    Object.assign(process.env, {[reportTargetAuthToken]: telemetryAuthTokenValue})

    const project = new TestProject({
      ...projectOptionsWithTelemetry,
      telemetryOptions: {
        ...telemetryOptions,
        reportTargetAuthHeaderName: telemetryAuthHeader,
        reportTargetAuthTokenVar: telemetryAuthTokenVar,
      },
    })

    collectTelemetry(project)

    const headers = {[telemetryAuthHeader]: telemetryAuthTokenValue}
    expect(mockedNodeFetch).toHaveBeenCalledWith(telemetryOptions.reportTargetUrl, {...fetchOptions, headers})

    delete process.env[telemetryAuthHeader]
  })

  test('collects templates version', () => {
    const templateVersion = '1.1.0'

    const project = new TestProject({
      ...projectOptionsWithTelemetry,
      devDeps: [`@ottofeller/templates@${templateVersion}`],
    })

    collectTelemetry(project)

    expect(mockStringify).lastCalledWith(expect.objectContaining({templateVersion}))
    expect(mockedNodeFetch).toBeCalledWith(telemetryOptions.reportTargetUrl, fetchOptions)
  })

  test('collects git URLs', () => {
    const project = new TestProject(projectOptionsWithTelemetry)

    const gitUrlsRaw = [
      'origin  https://github.com/ottofeller/sampleProject.git (fetch)',
      'origin  https://github.com/ottofeller/sampleProject.git (push)',
    ].join('\n')

    mockedExecSync.mockReturnValue(gitUrlsRaw)
    collectTelemetry(project)

    const gitUrls = ['https://github.com/ottofeller/sampleProject.git']
    expect(mockStringify).lastCalledWith(expect.objectContaining({gitUrls}))
    expect(mockedNodeFetch).toBeCalledWith(telemetryOptions.reportTargetUrl, fetchOptions)
  })

  test('collects escape hatches utilized in projenrc file', () => {
    const project = new TestProject(projectOptionsWithTelemetry)

    const escapeHatches = {
      files: {
        tryFindFile: "'.eslintrc.json'",
        tryRemoveFile: "'.eslintrc.js'",
      },
      overrides: {
        addOverride: "'env.node', true",
        addDeletionOverride: ["'env.node'", "'env.browser'"],
        addToArray: "'plugins', 'react'",
        patch: "JsonPatch.add('/settings/tailwindcss/name', 'Ginger Nut')",
      },
      tasks: {
        addScripts: "{'hi-five': 'echo hello'}",
        addTask: ["'good-bye', {exec: 'echo bye'}", "'adios', {exec: 'echo adios'}"],
        tryFind: "'test'",
      },
    }

    const projenrcTs = [
      "import {OttofellerNextjsProject} from '@ottofeller/templates'",
      'const project = new OttofellerNextjsProject({})',
      `const eslintrc = project.tryFindFile(${escapeHatches.files.tryFindFile}) as unknown as ObjectFile`,
      `eslintrc.addOverride(${escapeHatches.overrides.addOverride})`,
      ...escapeHatches.overrides.addDeletionOverride.map((override) => `eslintrc.addDeletionOverride(${override})`),
      `eslintrc.addToArray(${escapeHatches.overrides.addToArray})`,
      `eslintrc.patch(${escapeHatches.overrides.patch})`,
      `project.tryRemoveFile(${escapeHatches.files.tryRemoveFile})`,
      `project.tasks.tryFind(${escapeHatches.tasks.tryFind})`,
      `project.addScripts(${escapeHatches.tasks.addScripts})`,
      ...escapeHatches.tasks.addTask.map((task) => `project.addTask(${task})`),
      'project.synth()',
    ].join('\n')

    mockedReadFileSync.mockReturnValue(projenrcTs)
    collectTelemetry(project)

    expect(mockStringify).lastCalledWith(expect.objectContaining({escapeHatches}))
    expect(mockedNodeFetch).toBeCalledWith(telemetryOptions.reportTargetUrl, fetchOptions)
  })

  test('does not collect empty escape hatches', () => {
    const project = new TestProject(projectOptionsWithTelemetry)
    // NOTE: Only this single item will be recorded
    const escapeHatches = {files: {tryFindFile: "'.eslintrc.json'"}}

    const projenrcTs = [
      "import {OttofellerNextjsProject} from '@ottofeller/templates'",
      'const project = new OttofellerNextjsProject({})',
      `const eslintrc = project.tryFindFile(${escapeHatches.files.tryFindFile}) as unknown as ObjectFile`,
      'project.synth()',
    ].join('\n')

    mockedReadFileSync.mockReturnValue(projenrcTs)
    collectTelemetry(project)

    expect(mockStringify).toHaveBeenLastCalledWith(expect.objectContaining({escapeHatches}))
    expect(mockedNodeFetch).toHaveBeenLastCalledWith(telemetryOptions.reportTargetUrl, fetchOptions)
  })

  test('collects GitHub workflow data', () => {
    const project = new TestProject(projectOptionsWithTelemetry)
    const updatedWorkflowName = 'build'
    const updatedTrigger = {fork: {}}
    project.github!.tryFindWorkflow(updatedWorkflowName)!.on(updatedTrigger)
    collectTelemetry(project)

    const telemetryWorkflow = {
      actions: {actions: new Map()},
      events: {
        pullRequest: {
          paths: ['.projenrc.js'],
          types: ['opened', 'synchronize'],
        },
      },
      jobs: {
        telemetry: {
          env: {IS_OTTOFELLER_TEMPLATES_TELEMETRY_COLLECTED: '1'},
          permissions: {contents: 'read'},
          runsOn: ['ubuntu-latest'],
          steps: [
            {
              uses: 'actions/checkout@v3',
              with: {'fetch-depth': 0},
            },
            {
              uses: 'actions/setup-node@v3',
              with: {'node-version': 18},
            },
            {
              id: 'cache-deps',
              name: 'Cache node_modules',
              uses: 'actions/cache@v3',
              with: {
                key: "${{ hashFiles('./yarn.lock') }}",
                path: './node_modules',
              },
            },
            {
              if: "${{ steps.cache-deps.outputs.cache-hit != 'true' }}",
              name: 'Install dependencies',
              run: 'yarn install --check-files --frozen-lockfile',
            },
            {
              name: 'Execute the command',
              run: 'yarn run default',
            },
          ],
        },
      },
      name: 'telemetry',
      projenCredentials: {
        options: {
          setupSteps: [],
          tokenRef: '${{ secrets.PROJEN_GITHUB_TOKEN }}',
        },
      },
    }

    const workflows = {
      new: [telemetryWorkflow],
      updated: [{events: updatedTrigger, name: updatedWorkflowName}],
    }

    expect(mockStringify).lastCalledWith(expect.objectContaining({workflows}))
    expect(mockedNodeFetch).toBeCalledWith(telemetryOptions.reportTargetUrl, fetchOptions)
  })

  describe('collects errors', () => {
    test('if failed to collect git URLs', () => {
      const project = new TestProject(projectOptionsWithTelemetry)
      mockedReadFileSync.mockReturnValue('')
      collectTelemetry(project)

      const errors: unknown[] = [
        // undefined returned from execSync mock in gitUrls
        new TypeError("Cannot read properties of undefined (reading 'split')"),
      ]

      expect(mockStringify).lastCalledWith(expect.objectContaining({errors}))
      expect(mockedNodeFetch).toBeCalledWith(telemetryOptions.reportTargetUrl, fetchOptions)
    })

    test('if failed to read projenrc file', () => {
      const project = new TestProject(projectOptionsWithTelemetry)
      mockedExecSync.mockReturnValue('')
      collectTelemetry(project)

      const errors: unknown[] = [
        // undefined returned from readFileSync mock in escape hatches
        new TypeError("Cannot read properties of undefined (reading 'matchAll')"),
      ]

      expect(mockStringify).lastCalledWith(expect.objectContaining({errors}))
      expect(mockedNodeFetch).toBeCalledWith(telemetryOptions.reportTargetUrl, fetchOptions)
    })
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
      licensed: false, // NOTE License component interferes with readFileSync mock
    })

    setupTelemetry(this, options)
  }
}

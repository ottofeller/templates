import {NodePackageManager, NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {job, npmRunJobStep, runScriptJob, setupNode} from '..'

describe('GitHub utils', () => {
  test('job function creates a job object', () => {
    const steps = [
      {name: 'first step', run: 'node firstStep.js'},
      {name: 'second step', run: 'node secondStep.js'},
    ]

    const jobObject = job(steps)

    expect(jobObject).toStrictEqual({
      runsOn: ['ubuntu-latest'],
      permissions: {contents: 'read'},
      steps,
    })
  })

  describe('npmRunJobStep function', () => {
    const command = 'command'

    test('creates a job object with undefined directory field', () => {
      const jobObject = npmRunJobStep(command)

      expect(jobObject).toStrictEqual({
        uses: 'ottofeller/github-actions/npm-run@main',
        with: {'node-version': 18, command: `npm run ${command}`, directory: undefined},
      })
    })

    test('creates a job object with the directory specified', () => {
      const directory = 'testDir'
      const jobObject = npmRunJobStep(command, directory)

      expect(jobObject).toStrictEqual({
        uses: 'ottofeller/github-actions/npm-run@main',
        with: {'node-version': 18, command: `npm run ${command}`, directory},
      })
    })
  })

  describe('setupNode function', () => {
    test('creates an array of job steps setting up node.js', () => {
      const project = new TestProject()
      const setupNodeSteps = setupNode({projectPackage: project.package})

      expect(setupNodeSteps.map((step) => step.uses)).toStrictEqual([
        'actions/checkout@v3',
        'actions/setup-node@v3',
        'actions/cache@v3',
        undefined,
      ])

      expect(setupNodeSteps.map((step) => step.run)).toStrictEqual([undefined, undefined, undefined, 'npm ci'])
    })

    test('allows setting ref', () => {
      const ref = 'testRef'
      const project = new TestProject()

      const setupNodeSteps = setupNode({
        projectPackage: project.package,
        ref,
      })

      const checkoutStep = setupNodeSteps[0]
      expect(checkoutStep.with!.ref).toEqual(ref)
    })

    test('allows setting nodeVersion', () => {
      const nodeVersion = 20
      const project = new TestProject()

      const setupNodeSteps = setupNode({
        projectPackage: project.package,
        nodeVersion,
      })

      const setupNodeStep = setupNodeSteps[1]
      expect(setupNodeStep.with!['node-version']).toEqual(nodeVersion)
    })

    test('allows setting registryUrl', () => {
      const registryUrl = 'testRegistryUrl'
      const project = new TestProject()

      const setupNodeSteps = setupNode({
        projectPackage: project.package,
        registryUrl,
      })

      const setupNodeStep = setupNodeSteps[1]
      expect(setupNodeStep.with!['registry-url']).toEqual(registryUrl)
    })

    test('allows setting scope', () => {
      const scope = 'testScope'
      const project = new TestProject()

      const setupNodeSteps = setupNode({
        projectPackage: project.package,
        scope,
      })

      const setupNodeStep = setupNodeSteps[1]
      expect(setupNodeStep.with!.scope).toEqual(scope)
    })

    test('allows setting workingDirectory', () => {
      const workingDirectory = 'testDir'
      const project = new TestProject()

      const setupNodeSteps = setupNode({
        projectPackage: project.package,
        workingDirectory,
      })

      const workingDirectories = setupNodeSteps.map((step) => step.workingDirectory)
      expect(workingDirectories).toEqual([undefined, undefined, undefined, workingDirectory])
    })

    test('allows setting projectPackage to pnpm', () => {
      const project = new TestProject({packageManager: NodePackageManager.PNPM})
      const setupNodeSteps = setupNode({projectPackage: project.package})

      expect(setupNodeSteps.map((step) => step.uses)).toStrictEqual([
        'actions/checkout@v3',
        'actions/setup-node@v3',
        'pnpm/action-setup@v2',
        undefined,
        'actions/cache@v3',
        undefined,
      ])

      expect(setupNodeSteps.map((step) => step.run)).toStrictEqual([
        undefined,
        undefined,
        undefined,
        'echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT',
        undefined,
        'pnpm i --frozen-lockfile',
      ])
    })

    test('allows setting pnpm version', () => {
      const pnpmVersion = '8.6.5'
      const project = new TestProject({packageManager: NodePackageManager.PNPM, pnpmVersion})
      const setupNodeSteps = setupNode({projectPackage: project.package})
      const pnpmSetupStep = setupNodeSteps.find((step) => step.uses === 'pnpm/action-setup@v2')
      expect(pnpmSetupStep).toBeDefined()
      expect(pnpmSetupStep!.with!.version).toEqual(pnpmVersion)
    })
  })

  describe('runScriptJob function', () => {
    const command = 'testCommand'

    test('creates a job object with default setup', () => {
      const project = new TestProject()

      const jobObject = runScriptJob({
        command,
        projectPackage: project.package,
        runScriptCommand: project.runScriptCommand,
      })

      expect(jobObject.steps.at(-1)!.uses).toEqual(undefined)
      expect(jobObject.steps.at(-1)!.run).toEqual(`npm run ${command}`)
    })

    test('allows setting runsOn', () => {
      const runsOn = ['osx']
      const project = new TestProject()

      const jobObject = runScriptJob({
        command,
        projectPackage: project.package,
        runScriptCommand: project.runScriptCommand,
        runsOn,
      })

      expect(jobObject.runsOn).toEqual(runsOn)
    })

    test('allows setting workingDirectory', () => {
      const workingDirectory = 'testDir'
      const project = new TestProject()

      const jobObject = runScriptJob({
        command,
        projectPackage: project.package,
        runScriptCommand: project.runScriptCommand,
        workingDirectory,
      })

      expect(jobObject.steps.at(-1)!.workingDirectory).toEqual(workingDirectory)
    })

    test('allows setting projectPackage to pnpm', () => {
      const project = new TestProject({packageManager: NodePackageManager.PNPM})

      const jobObject = runScriptJob({
        command,
        projectPackage: project.package,
        runScriptCommand: project.runScriptCommand,
      })

      expect(jobObject.steps.at(-1)!.run).toEqual(`pnpm run ${command}`)
    })
  })
})

class TestProject extends NodeProject {
  constructor(options: Partial<NodeProjectOptions> = {}) {
    super({
      ...options,
      name: 'test-project',
      defaultReleaseBranch: 'main',
      github: true,
      packageManager: options.packageManager ?? NodePackageManager.NPM,
    })
  }
}

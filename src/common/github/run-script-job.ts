import type {Job, JobStep} from 'projen/lib/github/workflows-model'
import {NodePackage, NodePackageManager} from 'projen/lib/javascript'
import {job} from './job'

export interface RunScriptJobProps {
  /**
   * Script name to run. E.g. command === "build" will result in "npm run build"
   */
  readonly command: string

  /**
   * Version Spec of the version to use. Examples: 12.x, 10.15.1, >=10.15.0
   * @default 16
   */
  readonly nodeVersion?: number | string

  /**
   * Node package definition.
   */
  readonly projectPackage: NodePackage

  /**
   * Git reference used in checkout action.
   * When checking out the repository that triggered a workflow,
   * this defaults to the reference or SHA for that event.
   * Otherwise, uses the default branch.
   */
  readonly ref?: string

  /**
   * Optional registry to set up for auth.
   * Will set the registry in a project level .npmrc and .yarnrc file,
   * and set up auth to read in from env.NODE_AUTH_TOKEN.
   */
  readonly registryUrl?: string

  /**
   * The command to use to run the script (e.g. `yarn run` or `npm run` depending on the package manager).
   */
  readonly runScriptCommand: string

  /**
   * @param runsOn An array of one or more types of machine to run the job on.
   */
  readonly runsOn?: string[]

  /**
   * Optional scope for authenticating against scoped registries.
   */
  readonly scope?: string

  /**
   * A working directory to all steps (the folder containing package.json with the script to run).
   * @default ./
   */
  readonly workingDirectory?: string
}

/**
 * Create GitHub workflow job which runs a node.js script with a given setup.
 */
export const runScriptJob = ({
  command,
  nodeVersion = 16,
  projectPackage,
  registryUrl,
  runScriptCommand,
  ref,
  runsOn,
  scope,
  workingDirectory,
}: RunScriptJobProps): Job => {
  const {installCommand, lockFile, packageManager} = projectPackage
  const isPnpm = packageManager === NodePackageManager.PNPM
  const directory = workingDirectory || '.'

  // ANCHOR Basic setup: checkout and node
  const steps: Array<JobStep> = [
    {uses: 'actions/checkout@v3', with: {'fetch-depth': 0, ref}, workingDirectory},
    {
      uses: 'actions/setup-node@v3',
      with: {'node-version': nodeVersion, 'registry-url': registryUrl, scope},
      workingDirectory,
    },
  ]

  // ANCHOR Dependencies with cache
  if (isPnpm) {
    steps.push(
      {
        uses: 'pnpm/action-setup@v2',
        name: 'Install pnpm',
        id: 'pnpm-install',
        with: {version: 7, run_install: false},
      },
      {
        name: 'Get pnpm store directory',
        id: 'pnpm-cache-path',
        run: 'echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT',
      },
    )
  }

  const cachePath = isPnpm ? '${{ steps.pnpm-cache-path.outputs.STORE_PATH }}' : `${directory}/node_modules`

  steps.push(
    {
      id: 'cache-deps',
      name: 'Cache node_modules',
      uses: 'actions/cache@v3',
      with: {key: `\${{ hashFiles('${directory}/${lockFile}') }}`, path: cachePath},
      workingDirectory,
    },
    {
      // NOTE: For PNPM we need to install deps from the store.
      if: isPnpm ? undefined : `\${{ steps.cache-deps.outputs.cache-hit != 'true' }}`,
      name: 'Install dependencies',
      run: installCommand,
      workingDirectory,
    },
  )

  // ANCHOR Execute the command
  steps.push({name: 'Execute the command', run: `${runScriptCommand} ${command}`, workingDirectory})

  return job(steps, runsOn)
}

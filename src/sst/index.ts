import {execSync} from 'child_process'
import * as path from 'path'
import {SampleFile} from 'projen'
import {DependabotScheduleInterval} from 'projen/lib/github'
import {NodePackageManager} from 'projen/lib/javascript'
import {TypeScriptAppProject, TypeScriptProjectOptions} from 'projen/lib/typescript'
import {addTaskOrScript, renderReadme} from '../common'
import {WithGitHooks, addHusky, extendGitignore} from '../common/git'
import {
  CodeOwners,
  ProjenDriftCheckWorkflow,
  ReleaseWorkflow,
  TypeScriptTestWorkflow,
  WithCodeOwners,
  WithDefaultWorkflow,
} from '../common/github'
import {WithCustomLintPaths, addLinters} from '../common/lint'
import {IWithTelemetryReportUrl, WithTelemetry, collectTelemetry, setupTelemetry} from '../common/telemetry'
import {addVsCode} from '../common/vscode-settings'

export interface OttofellerSSTProjectOptions
  extends TypeScriptProjectOptions,
    WithCodeOwners,
    WithDefaultWorkflow,
    WithCustomLintPaths,
    WithGitHooks,
    WithTelemetry {
  /**
   * The base version of the very first release.
   *
   * @default 0.0.1
   */
  readonly initialReleaseVersion?: string
}

/**
 * SST template.
 *
 * @pjid ottofeller-sst
 */
export class OttofellerSSTProject extends TypeScriptAppProject implements IWithTelemetryReportUrl {
  readonly reportTargetUrl?: string
  readonly reportTargetAuthHeaderName?: string

  constructor(options: OttofellerSSTProjectOptions) {
    const name = 'sst'

    super({
      // Default options
      packageManager: options.packageManager ?? NodePackageManager.NPM,
      minNodeVersion: '20.0.0',
      tsconfig: {compilerOptions: {paths: {'*': ['./src/*']}, target: 'es6', skipLibCheck: true}},
      dependabot: (options.github ?? true) && (options.dependabot ?? true),
      dependabotOptions: {scheduleInterval: DependabotScheduleInterval.WEEKLY},
      readme: renderReadme(name),

      // In case Github is enabled remove all default stuff.
      githubOptions: {mergify: false, pullRequestLint: false},
      buildWorkflow: false,
      release: false,
      depsUpgrade: false,
      pullRequestTemplate: false,

      // Allow changing default options
      ...options,

      // Non-changeable options
      defaultReleaseBranch: 'main',
      eslint: false,
      jest: false,
      name,
      projenrcJs: false,
      projenrcTs: true,
      sampleCode: false,
    })

    // ANCHOR Install dependencies
    this.addDevDeps('sst', 'aws-cdk-lib', 'constructs')

    /*
     * Clean off the projen tasks and if needed replace them with regular npm scripts.
     * This way we ensure smooth ejection experience with all the commands visible in package.json
     * and no need to keep the projen task runner within an ejected project.
     */
    this.removeTask('build')
    this.removeTask('clobber')
    this.removeTask('compile')
    this.removeTask('package')
    this.removeTask('post-compile')
    this.removeTask('pre-compile')
    this.removeTask('test')
    this.removeTask('watch')

    addTaskOrScript(this, 'build', {exec: 'sst build'})
    addTaskOrScript(this, 'console', {exec: 'sst console'})
    addTaskOrScript(this, 'deploy', {exec: 'sst deploy'})
    addTaskOrScript(this, 'dev', {exec: 'sst dev'})
    addTaskOrScript(this, 'remove', {exec: 'sst remove'})

    // ANCHOR Setup git hooks with Husky
    if (options.hasGitHooks ?? false) {
      addHusky(this, options)
    }

    // ANCHOR ESLint and prettier setup
    const lintPaths = options.lintPaths ?? ['stacks', 'sst.config.ts']
    addLinters({project: this, lintPaths})

    // ANCHOR Github
    const hasDefaultGithubWorkflows = options.hasDefaultGithubWorkflows ?? true

    if (hasDefaultGithubWorkflows && this.github) {
      const initialReleaseVersion = options.initialReleaseVersion ?? '0.0.1'
      new ReleaseWorkflow(this.github, {initialReleaseVersion})
      TypeScriptTestWorkflow.addToProject(this, {...options, isLighthouseEnabled: false})
      ProjenDriftCheckWorkflow.addToProject(this, options)
    }

    CodeOwners.addToProject(this, options)

    // ANCHOR VSCode settings
    addVsCode(this)

    // ANCHOR gitignore
    extendGitignore(this)
    extendGitignore(this, ['node_modules', '.sst', '.build', '.open-next'])

    // ANCHOR SST config
    const assetsDir = path.join(__dirname, '..', '..', 'src/sst/assets')
    new SampleFile(this, 'sst.config.ts', {sourcePath: path.join(assetsDir, 'sst.config.ts.sample')})

    // ANCHOR Telemetry
    setupTelemetry(this, options)
  }

  postSynthesize(): void {
    /*
     * The `.projenrc.ts` file is created by projen and its formatting is not controlled.
     * Therefore an additional formatting step is required after project initialization.
     */
    execSync('prettier --write .projenrc.ts')
    execSync('eslint --fix .projenrc.ts')

    collectTelemetry(this)
  }
}

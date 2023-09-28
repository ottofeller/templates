import {execSync} from 'child_process'
import * as projen from 'projen'
import {AwsCdkTypeScriptApp, AwsCdkTypeScriptAppOptions} from 'projen/lib/awscdk'
import {NodePackageManager} from 'projen/lib/javascript'
import {WithGitHooks, addHusky, extendGitignore} from '../common/git'
import {PullRequestTest, ReleaseWorkflow, WithDefaultWorkflow} from '../common/github'
import {WithCustomLintPaths, addLinters} from '../common/lint'
import {IWithTelemetryReportUrl, collectTelemetry, setupTelemetry} from '../common/telemetry'
import {addVsCode} from '../common/vscode-settings'

export interface OttofellerCDKProjectOptions
  extends AwsCdkTypeScriptAppOptions,
    WithDefaultWorkflow,
    WithCustomLintPaths,
    WithGitHooks {
  /**
   * The base version of the very first release.
   *
   * @default 0.0.1
   */
  readonly initialReleaseVersion?: string
}

/**
 * AWS CDK template.
 *
 * @pjid ottofeller-cdk
 */
export class OttofellerCDKProject extends AwsCdkTypeScriptApp implements IWithTelemetryReportUrl {
  public readonly initialReleaseVersion: string = '0.0.1'
  readonly telemetryReportUrl?: string

  constructor(options: OttofellerCDKProjectOptions) {
    super({
      // Default options
      packageManager: options.packageManager ?? NodePackageManager.NPM,
      tsconfig: {compilerOptions: {paths: {'*': ['./src/*']}, target: 'es6'}},
      sampleCode: false,
      eslint: false,
      jest: false,
      dependabot: (options.github ?? true) && (options.dependabot ?? true),
      dependabotOptions: {scheduleInterval: projen.github.DependabotScheduleInterval.WEEKLY},

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
      name: 'cdk',
      projenrcTs: true,
      projenrcJs: false,
    })

    this.initialReleaseVersion = options.initialReleaseVersion || this.initialReleaseVersion

    // ANCHOR Install dependencies
    this.addDeps('cdk-nag@2')

    /*
     * Clean off the projen tasks and if needed replace them with regular npm scripts.
     * This way we ensure smooth ejection experience with all the commands visible in package.json
     * and no need to keep the projen task runner within an ejected project.
     */
    // NOTE For dependent tasks the order of deletion matters, so be cautious.
    this.removeTask('build')
    this.removeTask('clobber')
    this.removeTask('compile')
    this.removeTask('deploy')
    this.removeTask('destroy')
    this.removeTask('diff')
    this.removeTask('package')
    this.removeTask('post-compile')
    this.removeTask('pre-compile')
    this.removeTask('synth')
    this.removeTask('synth:silent')
    this.removeTask('watch')

    this.addScripts({
      build: `${this.ejected ? '' : 'npm run default '}npm run synth:silent`,
      deploy: 'cdk deploy',
      destroy: 'cdk destroy',
      diff: 'cdk diff',
      synth: 'cdk synth',
      'synth:silent': 'cdk synth -q',
      watch: 'cdk deploy --hotswap && cdk watch',
    })

    // Manage test task separately - delete it only if jest is disabled
    if (!this.jest) {
      this.removeTask('test')
    }

    // ANCHOR Setup git hooks with Husky
    if (options.hasGitHooks ?? false) {
      addHusky(this, options)
    }

    // ANCHOR ESLint and prettier setup
    const lintPaths = options.lintPaths ?? ['.projenrc.ts', 'src']
    addLinters({project: this, lintPaths})

    // ANCHOR Github
    const hasDefaultGithubWorkflows = options.hasDefaultGithubWorkflows ?? true

    if (hasDefaultGithubWorkflows && this.github) {
      new ReleaseWorkflow(this.github, {initialReleaseVersion: this.initialReleaseVersion})
      PullRequestTest.addToProject(this, {...options, isLighthouseEnabled: false})
    }

    // ANCHOR VSCode settings
    addVsCode(this)

    // ANCHOR gitignore
    extendGitignore(this)

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

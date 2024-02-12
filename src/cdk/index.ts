import {execSync} from 'child_process'
import * as path from 'path'
import * as projen from 'projen'
import {AwsCdkTypeScriptApp, AwsCdkTypeScriptAppOptions} from 'projen/lib/awscdk'
import {NodePackageManager} from 'projen/lib/javascript'
import {AssetFile, addTaskOrScript} from '../common'
import {WithGitHooks, addHusky, extendGitignore} from '../common/git'
import {
  CodeOwners,
  ProjenDriftCheckWorkflow,
  ReleaseWorkflow,
  RustTestWorkflow,
  TypeScriptTestWorkflow,
  WithCodeOwners,
  WithDefaultWorkflow,
  WithRustTestWorkflow,
} from '../common/github'
import {WithCustomLintPaths, addLinters} from '../common/lint'
import {IWithTelemetryReportUrl, WithTelemetry, collectTelemetry, setupTelemetry} from '../common/telemetry'
import {addVsCode} from '../common/vscode-settings'

export interface OttofellerCDKProjectOptions
  extends AwsCdkTypeScriptAppOptions,
    WithCodeOwners,
    WithDefaultWorkflow,
    WithRustTestWorkflow,
    WithCustomLintPaths,
    WithGitHooks,
    WithTelemetry {
  /**
   * The base version of the very first release.
   *
   * @default 0.0.1
   */
  readonly initialReleaseVersion?: string

  /**
   * Set up GraphQL dependencies and supplementary script.
   *
   * @default false
   */
  readonly isGraphqlCodegenEnabled?: boolean
}

/**
 * AWS CDK template.
 *
 * @pjid ottofeller-cdk
 */
export class OttofellerCDKProject extends AwsCdkTypeScriptApp implements IWithTelemetryReportUrl {
  public readonly initialReleaseVersion: string = '0.0.1'
  readonly reportTargetUrl?: string
  readonly reportTargetAuthHeaderName?: string

  constructor(options: OttofellerCDKProjectOptions) {
    const srcdir = options.srcdir ?? 'src'
    const jest = options.jest ?? false

    super({
      // Default options
      appEntrypoint: options.appEntrypoint ?? 'index.ts',
      packageManager: options.packageManager ?? NodePackageManager.NPM,
      tsconfig: {compilerOptions: {paths: {'*': [`./${srcdir}/*`]}, target: 'es6', skipLibCheck: true}},
      sampleCode: false,
      eslint: false,
      jest,
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

    addTaskOrScript(this, 'build', {exec: `${this.ejected ? '' : 'npm run default && '}npm run synth:silent`})
    addTaskOrScript(this, 'deploy', {exec: 'cdk deploy'})
    addTaskOrScript(this, 'destroy', {exec: 'cdk destroy'})
    addTaskOrScript(this, 'diff', {exec: 'cdk diff'})
    addTaskOrScript(this, 'synth', {exec: 'cdk synth'})
    addTaskOrScript(this, 'synth:silent', {exec: 'cdk synth -q'})
    addTaskOrScript(this, 'watch', {exec: 'cdk deploy --hotswap && cdk watch'})

    // Manage test task separately - delete it only if jest is disabled
    if (!this.jest) {
      this.removeTask('test')
    }

    // ANCHOR Setup git hooks with Husky
    if (options.hasGitHooks ?? false) {
      addHusky(this, options)
    }

    // ANCHOR ESLint and prettier setup
    const lintPaths = options.lintPaths ?? ['src']
    addLinters({project: this, lintPaths})

    // ANCHOR Github
    const hasDefaultGithubWorkflows = options.hasDefaultGithubWorkflows ?? true

    if (hasDefaultGithubWorkflows && this.github) {
      new ReleaseWorkflow(this.github, {initialReleaseVersion: this.initialReleaseVersion})
      TypeScriptTestWorkflow.addToProject(this, {...options, jest, isLighthouseEnabled: false})
      ProjenDriftCheckWorkflow.addToProject(this, options)
    }

    RustTestWorkflow.addToProject(this, options)
    CodeOwners.addToProject(this, options)

    // ANCHOR Set up GraphQL
    const isGraphqlCodegenEnabled = options.isGraphqlCodegenEnabled ?? false

    if (isGraphqlCodegenEnabled) {
      this.addDevDeps(
        '@graphql-codegen/add',
        '@graphql-codegen/cli',
        '@graphql-codegen/named-operations-object',
        '@graphql-codegen/typescript-graphql-request',
        '@graphql-codegen/typescript-operations',
        '@graphql-codegen/typescript',
      )

      this.addDeps('graphql')

      // ANCHOR Codegen
      const codegenPath = path.join(__dirname, '..', '..', 'src/cdk/assets/codegen.ts')
      new AssetFile(this, 'codegen.ts', {sourcePath: codegenPath, readonly: false, marker: false})

      addTaskOrScript(this, 'generate-graphql-schema', {exec: 'npx apollo schema:download'})
      addTaskOrScript(this, 'gql-to-ts', {exec: 'graphql-codegen -r dotenv/config --config codegen.ts'})
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

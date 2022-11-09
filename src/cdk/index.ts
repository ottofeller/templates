/* eslint-disable import/no-relative-parent-imports -- JSII project rewrites tsconfig thus always overriding introduced aliases */
import * as projen from 'projen'
import {AwsCdkTypeScriptApp, AwsCdkTypeScriptAppOptions} from 'projen/lib/awscdk'
import {NodePackageManager} from 'projen/lib/javascript'
import {PullRequestTest, ReleaseWorkflow} from '../common/github'
import {VsCodeSettings} from '../common/vscode-settings'

export interface OttofellerCDKProjectOptions extends AwsCdkTypeScriptAppOptions {
  /**
   * The base version of the very first release.
   *
   * @default 0.0.1
   */
  readonly initialReleaseVersion?: string
  readonly hasDefaultGithubWorkflows?: boolean
}

/**
 * AWS CDK template.
 *
 * @pjid ottofeller-cdk
 */
export class OttofellerCDKProject extends AwsCdkTypeScriptApp {
  public readonly initialReleaseVersion: string = '0.0.1'

  constructor(options: OttofellerCDKProjectOptions) {
    super({
      // Default options
      packageManager: NodePackageManager.NPM,
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

    // ANCHOR Scripts
    this.setScript('format', 'ofmt .projenrc.ts && ofmt src')
    this.setScript('lint', 'ofmt --lint .projenrc.ts && ofmt --lint src && olint src .projenrc.ts')
    this.setScript('typecheck', 'tsc --noEmit --project tsconfig.dev.json')

    // ANCHOR Install ofmt
    this.addDevDeps(
      '@ottofeller/eslint-config-ofmt@1.4.3',
      '@ottofeller/ofmt@1.4.3',
      '@ottofeller/prettier-config-ofmt@1.4.3',
    )

    // ANCHOR Install dependencies
    this.addDeps('cdk-nag@2.15.45')

    // ANCHOR Github
    const hasDefaultGithubWorkflows = options.hasDefaultGithubWorkflows ?? true
    if (hasDefaultGithubWorkflows && this.github) {
      new ReleaseWorkflow(this.github, {initlaReleaseVersion: this.initialReleaseVersion})
      new PullRequestTest(this.github)
    }

    // ANCHOR VSCode settings
    VsCodeSettings.addToProject(this)

    VsCodeSettings.of(this)?.add({
      'eslint.useESLintClass': true,
      'eslint.options': {cache: true, reportUnusedDisableDirectives: 'error'},
    })
  }
}

/* eslint-disable import/no-relative-parent-imports -- JSII project rewrites tsconfig thus always overriding introduced aliases */
import * as projen from 'projen'
import {NodePackageManager} from 'projen/lib/javascript'
import {AwsCdkTypeScriptApp, AwsCdkTypeScriptAppOptions} from 'projen/lib/awscdk'
import {VsCodeSettings} from '../common/vscode-settings'

/**
 * AWS CDK template.
 *
 * @pjid ottofeller-cdk
 */
export class OttofellerCDKProject extends AwsCdkTypeScriptApp {
  constructor(options: AwsCdkTypeScriptAppOptions) {
    super({
      ...options,
      projenrcTs: true,
      projenrcJs: false,
      defaultReleaseBranch: 'main',
      name: 'cdk',
      packageManager: NodePackageManager.NPM,
      tsconfig: {compilerOptions: {paths: {'*': ['./src/*']}, target: 'es6'}},
      sampleCode: false,
      eslint: false,
      jest: false,
      dependabot: true,
      dependabotOptions: {scheduleInterval: projen.github.DependabotScheduleInterval.WEEKLY},

      scripts: {
        format: 'ofmt .projenrc.ts && ofmt src',
        lint: 'ofmt --lint .projenrc.ts && ofmt --lint src && olint src .projenrc.ts',
        typecheck: 'tsc --noEmit --project tsconfig.dev.json',
      },

      // Enable Github but remove all default stuff.
      github: true,

      githubOptions: {mergify: false, pullRequestLint: false},
      buildWorkflow: false,
      release: false,
      depsUpgrade: false,
      pullRequestTemplate: false,
    })

    // ANCHOR Install ofmt
    this.addDevDeps(
      '@ottofeller/eslint-config-ofmt@1.3.6',
      '@ottofeller/ofmt@1.3.6',
      '@ottofeller/prettier-config-ofmt@1.3.6',
    )

    // ANCHOR VSCode settings
    VsCodeSettings.addToProject(this)

    VsCodeSettings.of(this)?.add({
      'editor.codeActionsOnSave': {'source.fixAll': true},
      'eslint.useESLintClass': true,
      'eslint.options': {cache: true, reportUnusedDisableDirectives: 'error'},
    })

    VsCodeSettings.of(this)?.add({
      'editor.codeActionsOnSave': {'source.organizeImports': true},
      'editor.formatOnSave': true,
      '[json]': {'editor.defaultFormatter': 'esbenp.prettier-vscode'},
      '[jsonc]': {'editor.defaultFormatter': 'esbenp.prettier-vscode'},
      '[yaml]': {'editor.defaultFormatter': 'esbenp.prettier-vscode'},
      '[typescript]': {'editor.defaultFormatter': 'esbenp.prettier-vscode'},
      '[javascript]': {'editor.defaultFormatter': 'esbenp.prettier-vscode'},
      '[svg]': {'editor.defaultFormatter': 'esbenp.prettier-vscode'},
      '[xml]': {'editor.defaultFormatter': 'esbenp.prettier-vscode'},
      'prettier.documentSelectors': ['**/*.svg'],
    })
  }
}

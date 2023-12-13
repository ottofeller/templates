import * as path from 'path'
import {NodePackageManager} from 'projen/lib/javascript'
import {TypeScriptProject, TypeScriptProjectOptions} from 'projen/lib/typescript'
import {
  IWithTelemetryReportUrl,
  WithCustomLintPaths,
  WithDefaultWorkflow,
  WithGitHooks,
  WithTelemetry,
  collectTelemetry,
} from '../common'
import {sampleCode} from './sample-code'

export interface OttofellerBackendTestProjectOptions
  extends TypeScriptProjectOptions,
    WithTelemetry,
    WithGitHooks,
    WithCustomLintPaths,
    WithDefaultWorkflow {}

/**
 * Backend-test template with TypeScript support.
 *
 * @pjid ottofeller-backend-test
 */

export class OttofellerBackendTestProject extends TypeScriptProject implements IWithTelemetryReportUrl {
  readonly reportTargetUrl?: string
  readonly reportTargetAuthHeaderName?: string

  constructor(options: OttofellerBackendTestProjectOptions) {
    super({
      ...options,
      bundlerOptions: {},
      jest: true,
      eslint: false,
      projenrcTs: true,
      projenrcJs: false,
      name: 'backend-test',
      packageManager: options.packageManager ?? NodePackageManager.NPM,
      srcdir: options.srcdir ?? '.',

      tsconfig: {
        compilerOptions: {
          target: 'esnext',
          module: 'esnext',
          noEmit: true,
          isolatedModules: false,
          strict: true,
          noImplicitAny: true,
          strictNullChecks: true,
          strictPropertyInitialization: true,
          noImplicitThis: true,
          alwaysStrict: true,
          noUnusedParameters: true,
          noImplicitReturns: true,
          noFallthroughCasesInSwitch: true,
          noUncheckedIndexedAccess: true,
          baseUrl: './',
          paths: {
            '*': ['./*'],
          },
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
        },
      },

      // In case Github is enabled remove all default stuff.
      githubOptions: {mergify: false, pullRequestLint: false},
      buildWorkflow: false,
      release: false,
      depsUpgrade: false,
      pullRequestTemplate: false,
    })

    // ANCHOR Source code
    const assetsDir = path.join(__dirname, '..', '..', 'src/backend-test/assets')
    sampleCode(this, options, assetsDir)

    // // ANCHOR playwright config
    // new SampleFile(this, 'playwright.config.ts', {sourcePath: path.join(assetsDir, 'playwright.config.ts.sample')})

    this.addScripts({
      test: 'jest --detectOpenHandles',
    })

    /*
     * Clean off the projen tasks and if needed replace them with regular npm scripts.
     * This way we ensure smooth ejection experience with all the commands visible in package.json
     * and no need to keep the projen task runner within an ejected project.
     */
    const tasksToRemove = [
      'build',
      'bump',
      'clobber',
      'compile',
      'package',
      'post-compile',
      'post-upgrade',
      'pre-compile',
      'release',
      'test',
      // eslint-disable-next-line @cspell/spellchecker -- the word is used once, so no need to add it to the dictionary
      'unbump',
      'upgrade',
      'watch',
      'projen',
    ]

    tasksToRemove.forEach(this.removeTask.bind(this))
  }

  postSynthesize(): void {
    // execSync('prettier --write .projenrc.ts')
    // execSync('eslint --fix .projenrc.ts')

    collectTelemetry(this)
  }
}

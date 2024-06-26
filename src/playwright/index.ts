import {execSync} from 'child_process'
import * as path from 'path'
import {SampleFile} from 'projen'
import {NodePackageManager} from 'projen/lib/javascript'
import {TypeScriptProject, TypeScriptProjectOptions} from 'projen/lib/typescript'
import {WithDefaultWorkflow, WithDocker, WithGitHooks, addTaskOrScript, renderReadme} from '../common'
import {CodeOwners, WithCodeOwners} from '../common/github'
import {WithCustomLintPaths, addLinters} from '../common/lint'
import {IWithTelemetryReportUrl, WithTelemetry, collectTelemetry, setupTelemetry} from '../common/telemetry'
import {PlaywrightWorkflowTest} from './github'
import {sampleCode} from './sample-code'

export interface OttofellerPlaywrightProjectOptions
  extends TypeScriptProjectOptions,
    WithCodeOwners,
    WithDocker,
    WithDefaultWorkflow,
    WithCustomLintPaths,
    WithGitHooks,
    WithTelemetry {}
/**
 * Playwright template with TypeScript support.
 *
 * @pjid ottofeller-playwright
 */
export class OttofellerPlaywrightProject extends TypeScriptProject implements IWithTelemetryReportUrl {
  readonly reportTargetUrl?: string
  readonly reportTargetAuthHeaderName?: string

  constructor(options: OttofellerPlaywrightProjectOptions) {
    const name = 'playwright'

    super({
      readme: renderReadme(name),
      packageManager: NodePackageManager.NPM,
      minNodeVersion: '20.0.0',
      srcdir: '.',
      ...options,
      bundlerOptions: {},
      jest: false,
      eslint: false,
      projenrcTs: true,
      projenrcJs: false,
      name,

      tsconfig: {
        compilerOptions: {
          baseUrl: './',
          target: 'es6',
          skipLibCheck: true,
          paths: {
            '*': ['./*'],
          },
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
    const assetsDir = path.join(__dirname, '..', '..', 'src/playwright/assets')
    sampleCode(this, options, assetsDir)

    // ANCHOR playwright config
    new SampleFile(this, 'playwright.config.ts', {sourcePath: path.join(assetsDir, 'playwright.config.ts.sample')})

    // eslint-disable-next-line @cspell/spellchecker -- the word is used once, so no need to add it to the dictionary
    this.addDeps('@playwright/test', 'playwright-qase-reporter')
    this.addDeps('dotenv')

    addTaskOrScript(this, 'test:e2e', {exec: 'playwright test'})
    addTaskOrScript(this, 'test:report', {exec: 'playwright show-report'})

    this.package.file.addDeletionOverride('main')
    this.package.file.addDeletionOverride('types')

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

    // ANCHOR ESLint and prettier setup
    const lintPaths = options.lintPaths ?? ['src']
    addLinters({project: this, lintPaths})

    // ANCHOR Github
    PlaywrightWorkflowTest.addToProject(this, options)
    CodeOwners.addToProject(this, options)

    // ANCHOR Telemetry
    setupTelemetry(this, options)
  }

  postSynthesize(): void {
    /*
     * NOTE: The `.projenrc.ts` file is created by projen and its formatting is not controlled.
     * Therefore an additional formatting step is required after project initialization.
     */
    execSync('prettier --write .projenrc.ts')
    execSync('eslint --fix .projenrc.ts')

    collectTelemetry(this)
  }
}

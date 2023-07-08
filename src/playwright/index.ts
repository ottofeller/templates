import {execSync} from 'child_process'
import * as path from 'path'
import {SampleFile} from 'projen'
import {NodePackageManager} from 'projen/lib/javascript'
import {TypeScriptProject, TypeScriptProjectOptions} from 'projen/lib/typescript'
import {WithDefaultWorkflow, WithDocker, WithGitHooks} from '../common'
import {addLinters, WithCustomLintPaths} from '../common/lint'
import {PlaywrightWorkflowTest} from './github'
import {sampleCode} from './sample-code'

export interface OttofellerPlaywrightProjectOptions
  extends TypeScriptProjectOptions,
    WithDocker,
    WithDefaultWorkflow,
    WithCustomLintPaths,
    WithGitHooks {}
/**
 * Playwright template with TypeScript support.
 *
 * @pjid ottofeller-playwright
 */
export class OttofellerPlaywrightProject extends TypeScriptProject {
  constructor(options: OttofellerPlaywrightProjectOptions) {
    super({
      ...options,
      bundlerOptions: {},
      jest: false,
      eslint: false,
      projenrcTs: true,
      projenrcJs: false,
      name: 'playwright',
      packageManager: options.packageManager ?? NodePackageManager.NPM,
      srcdir: options.srcdir ?? '.',

      tsconfig: {
        compilerOptions: {
          baseUrl: './',
          target: 'es6',
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

    // ANCHOR Add required dependencies
    this.addDevDeps('yaml') // REVIEW Required during "npx projen new", fails without this dependency

    // ANCHOR Source code
    const assetsDir = path.join(__dirname, '..', '..', 'src/playwright/assets')
    sampleCode(this, options, assetsDir)

    // ANCHOR playwright config
    new SampleFile(this, 'playwright.config.ts', {sourcePath: path.join(assetsDir, 'playwright.config.ts.sample')})
    new SampleFile(this, '.env.development', {sourcePath: path.join(assetsDir, '.env.development')})

    // eslint-disable-next-line @cspell/spellchecker -- the word is used once, so no need to add it to the dictionary
    this.addDeps('@playwright/test', 'playwright-qase-reporter')
    this.addDeps('dotenv')

    this.addScripts({
      'test:e2e': 'playwright test',
      'test:report': 'playwright show-report',
    })

    this.package.file.addDeletionOverride('main')
    this.package.file.addDeletionOverride('types')

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
    const lintPaths = options.lintPaths ?? ['.projenrc.ts', 'src']
    addLinters({project: this, lintPaths})

    // ANCHOR Github workflow
    PlaywrightWorkflowTest.addToProject(this, options)
  }

  postSynthesize(): void {
    /*
     * NOTE: The `.projenrc.ts` file is created by projen and its formatting is not controlled.
     * Therefore an additional formatting step is required after project initialization.
     */
    execSync('prettier --write .projenrc.ts')
    execSync('eslint --fix .projenrc.ts')
  }
}

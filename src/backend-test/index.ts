import {execSync} from 'child_process'
import * as path from 'path'
import {SampleFile} from 'projen'
import {NodePackageManager} from 'projen/lib/javascript'
import {TypeScriptProject, TypeScriptProjectOptions} from 'projen/lib/typescript'
import {IWithTelemetryReportUrl, WithDefaultWorkflow, WithGitHooks, WithTelemetry, collectTelemetry} from '../common'
import {WithCustomLintPaths, addLinters} from '../common/lint'
import {eslintConfigQa} from './eslint-config-qa'
import {sampleCode} from './sample-code'

export interface OttofellerBackendTestProjectOptions
  extends TypeScriptProjectOptions,
    WithTelemetry,
    WithGitHooks,
    WithCustomLintPaths,
    WithDefaultWorkflow {
  /**
   * Set up GraphQL dependencies and supplementary script.
   *
   * @default true
   */
  readonly isGraphqlEnabled?: boolean
}

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

    this.addDeps('dotenv')

    // ANCHOR ESLint and prettier setup
    const lintPaths = options.lintPaths ?? ['.projenrc.ts', 'src']
    const extraEslintConfigs = [eslintConfigQa]
    addLinters({project: this, lintPaths, extraEslintConfigs})

    // ANCHOR Set up GraphQL
    const isGraphqlEnabled = options.isGraphqlEnabled ?? true

    if (isGraphqlEnabled) {
      this.addDevDeps(
        '@graphql-codegen/add',
        '@graphql-codegen/cli',
        '@graphql-codegen/import-types-preset',
        '@graphql-codegen/introspection',
        '@graphql-codegen/named-operations-object',
        '@graphql-codegen/typescript',
        '@graphql-codegen/typescript-graphql-request',
        '@graphql-codegen/typescript-operations',
        '@graphql-codegen/typescript-react-apollo',
      )

      this.addDeps('@apollo/client', 'graphql')

      // ANCHOR Codegen
      new SampleFile(this, 'codegen.ts', {
        sourcePath: path.join(assetsDir, 'codegen.ts.sample'),
      })

      this.addScripts({
        'generate-graphql-schema': 'npx apollo schema:download',
        'gql-to-ts': 'graphql-codegen -r dotenv/config --config codegen.ts',
      })
    }

    this.package.file.addDeletionOverride('main')
    this.package.file.addDeletionOverride('types')
  }

  postSynthesize(): void {
    execSync('prettier --write .projenrc.ts')
    execSync('eslint --fix .projenrc.ts')

    collectTelemetry(this)
  }
}

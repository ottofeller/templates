import {execSync} from 'child_process'
import * as path from 'path'
import {NodePackageManager, TypeScriptModuleResolution} from 'projen/lib/javascript'
import {TypeScriptProject, TypeScriptProjectOptions} from 'projen/lib/typescript'
import {
  AssetFile,
  IWithTelemetryReportUrl,
  WithDefaultWorkflow,
  WithGitHooks,
  WithTelemetry,
  collectTelemetry,
  setupTelemetry,
} from '../common'
import {WithCustomLintPaths, addLinters} from '../common/lint'
import {eslintConfig} from './assets/eslint-config'
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
  /**
   * Set up AWS DynamoDb dependencies and supplementary script.
   *
   * @default true
   */
  readonly isAWSDynamoDBEnabled?: boolean
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
      jest: false,
      eslint: false,
      projenrcTs: true,
      projenrcJs: false,
      name: 'backend-test',
      packageManager: options.packageManager ?? NodePackageManager.NPM,
      srcdir: options.srcdir ?? '.',

      tsconfig: {
        compilerOptions: {
          declaration: undefined,
          experimentalDecorators: undefined,
          inlineSourceMap: undefined,
          inlineSources: undefined,
          noEmitOnError: undefined,
          noUnusedLocals: undefined,
          lib: undefined,
          outDir: undefined,
          rootDir: undefined,
          stripInternal: undefined,
          forceConsistentCasingInFileNames: true,
          isolatedModules: false,
          module: 'esnext',
          moduleResolution: TypeScriptModuleResolution.NODE,
          noEmit: true,
          noUncheckedIndexedAccess: true,
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
      deps: [
        'dotenv',
        'axios',
        'jest',
        'ts-jest',
        'jest-extended',
        'prettier',
        'eslint-plugin-prettier',
        'eslint-config-prettier',
      ],
    })

    // ANCHOR Source code
    const assetsDir = path.join(__dirname, '..', '..', 'src/backend-test/assets')
    sampleCode(this, options, assetsDir)

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

    // ANCHOR Jest setup
    this.addScripts({
      test: 'jest --detectOpenHandles',
    })

    new AssetFile(this, 'jest.config.ts', {
      sourcePath: path.join(assetsDir, 'jest.config.ts'),
      readonly: false,
      marker: false,
    })

    // ANCHOR ESLint and prettier setup

    const lintPaths = options.lintPaths ?? ['.projenrc.ts', '.']
    addLinters({project: this, lintPaths, extraEslintConfigs: [eslintConfig]})

    new AssetFile(this, '.prettierignore', {
      sourcePath: path.join(assetsDir, '.prettierignore'),
      readonly: false,
      marker: false,
    })

    this.removeTask('format')

    this.tasks.addTask('format', {
      steps: [
        {
          exec: 'prettier --write ./',
        },
        {
          exec: 'eslint --ext .ts ./ --fix',
        },
      ],
    })

    this.removeTask('lint')

    this.tasks.addTask('lint', {
      steps: [
        {
          exec: 'prettier --check ./',
        },
        {
          exec: 'eslint --ext .ts ./',
        },
      ],
    })

    this.removeTask('typecheck')

    this.tasks.addTask('typecheck', {
      steps: [
        {
          exec: 'tsc',
        },
      ],
    })

    //ANCHOR - Set up AWS DynamoDb Client
    const isAWSDynamoDBEnabled = options.isAWSDynamoDBEnabled ?? true

    if (isAWSDynamoDBEnabled) {
      this.addDevDeps('@aws-sdk/client-dynamodb', '@aws-sdk/lib-dynamodb')
    }

    // ANCHOR Set up GraphQL
    const isGraphqlEnabled = options.isGraphqlEnabled ?? true

    if (isGraphqlEnabled) {
      this.addDevDeps(
        '@graphql-codegen/add',
        '@graphql-codegen/cli',
        '@graphql-codegen/introspection',
        '@graphql-codegen/named-operations-object',
        '@graphql-codegen/near-operation-file-preset',
        '@graphql-codegen/typescript',
        '@graphql-codegen/typescript-graphql-request',
        '@graphql-codegen/typescript-operations',
      )

      this.addDeps('graphql')

      // ANCHOR Codegen
      new AssetFile(this, 'codegen.ts', {
        sourcePath: path.join(assetsDir, 'codegen.ts'),
        readonly: false,
        marker: false,
      })

      this.addScripts({
        'gql-to-ts': 'graphql-codegen',
      })
    }

    this.package.file.addDeletionOverride('main')
    this.package.file.addDeletionOverride('types')

    // ANCHOR Telemetry
    setupTelemetry(this, options)
  }

  postSynthesize(): void {
    execSync('prettier --write .projenrc.ts')
    execSync('eslint --fix .projenrc.ts')

    collectTelemetry(this)
  }
}

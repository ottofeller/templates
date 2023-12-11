import {execSync} from 'child_process'
import * as path from 'path'
import * as projen from 'projen'
import {NodePackageManager} from 'projen/lib/javascript'
import {TypeScriptAppProject, TypeScriptProjectOptions} from 'projen/lib/typescript'
import {WithDocker} from '../common'
import {AssetFile} from '../common/files/AssetFile'
import {WithGitHooks, addHusky, extendGitignore} from '../common/git'
import {ProjenDriftCheckWorkflow, PullRequestTest, WithDefaultWorkflow} from '../common/github'
import {WithCustomLintPaths, addLinters} from '../common/lint'
import {IWithTelemetryReportUrl, WithTelemetry, collectTelemetry, setupTelemetry} from '../common/telemetry'
import {addVsCode} from '../common/vscode-settings'
import {sampleCode} from './sample-code'

export interface OttofellerApolloServerProjectOptions
  extends TypeScriptProjectOptions,
    WithDocker,
    WithDefaultWorkflow,
    WithCustomLintPaths,
    WithGitHooks,
    WithTelemetry {}

/**
 * Apollo server template.
 *
 * @pjid ottofeller-apollo-server
 */
export class OttofellerApolloServerProject extends TypeScriptAppProject implements IWithTelemetryReportUrl {
  readonly reportTargetUrl?: string
  readonly reportTargetAuthHeaderName?: string

  constructor(options: OttofellerApolloServerProjectOptions) {
    super({
      ...options,
      projenrcTs: true,
      projenrcJs: false,

      // Comply with node loader
      projenrcTsOptions: {filename: '.projenrc.mjs'},

      defaultReleaseBranch: 'main',
      name: 'apollo-server',
      packageManager: options.packageManager ?? NodePackageManager.NPM,
      tsconfig: {compilerOptions: {paths: {'*': ['./src/*']}, target: 'es6', skipLibCheck: true}},
      sampleCode: false,
      eslint: false,
      dependabot: (options.github ?? true) && (options.dependabot ?? true),
      dependabotOptions: {scheduleInterval: projen.github.DependabotScheduleInterval.WEEKLY},

      // In case Github is enabled remove all default stuff.
      githubOptions: {mergify: false, pullRequestLint: false},
      buildWorkflow: false,
      release: false,
      depsUpgrade: false,
      pullRequestTemplate: false,
    })

    // ANCHOR Add required dependencies
    this.addDeps(
      '@apollo/server@4',
      'axios',
      'dd-trace',
      'dotenv@',
      'esbuild',
      'graphql',
      'graphql-tag',
      'source-map-support',
      'yup',
      '@graphql-tools/merge',
      '@graphql-tools/schema',
    )

    this.addDevDeps(
      '@graphql-codegen/add',
      '@graphql-codegen/cli',
      '@graphql-codegen/named-operations-object',
      '@graphql-codegen/typescript',
      '@graphql-codegen/typescript-operations',
      '@graphql-codegen/typescript-resolvers',
      '@graphql-codegen/typescript-graphql-request',
      '@types/source-map-support',
      'nodemon',
    )

    // ANCHOR Scripts
    this.package.addField('type', 'module')

    /*
     * Clean off the projen tasks and if needed replace them with regular npm scripts.
     * This way we ensure smooth ejection experience with all the commands visible in package.json
     * and no need to keep the projen task runner within an ejected project.
     */
    this.removeTask('build')
    this.removeTask('clobber')
    this.removeTask('compile')
    this.removeTask('dev')
    this.removeTask('package')
    this.removeTask('post-compile')
    this.removeTask('pre-compile')
    this.removeTask('start')
    this.removeTask('test:update')
    this.removeTask('test:watch')
    this.removeTask('test')
    this.removeTask('watch')

    this.addScripts({
      build: 'node esbuild.config.js',
      dev: 'nodemon',
      'generate-graphql-schema': 'npx apollo schema:download',
      'gql-to-ts': 'graphql-codegen -r dotenv/config --config codegen.yml dotenv_config_path=.env.development',
      start: 'node build/index.js',
    })

    if (this.jest) {
      this.addScripts({
        test: 'jest --passWithNoTests --updateSnapshot',
        'test:watch': 'jest --watch',
      })
    }

    // ANCHOR Source code
    const assetsDir = path.join(__dirname, '..', '..', 'src/apollo-server/assets')
    sampleCode(this, options, assetsDir)

    if (options.jest === false) {
      this.removeTask('test')
    }

    // ANCHOR Environment file
    new projen.SampleFile(this, '.env.development', {sourcePath: path.join(assetsDir, '.env.development')})

    // ANCHOR Apollo server config
    new AssetFile(this, 'apollo.config.cjs', {sourcePath: path.join(assetsDir, 'apollo.config.cjs')})

    // ANCHOR esbuild
    new AssetFile(this, 'esbuild.config.js', {sourcePath: path.join(assetsDir, 'esbuild.config.js')})

    // ANCHOR Nodemon
    new projen.JsonFile(this, 'nodemon.json', {
      obj: {
        env: {NODE_ENV: 'development'},
        exec: 'npm run build && npm run start',
        ext: 'ts,json',
        ignore: ['src/**/*.test.ts', 'src/**/__tests__/**'],
        watch: ['src'],
      },
    })

    // ANCHOR Setup git hooks with Husky
    if (options.hasGitHooks ?? false) {
      addHusky(this, options)
    }

    // ANCHOR ESLint and prettier setup
    const lintPaths = options.lintPaths ?? ['src']
    addLinters({project: this, lintPaths})

    // ANCHOR Github workflow
    PullRequestTest.addToProject(this, {...options, isLighthouseEnabled: false})
    ProjenDriftCheckWorkflow.addToProject(this, options)

    // ANCHOR Codegen
    new AssetFile(this, 'codegen.ts', {sourcePath: path.join(assetsDir, 'codegen.ts'), readonly: false, marker: false})

    // ANCHOR Docker setup
    if (options.hasDocker ?? true) {
      new AssetFile(this, '.dockerignore', {sourcePath: path.join(assetsDir, '.dockerignore')})
      new AssetFile(this, 'Dockerfile', {sourcePath: path.join(assetsDir, 'Dockerfile')})
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
    execSync('prettier --write .projenrc.mjs')
    execSync('eslint --fix .projenrc.mjs')

    collectTelemetry(this)
  }
}

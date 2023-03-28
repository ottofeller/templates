/* eslint-disable import/no-relative-parent-imports -- JSII project rewrites tsconfig thus always overriding introduced aliases */
import {execSync} from 'child_process'
import * as path from 'path'
import * as projen from 'projen'
import {NodePackageManager} from 'projen/lib/javascript'
import {TypeScriptAppProject, TypeScriptProjectOptions} from 'projen/lib/typescript'
import {CodegenConfigYaml} from '../common/codegen'
import {AssetFile} from '../common/files/AssetFile'
import {PullRequestTest, WithDefaultWorkflow} from '../common/github'
import {extendGitignore} from '../common/gitignore'
import {addOfmt, WithCustomLintPaths} from '../common/lint'
import {VsCodeSettings, WithVSCode} from '../common/vscode-settings'
import {codegenConfig} from './codegen-config'
import {sampleCode} from './sample-code'

export interface OttofellerApolloServerProjectOptions
  extends TypeScriptProjectOptions,
    WithDefaultWorkflow,
    WithCustomLintPaths,
    WithVSCode {}

/**
 * Apollo server template.
 *
 * @pjid ottofeller-apollo-server
 */
export class OttofellerApolloServerProject extends TypeScriptAppProject {
  public codegenConfigYaml?: CodegenConfigYaml

  constructor(options: OttofellerApolloServerProjectOptions) {
    super({
      ...options,
      projenrcTs: true,
      projenrcJs: false,

      // Comply with node loader
      projenrcTsOptions: {filename: '.projenrc.mjs'},

      defaultReleaseBranch: 'main',
      name: 'apollo-server',
      packageManager: NodePackageManager.NPM,
      tsconfig: {compilerOptions: {paths: {'*': ['./src/*']}, target: 'es6'}},
      sampleCode: false,
      eslint: false,
      dependabot: (options.github ?? true) && (options.dependabot ?? true),
      dependabotOptions: {scheduleInterval: projen.github.DependabotScheduleInterval.WEEKLY},

      scripts: {
        dev: 'nodemon',
        start: 'node build/index.js',
        'generate-graphql-schema': 'npx apollo schema:download',
        'gql-to-ts': 'graphql-codegen -r dotenv/config --config codegen.yml dotenv_config_path=.env.development',
      },

      // In case Github is enabled remove all default stuff.
      githubOptions: {mergify: false, pullRequestLint: false},
      buildWorkflow: false,
      release: false,
      depsUpgrade: false,
      pullRequestTemplate: false,
    })

    // ANCHOR Add required dependencies
    this.addDeps(
      'apollo-server@3.7.0',
      'axios@0.27.2',
      'dd-trace@2.7.1',
      'dotenv@16.0.0',
      'esbuild@0.14.39',
      'graphql@16.5.0',
      'source-map-support@0.5.21',
      'yup@0.32.11',
      '@graphql-tools/merge@8.2.11',
      '@graphql-tools/schema@8.3.13',
    )

    this.addDevDeps(
      '@graphql-codegen/add@3.1.1',
      '@graphql-codegen/cli@2.6.2',
      '@graphql-codegen/named-operations-object@2.2.1',
      '@graphql-codegen/typescript@2.4.8',
      '@graphql-codegen/typescript-operations@2.4.0',
      '@graphql-codegen/typescript-resolvers@2.6.4',
      '@graphql-codegen/typescript-graphql-request@4.4.8',
      '@types/source-map-support@0.5.4',
      'nodemon@2.0.16',
    )

    // ANCHOR Scripts
    this.package.addField('type', 'module')
    const tasksToRemove = ['build', 'compile', 'package', 'post-compile', 'pre-compile', 'watch']
    tasksToRemove.forEach(this.removeTask.bind(this))
    this.addTask('build', {exec: 'node esbuild.config.js'})

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

    // ANCHOR ESLint and prettier setup
    const lintPaths = options.lintPaths ?? ['.projenrc.mjs', 'src']
    addOfmt(this, lintPaths)

    // ANCHOR Github workflow
    PullRequestTest.addToProject(this, options)

    // ANCHOR Codegen
    this.codegenConfigYaml = new CodegenConfigYaml(this, codegenConfig)

    // ANCHOR Docker setup
    new AssetFile(this, '.dockerignore', {sourcePath: path.join(assetsDir, '.dockerignore')})
    new AssetFile(this, 'Dockerfile', {sourcePath: path.join(assetsDir, 'Dockerfile')})

    // ANCHOR VSCode settings
    VsCodeSettings.addToProject(this, options)

    VsCodeSettings.of(this)?.add({
      'eslint.useESLintClass': true,
      'eslint.options': {cache: true, reportUnusedDisableDirectives: 'error'},
    })

    // ANCHOR gitignore
    extendGitignore(this)
  }

  postSynthesize(): void {
    /*
     * NOTE: The `.projenrc.ts` file is created by projen and its formatting is not controlled.
     * Therefore an additional formatting step is required after project initialization.
     */
    execSync('ofmt .projenrc.mjs')
  }
}

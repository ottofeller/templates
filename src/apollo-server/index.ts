import {execSync} from 'child_process'
import * as path from 'path'
import * as projen from 'projen'
import {NodePackageManager} from 'projen/lib/javascript'
import {TypeScriptAppProject, TypeScriptProjectOptions} from 'projen/lib/typescript'
import {WithDocker} from '../common'
import {CodegenConfigYaml} from '../common/codegen'
import {AssetFile} from '../common/files/AssetFile'
import {WithGitHooks, addHusky, extendGitignore} from '../common/git'
import {PullRequestTest, WithDefaultWorkflow} from '../common/github'
import {WithCustomLintPaths, addLinters} from '../common/lint'
import {addVsCode} from '../common/vscode-settings'
import {codegenConfig} from './codegen-config'
import {sampleCode} from './sample-code'

export interface OttofellerApolloServerProjectOptions
  extends TypeScriptProjectOptions,
    WithDocker,
    WithDefaultWorkflow,
    WithCustomLintPaths,
    WithGitHooks {}

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
      packageManager: options.packageManager ?? NodePackageManager.NPM,
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

    // ANCHOR Setup git hooks with Husky
    if (options.hasGitHooks ?? false) {
      addHusky(this, options)
    }

    // ANCHOR ESLint and prettier setup
    const lintPaths = options.lintPaths ?? ['.projenrc.mjs', 'src']
    addLinters({project: this, lintPaths})

    // ANCHOR Github workflow
    PullRequestTest.addToProject(this, {...options, isLighthouseEnabled: false})

    // ANCHOR Codegen
    this.codegenConfigYaml = new CodegenConfigYaml(this, codegenConfig)

    // ANCHOR Docker setup
    if (options.hasDocker ?? true) {
      new AssetFile(this, '.dockerignore', {sourcePath: path.join(assetsDir, '.dockerignore')})
      new AssetFile(this, 'Dockerfile', {sourcePath: path.join(assetsDir, 'Dockerfile')})
    }

    // ANCHOR VSCode settings
    addVsCode(this)

    // ANCHOR gitignore
    extendGitignore(this)
  }

  postSynthesize(): void {
    /*
     * NOTE: The `.projenrc.ts` file is created by projen and its formatting is not controlled.
     * Therefore an additional formatting step is required after project initialization.
     */
    execSync('prettier --write .projenrc.mjs')
    execSync('eslint --fix .projenrc.mjs')
  }
}

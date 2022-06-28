// FIXME Need to find a way to control "tsconfig.json"
/* eslint-disable import/no-relative-parent-imports -- JSII project rewrites tsconfig thus always overriding introduced aliases */
import * as path from 'path'
import * as projen from 'projen'
import {NodePackageManager} from 'projen/lib/javascript'
import {TypeScriptAppProject, TypeScriptProjectOptions} from 'projen/lib/typescript'
import {PullRequestTest} from '../common/github/pull-request-test-workflow'
import {VsCodeSettings} from '../common/vscode-settings'

/**
 * Apollo server template.
 *
 * @pjid ottofeller-apollo-server
 */
export class OttofellerApolloServerProject extends TypeScriptAppProject {
  constructor(options: TypeScriptProjectOptions) {
    super({
      ...options,
      bundlerOptions: {},
      projenrcTs: true,
      projenrcJs: false,
      defaultReleaseBranch: 'main',
      name: 'apollo-server',
      packageManager: NodePackageManager.NPM,
      tsconfig: {compilerOptions: {paths: {'*': ['./src/*']}, target: 'es6'}},
      sampleCode: false,
      eslint: false,
      jest: false,

      deps: [
        'apollo-server',
        'axios',
        'dd-trace',
        'dotenv',
        'esbuild',
        'graphql',
        'source-map-support',
        'yup',
        '@graphql-tools/merge',
        '@graphql-tools/schema',
      ],

      devDeps: [
        '@graphql-codegen/add',
        '@graphql-codegen/cli',
        '@graphql-codegen/named-operations-object',
        '@graphql-codegen/typescript',
        '@graphql-codegen/typescript-operations',
        '@graphql-codegen/typescript-resolvers',
        '@graphql-codegen/typescript-graphql-request',
        '@ottofeller/eslint-config-ofmt',
        '@ottofeller/ofmt',
        '@ottofeller/prettier-config-ofmt',
        '@types/source-map-support',
        'nodemon',
      ],

      scripts: {
        dev: 'nodemon',
        start: 'node build/index.js',
        format: 'ofmt .projenrc.ts && ofmt src',
        lint: 'ofmt --lint .projenrc.ts && ofmt --lint src && olint src .projenrc.ts',
        typecheck: 'tsc --noEmit --project tsconfig.dev.json',
        'generate-graphql-schema': 'npx apollo schema:download',
        'gql-to-ts': 'graphql-codegen -r dotenv/config --config codegen.yml dotenv_config_path=.env.development',
      },

      // Enable Github but remove all default stuff.
      github: true,
      githubOptions: {mergify: false, pullRequestLint: false},
      buildWorkflow: false,
      release: false,
      depsUpgrade: false,
      pullRequestTemplate: false,
    })

    this.package.addField('type', 'module')
    const tasksToRemove = ['build', 'compile', 'package', 'post-compile', 'pre-compile', 'watch']
    tasksToRemove.forEach(this.removeTask.bind(this))
    this.addTask('build', {exec: 'node esbuild.config.js'})

    // ANCHOR Source code
    new projen.SampleDir(this, 'src', {sourceDir: path.join(__dirname, 'assets/src')})

    // ANCHOR Apollo server config
    new projen.SampleFile(this, '.env.development', {sourcePath: path.join(__dirname, 'assets/.env.development')})
    new projen.SampleFile(this, 'apollo.config.cjs', {sourcePath: path.join(__dirname, 'assets/apollo.config.cjs')})

    // ANCHOR esbuild
    new projen.SampleFile(this, 'esbuild.config.js', {sourcePath: path.join(__dirname, 'assets/esbuild.config.js')})

    // ANCHOR Nodemon
    new projen.JsonFile(this, 'nodemon.json', {
      obj: {
        env: {
          NODE_ENV: 'development',
        },
        exec: 'npm run build && npm run start',
        ext: 'ts,json',
        ignore: ['src/**/*.test.ts', 'src/**/__tests__/**'],
        watch: ['src'],
      },
    })

    // ANCHOR ESLint and prettier setup
    this.package.addField('prettier', '@ottofeller/prettier-config-ofmt')
    this.package.addField('eslintConfig', {extends: ['@ottofeller/eslint-config-ofmt/eslint.quality.cjs']})

    // ANCHOR Github workflow
    if (this.github) {
      new PullRequestTest(this.github)
    }

    // ANCHOR Codegen
    new projen.SampleFile(this, 'codegen.yml', {sourcePath: path.join(__dirname, 'assets/codegen.yml')})

    // ANCHOR Docker setup
    new projen.SampleFile(this, '.dockerignore', {sourcePath: path.join(__dirname, 'assets/.dockerignore')})
    new projen.SampleFile(this, 'Dockerfile', {sourcePath: path.join(__dirname, 'assets/Dockerfile')})

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

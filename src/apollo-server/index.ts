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
      projenrcTs: true,
      defaultReleaseBranch: 'main',
      name: 'apollo-server',
      packageManager: NodePackageManager.NPM,
      tsconfig: {compilerOptions: {paths: {'*': ['./src/*']}, target: 'es6'}},
      sampleCode: false,
      eslint: false,
      jest: false,
      dependabot: true,
      dependabotOptions: {scheduleInterval: projen.github.DependabotScheduleInterval.WEEKLY},

      deps: [
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
      ],

      devDeps: [
        '@graphql-codegen/add@3.1.1',
        '@graphql-codegen/cli@2.6.2',
        '@graphql-codegen/named-operations-object@2.2.1',
        '@graphql-codegen/typescript@2.4.8',
        '@graphql-codegen/typescript-operations@2.4.0',
        '@graphql-codegen/typescript-resolvers@2.6.4',
        '@graphql-codegen/typescript-graphql-request@4.4.8',
        '@ottofeller/eslint-config-ofmt@1.3.6',
        '@ottofeller/ofmt@1.3.6',
        '@ottofeller/prettier-config-ofmt@1.3.6',
        '@types/source-map-support@0.5.4',
        'nodemon@2.0.16',
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
    ;['build', 'compile', 'package', 'post-compile', 'pre-compile', 'watch'].forEach(this.removeTask.bind(this))
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

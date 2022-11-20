/* eslint-disable import/no-relative-parent-imports -- JSII project rewrites tsconfig thus always overriding introduced aliases */
import {execSync} from 'child_process'
import * as path from 'path'
import * as projen from 'projen'
import {NodePackageManager} from 'projen/lib/javascript'
import {NextJsTypeScriptProject, NextJsTypeScriptProjectOptions} from 'projen/lib/web'
import {CodegenConfigYaml} from '../common/codegen'
import {AssetFile} from '../common/files/AssetFile'
import {PullRequestTest, WithDefaultWorkflow} from '../common/github'
import {addLintScripts, WithCustomLintPaths} from '../common/lint'
import {VsCodeSettings} from '../common/vscode-settings'
import {codegenConfig} from './codegen-config'
import {tailwindStaticConfig} from './tailwind-static-config'

const GENERATED_BY_PROJEN = '# ~~ Generated by projen. To modify, edit .projenrc.ts and run "npx projen".'

export interface OttofellerNextjsProjectOptions
  extends NextJsTypeScriptProjectOptions,
    WithDefaultWorkflow,
    WithCustomLintPaths {
  /**
   * Set up GraphQL dependencies and supplementary script.
   *
   * @default true
   */
  readonly isGraphqlEnabled?: boolean
}

/**
 * Nextjs template with TypeScript support.
 *
 * @pjid ottofeller-nextjs
 */
export class OttofellerNextjsProject extends NextJsTypeScriptProject {
  public codegenConfigYaml?: CodegenConfigYaml

  constructor(options: OttofellerNextjsProjectOptions) {
    super({
      ...options,
      bundlerOptions: {},
      projenrcTs: true,
      projenrcJs: false,
      defaultReleaseBranch: 'main',
      name: 'nextjs',
      packageManager: NodePackageManager.NPM,
      srcdir: options.srcdir ?? '.',

      tsconfig: {
        compilerOptions: {
          baseUrl: './',
          target: 'es6',
          paths: {'*': ['./src/*'], 'tailwind.config.js': ['./tailwind.config.js']},
        },
      },
      sampleCode: false,
      tailwind: false, // Tailwind has to be configured manually.
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
    this.addDeps('@apollo/client')

    this.addDevDeps(
      '@ottofeller/eslint-config-ofmt@1.5.2',
      '@ottofeller/ofmt@1.5.2',
      '@ottofeller/prettier-config-ofmt@1.5.2',
      'eslint@>=8',

      // REVIEW Required during "npx projen new", fails without this dependency
      'yaml',
    )

    // ANCHOR scripts
    const lintPaths = options.lintPaths ?? ['.projenrc.ts', 'pages', 'src']
    addLintScripts(this, lintPaths)

    const assetsDir = path.join(__dirname, '..', '..', 'src/nextjs/assets')

    // ANCHOR Source code
    ;['_app.tsx', 'index.tsx'].forEach((file) => {
      const filePath = `pages/${file}`
      new projen.SampleFile(this, filePath, {sourcePath: path.join(assetsDir, filePath)})
    })

    const globalCssPath = 'src/assets/global.css'
    new projen.SampleFile(this, globalCssPath, {sourcePath: path.join(assetsDir, globalCssPath)})

    // ANCHOR NextJS config
    new AssetFile(this, 'next.config.js', {sourcePath: path.join(assetsDir, 'next.config.js')})

    new projen.JsonFile(this, 'next.config.json', {
      obj: {
        images: {formats: ['avif', 'webp'].map((type) => `image/${type}`)},
        output: 'standalone',
        poweredByHeader: false,

        publicRuntimeConfig: {
          ACCEPT_IMAGES_MIME_TYPES: ['avif', 'gif', 'jpeg', 'png', 'svg+xml', 'webp']
            .map((type) => `image/${type}`)
            .join(', '),
          ITEMS_PER_PAGE: 25,
          US_DATE_FORMAT: 'MM/DD/YYYY',
        },

        reactStrictMode: true,
      },
    })

    // ANCHOR ESLint and prettier setup
    this.package.addField('prettier', '@ottofeller/prettier-config-ofmt')
    this.package.addField('eslintConfig', {extends: ['@ottofeller/eslint-config-ofmt/eslint.quality.cjs']})

    // ANCHOR Github workflow
    const hasDefaultGithubWorkflows = options.hasDefaultGithubWorkflows ?? true

    if (hasDefaultGithubWorkflows && this.github) {
      new PullRequestTest(this.github)
    }

    // ANCHOR Set up GraphQL
    const isGraphqlEnabled = options.isGraphqlEnabled ?? true

    if (isGraphqlEnabled) {
      this.addDeps(
        '@graphql-codegen/add',
        '@graphql-codegen/cli',
        '@graphql-codegen/import-types-preset',
        '@graphql-codegen/introspection',
        '@graphql-codegen/named-operations-object',
        '@graphql-codegen/typescript',
        '@graphql-codegen/typescript-graphql-request',
        '@graphql-codegen/typescript-operations',
        '@graphql-codegen/typescript-react-apollo',
        'graphql',
      )

      // ANCHOR Codegen
      this.codegenConfigYaml = new CodegenConfigYaml(this, codegenConfig)
      this.addTask('generate-graphql-schema', {exec: 'npx apollo schema:download'})
      this.addTask('gql-to-ts', {exec: 'graphql-codegen -r dotenv/config --config codegen.yml'})
    }

    // ANCHOR Tailwind
    this.addDeps('postcss', 'tailwindcss', 'autoprefixer', '@tailwindcss/line-clamp')

    new projen.JsonFile(this, 'postcss.config.json', {
      obj: {plugins: {'tailwindcss/nesting': {}, tailwindcss: {}, autoprefixer: {}}},
      marker: false,
    })

    new projen.JsonFile(this, 'tailwind.config.json', {obj: tailwindStaticConfig})
    new AssetFile(this, 'tailwind.config.js', {sourcePath: path.join(assetsDir, 'tailwind.config.js')})

    // ANCHOR Docker setup
    new projen.TextFile(this, '.dockerignore', {lines: [GENERATED_BY_PROJEN, 'node_modules', '.next']})
    new AssetFile(this, 'Dockerfile.dev', {sourcePath: path.join(assetsDir, 'Dockerfile.dev')})
    new AssetFile(this, 'Dockerfile.production', {sourcePath: path.join(assetsDir, 'Dockerfile.production')})

    // ANCHOR VSCode settings
    VsCodeSettings.addToProject(this)

    VsCodeSettings.of(this)?.add({
      'eslint.useESLintClass': true,
      'eslint.options': {cache: true, reportUnusedDisableDirectives: 'error'},
    })
  }

  postSynthesize(): void {
    /*
     * NOTE: The `.projenrc.ts` file is created by projen and its formatting is not controlled.
     * Therefore an additional formatting step is required after project initialization.
     */
    execSync('ofmt .projenrc.ts')
  }
}

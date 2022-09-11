import {AssetFile} from 'common/files/AssetFile'
import {PullRequestTest} from 'common/github'
import {VsCodeSettings} from 'common/vscode-settings'
import * as path from 'path'
import * as projen from 'projen'
import {NodePackageManager} from 'projen/lib/javascript'
import {NextJsTypeScriptProject, NextJsTypeScriptProjectOptions} from 'projen/lib/web'
import {tailwindStaticConfig} from './tailwind-static-config'
const GENERATED_BY_PROJEN = '# ~~ Generated by projen. To modify, edit .projenrc.ts and run "npx projen".'

export interface OttofellerNextjsProjectOptions extends NextJsTypeScriptProjectOptions {
  /**
   * Include a default GitHub pull request template.
   *
   * @default true
   */
  readonly hasDefaultGithubWorkflows?: boolean

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
  constructor(options: OttofellerNextjsProjectOptions) {
    super({
      ...options,
      bundlerOptions: {},
      projenrcTs: true,
      projenrcJs: false,
      defaultReleaseBranch: 'main',
      name: 'nextjs',
      packageManager: NodePackageManager.NPM,
      tsconfig: {compilerOptions: {baseUrl: './', target: 'es6'}},
      sampleCode: false,
      tailwind: false, // Tailwind has to be configured manually.
      dependabot: (options.github ?? true) && (options.dependabot ?? true),
      dependabotOptions: {scheduleInterval: projen.github.DependabotScheduleInterval.WEEKLY},

      scripts: {
        format: 'npx ofmt .projenrc.ts && npx ofmt pages',
        lint: 'npx ofmt --lint .projenrc.ts && npx ofmt --lint pages && npx olint pages .projenrc.ts',
        typecheck: 'tsc --noEmit --project tsconfig.dev.json',
      },

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
      '@ottofeller/eslint-config-ofmt',
      '@ottofeller/ofmt',
      '@ottofeller/prettier-config-ofmt',
      'eslint@>=8',

      // REVIEW Required during "npx projen new", fails without this dependency
      'yaml',
    )

    const assetsDir = path.join(__dirname, '..', 'src/nextjs/assets')
    // ANCHOR Source code
    ;['_app.tsx', 'global.css', 'index.tsx'].forEach((file) => {
      new projen.SampleFile(this, `pages/${file}`, {
        sourcePath: path.join(assetsDir, `pages/${file}`),
      })
    })

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
    if (options.isGraphqlEnabled) {
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
      new AssetFile(this, 'codegen.yml', {sourcePath: path.join(assetsDir, 'codegen.yml')})
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

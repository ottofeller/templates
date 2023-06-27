import {execSync} from 'child_process'
import * as path from 'path'
import * as projen from 'projen'
import {SampleFile} from 'projen'
import {NodePackageManager} from 'projen/lib/javascript'
import {NextJsTypeScriptProject, NextJsTypeScriptProjectOptions} from 'projen/lib/web'
import {WithDocker} from '../common'
import {CodegenConfigYaml} from '../common/codegen'
import {AssetFile} from '../common/files/AssetFile'
import {addHusky, extendGitignore, WithGitHooks} from '../common/git'
import {PullRequestTest, WithDefaultWorkflow} from '../common/github'
import {addLinters, WithCustomLintPaths} from '../common/lint'
import {addVsCode} from '../common/vscode-settings'
import {codegenConfig} from './codegen-config'
import {eslintConfigTailwind} from './eslint-config-tailwind'
import {setupJest} from './jest'
import {sampleCode} from './sample-code'
import {setupUIPackages} from './setup-ui-packages'

const GENERATED_BY_PROJEN = '# ~~ Generated by projen. To modify, edit .projenrc.ts and run "npx projen".'

export interface OttofellerNextjsProjectOptions
  extends NextJsTypeScriptProjectOptions,
    WithDocker,
    WithDefaultWorkflow,
    WithCustomLintPaths,
    WithGitHooks {
  /**
   * Set up GraphQL dependencies and supplementary script.
   *
   * @default true
   */
  readonly isGraphqlEnabled?: boolean

  /**
   * Setup ui packages. E.g. tailwindcss, postcss, @next/font, @headlessui/react.
   * Include basic styles into sample code.
   *
   * @default true
   */
  readonly isUiConfigEnabled?: boolean

  /**
   * Setup Lighthouse audit script & GitHub job.
   *
   * @default true
   */
  readonly isLighthouseEnabled?: boolean

  /**
   * Setup Playwright project with Page Object Model.
   *
   * @default true
   */
  readonly isPlaywrightEnabled?: boolean
}

/**
 * Nextjs template with TypeScript support.
 *
 * @pjid ottofeller-nextjs
 */
export class OttofellerNextjsProject extends NextJsTypeScriptProject {
  public codegenConfigYaml?: CodegenConfigYaml
  public postSynthFormattingPaths: Array<string>

  constructor(options: OttofellerNextjsProjectOptions) {
    super({
      ...options,
      bundlerOptions: {},
      projenrcTs: true,
      projenrcJs: false,
      defaultReleaseBranch: 'main',
      name: 'nextjs',
      packageManager: options.packageManager ?? NodePackageManager.NPM,
      srcdir: options.srcdir ?? '.',

      tsconfig: {
        compilerOptions: {
          baseUrl: './',
          target: 'es6',
        },
        include: ['**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      },
      sampleCode: false,
      tailwind: false, // Tailwind has to be configured manually.
      jest: false, // Default jest config created by projen does not utilize the nextjs helper and poorly works with react.
      dependabot: (options.github ?? true) && (options.dependabot ?? true),
      dependabotOptions: {scheduleInterval: projen.github.DependabotScheduleInterval.WEEKLY},

      // In case Github is enabled remove all default stuff.
      githubOptions: {mergify: false, pullRequestLint: false},
      buildWorkflow: false,
      release: false,
      depsUpgrade: false,
      pullRequestTemplate: false,
    })

    // NOTE A subproject won't have the `projenrc` file thus it does not need to format the file.
    this.postSynthFormattingPaths = this.parent ? [] : ['.projenrc.ts']

    // ANCHOR Next.js related setup of TypeScript -- define the "plugins" option manually, since it is not yet supported by projen types.
    this.tsconfig?.file.addOverride('compilerOptions.plugins', [{name: 'next'}])
    this.tsconfigDev?.file.addOverride('compilerOptions.plugins', [{name: 'next'}])

    // ANCHOR Rename "server" task to "start"
    const {steps = [{exec: 'next start'}], description = 'Start next server'} = this.tasks.removeTask('server') || {}
    this.addTask('start', {steps, description})

    // ANCHOR Add required dependencies
    this.addDevDeps('yaml') // REVIEW Required during "npx projen new", fails without this dependency

    // ANCHOR Source code
    const assetsDir = path.join(__dirname, '..', '..', 'src/nextjs/assets')
    sampleCode(this, options, assetsDir)

    // ANCHOR NextJS config
    new AssetFile(this, 'next.config.defaults.js', {sourcePath: path.join(assetsDir, 'next.config.defaults.js')})
    new SampleFile(this, 'next.config.js', {sourcePath: path.join(assetsDir, 'next.config.js')})

    // ANCHOR NextJS type declarations
    new SampleFile(this, 'next-env.d.ts', {sourcePath: path.join(assetsDir, 'next-env.d.ts.sample')})

    // ANCHOR ESLint and prettier setup
    const lintPaths = options.lintPaths ?? ['.projenrc.ts', 'app', 'src']
    const extraEslintConfigs = options.isUiConfigEnabled === false ? undefined : [eslintConfigTailwind]
    addLinters({project: this, lintPaths, extraEslintConfigs})

    // ANCHOR Setup git hooks with Husky
    if (options.hasGitHooks ?? false) {
      addHusky(this, options)
    }

    // ANCHOR Github workflow
    PullRequestTest.addToProject(this, options)

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
      this.codegenConfigYaml = new CodegenConfigYaml(this, codegenConfig)
      this.addTask('generate-graphql-schema', {exec: 'npx apollo schema:download'})
      this.addTask('gql-to-ts', {exec: 'graphql-codegen -r dotenv/config --config codegen.yml'})
    }

    // ANCHOR Set up Lighthouse audit
    const isLighthouseEnabled = options.isLighthouseEnabled ?? true

    if (isLighthouseEnabled) {
      this.addDevDeps('@lhci/cli')
      this.addScripts({lighthouse: 'lhci autorun'})
      new SampleFile(this, 'lighthouserc.js', {sourcePath: path.join(assetsDir, 'lighthouserc.js')})
    }

    // ANCHOR Set up Playwright
    const isPlaywrightEnabled = options.isPlaywrightEnabled ?? true

    if (isPlaywrightEnabled) {
      this.addDeps('@playwright/test', 'playwright-qase-reporter')

      this.addScripts({'test:e2e': 'playwright test'})

      new SampleFile(this, 'playwright.config.ts', {sourcePath: path.join(assetsDir, 'playwright.config.ts.sample')})

      new SampleFile(this, 'src/tests/common/index.ts', {
        sourcePath: path.join(assetsDir, 'src/tests/common/index.ts.sample'),
      })

      new SampleFile(this, 'src/tests/common/test.ts', {
        sourcePath: path.join(assetsDir, 'src/tests/common/test.ts.sample'),
      })

      new SampleFile(this, 'src/tests/common/users.ts', {sourcePath: path.join(assetsDir, 'src/tests/common/users.ts')})
      new SampleFile(this, 'src/tests/data/index.ts', {sourcePath: path.join(assetsDir, 'src/tests/data/index.ts')})

      new SampleFile(this, 'src/tests/data/error-texts.json', {
        sourcePath: path.join(assetsDir, 'src/tests/data/error-texts.json'),
      })

      new SampleFile(this, 'src/tests/pages/index.ts', {
        sourcePath: path.join(assetsDir, 'src/tests/pages/index.ts.sample'),
      })

      new SampleFile(this, 'src/tests/pages/base.ts', {
        sourcePath: path.join(assetsDir, 'src/tests/pages/base.ts.sample'),
      })

      new SampleFile(this, 'src/tests/pages/index.ts', {
        sourcePath: path.join(assetsDir, 'src/tests/pages/index.ts.sample'),
      })

      new SampleFile(this, 'src/tests/pages/sign-in.ts', {
        sourcePath: path.join(assetsDir, 'src/tests/pages/sign-in.ts.sample'),
      })

      new SampleFile(this, 'src/tests/pages/products.ts', {
        sourcePath: path.join(assetsDir, 'src/tests/pages/products.ts.sample'),
      })

      new SampleFile(this, 'src/tests/specs/auth.spec.ts', {
        sourcePath: path.join(assetsDir, 'src/tests/specs/auth.spec.ts.sample'),
      })
    }

    // ANCHOR Jest
    setupJest(this, options, assetsDir)

    // ANCHOR Tailwind
    setupUIPackages(this, options, assetsDir)

    // ANCHOR Docker setup
    if (options.hasDocker ?? true) {
      new projen.TextFile(this, '.dockerignore', {lines: [GENERATED_BY_PROJEN, 'node_modules', '.next']})
      new AssetFile(this, 'Dockerfile.dev', {sourcePath: path.join(assetsDir, 'Dockerfile.dev')})
      new AssetFile(this, 'Dockerfile.production', {sourcePath: path.join(assetsDir, 'Dockerfile.production')})
    }

    // ANCHOR VSCode settings
    addVsCode(this)

    // ANCHOR gitignore
    extendGitignore(this)
    extendGitignore(this, ['.next/', 'debug/', '.vscode/tasks.json', 'build/', '.lighthouseci/'])

    // ANCHOR Codemod
    this.addDevDeps('jscodeshift')
    const addSrcTransform = '-t ./node_modules/@ottofeller/templates/lib/nextjs/add-src-reference-codemode.js'
    const extensions = '--extensions=js,jsx,ts,tsx'
    const foldersToProcess = 'src pages'

    this.addScripts({
      'codemod:add-src-to-imports': `jscodeshift ${addSrcTransform} ${extensions} ${foldersToProcess}`,
    })
  }

  postSynthesize(): void {
    /*
     * NOTE: The `.projenrc.ts` file is created by projen and its formatting is not controlled.
     * Therefore an additional formatting step is required after project initialization.
     *
     * The pages/_app.tsx file has optional content which is easier to format after the synthesis,
     * instead of trying to arrange the file lines programmatically.
     */
    const formattingPaths = this.postSynthFormattingPaths
      .map((filePath) => `${this.outdir}/${filePath}`) // NOTE: `outdir` is necessary for subprojects to correctly identify files in nested folders.
      .join(' ')

    execSync(`prettier --write ${formattingPaths}`)
    execSync(`eslint --fix ${formattingPaths}`)
  }
}

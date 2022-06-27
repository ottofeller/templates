import * as fs from 'fs'
import * as path from 'path'
import * as projen from 'projen'
import {NodePackageManager} from 'projen/lib/javascript'
import {NextJsTypeScriptProject, NextJsTypeScriptProjectOptions} from 'projen/lib/web'

// FIXME Need to find a way to control "tsconfig.json"
// eslint-disable-next-line import/no-relative-parent-imports -- JSII project rewrites tsconfig thus always overriding introduced aliases
import {VsCodeSettings} from '../common/vscode-settings'

import {PullRequestTest} from './pull-request-test-workflow'
const GENERATED_BY_PROJEN = '# ~~ Generated by projen. To modify, edit .projenrc.ts and run "npx projen".'

export class OttofellerNextjsProject extends NextJsTypeScriptProject {
  constructor(options: NextJsTypeScriptProjectOptions) {
    super({
      ...options,
      bundlerOptions: {},
      projenrcTs: true,
      projenrcJs: false,
      defaultReleaseBranch: 'main',
      name: 'nextjs',
      packageManager: NodePackageManager.NPM,
      tsconfig: {compilerOptions: {paths: {'*': ['./src/*']}, target: 'es6'}},
      sampleCode: false,
      tailwind: false, // Tailwind has to be configured manually.
      deps: ['@apollo/client'],

      devDeps: [
        '@ottofeller/eslint-config-ofmt',
        '@ottofeller/ofmt',
        '@ottofeller/prettier-config-ofmt',
        'eslint@>=8',
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

        // REVIEW Required during "npx projen new", fails without this dependency
        'yaml',
      ],

      scripts: {
        format: 'npx ofmt .projenrc.ts && npx ofmt pages',
        lint: 'npx ofmt --lint .projenrc.ts && npx ofmt --lint pages && npx olint pages .projenrc.ts',
        typecheck: 'tsc --noEmit --project tsconfig.dev.json',
        'generate-graphql-schema': 'npx apollo schema:download',
        'gql-to-ts': 'graphql-codegen -r dotenv/config --config codegen.yml',
      },

      // Enable Github but remove all default stuff.
      github: true,
      githubOptions: {mergify: false, pullRequestLint: false},
      buildWorkflow: false,
      release: false,
      depsUpgrade: false,
      pullRequestTemplate: false,
    })

    // ANCHOR Source code
    new projen.SampleDir(this, 'pages', {
      files: {
        // FIXME Find a way to copy/include an arbitrary file to the TypeScript output dir
        '_app.tsx': fs.readFileSync(path.join(__dirname, '..', '..', 'src/nextjs/assets/pages/_app.tsx'), 'utf-8'),
        'global.css': fs.readFileSync(path.join(__dirname, '..', '..', 'src/nextjs/assets/pages/global.css'), 'utf-8'),
        'index.tsx': fs.readFileSync(path.join(__dirname, '..', '..', 'src/nextjs/assets/pages/index.tsx'), 'utf-8'),
      },
    })

    // ANCHOR ESLint and prettier setup
    this.package.addField('prettier', '@ottofeller/prettier-config-ofmt')
    this.package.addField('eslintConfig', {extends: ['@ottofeller/eslint-config-ofmt/eslint.quality.cjs']})

    // ANCHOR Github workflow
    if (this.github) {
      new PullRequestTest(this.github)
    }

    // ANCHOR Tailwind
    this.addDeps('postcss', 'tailwindcss', 'autoprefixer', '@tailwindcss/line-clamp')
    new projen.JsonFile(this, 'postcss.config.json', {
      obj: {plugins: {'tailwindcss/nesting': {}, tailwindcss: {}, autoprefixer: {}}},
      marker: false,
    })
    new projen.SampleFile(this, 'tailwind.config.js', {
      // FIXME Find a way to copy/include an arbitrary file to the TypeScript output dir
      contents: fs.readFileSync(path.join(__dirname, '..', '..', 'src/nextjs/assets/tailwind.config.js'), 'utf-8'),
    })

    // ANCHOR Codegen
    new projen.SampleFile(this, 'codegen.yml', {
      // FIXME Find a way to copy/include an arbitrary file to the TypeScript output dir
      contents: fs.readFileSync(path.join(__dirname, '..', '..', 'src/nextjs/assets/codegen.yml'), 'utf-8'),
    })

    // ANCHOR Docker setup
    new projen.TextFile(this, '.dockerignore', {
      lines: [GENERATED_BY_PROJEN, 'node_modules', '.next'],
    })

    new projen.TextFile(this, 'Dockerfile.dev', {
      lines: [GENERATED_BY_PROJEN].concat(
        fs.readFileSync(path.join(__dirname, '..', '..', 'src/nextjs/assets/Dockerfile.dev'), 'utf-8').split('\n'),
      ),
    })

    new projen.TextFile(this, 'Dockerfile.production', {
      lines: [GENERATED_BY_PROJEN].concat(
        fs
          .readFileSync(path.join(__dirname, '..', '..', 'src/nextjs/assets/Dockerfile.production'), 'utf-8')
          .split('\n'),
      ),
    })

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

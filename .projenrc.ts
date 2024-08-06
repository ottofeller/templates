import type {Linter} from 'eslint'
import {readFileSync} from 'fs'
import * as projen from 'projen'
import {addHusky} from './src/common/git'
import {ProjenDriftCheckWorkflow, job, runScriptJob} from './src/common/github'
import {addLinters} from './src/common/lint'

// ANCHOR Basic setup
const project = new projen.cdk.JsiiProject({
  author: 'ottofeller',
  authorAddress: 'https://ottofeller.com',
  defaultReleaseBranch: 'main',
  repositoryUrl: 'https://github.com/ottofeller/templates.git',
  name: '@ottofeller/templates',
  description: 'Projen templates for OttoFeller projects',
  packageName: '@ottofeller/templates',
  packageManager: projen.javascript.NodePackageManager.NPM,
  minNodeVersion: '20.0.0',

  deps: ['projen', 'prettier'],
  bundledDeps: ['prettier'],
  peerDeps: ['projen', 'constructs'],
  devDeps: ['@types/eslint', '@types/jscodeshift', '@types/prettier', '@graphql-codegen/cli'],

  jsiiVersion: '5.3.x',
  typescriptVersion: '5.3.x',

  github: true,
  buildWorkflow: false,
  release: false,
  dependabot: true,
  depsUpgrade: false,
  githubOptions: {mergify: false, workflows: true, pullRequestLint: false},
  pullRequestTemplate: false,

  projenrcTs: true,
  sampleCode: false,
  docgen: false,
  eslint: false,
  jest: true,
  jestOptions: {jestVersion: '29'},
})

// ANCHOR Pull project version from package.json (in order to make possible the version update with npm).
// Allow an override with an environment variable
const versionFromEnv = process.env.PACKAGE_VERSION

if (versionFromEnv !== undefined && !/^\d+\.\d+\.\d+$/.test(versionFromEnv)) {
  throw new Error('Received invalid version from env. Please use semver format (e.g. 1.2.3).')
}

const packageJson = JSON.parse(readFileSync('package.json', {encoding: 'utf-8'}))
const version = versionFromEnv || packageJson.version
project.package.addField('version', version)

// ANCHOR ESLint and prettier setup
const rules: Linter.RulesRecord = {
  'import/no-relative-parent-imports': ['off'], // Relative paths are required at runtime
  '@typescript-eslint/consistent-type-definitions': ['error', 'interface'], // JSII requires interfaces to be exported
}

addLinters({
  project,
  lintPaths: ['src'],
  extraEslintConfigs: [{rules}],
})

/*
  NPM skips bundling all deps found in dev section.
  Therefore prettier needs to be removed from the dev list to enable bundling.
*/
project.deps.removeDependency('prettier', projen.DependencyType.BUILD)

// ANCHOR Setup git hooks with Husky
addHusky(project, {huskyRules: {commitMsg: {ignoreBranches: ['main']}}})

// ANCHOR Github workflows
const testGithubWorkflow = project.github!.addWorkflow('test')
testGithubWorkflow.on({push: {paths: ['src/**', '.projenrc.ts', '.github/workflows/test.yml', 'package-lock.json']}})

const {package: projectPackage, runScriptCommand} = project
const commonJobOptions = {runScriptCommand, projectPackage}

testGithubWorkflow.addJobs({
  lint: runScriptJob({command: 'lint', ...commonJobOptions}),
  test: runScriptJob({command: 'test', ...commonJobOptions}),
  typecheck: runScriptJob({command: 'typecheck', ...commonJobOptions}),
  build: {...runScriptJob({command: 'build', ...commonJobOptions}), needs: ['lint', 'test', 'typecheck']},
})

new ProjenDriftCheckWorkflow(project.github!, {})

const createReleaseGithubWorkflow = project.github!.addWorkflow('create-release')

createReleaseGithubWorkflow.on({
  workflowDispatch: {
    inputs: {
      bumpLevel: {
        description: 'Version level to bump',
        default: 'patch',
        required: false,
        type: 'choice',
        options: ['none', 'patch', 'minor', 'major'],
      },
    },
  },
})

createReleaseGithubWorkflow.addJobs({
  create: {
    ...job([
      {
        uses: 'ottofeller/github-actions/create-release@main',

        with: {
          'initial-version': '1.0.0',
          'bump-level': '${{ github.event.inputs.bump_level }}',
          'release-branches': 'main',
          'update-root-package_json': true,
          'github-token': '${{ secrets.GITHUB_TOKEN }}',
        },
      },
    ]),

    permissions: {contents: projen.github.workflows.JobPermission.WRITE},
  },
})

const publishReleaseGithubWorkflow = project.github!.addWorkflow('publish-release')
publishReleaseGithubWorkflow.on({release: {types: ['published', 'unpublished']}})

publishReleaseGithubWorkflow.addJobs({
  'set-commit-hash': job([
    {
      id: 'commit-hash',
      uses: 'ottofeller/github-actions/latest-release-commit-hash@main',
      with: {'github-token': '${{ secrets.GITHUB_TOKEN }}'},
    },
  ]),

  lint: {...runScriptJob({command: 'lint', ...commonJobOptions}), needs: ['set-commit-hash']},
  typecheck: {...runScriptJob({command: 'typecheck', ...commonJobOptions}), needs: ['set-commit-hash']},
  test: {...runScriptJob({command: 'test', ...commonJobOptions}), needs: ['set-commit-hash']},

  publish: {
    needs: ['set-commit-hash', 'lint', 'typecheck', 'test'],

    ...job([
      {
        uses: 'ottofeller/github-actions/publish-npm@main',

        with: {
          ref: '${{ needs.set-commit-hash.outputs.commit_hash }}',
          'registry-url': 'https://registry.npmjs.org/',
          'npm-token': '${{ secrets.NPM_TOKEN }}',
          'include-build-step': true,
        },
      },
    ]),
  },
})

// ANCHOR nmpignore
project.npmignore!.exclude(
  '/cspell.json',
  '/.eslintrc.json',
  '/.prettierrc.json',
  '/.projenrc.ts',
  '/examples/',
  '/src/**',
  '/lib/**/assets/**',
  '**/__tests__/**',
)

project.npmignore!.include('/src/**/assets/**')

project.synth()

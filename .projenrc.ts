import {readFileSync} from 'fs'
import * as projen from 'projen'
import {addHusky} from './src/common/git'
import {job, npmRunJobStep} from './src/common/github'
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
  minNodeVersion: '16.0.0',
  deps: ['projen'],
  bundledDeps: ['prettier', 'eslint'],
  peerDeps: ['projen'],

  devDeps: ['@types/eslint', '@types/jscodeshift'],

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
  jest: true,
  eslint: false,
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

// Use older version of the package that is compatible with TS 3.9 (the version used by JSII)
project.package.addField('overrides', {'@types/babel__traverse': 'ts3.9'})

// ANCHOR ESLint and prettier setup
addLinters({project, lintPaths: ['.projenrc.ts', 'src']})

// Solves the typescript > 4 problem
// https://github.com/projen/projen/blob/0eae60e2cb5a5f7e4b80f96d8760f4be781f82f4/src/cdk/jsii-project.ts#L343
project.addDevDeps('@types/prettier@2.6.0')

// ANCHOR Setup git hooks with Husky
addHusky(project, {})

// ANCHOR Github workflows
const testGithubWorkflow = project.github!.addWorkflow('test')
testGithubWorkflow.on({push: {paths: ['src/**', '.projenrc.ts', '.github/workflows/test.yml', 'package-lock.json']}})

testGithubWorkflow.addJobs({
  lint: job([npmRunJobStep('lint')]),
  test: job([npmRunJobStep('test')]),
  typecheck: job([npmRunJobStep('typecheck')]),
  build: {...job([npmRunJobStep('build')]), needs: ['lint', 'test', 'typecheck']},
})

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

  lint: {needs: ['set-commit-hash'], ...job([npmRunJobStep('lint')])},
  typecheck: {needs: ['set-commit-hash'], ...job([npmRunJobStep('typecheck')])},
  test: {needs: ['set-commit-hash'], ...job([npmRunJobStep('test')])},

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
  '/.eslintrc.json',
  '/.prettierrc.json',
  '/.projenrc.ts',
  '/src/**',
  '/lib/**/assets/**',
  '**/__tests__/**',
)

project.npmignore!.include('/src/**/assets/**')

project.synth()

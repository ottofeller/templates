import {readFileSync} from 'fs'
import * as projen from 'projen'
import {job, npmRunJob} from './src/common/github'

// ANCHOR Basic setup
const project = new projen.cdk.JsiiProject({
  author: 'ottofeller',
  authorAddress: 'https://ottofeller.com',
  defaultReleaseBranch: 'main',
  docgen: false,
  github: true,
  buildWorkflow: false,
  release: false,
  dependabot: true,
  depsUpgrade: false,
  githubOptions: {mergify: false, workflows: true, pullRequestLint: false},
  pullRequestTemplate: false,
  name: '@ottofeller/templates',

  // FIXME A temporary solution until the assets are finally bundled in the build
  npmignoreEnabled: false,

  projenrcTs: true,
  repositoryUrl: 'https://github.com/gvidon/templates.git',
  sampleCode: false,
  description: 'Projen templates for OttoFeller projects',
  packageName: '@ottofeller/templates',
  packageManager: projen.javascript.NodePackageManager.NPM,
  minNodeVersion: '16.0.0',
  deps: ['projen'],

  devDeps: [
    // Solves the typescript > 4 problem
    // https://github.com/projen/projen/blob/0eae60e2cb5a5f7e4b80f96d8760f4be781f82f4/src/cdk/jsii-project.ts#L343
    '@types/prettier@2.6.0',

    '@ottofeller/eslint-config-ofmt@1.7.0',
    '@ottofeller/ofmt@1.7.0',
    '@ottofeller/prettier-config-ofmt@1.7.0',
    'eslint-plugin-import@2.25.4',
    '@typescript-eslint/eslint-plugin@5.10.2',
    '@typescript-eslint/parser',
  ],

  bundledDeps: ['prettier', '@ottofeller/prettier-config-ofmt'],
  peerDeps: ['projen'],

  scripts: {
    format: 'npx ofmt ".projenrc.ts src"',
    lint: 'npx ofmt --lint ".projenrc.ts src" && npx olint src .projenrc.ts',
    typecheck: 'tsc --noEmit --project tsconfig.dev.json',
  },

  jest: true,
  eslint: false,
})

// REVIEW There is probably another way to manage the version property
const versionFromEnv = process.env.PACKAGE_VERSION

if (versionFromEnv !== undefined && !/^\d+\.\d+\.\d+$/.test(versionFromEnv)) {
  throw new Error('Received invalid version from env. Please use semver format (e.g. 1.2.3).')
}

const packageJson = JSON.parse(readFileSync('package.json', {encoding: 'utf-8'}))
const version = versionFromEnv || packageJson.version
project.package.addField('version', version)

// ANCHOR ESLint and prettier setup
project.package.addField('prettier', '@ottofeller/prettier-config-ofmt')

project.package.addField('eslintConfig', {
  extends: [
    '@ottofeller/eslint-config-ofmt/eslint.quality.cjs',
    '@ottofeller/eslint-config-ofmt/eslint.formatting.cjs',
  ],
})

// Use older version of the package that is compatible with TS 3.9 (the version used by JSII)
project.package.addField('overrides', {'@types/babel__traverse': 'ts3.9'})

// ANCHOR Github workflows
const testGithubWorkflow = project.github!.addWorkflow('test')
testGithubWorkflow.on({push: {paths: ['src/**', '.projenrc.ts', '.github/workflows/test.yml', 'package-lock.json']}})

testGithubWorkflow.addJobs({
  lint: job([npmRunJob('lint')]),
  test: job([npmRunJob('test')]),
  typecheck: job([npmRunJob('typecheck')]),
  build: {...job([npmRunJob('build')]), needs: ['lint', 'test', 'typecheck']},
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
  create: job([
    {
      uses: 'ottofeller/github-actions/create-release@main',

      with: {
        'initial-version': '1.0.0',
        'bump-level': '${{ github.event.inputs.bump-level }}',
        'release-branches': 'master',
        'update-root-package_json': true,
        'github-token': '${{ secrets.GITHUB_TOKEN }}',
      },
    },
  ]),
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

  lint: {needs: ['set-commit-hash'], ...job([npmRunJob('lint')])},
  typecheck: {needs: ['set-commit-hash'], ...job([npmRunJob('typecheck')])},
  test: {needs: ['set-commit-hash'], ...job([npmRunJob('test')])},

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

project.synth()

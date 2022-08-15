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

    '@ottofeller/eslint-config-ofmt@1.4.1',
    '@ottofeller/ofmt@1.4.1',
    '@ottofeller/prettier-config-ofmt@1.4.1',
    'eslint-plugin-import@2.25.4',
    '@typescript-eslint/eslint-plugin@5.10.2',
    '@typescript-eslint/parser',
  ],

  peerDeps: ['projen'],

  scripts: {
    format: 'npx ofmt .projenrc.ts && npx ofmt src',
    lint: 'npx ofmt --lint .projenrc.ts && npx ofmt --lint src && npx olint src .projenrc.ts --ignore-pattern "!.projenrc.ts"',
    typecheck: 'tsc --noEmit --project tsconfig.dev.json',
  },

  // npx projen build fails if jest is enabled
  jest: false,

  eslint: false,
})

// REVIEW There is probably another way to manage the version property
project.package.addField('version', '1.1.0')

// ANCHOR ESLint and prettier setup
project.package.addField('prettier', '@ottofeller/prettier-config-ofmt')
project.package.addField('eslintConfig', {extends: ['@ottofeller/eslint-config-ofmt/eslint.quality.cjs']})

// ANCHOR Github workflows
const testGithubWorkflow = project.github!.addWorkflow('test')
testGithubWorkflow.on({push: {paths: ['src/**']}})

testGithubWorkflow.addJobs({
  lint: job([npmRunJob('lint')]),
  typecheck: job([npmRunJob('typecheck')]),
  test: job([npmRunJob('test')]),
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

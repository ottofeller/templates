import * as projen from 'projen'
import {JobStep} from 'projen/lib/github/workflows-model'

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

    '@ottofeller/eslint-config-ofmt@1.3.6',
    '@ottofeller/ofmt@1.3.6',
    '@ottofeller/prettier-config-ofmt@1.3.6',
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

// ANCHOR ESLint and prettier setup
project.package.addField('prettier', '@ottofeller/prettier-config-ofmt')
project.package.addField('eslintConfig', {extends: ['@ottofeller/eslint-config-ofmt/eslint.quality.cjs']})

// ANCHOR Github Workflow
const githubWorkflow = project.github!.addWorkflow('Test')

const job = (steps: Array<JobStep>) => ({
  runsOn: ['ubuntu-latest'],
  permissions: {contents: projen.github.workflows.JobPermission.READ},
  steps,
})

githubWorkflow.on({pullRequestTarget: {types: ['opened', 'synchronize', 'reopened']}, push: {branches: ['*']}})

githubWorkflow.addJobs({
  lint: job([{uses: 'ottofeller/github-actions/npm-run@main', with: {'node-version': 16, command: 'npm run lint'}}]),

  typecheck: job([
    {uses: 'ottofeller/github-actions/npm-run@main', with: {'node-version': 16, command: 'npm run typecheck'}},
  ]),

  test: job([{uses: 'ottofeller/github-actions/npm-run@main', with: {'node-version': 16, command: 'npm run test'}}]),
})

project.synth()

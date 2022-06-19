import {cdk, javascript} from 'projen'

const project = new cdk.JsiiProject({
  author: 'ottofeller',
  authorAddress: 'https://ottofeller.com',
  defaultReleaseBranch: 'main',
  docgen: false,
  githubOptions: {mergify: false, workflows: false, pullRequestLint: false},
  pullRequestTemplate: false,
  name: '@ottofeller/templates',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/gvidon/templates.git',
  sampleCode: false,
  description: 'Projen templates for OttoFeller projects',
  packageName: 'nextjs',
  packageManager: javascript.NodePackageManager.NPM,
  minNodeVersion: '16.0.0',
  deps: ['projen@0.57.3'],
  devDeps: [
    // Solves the typescript > 4 problem (https://github.com/projen/projen/blob/0eae60e2cb5a5f7e4b80f96d8760f4be781f82f4/src/cdk/jsii-project.ts#L343).
    '@types/prettier@2.6.0',

    '@ottofeller/eslint-config-ofmt@1.3.6',
    '@ottofeller/ofmt@1.3.6',
    '@ottofeller/prettier-config-ofmt@1.3.6',
    'eslint-plugin-import@2.25.4',
    '@typescript-eslint/eslint-plugin@5.10.2',
    '@typescript-eslint/parser',
  ],

  peerDeps: ['projen@0.57.3'],

  scripts: {
    format: 'npx ofmt .projenrc.ts && npx ofmt src',
    lint: 'npx ofmt --lint .projenrc.ts && npx ofmt --lint src && npx olint src .projenrc.ts --ignore-pattern "!.projenrc.ts"',
    typecheck: 'tsc --noEmit --project tsconfig.dev.json',
  },

  // npx projen build fails if jest is enabled
  jest: false,

  eslint: false,
})

project.synth()

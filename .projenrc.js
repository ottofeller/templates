const { cdk, javascript } = require('projen');

// ANCHOR 1: Project base config.
const project = new cdk.JsiiProject({
  author: 'Ottofeller',
  authorOrganization: true,
  defaultReleaseBranch: 'main',
  name: '@ottofeller/nextjs-ts-template',
  description: 'projen template for nextjs projects with typescript support',
  packageName: 'nextjs-ts-template',
  repositoryUrl: 'https://github.com/ottofeller/templates.git',
  minNodeVersion: '16.0.0',
  packageManager: javascript.NodePackageManager.NPM,
  eslint: false,
  prettier: false,

  scripts: {
    format: 'npx ofmt src',
    lint: 'npx ofmt --lint src && npx olint src',
  },

  testdir: 'src/__tests__',
  jest: true,

  // deps: [],
  devDeps: [
    'projen@0.57.3',
    '@types/prettier@2.6.0', // Solves the typescript > 4 problem (https://github.com/projen/projen/blob/0eae60e2cb5a5f7e4b80f96d8760f4be781f82f4/src/cdk/jsii-project.ts#L343).
    '@ottofeller/eslint-config-ofmt@1.3.5',
    '@ottofeller/ofmt@1.3.5',
    '@ottofeller/prettier-config-ofmt@1.3.5',
    'eslint-plugin-import@2.25.4',
    '@typescript-eslint/eslint-plugin@5.10.2'
  ],

  peerDeps: ['projen@0.57.3'],
});

// ANCHOR 2: Add `ofmt` configs.
const packageJson = project.tryFindObjectFile('package.json');
packageJson.addOverride('prettier', '@ottofeller/prettier-config-ofmt')
packageJson.addOverride('eslintConfig', {
  extends: '@ottofeller/eslint-config-ofmt/eslint.quality.cjs'
})

project.synth();
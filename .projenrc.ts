import { cdk } from 'projen';
const project = new cdk.JsiiProject({
  author: 'ottofeller',
  authorAddress: 'https://ottofeller.com',
  defaultReleaseBranch: 'main',
  docgen: false,
  githubOptions: {mergify: false, workflows: false},
  pullRequestTemplate: false,
  name: '@ottofeller/templates',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/gvidon/templates.git',
  sampleCode: false,
  deps: ['projen'],
  peerDeps: ['projen'],

  // npx projen build fails if jest is enabled
  jest: false,

  eslint: false,
});
project.synth();

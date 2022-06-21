import * as projen from 'projen'
import {PullRequestTest} from './pull-request-test-workflow'
export class OttofellerNextjsProject extends projen.web.NextJsTypeScriptProject {
  constructor(options: projen.typescript.TypeScriptProjectOptions) {
    super({
      ...options,
      projenrcTs: true,
      projenrcJs: false,
      defaultReleaseBranch: 'main',
      name: 'nextjs',
      packageManager: projen.javascript.NodePackageManager.NPM,
      tsconfig: {compilerOptions: {target: 'es6'}},
      devDeps: ['@ottofeller/eslint-config-ofmt', '@ottofeller/ofmt', '@ottofeller/prettier-config-ofmt', 'eslint@>=8'],

      scripts: {
        format: 'npx ofmt .projenrc.ts && npx ofmt pages',
        lint: 'npx ofmt --lint .projenrc.ts && npx ofmt --lint pages && npx olint pages .projenrc.ts',
        typecheck: 'tsc --noEmit --project tsconfig.dev.json',
      },

      github: true,
      githubOptions: {mergify: false, pullRequestLint: false},
      buildWorkflow: false,
      release: false,
      depsUpgrade: false,
      pullRequestTemplate: false,
    })

    if (this.github) {
      new PullRequestTest(this.github)
    }
  }
}

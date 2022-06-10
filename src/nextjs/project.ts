import {javascript, TextFile, web} from 'projen'
// eslint-disable-next-line import/no-relative-parent-imports -- projen jsii project compilation does not pick up path aliases. Thus relative import are used as a safe alternative.
import {PullRequestLint} from '../github/pull-request-lint'
import {configureJest, DEFAULT_CONFIG_FILENAME} from './jest'
import {SampleCode, indexPage, indexPageTest} from './SampleCode'

/**
 * Project that wraps NextJsTypeScriptProject and adds specific configurations and sample code.
 *
 * ID shall be different from IDs used by internal projen classes.
 * @pjid ottofeller-nextjs
 */
export class OttofellerNextJs extends web.NextJsTypeScriptProject {
  constructor(options: web.NextJsTypeScriptProjectOptions) {
    super({
      ...options,
      docgen        : false,
      packageManager: javascript.NodePackageManager.NPM,
      sampleCode    : false,

      // GitHub CI setup
      github       : true,
      githubOptions: {
        mergify        : false,
        pullRequestLint: false,
      },
      buildWorkflow: false,
      release      : false,
      depsUpgrade  : false,
      jest: true,
      jestOptions: {
        configFilePath: DEFAULT_CONFIG_FILENAME,
        junitReporting: false,
      }
    })

    // javascript.NpmConfig class sets only registry. Hence a need for manual file creation.
    new TextFile(this, '.npmrc', {
      lines: [
        '# ~~ Generated by projen. To modify, edit .projenrc.ts and run "npx projen".',
        'fund=false',
        'loglevel=error',
        'engine-strict=true',
        'send-metrics=false',
        'legacy-peer-deps=true',
      ],
    })

    // Next configures Jest with a function that looks into the project. Therefore static config won't work.
    configureJest(this)

    this.addDeps(
      '@apollo/client',
      '@tailwindcss/line-clamp',
      'classnames',
      'cookie-parser',
      'dayjs',
      'dotenv',
      'graphql-request',
      'jsonwebtoken',
      'next-cookies',
      'next-env',
      'next-with-apollo',
      'react-hook-form',
      'react-portal',
      'yup',
    )

    this.addDevDeps(
      '@graphql-codegen/add',
      '@graphql-codegen/cli',
      '@graphql-codegen/import-types-preset',
      '@graphql-codegen/introspection',
      '@graphql-codegen/named-operations-object',
      '@graphql-codegen/typescript',
      '@graphql-codegen/typescript-graphql-request',
      '@graphql-codegen/typescript-operations',
      '@graphql-codegen/typescript-react-apollo',
      '@ottofeller/dangerules',
      '@ottofeller/eslint-config-ofmt',
      '@ottofeller/ofmt',
      '@ottofeller/prettier-config-ofmt',
      '@testing-library/react',
      '@types/jest',
      'ajv',
      'danger',
      'empty',
      'eslint',
      'eslint-plugin-graphql',
      'graphql',
      'jest',
      'jest-environment-jsdom',
      'jest-fetch-mock',
      'jest-transform-stub',
      'npm-run-all',
      'postcss',
      'react-test-renderer',
      'stylelint',
      'stylelint-declaration-block-no-ignored-properties',
      'stylelint-images',
      'stylelint-order',
    )

    if (this.github) {
      new PullRequestLint(this.github)
    }

    new SampleCode(this, 'index.tsx', indexPage)
    new SampleCode(this, '__tests__/index.tsx', indexPageTest)
  }
}

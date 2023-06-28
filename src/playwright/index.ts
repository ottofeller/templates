import * as path from 'path'
import {SampleFile} from 'projen'
import {NodePackageManager} from 'projen/lib/javascript'
import {TypeScriptProject, TypeScriptProjectOptions} from 'projen/lib/typescript'
import {AssetFile, WithCustomLintPaths, WithDefaultWorkflow, WithDocker, WithGitHooks} from '../common'
import {sampleCode} from './sample-code'

export interface OttofellerPlaywrightProjectOptions
  extends TypeScriptProjectOptions,
    WithDocker,
    WithDefaultWorkflow,
    WithCustomLintPaths,
    WithGitHooks {
  /**
   * Setup Lighthouse audit script & GitHub job.
   *
   * @default true
   */
  readonly isLighthouseEnabled?: boolean
}
/**
 * Playwright template with TypeScript support.
 *
 * @pjid ottofeller-playwright
 */
export class OttofellerPlaywrightProject extends TypeScriptProject {
  constructor(options: OttofellerPlaywrightProjectOptions) {
    super({
      ...options,
      bundlerOptions: {},
      projenrcTs: true,
      projenrcJs: false,
      defaultReleaseBranch: 'main',
      name: 'nextjs',
      packageManager: options.packageManager ?? NodePackageManager.NPM,
      srcdir: options.srcdir ?? '.',

      tsconfig: {
        compilerOptions: {
          baseUrl: './',
          target: 'es6',
        },
      },
    })

    // ANCHOR Add required dependencies
    this.addDevDeps('yaml') // REVIEW Required during "npx projen new", fails without this dependency

    // ANCHOR Source code
    const assetsDir = path.join(__dirname, '..', '..', 'src/playwright/assets')
    sampleCode(this, options, assetsDir)

    // ANCHOR playwright config
    new AssetFile(this, 'playwright.config.ts', {sourcePath: path.join(assetsDir, 'palywright.config.ts.sample')})

    this.addDeps('@playwright/test', 'playwright-qase-reporter')

    this.addScripts({'test:e2e': 'playwright test'})

    // ANCHOR Set up Lighthouse audit
    const isLighthouseEnabled = options.isLighthouseEnabled ?? true

    if (isLighthouseEnabled) {
      this.addDevDeps('@lhci/cli')
      this.addScripts({lighthouse: 'lhci autorun'})
      new SampleFile(this, 'lighthouserc.js', {sourcePath: path.join(assetsDir, 'lighthouserc.js')})
    }
  }
}

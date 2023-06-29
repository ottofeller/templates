import * as path from 'path'
import * as projen from 'projen'
import {OttofellerPlaywrightProject, OttofellerPlaywrightProjectOptions} from '.'

/**
 * Add sample source code for the project.
 */
export function sampleCode(
  project: OttofellerPlaywrightProject,
  options: OttofellerPlaywrightProjectOptions,
  assetsDir: string,
) {
  if (options.sampleCode === false) {
    return
  }

  new projen.SampleFile(project, 'playwright.config.ts', {
    sourcePath: path.join(assetsDir, 'playwright.config.ts.sample'),
  })

  new projen.SampleFile(project, 'tests/common/index.ts', {
    sourcePath: path.join(assetsDir, 'tests/common/index.ts.sample'),
  })

  new projen.SampleFile(project, 'tests/common/test.ts', {
    sourcePath: path.join(assetsDir, 'tests/common/test.ts.sample'),
  })

  new projen.SampleFile(project, 'tests/common/users.ts', {
    sourcePath: path.join(assetsDir, 'tests/common/users.ts'),
  })

  new projen.SampleFile(project, 'tests/data/index.ts', {
    sourcePath: path.join(assetsDir, 'tests/data/index.ts'),
  })

  new projen.SampleFile(project, 'tests/data/error-texts.json', {
    sourcePath: path.join(assetsDir, 'tests/data/error-texts.json'),
  })

  new projen.SampleFile(project, 'tests/pages/index.ts', {
    sourcePath: path.join(assetsDir, 'tests/pages/index.ts.sample'),
  })

  new projen.SampleFile(project, 'tests/pages/base.ts', {
    sourcePath: path.join(assetsDir, 'tests/pages/base.ts.sample'),
  })

  new projen.SampleFile(project, 'tests/pages/index.ts', {
    sourcePath: path.join(assetsDir, 'tests/pages/index.ts.sample'),
  })

  new projen.SampleFile(project, 'tests/pages/sign-in.ts', {
    sourcePath: path.join(assetsDir, 'tests/pages/sign-in.ts.sample'),
  })

  new projen.SampleFile(project, 'tests/pages/products.ts', {
    sourcePath: path.join(assetsDir, 'tests/pages/products.ts.sample'),
  })

  new projen.SampleFile(project, 'tests/specs/auth.spec.ts', {
    sourcePath: path.join(assetsDir, 'tests/specs/auth.spec.ts.sample'),
  })
}

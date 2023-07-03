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

  new projen.SampleFile(project, 'common/index.ts', {
    sourcePath: path.join(assetsDir, 'common/index.ts.sample'),
  })

  new projen.SampleFile(project, 'common/test.ts', {
    sourcePath: path.join(assetsDir, 'common/test.ts.sample'),
  })

  new projen.SampleFile(project, 'common/enums/user.ts', {
    sourcePath: path.join(assetsDir, 'common/enums/user.ts'),
  })

  new projen.SampleFile(project, 'common/enums/index.ts', {
    sourcePath: path.join(assetsDir, 'common/enums/index.ts.sample'),
  })

  new projen.SampleFile(project, 'data/index.ts', {
    sourcePath: path.join(assetsDir, 'data/index.ts'),
  })

  new projen.SampleFile(project, 'data/errors.json', {
    sourcePath: path.join(assetsDir, 'data/errors.json'),
  })

  new projen.SampleFile(project, 'pages/index.ts', {
    sourcePath: path.join(assetsDir, 'pages/index.ts.sample'),
  })

  new projen.SampleFile(project, 'pages/base.ts', {
    sourcePath: path.join(assetsDir, 'pages/base.ts.sample'),
  })

  new projen.SampleFile(project, 'pages/index.ts', {
    sourcePath: path.join(assetsDir, 'pages/index.ts.sample'),
  })

  new projen.SampleFile(project, 'pages/sign-in.ts', {
    sourcePath: path.join(assetsDir, 'pages/sign-in.ts.sample'),
  })

  new projen.SampleFile(project, 'pages/products.ts', {
    sourcePath: path.join(assetsDir, 'pages/products.ts.sample'),
  })

  new projen.SampleFile(project, 'specs/auth.spec.ts', {
    sourcePath: path.join(assetsDir, 'specs/auth.spec.ts.sample'),
  })
}

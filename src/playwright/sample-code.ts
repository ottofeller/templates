import * as path from 'path'
import {SampleFile} from 'projen'
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

  new SampleFile(project, '.env.development', {sourcePath: path.join(assetsDir, '.env.development')})

  new SampleFile(project, 'common/index.ts', {sourcePath: path.join(assetsDir, 'common/index.ts.sample')})
  new SampleFile(project, 'common/test.ts', {sourcePath: path.join(assetsDir, 'common/test.ts.sample')})
  new SampleFile(project, 'common/enums/user.ts', {sourcePath: path.join(assetsDir, 'common/enums/user.ts')})
  new SampleFile(project, 'common/enums/index.ts', {sourcePath: path.join(assetsDir, 'common/enums/index.ts.sample')})

  new SampleFile(project, 'data/index.ts', {sourcePath: path.join(assetsDir, 'data/index.ts')})
  new SampleFile(project, 'data/errors.json', {sourcePath: path.join(assetsDir, 'data/errors.json')})

  new SampleFile(project, 'pages/index.ts', {sourcePath: path.join(assetsDir, 'pages/index.ts.sample')})
  new SampleFile(project, 'pages/base.ts', {sourcePath: path.join(assetsDir, 'pages/base.ts.sample')})
  new SampleFile(project, 'pages/index.ts', {sourcePath: path.join(assetsDir, 'pages/index.ts.sample')})
  new SampleFile(project, 'pages/sign-in.ts', {sourcePath: path.join(assetsDir, 'pages/sign-in.ts.sample')})
  new SampleFile(project, 'pages/products.ts', {sourcePath: path.join(assetsDir, 'pages/products.ts.sample')})

  new SampleFile(project, 'specs/auth.spec.ts', {sourcePath: path.join(assetsDir, 'specs/auth.spec.ts.sample')})
}

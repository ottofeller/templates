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

  new projen.SampleDir(project, 'tests/common', {sourceDir: path.join(assetsDir, 'tests/common')})
  new projen.SampleDir(project, 'tests/data', {sourceDir: path.join(assetsDir, 'tests/data')})
  new projen.SampleDir(project, 'tests/pages', {sourceDir: path.join(assetsDir, 'tests/pages')})
  new projen.SampleDir(project, 'tests/specs', {sourceDir: path.join(assetsDir, 'tests/specs')})
}

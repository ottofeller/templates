import * as path from 'path'
import {SampleFile} from 'projen'
import {OttofellerBackendTestProject, OttofellerBackendTestProjectOptions} from '.'

export function sampleCode(
  project: OttofellerBackendTestProject,
  options: OttofellerBackendTestProjectOptions,
  assetsDir: string,
) {
  if (options.sampleCode === false) {
    return
  }

  new SampleFile(project, '.env.development', {sourcePath: path.join(assetsDir, '.env.development')})
}

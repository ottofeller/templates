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

  new SampleFile(project, 'api/auth/index.ts', {sourcePath: path.join(assetsDir, 'api/auth/index.ts.sample')})
  new SampleFile(project, 'api/auth/request.ts', {sourcePath: path.join(assetsDir, 'api/auth/request.ts.sample')})
  new SampleFile(project, 'api/auth/response.ts', {sourcePath: path.join(assetsDir, 'api/auth/response.ts.sample')})

  new SampleFile(project, 'common/client.ts', {sourcePath: path.join(assetsDir, 'common/client.ts.sample')})
  new SampleFile(project, 'common/index.ts', {sourcePath: path.join(assetsDir, 'common/index.ts.sample')})

  new SampleFile(project, 'tests/auth.spec.ts', {sourcePath: path.join(assetsDir, 'tests/auth.spec.ts.sample')})
}

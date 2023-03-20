import * as path from 'path'
import * as projen from 'projen'
import type {OttofellerApolloServerProject, OttofellerApolloServerProjectOptions} from '.'

/**
 * Add sample source code for the project.
 */
export function sampleCode(
  project: OttofellerApolloServerProject,
  options: OttofellerApolloServerProjectOptions,
  assetsDir: string,
) {
  if (options.sampleCode === false) {
    return
  }

  new projen.SampleFile(project, 'src/index.ts', {sourcePath: path.join(assetsDir, 'src/index.ts.sample')})

  new projen.SampleFile(project, 'src/logger/create-logger.ts', {
    sourcePath: path.join(assetsDir, 'src/logger/create-logger.ts'),
  })

  // ANCHOR tests
  if (options.jest ?? true) {
    new projen.SampleFile(project, 'src/logger/__tests__/index.ts', {
      sourcePath: path.join(assetsDir, 'src/logger/__tests__/index.ts.sample'),
    })
  }
}

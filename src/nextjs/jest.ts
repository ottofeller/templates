import * as path from 'path'
import * as projen from 'projen'
import type {OttofellerNextjsProject, OttofellerNextjsProjectOptions} from '.'
import {AssetFile} from '../common'

/**
 * Add jest to the project.
 */
export function setupJest(
  project: OttofellerNextjsProject,
  options: OttofellerNextjsProjectOptions,
  assetsDir: string,
) {
  const includeTests = options.jest ?? true

  if (!includeTests) {
    return
  }

  // ANCHOR Dependencies
  project.addDevDeps('@testing-library/react', '@types/jest', 'jest', 'jest-environment-jsdom')

  // ANCHOR Files
  new AssetFile(project, 'jest.config.defaults.js', {sourcePath: path.join(assetsDir, 'jest.config.defaults.js')})
  new projen.SampleFile(project, 'jest.config.js', {sourcePath: path.join(assetsDir, 'jest.config.js')})

  // ANCHOR Tasks
  const testTask = project.removeTask('test')
  const testTaskName = testTask ? 'test' : 'test-unit'

  project.addScripts({
    [testTaskName]: 'jest --no-cache --all',
    'test-unit:watch': 'jest --watch',
  })
}

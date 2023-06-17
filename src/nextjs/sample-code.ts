import * as fs from 'fs'
import * as path from 'path'
import * as projen from 'projen'
import type {OttofellerNextjsProject, OttofellerNextjsProjectOptions} from '.'

/**
 * Add sample source code for the project.
 */
export function sampleCode(
  project: OttofellerNextjsProject,
  options: OttofellerNextjsProjectOptions,
  assetsDir: string,
) {
  if (options.sampleCode === false) {
    return
  }

  const isUiConfigEnabled = options.isUiConfigEnabled ?? true

  const homeComponentFilePath = 'src/Home/index.tsx'
  new projen.SampleFile(project, homeComponentFilePath, {sourcePath: path.join(assetsDir, homeComponentFilePath)})

  const indexPagePath = 'app/page.tsx'
  new projen.SampleFile(project, indexPagePath, {sourcePath: path.join(assetsDir, indexPagePath)})

  const layoutFilePath = 'app/layout.tsx'
  const layoutContents = fs.readFileSync(path.join(assetsDir, layoutFilePath), {encoding: 'utf-8'}).split('\n')

  if (isUiConfigEnabled) {
    layoutContents.unshift("import 'src/assets/global.css'", '')
    project.postSynthFormattingPaths.push(layoutFilePath)
  }

  new projen.SampleFile(project, layoutFilePath, {contents: layoutContents.join('\n')})

  if (isUiConfigEnabled) {
    const globalCssPath = 'src/assets/global.css'
    new projen.SampleFile(project, globalCssPath, {sourcePath: path.join(assetsDir, globalCssPath)})
  }

  const includeTests = options.jest ?? true

  if (includeTests) {
    new projen.SampleFile(project, 'src/Home/__tests__/index.tsx', {
      sourcePath: path.join(assetsDir, 'src/Home/__tests__/index.tsx.sample'),
    })
  }

  const envDevelopmentPath = '.env.development'
  new projen.SampleFile(project, envDevelopmentPath, {sourcePath: path.join(assetsDir, envDevelopmentPath)})
}

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

  const indexPagePath = 'pages/index.tsx'
  new projen.SampleFile(project, indexPagePath, {sourcePath: path.join(assetsDir, indexPagePath)})

  const appFilePath = 'pages/_app.tsx'
  const appContents = fs.readFileSync(path.join(assetsDir, appFilePath), {encoding: 'utf-8'}).split('\n')

  if (isUiConfigEnabled) {
    appContents.unshift("import 'src/assets/global.css'")
    project.postSynthFormattingPaths.push(appFilePath)
  }

  new projen.SampleFile(project, appFilePath, {contents: appContents.join('\n')})

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
}

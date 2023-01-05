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
  const includeUIPackages = options.ui ?? true

  const indexFilePath = 'pages/index.tsx'
  new projen.SampleFile(project, indexFilePath, {sourcePath: path.join(assetsDir, indexFilePath)})

  const appFilePath = 'pages/_app.tsx'
  const appContents = fs.readFileSync(path.join(assetsDir, appFilePath), {encoding: 'utf-8'}).split('\n')

  if (includeUIPackages) {
    appContents.unshift("import 'assets/global.css'")
  }

  new projen.SampleFile(project, appFilePath, {contents: appContents.join('\n')})

  if (includeUIPackages) {
    const globalCssPath = 'src/assets/global.css'
    new projen.SampleFile(project, globalCssPath, {sourcePath: path.join(assetsDir, globalCssPath)})
  }
}

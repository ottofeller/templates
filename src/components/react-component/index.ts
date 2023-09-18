import * as fs from 'fs'
import * as path from 'path'
import {Project} from 'projen/lib'
import {AssetFile, AssetFileTemplate} from '../../common'
import {OttofellerComponentOptions} from '../component-options'

/**
 * A generic react component template.
 *
 * @pjid ottofeller-component-react
 */
export class OttofellerReactComponentProject extends Project {
  constructor(options: OttofellerComponentOptions) {
    const ejecting = process.env.PROJEN_EJECTING
    process.env.PROJEN_EJECTING = '1'

    super({
      commitGenerated: false,
      ...options,
    })

    // ANCHOR Delete all components
    this.tryRemoveFile('.gitignore')

    // ANCHOR Delete all tasks
    this.removeTask('build')
    this.removeTask('compile')
    this.removeTask('package')
    this.removeTask('post-compile')
    this.removeTask('pre-compile')
    this.removeTask('test')

    // ANCHOR The component code
    const componentFilePath = 'index.tsx'
    const testFilePath = '__tests__/index.tsx'
    const assetsDir = path.join(__dirname, '../../..', 'src/components/react-component/assets')
    const template: AssetFileTemplate = {templateString: 'COMPONENT_NAME', replacement: this.name}
    new AssetFile(this, componentFilePath, {sourcePath: path.join(assetsDir, `${componentFilePath}.sample`), template})
    new AssetFile(this, testFilePath, {sourcePath: path.join(assetsDir, `${testFilePath}.sample`), template})

    // ANCHOR Restore env var
    process.env.PROJEN_EJECTING = ejecting
  }

  postSynthesize(): void {
    fs.rmSync(path.join(this.outdir, 'scripts'), {recursive: true})
    const cwd = process.cwd()
    fs.rmSync(path.join(cwd, 'node_modules'), {recursive: true})
    fs.rmSync(path.join(cwd, 'package.json'))
  }
}

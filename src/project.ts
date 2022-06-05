import {javascript, web} from 'projen'
import {SampleCode, srcCode} from './SampleCode'

/**
 * Project that wraps NextJsTypeScriptProject and adds specific configurations and sample code.
 *
 * @pjid ottofeller-nextjs
 */
export class OttofellerNextJs extends web.NextJsTypeScriptProject {
  constructor(options: web.NextJsTypeScriptProjectOptions) {
    super({
      ...options,
      sampleCode: false,
      jest: true,
      packageManager: javascript.NodePackageManager.NPM,
    })

    new SampleCode(this, 'index.tsx', srcCode)
  }
}

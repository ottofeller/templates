import * as projen from 'projen'

export class OttofellerNextjsProject extends projen.typescript.TypeScriptProject {
  private readonly nextjs: projen.web.NextJsTypeScriptProject

  constructor(options: projen.typescript.TypeScriptProjectOptions) {
    super({...options, projenrcTs: true, projenrcJs: false})

    this.nextjs = new projen.web.NextJsTypeScriptProject({
      defaultReleaseBranch: 'main',
      name: 'nextjs',
      projenrcJs: false,
    })
  }

  synth(): void {
    super.synth()
    this.nextjs.synth()
  }
}

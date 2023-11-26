# A CDK app with a nested NextJS service
This application defines an AWS CDK project as a root and adds NextJS project as a subproject. The `parent` property on NextJS project options sets the dependency, which ensures the following:
- both projects are synthesized from a single _projenrc_ file;
- subprojects use root level default task;
- only a single GitHub instance is created (in the root);

```typescript
// .projenrc.ts
import {OttofellerCDKProject, OttofellerNextjsProject} from '@ottofeller/templates'

const cdk = new OttofellerCDKProject({
  cdkVersion: '2.111.0',
  defaultReleaseBranch: 'main',
  devDeps: ['@ottofeller/templates'],
  name: 'cdk',
})

const nextjs = new OttofellerNextjsProject({
  defaultReleaseBranch: 'main',
  devDeps: ['@ottofeller/templates'],
  name: 'nextjs',
  parent: cdk,
  outdir:  'webApp',
})

nextjs.synth()
cdk.synth()
```

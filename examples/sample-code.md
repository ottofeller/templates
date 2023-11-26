# Sample code
Sample code is created with a special construct that generates related files only when they are not found in the project. Otherwise an existing file is left as is (all user edits are preserved). Thus a file can be generated when:
- the project is generated from the scratch with `npx projen new`;
- a sample code file is deleted from the project and then resynthesized (with `npm run default`).

In both cases a developer might want to avoid generation of the sample code. It is possible to stop sample code generation with `sampleCode` option.

## New project
```sh
npx projen new ottofeller-nextjs \
  --from @ottofeller/templates \
  --sampleCode false
```

## Existing project
```typescript
import {OttofellerNextjsProject} from '@ottofeller/templates'

const project = new OttofellerNextjsProject({
  defaultReleaseBranch: 'main',
  devDeps: ['@ottofeller/templates'],
  name: 'nextjs',

  // Disable sample code generation
  sampleCode: false,
})

project.synth()
```

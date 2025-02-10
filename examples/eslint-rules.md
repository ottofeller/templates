# Eslint rules
The templates include a set of eslint rules to be applied to a project.
These rules are supposed to be respected.
However in case a rule causes too much trouble
and has to be silenced with incline comments way too often,
it can be disabled with `projen` override:

```typescript
import {OttofellerNextjsProject} from '@ottofeller/templates'

const project = new OttofellerNextjsProject({
  defaultReleaseBranch: 'main',
  devDeps: ['@ottofeller/templates'],
  name: 'nextjs',
})

// Delete a rule
project.tryFindObjectFile('.eslintrc.json')?.addDeletionOverride('rules.curly')
// or disable it
project.tryFindObjectFile('.eslintrc.json')?.addOverride('rules.curly', 'off')

project.synth()
```

# Github workflows

## Remove default workflow
Most of the templates come with a preconfigured workflows that run on PRs and perform static code analysis and check for unsinthesized changes to _projenrc_ file. Other workflows such as release flow might be present in some projects as well.

In order to remove the default workflows from the project it is not necessary to delete that manually. The options `hasDefaultGithubWorkflows: false` removes these workflows from a project.


### New project
```sh
npx projen new ottofeller-nextjs \
  --from @ottofeller/templates \
  --hasDefaultGithubWorkflows false
```

### Existing project
```typescript
import {OttofellerNextjsProject} from '@ottofeller/templates'

const project = new OttofellerNextjsProject({
  defaultReleaseBranch: 'main',
  devDeps: ['@ottofeller/templates'],
  name: 'nextjs',

  // Disable default workflows generation
  hasDefaultGithubWorkflows: false
})

project.synth()
```

## Provide options for `PullRequestTest` workflow
The `PullRequestTest` workflow by default pulls its options from the project. The following options are configurable via project options:
- `isLighthouseEnabled` - a flag that enable `Lighthouse` audit (releveant to the `ottofeller-nextjs` project),
- `workflowNodeVersion` - the node version to use in GitHub workflows,
- `name` - either `test` for a standalone project or `test-${options.name}` for a subproject in a monorepo setup,
- `outdir` - points out to the project location (relevant only for subprojects).

### Fine-tune the workflow
In order to change the remaining options, the `PullRequestTest` workflow needs to be removed from the project and then added manually. See [PullRequestTestOptions](../src/common/github/pull-request-test-workflow.ts) for a full list of options with descriptions, or use your IDE to inspect the options.

```typescript
import {OttofellerNextjsProject} from '@ottofeller/templates'
import {PullRequestTest} from '@ottofeller/templates/lib/common/github'

const project = new OttofellerNextjsProject({
  defaultReleaseBranch: 'main',
  devDeps: ['file:../../templates'],
  name: 'nextjs',

  // Disable default workflows generation
  hasDefaultGithubWorkflows: false
})

new PullRequestTest(project.github!, {
  runScriptCommand: 'node',
  installCommand: 'npm ci --ignore-scripts',
  workflowNodeVersion: 'v20.10.0',
  runsOn: ['windows-latest'],
  name: 'custom-workflow-name',
  triggerOnPushToBranches: ['master'],
  isLighthouseEnabled: false,
})

project.synth()
```

# API Reference <a name="API Reference" id="api-reference"></a>



## Classes <a name="Classes" id="Classes"></a>

### OttofellerNextJs <a name="OttofellerNextJs" id="nextjs-ts-template.OttofellerNextJs"></a>

Project that wraps NextJsTypeScriptProject and adds specific configurations and sample code.

#### Initializers <a name="Initializers" id="nextjs-ts-template.OttofellerNextJs.Initializer"></a>

```typescript
import { OttofellerNextJs } from 'nextjs-ts-template'

new OttofellerNextJs(options: NextJsTypeScriptProjectOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.Initializer.parameter.options">options</a></code> | <code>projen.web.NextJsTypeScriptProjectOptions</code> | *No description.* |

---

##### `options`<sup>Required</sup> <a name="options" id="nextjs-ts-template.OttofellerNextJs.Initializer.parameter.options"></a>

- *Type:* projen.web.NextJsTypeScriptProjectOptions

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.addExcludeFromCleanup">addExcludeFromCleanup</a></code> | Exclude the matching files from pre-synth cleanup. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.addGitIgnore">addGitIgnore</a></code> | Adds a .gitignore pattern. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.addPackageIgnore">addPackageIgnore</a></code> | Exclude these files from the bundled package. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.addTask">addTask</a></code> | Adds a new task to this project. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.addTip">addTip</a></code> | Prints a "tip" message during synthesis. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.annotateGenerated">annotateGenerated</a></code> | Marks the provided file(s) as being generated. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.postSynthesize">postSynthesize</a></code> | Called after all components are synthesized. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.preSynthesize">preSynthesize</a></code> | Called before all components are synthesized. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.removeTask">removeTask</a></code> | Removes a task from a project. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.runTaskCommand">runTaskCommand</a></code> | Returns the shell command to execute in order to run a task. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.synth">synth</a></code> | Synthesize all project files into `outdir`. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.tryFindFile">tryFindFile</a></code> | Finds a file at the specified relative path within this project and all its subprojects. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.tryFindJsonFile">tryFindJsonFile</a></code> | Finds a json file by name. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.tryFindObjectFile">tryFindObjectFile</a></code> | Finds an object file (like JsonFile, YamlFile, etc.) by name. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.tryRemoveFile">tryRemoveFile</a></code> | Finds a file at the specified relative path within this project and removes it. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.addBins">addBins</a></code> | *No description.* |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.addBundledDeps">addBundledDeps</a></code> | Defines bundled dependencies. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.addCompileCommand">addCompileCommand</a></code> | DEPRECATED. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.addDeps">addDeps</a></code> | Defines normal dependencies. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.addDevDeps">addDevDeps</a></code> | Defines development/test dependencies. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.addFields">addFields</a></code> | Directly set fields in `package.json`. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.addKeywords">addKeywords</a></code> | Adds keywords to package.json (deduplicated). |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.addPeerDeps">addPeerDeps</a></code> | Defines peer dependencies. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.addTestCommand">addTestCommand</a></code> | DEPRECATED. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.hasScript">hasScript</a></code> | Indicates if a script by the name name is defined. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.removeScript">removeScript</a></code> | Removes the npm script (always successful). |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.renderWorkflowSetup">renderWorkflowSetup</a></code> | Returns the set of workflow steps which should be executed to bootstrap a workflow. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.setScript">setScript</a></code> | Replaces the contents of an npm package.json script. |

---

##### `addExcludeFromCleanup` <a name="addExcludeFromCleanup" id="nextjs-ts-template.OttofellerNextJs.addExcludeFromCleanup"></a>

```typescript
public addExcludeFromCleanup(globs: string): void
```

Exclude the matching files from pre-synth cleanup.

Can be used when, for example, some
source files include the projen marker and we don't want them to be erased during synth.

###### `globs`<sup>Required</sup> <a name="globs" id="nextjs-ts-template.OttofellerNextJs.addExcludeFromCleanup.parameter.globs"></a>

- *Type:* string

The glob patterns to match.

---

##### `addGitIgnore` <a name="addGitIgnore" id="nextjs-ts-template.OttofellerNextJs.addGitIgnore"></a>

```typescript
public addGitIgnore(pattern: string): void
```

Adds a .gitignore pattern.

###### `pattern`<sup>Required</sup> <a name="pattern" id="nextjs-ts-template.OttofellerNextJs.addGitIgnore.parameter.pattern"></a>

- *Type:* string

The glob pattern to ignore.

---

##### `addPackageIgnore` <a name="addPackageIgnore" id="nextjs-ts-template.OttofellerNextJs.addPackageIgnore"></a>

```typescript
public addPackageIgnore(pattern: string): void
```

Exclude these files from the bundled package.

Implemented by project types based on the
packaging mechanism. For example, `NodeProject` delegates this to `.npmignore`.

###### `pattern`<sup>Required</sup> <a name="pattern" id="nextjs-ts-template.OttofellerNextJs.addPackageIgnore.parameter.pattern"></a>

- *Type:* string

---

##### `addTask` <a name="addTask" id="nextjs-ts-template.OttofellerNextJs.addTask"></a>

```typescript
public addTask(name: string, props?: TaskOptions): Task
```

Adds a new task to this project.

This will fail if the project already has
a task with this name.

###### `name`<sup>Required</sup> <a name="name" id="nextjs-ts-template.OttofellerNextJs.addTask.parameter.name"></a>

- *Type:* string

The task name to add.

---

###### `props`<sup>Optional</sup> <a name="props" id="nextjs-ts-template.OttofellerNextJs.addTask.parameter.props"></a>

- *Type:* projen.TaskOptions

Task properties.

---

##### ~~`addTip`~~ <a name="addTip" id="nextjs-ts-template.OttofellerNextJs.addTip"></a>

```typescript
public addTip(message: string): void
```

Prints a "tip" message during synthesis.

###### `message`<sup>Required</sup> <a name="message" id="nextjs-ts-template.OttofellerNextJs.addTip.parameter.message"></a>

- *Type:* string

The message.

---

##### `annotateGenerated` <a name="annotateGenerated" id="nextjs-ts-template.OttofellerNextJs.annotateGenerated"></a>

```typescript
public annotateGenerated(glob: string): void
```

Marks the provided file(s) as being generated.

This is achieved using the
github-linguist attributes. Generated files do not count against the
repository statistics and language breakdown.

> [https://github.com/github/linguist/blob/master/docs/overrides.md](https://github.com/github/linguist/blob/master/docs/overrides.md)

###### `glob`<sup>Required</sup> <a name="glob" id="nextjs-ts-template.OttofellerNextJs.annotateGenerated.parameter.glob"></a>

- *Type:* string

the glob pattern to match (could be a file path).

---

##### `postSynthesize` <a name="postSynthesize" id="nextjs-ts-template.OttofellerNextJs.postSynthesize"></a>

```typescript
public postSynthesize(): void
```

Called after all components are synthesized.

Order is *not* guaranteed.

##### `preSynthesize` <a name="preSynthesize" id="nextjs-ts-template.OttofellerNextJs.preSynthesize"></a>

```typescript
public preSynthesize(): void
```

Called before all components are synthesized.

##### `removeTask` <a name="removeTask" id="nextjs-ts-template.OttofellerNextJs.removeTask"></a>

```typescript
public removeTask(name: string): Task
```

Removes a task from a project.

###### `name`<sup>Required</sup> <a name="name" id="nextjs-ts-template.OttofellerNextJs.removeTask.parameter.name"></a>

- *Type:* string

The name of the task to remove.

---

##### `runTaskCommand` <a name="runTaskCommand" id="nextjs-ts-template.OttofellerNextJs.runTaskCommand"></a>

```typescript
public runTaskCommand(task: Task): string
```

Returns the shell command to execute in order to run a task.

This will
typically be `npx projen TASK`.

###### `task`<sup>Required</sup> <a name="task" id="nextjs-ts-template.OttofellerNextJs.runTaskCommand.parameter.task"></a>

- *Type:* projen.Task

The task for which the command is required.

---

##### `synth` <a name="synth" id="nextjs-ts-template.OttofellerNextJs.synth"></a>

```typescript
public synth(): void
```

Synthesize all project files into `outdir`.

1. Call "this.preSynthesize()"
2. Delete all generated files
3. Synthesize all sub-projects
4. Synthesize all components of this project
5. Call "postSynthesize()" for all components of this project
6. Call "this.postSynthesize()"

##### `tryFindFile` <a name="tryFindFile" id="nextjs-ts-template.OttofellerNextJs.tryFindFile"></a>

```typescript
public tryFindFile(filePath: string): FileBase
```

Finds a file at the specified relative path within this project and all its subprojects.

###### `filePath`<sup>Required</sup> <a name="filePath" id="nextjs-ts-template.OttofellerNextJs.tryFindFile.parameter.filePath"></a>

- *Type:* string

The file path.

If this path is relative, it will be resolved
from the root of _this_ project.

---

##### ~~`tryFindJsonFile`~~ <a name="tryFindJsonFile" id="nextjs-ts-template.OttofellerNextJs.tryFindJsonFile"></a>

```typescript
public tryFindJsonFile(filePath: string): JsonFile
```

Finds a json file by name.

###### `filePath`<sup>Required</sup> <a name="filePath" id="nextjs-ts-template.OttofellerNextJs.tryFindJsonFile.parameter.filePath"></a>

- *Type:* string

The file path.

---

##### `tryFindObjectFile` <a name="tryFindObjectFile" id="nextjs-ts-template.OttofellerNextJs.tryFindObjectFile"></a>

```typescript
public tryFindObjectFile(filePath: string): ObjectFile
```

Finds an object file (like JsonFile, YamlFile, etc.) by name.

###### `filePath`<sup>Required</sup> <a name="filePath" id="nextjs-ts-template.OttofellerNextJs.tryFindObjectFile.parameter.filePath"></a>

- *Type:* string

The file path.

---

##### `tryRemoveFile` <a name="tryRemoveFile" id="nextjs-ts-template.OttofellerNextJs.tryRemoveFile"></a>

```typescript
public tryRemoveFile(filePath: string): FileBase
```

Finds a file at the specified relative path within this project and removes it.

###### `filePath`<sup>Required</sup> <a name="filePath" id="nextjs-ts-template.OttofellerNextJs.tryRemoveFile.parameter.filePath"></a>

- *Type:* string

The file path.

If this path is relative, it will be
resolved from the root of _this_ project.

---

##### `addBins` <a name="addBins" id="nextjs-ts-template.OttofellerNextJs.addBins"></a>

```typescript
public addBins(bins: {[ key: string ]: string}): void
```

###### `bins`<sup>Required</sup> <a name="bins" id="nextjs-ts-template.OttofellerNextJs.addBins.parameter.bins"></a>

- *Type:* {[ key: string ]: string}

---

##### `addBundledDeps` <a name="addBundledDeps" id="nextjs-ts-template.OttofellerNextJs.addBundledDeps"></a>

```typescript
public addBundledDeps(deps: string): void
```

Defines bundled dependencies.

Bundled dependencies will be added as normal dependencies as well as to the
`bundledDependencies` section of your `package.json`.

###### `deps`<sup>Required</sup> <a name="deps" id="nextjs-ts-template.OttofellerNextJs.addBundledDeps.parameter.deps"></a>

- *Type:* string

Names modules to install.

By default, the the dependency will
be installed in the next `npx projen` run and the version will be recorded
in your `package.json` file. You can upgrade manually or using `yarn
add/upgrade`. If you wish to specify a version range use this syntax:
`module@^7`.

---

##### ~~`addCompileCommand`~~ <a name="addCompileCommand" id="nextjs-ts-template.OttofellerNextJs.addCompileCommand"></a>

```typescript
public addCompileCommand(commands: string): void
```

DEPRECATED.

###### `commands`<sup>Required</sup> <a name="commands" id="nextjs-ts-template.OttofellerNextJs.addCompileCommand.parameter.commands"></a>

- *Type:* string

---

##### `addDeps` <a name="addDeps" id="nextjs-ts-template.OttofellerNextJs.addDeps"></a>

```typescript
public addDeps(deps: string): void
```

Defines normal dependencies.

###### `deps`<sup>Required</sup> <a name="deps" id="nextjs-ts-template.OttofellerNextJs.addDeps.parameter.deps"></a>

- *Type:* string

Names modules to install.

By default, the the dependency will
be installed in the next `npx projen` run and the version will be recorded
in your `package.json` file. You can upgrade manually or using `yarn
add/upgrade`. If you wish to specify a version range use this syntax:
`module@^7`.

---

##### `addDevDeps` <a name="addDevDeps" id="nextjs-ts-template.OttofellerNextJs.addDevDeps"></a>

```typescript
public addDevDeps(deps: string): void
```

Defines development/test dependencies.

###### `deps`<sup>Required</sup> <a name="deps" id="nextjs-ts-template.OttofellerNextJs.addDevDeps.parameter.deps"></a>

- *Type:* string

Names modules to install.

By default, the the dependency will
be installed in the next `npx projen` run and the version will be recorded
in your `package.json` file. You can upgrade manually or using `yarn
add/upgrade`. If you wish to specify a version range use this syntax:
`module@^7`.

---

##### `addFields` <a name="addFields" id="nextjs-ts-template.OttofellerNextJs.addFields"></a>

```typescript
public addFields(fields: {[ key: string ]: any}): void
```

Directly set fields in `package.json`.

###### `fields`<sup>Required</sup> <a name="fields" id="nextjs-ts-template.OttofellerNextJs.addFields.parameter.fields"></a>

- *Type:* {[ key: string ]: any}

The fields to set.

---

##### `addKeywords` <a name="addKeywords" id="nextjs-ts-template.OttofellerNextJs.addKeywords"></a>

```typescript
public addKeywords(keywords: string): void
```

Adds keywords to package.json (deduplicated).

###### `keywords`<sup>Required</sup> <a name="keywords" id="nextjs-ts-template.OttofellerNextJs.addKeywords.parameter.keywords"></a>

- *Type:* string

The keywords to add.

---

##### `addPeerDeps` <a name="addPeerDeps" id="nextjs-ts-template.OttofellerNextJs.addPeerDeps"></a>

```typescript
public addPeerDeps(deps: string): void
```

Defines peer dependencies.

When adding peer dependencies, a devDependency will also be added on the
pinned version of the declared peer. This will ensure that you are testing
your code against the minimum version required from your consumers.

###### `deps`<sup>Required</sup> <a name="deps" id="nextjs-ts-template.OttofellerNextJs.addPeerDeps.parameter.deps"></a>

- *Type:* string

Names modules to install.

By default, the the dependency will
be installed in the next `npx projen` run and the version will be recorded
in your `package.json` file. You can upgrade manually or using `yarn
add/upgrade`. If you wish to specify a version range use this syntax:
`module@^7`.

---

##### ~~`addTestCommand`~~ <a name="addTestCommand" id="nextjs-ts-template.OttofellerNextJs.addTestCommand"></a>

```typescript
public addTestCommand(commands: string): void
```

DEPRECATED.

###### `commands`<sup>Required</sup> <a name="commands" id="nextjs-ts-template.OttofellerNextJs.addTestCommand.parameter.commands"></a>

- *Type:* string

---

##### `hasScript` <a name="hasScript" id="nextjs-ts-template.OttofellerNextJs.hasScript"></a>

```typescript
public hasScript(name: string): boolean
```

Indicates if a script by the name name is defined.

###### `name`<sup>Required</sup> <a name="name" id="nextjs-ts-template.OttofellerNextJs.hasScript.parameter.name"></a>

- *Type:* string

The name of the script.

---

##### `removeScript` <a name="removeScript" id="nextjs-ts-template.OttofellerNextJs.removeScript"></a>

```typescript
public removeScript(name: string): void
```

Removes the npm script (always successful).

###### `name`<sup>Required</sup> <a name="name" id="nextjs-ts-template.OttofellerNextJs.removeScript.parameter.name"></a>

- *Type:* string

The name of the script.

---

##### `renderWorkflowSetup` <a name="renderWorkflowSetup" id="nextjs-ts-template.OttofellerNextJs.renderWorkflowSetup"></a>

```typescript
public renderWorkflowSetup(options?: RenderWorkflowSetupOptions): JobStep[]
```

Returns the set of workflow steps which should be executed to bootstrap a workflow.

###### `options`<sup>Optional</sup> <a name="options" id="nextjs-ts-template.OttofellerNextJs.renderWorkflowSetup.parameter.options"></a>

- *Type:* projen.javascript.RenderWorkflowSetupOptions

Options.

---

##### `setScript` <a name="setScript" id="nextjs-ts-template.OttofellerNextJs.setScript"></a>

```typescript
public setScript(name: string, command: string): void
```

Replaces the contents of an npm package.json script.

###### `name`<sup>Required</sup> <a name="name" id="nextjs-ts-template.OttofellerNextJs.setScript.parameter.name"></a>

- *Type:* string

The script name.

---

###### `command`<sup>Required</sup> <a name="command" id="nextjs-ts-template.OttofellerNextJs.setScript.parameter.command"></a>

- *Type:* string

The command to execute.

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.buildTask">buildTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.compileTask">compileTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.components">components</a></code> | <code>projen.Component[]</code> | Returns all the components within this project. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.deps">deps</a></code> | <code>projen.Dependencies</code> | Project dependencies. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.ejected">ejected</a></code> | <code>boolean</code> | Whether or not the project is being ejected. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.files">files</a></code> | <code>projen.FileBase[]</code> | All files in this project. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.gitattributes">gitattributes</a></code> | <code>projen.GitAttributesFile</code> | The .gitattributes file for this repository. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.gitignore">gitignore</a></code> | <code>projen.IgnoreFile</code> | .gitignore. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.logger">logger</a></code> | <code>projen.Logger</code> | Logging utilities. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.name">name</a></code> | <code>string</code> | Project name. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.outdir">outdir</a></code> | <code>string</code> | Absolute output directory of this project. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.packageTask">packageTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.postCompileTask">postCompileTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.preCompileTask">preCompileTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.projectBuild">projectBuild</a></code> | <code>projen.ProjectBuild</code> | Manages the build process of the project. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.projenCommand">projenCommand</a></code> | <code>string</code> | The command to use in order to run the projen CLI. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.root">root</a></code> | <code>projen.Project</code> | The root project. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.tasks">tasks</a></code> | <code>projen.Tasks</code> | Project tasks. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.testTask">testTask</a></code> | <code>projen.Task</code> | *No description.* |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.defaultTask">defaultTask</a></code> | <code>projen.Task</code> | This is the "default" task, the one that executes "projen". |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.initProject">initProject</a></code> | <code>projen.InitProject</code> | The options used when this project is bootstrapped via `projen new`. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.parent">parent</a></code> | <code>projen.Project</code> | A parent project. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.projectType">projectType</a></code> | <code>projen.ProjectType</code> | *No description.* |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.autoApprove">autoApprove</a></code> | <code>projen.github.AutoApprove</code> | Auto approve set up for this project. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.devContainer">devContainer</a></code> | <code>projen.vscode.DevContainer</code> | Access for .devcontainer.json (used for GitHub Codespaces). |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.github">github</a></code> | <code>projen.github.GitHub</code> | Access all github components. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.gitpod">gitpod</a></code> | <code>projen.Gitpod</code> | Access for Gitpod. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.vscode">vscode</a></code> | <code>projen.vscode.VsCode</code> | Access all VSCode components. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.allowLibraryDependencies">allowLibraryDependencies</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.artifactsDirectory">artifactsDirectory</a></code> | <code>string</code> | The build output directory. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.artifactsJavascriptDirectory">artifactsJavascriptDirectory</a></code> | <code>string</code> | The location of the npm tarball after build (`${artifactsDirectory}/js`). |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.bundler">bundler</a></code> | <code>projen.javascript.Bundler</code> | *No description.* |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.entrypoint">entrypoint</a></code> | <code>string</code> | *No description.* |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.manifest">manifest</a></code> | <code>any</code> | *No description.* |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.package">package</a></code> | <code>projen.javascript.NodePackage</code> | API for managing the node package. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.packageManager">packageManager</a></code> | <code>projen.javascript.NodePackageManager</code> | The package manager to use. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.runScriptCommand">runScriptCommand</a></code> | <code>string</code> | The command to use to run scripts (e.g. `yarn run` or `npm run` depends on the package manager). |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.autoMerge">autoMerge</a></code> | <code>projen.github.AutoMerge</code> | Component that sets up mergify for merging approved pull requests. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.buildWorkflow">buildWorkflow</a></code> | <code>projen.build.BuildWorkflow</code> | The PR build GitHub workflow. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.buildWorkflowJobId">buildWorkflowJobId</a></code> | <code>string</code> | The job ID of the build workflow. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.jest">jest</a></code> | <code>projen.javascript.Jest</code> | The Jest configuration (if enabled). |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.maxNodeVersion">maxNodeVersion</a></code> | <code>string</code> | Maximum node version required by this pacakge. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.minNodeVersion">minNodeVersion</a></code> | <code>string</code> | Minimum node.js version required by this package. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.npmignore">npmignore</a></code> | <code>projen.IgnoreFile</code> | The .npmignore file. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.prettier">prettier</a></code> | <code>projen.javascript.Prettier</code> | *No description.* |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.publisher">publisher</a></code> | <code>projen.release.Publisher</code> | Package publisher. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.release">release</a></code> | <code>projen.release.Release</code> | Release management. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.upgradeWorkflow">upgradeWorkflow</a></code> | <code>projen.javascript.UpgradeDependencies</code> | The upgrade workflow. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.docsDirectory">docsDirectory</a></code> | <code>string</code> | *No description.* |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.libdir">libdir</a></code> | <code>string</code> | The directory in which compiled .js files reside. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.srcdir">srcdir</a></code> | <code>string</code> | The directory in which source files reside. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.testdir">testdir</a></code> | <code>string</code> | The directory in which tests reside. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.tsconfigDev">tsconfigDev</a></code> | <code>projen.javascript.TypescriptConfig</code> | A typescript configuration file which covers all files (sources, tests, projen). |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.watchTask">watchTask</a></code> | <code>projen.Task</code> | The "watch" task. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.docgen">docgen</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.eslint">eslint</a></code> | <code>projen.javascript.Eslint</code> | *No description.* |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.tsconfig">tsconfig</a></code> | <code>projen.javascript.TypescriptConfig</code> | *No description.* |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.tsconfigEslint">tsconfigEslint</a></code> | <code>projen.javascript.TypescriptConfig</code> | *No description.* |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.assetsdir">assetsdir</a></code> | <code>string</code> | The directory in which app assets reside. |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.tailwind">tailwind</a></code> | <code>boolean</code> | Setup Tailwind as a PostCSS plugin. |

---

##### `buildTask`<sup>Required</sup> <a name="buildTask" id="nextjs-ts-template.OttofellerNextJs.property.buildTask"></a>

```typescript
public readonly buildTask: Task;
```

- *Type:* projen.Task

---

##### `compileTask`<sup>Required</sup> <a name="compileTask" id="nextjs-ts-template.OttofellerNextJs.property.compileTask"></a>

```typescript
public readonly compileTask: Task;
```

- *Type:* projen.Task

---

##### `components`<sup>Required</sup> <a name="components" id="nextjs-ts-template.OttofellerNextJs.property.components"></a>

```typescript
public readonly components: Component[];
```

- *Type:* projen.Component[]

Returns all the components within this project.

---

##### `deps`<sup>Required</sup> <a name="deps" id="nextjs-ts-template.OttofellerNextJs.property.deps"></a>

```typescript
public readonly deps: Dependencies;
```

- *Type:* projen.Dependencies

Project dependencies.

---

##### `ejected`<sup>Required</sup> <a name="ejected" id="nextjs-ts-template.OttofellerNextJs.property.ejected"></a>

```typescript
public readonly ejected: boolean;
```

- *Type:* boolean

Whether or not the project is being ejected.

---

##### `files`<sup>Required</sup> <a name="files" id="nextjs-ts-template.OttofellerNextJs.property.files"></a>

```typescript
public readonly files: FileBase[];
```

- *Type:* projen.FileBase[]

All files in this project.

---

##### `gitattributes`<sup>Required</sup> <a name="gitattributes" id="nextjs-ts-template.OttofellerNextJs.property.gitattributes"></a>

```typescript
public readonly gitattributes: GitAttributesFile;
```

- *Type:* projen.GitAttributesFile

The .gitattributes file for this repository.

---

##### `gitignore`<sup>Required</sup> <a name="gitignore" id="nextjs-ts-template.OttofellerNextJs.property.gitignore"></a>

```typescript
public readonly gitignore: IgnoreFile;
```

- *Type:* projen.IgnoreFile

.gitignore.

---

##### `logger`<sup>Required</sup> <a name="logger" id="nextjs-ts-template.OttofellerNextJs.property.logger"></a>

```typescript
public readonly logger: Logger;
```

- *Type:* projen.Logger

Logging utilities.

---

##### `name`<sup>Required</sup> <a name="name" id="nextjs-ts-template.OttofellerNextJs.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

Project name.

---

##### `outdir`<sup>Required</sup> <a name="outdir" id="nextjs-ts-template.OttofellerNextJs.property.outdir"></a>

```typescript
public readonly outdir: string;
```

- *Type:* string

Absolute output directory of this project.

---

##### `packageTask`<sup>Required</sup> <a name="packageTask" id="nextjs-ts-template.OttofellerNextJs.property.packageTask"></a>

```typescript
public readonly packageTask: Task;
```

- *Type:* projen.Task

---

##### `postCompileTask`<sup>Required</sup> <a name="postCompileTask" id="nextjs-ts-template.OttofellerNextJs.property.postCompileTask"></a>

```typescript
public readonly postCompileTask: Task;
```

- *Type:* projen.Task

---

##### `preCompileTask`<sup>Required</sup> <a name="preCompileTask" id="nextjs-ts-template.OttofellerNextJs.property.preCompileTask"></a>

```typescript
public readonly preCompileTask: Task;
```

- *Type:* projen.Task

---

##### `projectBuild`<sup>Required</sup> <a name="projectBuild" id="nextjs-ts-template.OttofellerNextJs.property.projectBuild"></a>

```typescript
public readonly projectBuild: ProjectBuild;
```

- *Type:* projen.ProjectBuild

Manages the build process of the project.

---

##### `projenCommand`<sup>Required</sup> <a name="projenCommand" id="nextjs-ts-template.OttofellerNextJs.property.projenCommand"></a>

```typescript
public readonly projenCommand: string;
```

- *Type:* string

The command to use in order to run the projen CLI.

---

##### `root`<sup>Required</sup> <a name="root" id="nextjs-ts-template.OttofellerNextJs.property.root"></a>

```typescript
public readonly root: Project;
```

- *Type:* projen.Project

The root project.

---

##### `tasks`<sup>Required</sup> <a name="tasks" id="nextjs-ts-template.OttofellerNextJs.property.tasks"></a>

```typescript
public readonly tasks: Tasks;
```

- *Type:* projen.Tasks

Project tasks.

---

##### `testTask`<sup>Required</sup> <a name="testTask" id="nextjs-ts-template.OttofellerNextJs.property.testTask"></a>

```typescript
public readonly testTask: Task;
```

- *Type:* projen.Task

---

##### `defaultTask`<sup>Optional</sup> <a name="defaultTask" id="nextjs-ts-template.OttofellerNextJs.property.defaultTask"></a>

```typescript
public readonly defaultTask: Task;
```

- *Type:* projen.Task

This is the "default" task, the one that executes "projen".

Undefined if
the project is being ejected.

---

##### `initProject`<sup>Optional</sup> <a name="initProject" id="nextjs-ts-template.OttofellerNextJs.property.initProject"></a>

```typescript
public readonly initProject: InitProject;
```

- *Type:* projen.InitProject

The options used when this project is bootstrapped via `projen new`.

It
includes the original set of options passed to the CLI and also the JSII
FQN of the project type.

---

##### `parent`<sup>Optional</sup> <a name="parent" id="nextjs-ts-template.OttofellerNextJs.property.parent"></a>

```typescript
public readonly parent: Project;
```

- *Type:* projen.Project

A parent project.

If undefined, this is the root project.

---

##### `projectType`<sup>Required</sup> <a name="projectType" id="nextjs-ts-template.OttofellerNextJs.property.projectType"></a>

```typescript
public readonly projectType: ProjectType;
```

- *Type:* projen.ProjectType

---

##### `autoApprove`<sup>Optional</sup> <a name="autoApprove" id="nextjs-ts-template.OttofellerNextJs.property.autoApprove"></a>

```typescript
public readonly autoApprove: AutoApprove;
```

- *Type:* projen.github.AutoApprove

Auto approve set up for this project.

---

##### `devContainer`<sup>Optional</sup> <a name="devContainer" id="nextjs-ts-template.OttofellerNextJs.property.devContainer"></a>

```typescript
public readonly devContainer: DevContainer;
```

- *Type:* projen.vscode.DevContainer

Access for .devcontainer.json (used for GitHub Codespaces).

This will be `undefined` if devContainer boolean is false

---

##### `github`<sup>Optional</sup> <a name="github" id="nextjs-ts-template.OttofellerNextJs.property.github"></a>

```typescript
public readonly github: GitHub;
```

- *Type:* projen.github.GitHub

Access all github components.

This will be `undefined` for subprojects.

---

##### `gitpod`<sup>Optional</sup> <a name="gitpod" id="nextjs-ts-template.OttofellerNextJs.property.gitpod"></a>

```typescript
public readonly gitpod: Gitpod;
```

- *Type:* projen.Gitpod

Access for Gitpod.

This will be `undefined` if gitpod boolean is false

---

##### `vscode`<sup>Optional</sup> <a name="vscode" id="nextjs-ts-template.OttofellerNextJs.property.vscode"></a>

```typescript
public readonly vscode: VsCode;
```

- *Type:* projen.vscode.VsCode

Access all VSCode components.

This will be `undefined` for subprojects.

---

##### ~~`allowLibraryDependencies`~~<sup>Required</sup> <a name="allowLibraryDependencies" id="nextjs-ts-template.OttofellerNextJs.property.allowLibraryDependencies"></a>

- *Deprecated:* use `package.allowLibraryDependencies`

```typescript
public readonly allowLibraryDependencies: boolean;
```

- *Type:* boolean

---

##### `artifactsDirectory`<sup>Required</sup> <a name="artifactsDirectory" id="nextjs-ts-template.OttofellerNextJs.property.artifactsDirectory"></a>

```typescript
public readonly artifactsDirectory: string;
```

- *Type:* string

The build output directory.

An npm tarball will be created under the `js`
subdirectory. For example, if this is set to `dist` (the default), the npm
tarball will be placed under `dist/js/boom-boom-1.2.3.tg`.

---

##### `artifactsJavascriptDirectory`<sup>Required</sup> <a name="artifactsJavascriptDirectory" id="nextjs-ts-template.OttofellerNextJs.property.artifactsJavascriptDirectory"></a>

```typescript
public readonly artifactsJavascriptDirectory: string;
```

- *Type:* string

The location of the npm tarball after build (`${artifactsDirectory}/js`).

---

##### `bundler`<sup>Required</sup> <a name="bundler" id="nextjs-ts-template.OttofellerNextJs.property.bundler"></a>

```typescript
public readonly bundler: Bundler;
```

- *Type:* projen.javascript.Bundler

---

##### ~~`entrypoint`~~<sup>Required</sup> <a name="entrypoint" id="nextjs-ts-template.OttofellerNextJs.property.entrypoint"></a>

- *Deprecated:* use `package.entrypoint`

```typescript
public readonly entrypoint: string;
```

- *Type:* string

---

##### ~~`manifest`~~<sup>Required</sup> <a name="manifest" id="nextjs-ts-template.OttofellerNextJs.property.manifest"></a>

- *Deprecated:* use `package.addField(x, y)`

```typescript
public readonly manifest: any;
```

- *Type:* any

---

##### `package`<sup>Required</sup> <a name="package" id="nextjs-ts-template.OttofellerNextJs.property.package"></a>

```typescript
public readonly package: NodePackage;
```

- *Type:* projen.javascript.NodePackage

API for managing the node package.

---

##### ~~`packageManager`~~<sup>Required</sup> <a name="packageManager" id="nextjs-ts-template.OttofellerNextJs.property.packageManager"></a>

- *Deprecated:* use `package.packageManager`

```typescript
public readonly packageManager: NodePackageManager;
```

- *Type:* projen.javascript.NodePackageManager

The package manager to use.

---

##### `runScriptCommand`<sup>Required</sup> <a name="runScriptCommand" id="nextjs-ts-template.OttofellerNextJs.property.runScriptCommand"></a>

```typescript
public readonly runScriptCommand: string;
```

- *Type:* string

The command to use to run scripts (e.g. `yarn run` or `npm run` depends on the package manager).

---

##### `autoMerge`<sup>Optional</sup> <a name="autoMerge" id="nextjs-ts-template.OttofellerNextJs.property.autoMerge"></a>

```typescript
public readonly autoMerge: AutoMerge;
```

- *Type:* projen.github.AutoMerge

Component that sets up mergify for merging approved pull requests.

---

##### `buildWorkflow`<sup>Optional</sup> <a name="buildWorkflow" id="nextjs-ts-template.OttofellerNextJs.property.buildWorkflow"></a>

```typescript
public readonly buildWorkflow: BuildWorkflow;
```

- *Type:* projen.build.BuildWorkflow

The PR build GitHub workflow.

`undefined` if `buildWorkflow` is disabled.

---

##### `buildWorkflowJobId`<sup>Optional</sup> <a name="buildWorkflowJobId" id="nextjs-ts-template.OttofellerNextJs.property.buildWorkflowJobId"></a>

```typescript
public readonly buildWorkflowJobId: string;
```

- *Type:* string

The job ID of the build workflow.

---

##### `jest`<sup>Optional</sup> <a name="jest" id="nextjs-ts-template.OttofellerNextJs.property.jest"></a>

```typescript
public readonly jest: Jest;
```

- *Type:* projen.javascript.Jest

The Jest configuration (if enabled).

---

##### `maxNodeVersion`<sup>Optional</sup> <a name="maxNodeVersion" id="nextjs-ts-template.OttofellerNextJs.property.maxNodeVersion"></a>

```typescript
public readonly maxNodeVersion: string;
```

- *Type:* string

Maximum node version required by this pacakge.

---

##### `minNodeVersion`<sup>Optional</sup> <a name="minNodeVersion" id="nextjs-ts-template.OttofellerNextJs.property.minNodeVersion"></a>

```typescript
public readonly minNodeVersion: string;
```

- *Type:* string

Minimum node.js version required by this package.

---

##### `npmignore`<sup>Optional</sup> <a name="npmignore" id="nextjs-ts-template.OttofellerNextJs.property.npmignore"></a>

```typescript
public readonly npmignore: IgnoreFile;
```

- *Type:* projen.IgnoreFile

The .npmignore file.

---

##### `prettier`<sup>Optional</sup> <a name="prettier" id="nextjs-ts-template.OttofellerNextJs.property.prettier"></a>

```typescript
public readonly prettier: Prettier;
```

- *Type:* projen.javascript.Prettier

---

##### ~~`publisher`~~<sup>Optional</sup> <a name="publisher" id="nextjs-ts-template.OttofellerNextJs.property.publisher"></a>

- *Deprecated:* use `release.publisher`.

```typescript
public readonly publisher: Publisher;
```

- *Type:* projen.release.Publisher

Package publisher.

This will be `undefined` if the project does not have a
release workflow.

---

##### `release`<sup>Optional</sup> <a name="release" id="nextjs-ts-template.OttofellerNextJs.property.release"></a>

```typescript
public readonly release: Release;
```

- *Type:* projen.release.Release

Release management.

---

##### `upgradeWorkflow`<sup>Optional</sup> <a name="upgradeWorkflow" id="nextjs-ts-template.OttofellerNextJs.property.upgradeWorkflow"></a>

```typescript
public readonly upgradeWorkflow: UpgradeDependencies;
```

- *Type:* projen.javascript.UpgradeDependencies

The upgrade workflow.

---

##### `docsDirectory`<sup>Required</sup> <a name="docsDirectory" id="nextjs-ts-template.OttofellerNextJs.property.docsDirectory"></a>

```typescript
public readonly docsDirectory: string;
```

- *Type:* string

---

##### `libdir`<sup>Required</sup> <a name="libdir" id="nextjs-ts-template.OttofellerNextJs.property.libdir"></a>

```typescript
public readonly libdir: string;
```

- *Type:* string

The directory in which compiled .js files reside.

---

##### `srcdir`<sup>Required</sup> <a name="srcdir" id="nextjs-ts-template.OttofellerNextJs.property.srcdir"></a>

```typescript
public readonly srcdir: string;
```

- *Type:* string

The directory in which source files reside.

---

##### `testdir`<sup>Required</sup> <a name="testdir" id="nextjs-ts-template.OttofellerNextJs.property.testdir"></a>

```typescript
public readonly testdir: string;
```

- *Type:* string

The directory in which tests reside.

---

##### `tsconfigDev`<sup>Required</sup> <a name="tsconfigDev" id="nextjs-ts-template.OttofellerNextJs.property.tsconfigDev"></a>

```typescript
public readonly tsconfigDev: TypescriptConfig;
```

- *Type:* projen.javascript.TypescriptConfig

A typescript configuration file which covers all files (sources, tests, projen).

---

##### `watchTask`<sup>Required</sup> <a name="watchTask" id="nextjs-ts-template.OttofellerNextJs.property.watchTask"></a>

```typescript
public readonly watchTask: Task;
```

- *Type:* projen.Task

The "watch" task.

---

##### `docgen`<sup>Optional</sup> <a name="docgen" id="nextjs-ts-template.OttofellerNextJs.property.docgen"></a>

```typescript
public readonly docgen: boolean;
```

- *Type:* boolean

---

##### `eslint`<sup>Optional</sup> <a name="eslint" id="nextjs-ts-template.OttofellerNextJs.property.eslint"></a>

```typescript
public readonly eslint: Eslint;
```

- *Type:* projen.javascript.Eslint

---

##### `tsconfig`<sup>Optional</sup> <a name="tsconfig" id="nextjs-ts-template.OttofellerNextJs.property.tsconfig"></a>

```typescript
public readonly tsconfig: TypescriptConfig;
```

- *Type:* projen.javascript.TypescriptConfig

---

##### `tsconfigEslint`<sup>Optional</sup> <a name="tsconfigEslint" id="nextjs-ts-template.OttofellerNextJs.property.tsconfigEslint"></a>

```typescript
public readonly tsconfigEslint: TypescriptConfig;
```

- *Type:* projen.javascript.TypescriptConfig

---

##### `assetsdir`<sup>Required</sup> <a name="assetsdir" id="nextjs-ts-template.OttofellerNextJs.property.assetsdir"></a>

```typescript
public readonly assetsdir: string;
```

- *Type:* string

The directory in which app assets reside.

---

##### `tailwind`<sup>Required</sup> <a name="tailwind" id="nextjs-ts-template.OttofellerNextJs.property.tailwind"></a>

```typescript
public readonly tailwind: boolean;
```

- *Type:* boolean

Setup Tailwind as a PostCSS plugin.

> [https://tailwindcss.com/docs/installation](https://tailwindcss.com/docs/installation)

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#nextjs-ts-template.OttofellerNextJs.property.DEFAULT_TASK">DEFAULT_TASK</a></code> | <code>string</code> | The name of the default task (the task executed when `projen` is run without arguments). |

---

##### `DEFAULT_TASK`<sup>Required</sup> <a name="DEFAULT_TASK" id="nextjs-ts-template.OttofellerNextJs.property.DEFAULT_TASK"></a>

```typescript
public readonly DEFAULT_TASK: string;
```

- *Type:* string

The name of the default task (the task executed when `projen` is run without arguments).

Normally
this task should synthesize the project files.

---



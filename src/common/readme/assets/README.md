# {{PROJECT_TITLE}}

## 📀 User guide

### Update a project

In order to pull template updates you need to specify the desired version of the `@ottofeller/templates` package in either `.projenrc.ts` file or in `package.json` (if the version in `.projenrc.ts` is not fixed). Then run the default projen task:

```sh
npx projen
```

Upon completion the following changes would apply:

- all packages with specified versions are updated (if a template does not specify a dependency version, it is not managed by projen and can be updated by simply setting the desired version in `package.json`; note that this way `package-lock.json` is not necessarily updated, thus you need to check it as well);
- all projen-generated files are updated;
- all sample code files are left unchanged (note that if you have deleted some sample code files they will be recreated unless you use the `sampleCode: false` option).

### Install new packages

The common approach of installing packages by running `npm install <package-name>` won't work because `npx projen` re-synthesizes all files, including `package.json`. For dependency handling see the docs in `projen` repo:

- [generic dependency handling](https://github.com/projen/projen/blob/main/docs/deps.md);
- [node.js specific](https://github.com/projen/projen/blob/main/docs/node.md#dependencies);
- [node-package comments on dependency options](https://github.com/projen/projen/blob/main/src/javascript/node-package.ts#L46-L111) - these are available in an IDE.

To install a new packages to the project:

- Add a new item with the package name to either the `deps` or `devDeps` array in project options. Alternative way would be to use `project.addDeps('package-name')` or `project.addDevDeps('dev-package-name')`.
- Run `npx projen`. This will update the `package.json` and lock file as well.

Note that there are two distinct approaches in controlling package version:

- Strict version control in `.projenrc.ts` - when adding packages one specifies a name and a version. All updates are handled manually by specifying a new version and then running `npx projen` to resynthesize the project.
- Specifying just a package name in `.projenrc.ts`. This is how `projen` [recommends it](https://github.com/projen/projen/blob/main/src/javascript/node-package.ts#L49-L54). When no version is specified it makes it possible to update versions in `package.json` and `package-lock.json` without touching the `.projenrc.ts` file. It also allows the use of `dependabot` - otherwise all changes introduced by `dependabot` would be overwritten on `npx projen`.

### Eject

To get rid of projen run this command:

```sh
npm run eject
```

The command removes default projen task, makes projen remove its authority from all the generated files and stop tracking changes. At this moment the project is managed as a regular repository (feel free to edit and remove files).

> All the projen tasks are run via a custom runner, so the runner is saved into the project at `scripts/run-task` and the tasks remain in the project in a tasks definition file (`.projen/tasks.json`). All the internal tasks within the templates are saved as npm scripts and thus don't need this task runner. Therefore the task runner and the tasks definition file file can be deleted. If you had any custom tasks created in your project either use this runner or make sure to convert all the tasks into npm scripts before deleting the tasks definition file and the runner.

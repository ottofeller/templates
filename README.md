# OttoFeller Projen Templates
![Test workflow status](https://github.com/ottofeller/templates/actions/workflows/test.yml/badge.svg?branch=main)

## 📀 User guide
In order to install a certain project (template) from `@ottofeller/templates` call `npx projen new` in the dir of the new project in the following way:
```sh
# This will synthesize NextJS project in the current dir
npx projen new --from @ottofeller/templates ottofeller-nextjs
```

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
The command removes default projen task, makes projen remove its authority from all the generated files and stop tracking changes. At this moment the project is managed as a regular repository (feel fre to edit and remove files).

## 🛠 Development guide
### Install
Simply install dependencies:
```sh
npm install
```

### Synthesize
The app itself is based on a projen template, so it can be synthesized (a code generated out of projen's TS files). Modify the app's template in `.projenrc.ts` and run the following command:
```sh
npx projen
```

> :warning: Normally you should never modify anything other than templates in `src/` dir and `.projenrc.ts`.

### Build
The build is the process of creating [JSII](https://github.com/aws/jsii) artifacts. These are the files required to run `npx projen new --from ...` (JSII is much more powerful technology, but it is out of the scope of this project). The build creates/updates the `.jsii` file (JSII config):
```sh
npx projen build
```

### Publish
Publishing is a two-step process:
- a GitHub action bumps version (creating a new commit with appropriate tag) and creates a draft release;
- after the release is published another GitHub action builds the artifacts and pushes them to npm.

## 🧩 Templates

### NextJS
```sh
npx projen new --from @ottofeller/templates ottofeller-nextjs
```

#### next.config.js
The config for NextJS is separated into two parts:
- `next.config.defaults.js` - default config options deployed with the template; the file is readonly and shall not be edited;
- `next.config.js` - editable config that by default only imports the `next.config.defaults.js`; feel free to edit the file, add required options, or include only the needed part of the default config.

#### UI packages
The project contains some UI-related packages:
- `tailwindcss` (along with a few plugins);
- `postcss`;
- `autoprefixer`;
- `@headlessui/react`.

These are included by default and can be excluded providing an `isUiConfigEnabled: false` option.

#### Tailwind
The template uses *tailwind* for CSS. There are two config files (similar to NextJS configuration):
- `tailwind.config.defaults.js` - default config options deployed with the template; the file is readonly and shall not be edited;
- `tailwind.config.js` - editable config that by default only imports the `tailwind.config.defaults.js`; feel free to edit the file, add required options, or include only the needed part of the default config.

#### Codegen config
The template uses `@graphql-codegen` packages for GraphQL management. The codegen config is copied from the assets folder (see the `codegen.ts` file). Feel free to edit the config.

In order to exclude the GraphQL packages from the project use the `isGraphqlEnabled: false` option. NOTE that the config file `codegen.ts` is editable and therefore not controlled by `projen` after creation. This means after GraphQL dependencies removal it remains in the project and should be deleted manually.

#### Codemods
##### Add `src` reference to imports
After update to `next@13.2.4` the typescript alias `"*" : ["./src/*"]` no longer works with `jest`/`swc`. The simplest solution is to get rid of the alias and update all imports - the codemod does exactly this. To run the codemod an npm script is added to the project: `codemod:add-src-to-imports`. The script run `jscodeshift` on `src` and `pages` folders. Feel free to add any arguments acceptable by `jscodeshift`.

Examples:
```sh
# Default: run the codemod on contents of src and pages folders
npm run codemod:add-src-to-imports
```
```sh
# Run the codemod in dry mode to see the extent of modification
npm run codemod:add-src-to-imports -- --dry
```

### Apollo Server
```sh
npx projen new --from @ottofeller/templates ottofeller-apollo-server
```
#### Codegen config
See the [Codegen config](#codegen-config) subsection for the [NextJS](#nextjs) template above.

### CDK
```sh
npx projen new --from @ottofeller/templates ottofeller-cdk
```

### SST
An [SST](https://sst.dev) based template for easy deployment of modern full-stack applications on AWS.

```sh
npx projen new --from @ottofeller/templates ottofeller-sst
```

The initial release version can be set with `initialReleaseVersion` option:
```sh
npx projen new --from @ottofeller/templates ottofeller-sst --initial-release-version "1.0.0"
```

The project has the following common options (see [Other custom options](#other-custom-options) section for details):
- `hasDefaultGithubWorkflows`;
- `lintPaths`;
- `hasGitHooks`;
- `huskyRules`.

### Other custom options
There are a few other options specific to all the templates within this project:
- `hasVscode` - include recommended VSCode settings, defaults to `true`;
- `lintPaths` - an array of paths for linting and formatting;
- `hasDefaultGithubWorkflows` - include a default GitHub pull request template, defaults to `true`;
- `hasGitHooks` - include `husky` for git hooks management, defaults to `true` (NOTE: `projen` sets up `git` as a final step of project bootstrapping and thus there is no way to run `husky install` within the process. Hence a user has to run it manually after the `git` repo is initialized.);
- `huskyRules` - an options object for husky rules; if `hasGitHooks` is enabled, sets up the rules from this object:
  - `checkCargo` creates a `pre-commit` hook that runs a check on Rust cargo (disabled by default); 
  - `commitMsg` creates a `commit-msg` hook for a basic check of commit messages (defaults to `true`); can be set to an object with `ignoreBranches` property which specifies an array of branch names to be ignored while processing commit messages; bu default (with `commitMsg: true` option) the `ignoreBranches` is set to `['main', 'dev']`; in order to perform the check on all branches set either `commitMsg: {}` or `commitMsg: {ignoreBranches: []}`;
  - `huskyCustomRules` adds arbitrary commands to supported hooks (`commit-msg` and `pre-commit`); disabled by default.

## Components
The repository contains a collections of react components that can be bootstrapped via `projen`.

All the component templates have the following shared settings:
- `name` defines the exported name of the component, defaults to the dir from which `projen` was called;
- `outdir` defines the folder to which the componend will be rendered to, defaults to the dir from which `projen` was called.

> IMPORTANT! In order to create a component one needs to `cd` into a folder without populated `package.json` file, e.g. `src`. It is required to let `projen` run smoothly. Since it is a `jsii` project its `new` command runs only along with other packages built as `jsii` (having a regular package in `node_modules` would fail the run).

> IMPORTANT! By default projen creates a `git` repository and commits the initialized project. In order to avoid this use a `--no-git` or `--git=false` option.

There are two ways to define a component name and destination folder:
- run `projen` from `src` folder (or any other suitable folder) and define the `name` and `outdir` options;
```sh
# Run projen from src folder
cd src
npx projen new --no-git --from @ottofeller/templates <component> --outdir components/NewComponent --name NewComponent
```
- create manually the destination folder and `cd` into it - then running `projen` would create the component file in that folder and the component would inherit the folder name.
```sh
# Create the component folder manually and run projen from that folder
mkdir src/components/NewComponent
cd src/components/NewComponent
npx projen new --no-git --from @ottofeller/templates <component>
```

### ottofeller-component-react
A generic component with a simple render test.
```sh
# Run projen from src folder
cd src
npx projen new --no-git --from @ottofeller/templates ottofeller-component-react --outdir components/NewComponent --name NewComponent

# Or create the component folder manually and run projen from that folder
mkdir src/components/NewComponent
cd src/components/NewComponent
npx projen new --no-git --from @ottofeller/templates ottofeller-component-react
```
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
The template uses `@graphql-codegen` packages for GraphQL management. The main config is created with a custom class `CodegenConfigYaml`. The created file `codegen.yml` is not directly editable. In order to edit the config use `codegenConfig` property of the project. The class exposes methods to override restricted subset of config properties:
```typescript
// Set global `schema` property.
project.codegenConfig?.overrideSchema('./schema.json')
  // Set global `overwrite` property.
  .overrideOverwrite(true)
  // Set plugins for an output path within global `generates` property.
  .overridePluginsForOutput('./generated/resolvers.ts', ['typescript', 'typescript-resolvers'])
  // Delete plugins for an output path within global `generates` property.
  .overridePluginsForOutput('./generated/index.ts')
  // Set documents for an output path within global `generates` property.
  .overrideDocumentsForOutput('./generated/index.ts', 'src/**/graphql/!(*.generated).ts')
```

In order to exclude the GraphQL packages from the project use the `isGraphqlEnabled: false` option.

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

### Other custom options
There are a few other options specific to all the templates within this project:
- `hasVscode` - include recommended VSCode settings, defaults to `true`;
- `lintPaths` - an array of paths for linting and formatting;
- `hasDefaultGithubWorkflows` - include a default GitHub pull request template, defaults to `true`;
- `hasGitHooks` - include `husky` for git hooks management, defaults to `true` (NOTE: `projen` sets up `git` as a final step of project bootstrapping and thus there is no way to run `husky install` within the process. Hence a user has to run it manually after the `git` repo is initialized.);
- `hasDefaultCommitHook` - if `hasGitHooks` is enabled, create a file with `commit-msg` hook for a basic check of commit messages, defaults to `true`.

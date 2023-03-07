# OttoFeller Projen Templates
![Test workflow status](https://github.com/ottofeller/templates/actions/workflows/test.yml/badge.svg?branch=main)

## 📀 User guide
In order to install a certain project (template) from `@ottofeller/templates` call `npx projen new` in the dir of the new project in the following way:
```sh
# This will synthesize NextJS project in the current dir
npx projen new --from @ottofeller/templates ottofeller-nextjs
```

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
- `@next/font`;
- `@headlessui/react`.

These are included by default and can be excluded providing an `ui: false` option.

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

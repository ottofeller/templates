# OttoFeller Projen Templates

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

The app itself is projen template, so it can be synthesized (a code generated out of projen's TS files). Modify the app's template in `.projenrc.ts` and run the following command:

```sh
npx projen
```

> :warning: Normally you should never modify anything other than templates in `src/` dir and `.projenrc.ts`.

### Build

The build is the process of creating [JSII](https://github.com/aws/jsii) artefacts. These are the files required to run `npx projen new --from ...` (JSII is much more powerful technology, but it is out of the scope of this project). The build creates/updates the `.jsii` file (JSII config):

```sh
npx projen build
```

### Publish

## 🧩 Templates

### NextJS

```sh
npx projen new --from @ottofeller/templates ottofeller-nextjs
```

#### next.config.js

You can customize `next.config.js` in projenrc.ts, e.g:

```typescript
const nextConfig = project.tryFindObjectFile('next.config.json')
nextConfig?.addOverride('plugins', {
  '@next/mdx': {
    foo: 'foo',
    bar: 'RegExp(^bar)',
    someArray: ['require(react)'],
  },
})
nextConfig?.addOverride('pageExtensions', ['tsx', 'mdx'])
```

Be careful, json supports only string literal (no regex, require, ...etc). <br>
To use some js objects, you can specify their equivalents in string literals (list may be added with new transpilers)
| Literal | Transpiled to |
| - | - |
| `"RegExp(^foobar$)"` | `/^foobar$/` |
| `"require(react)"` | `require("react")` |

#### Tailwind

The template uses tailwind for CSS. The main config used by tailwind is `tailwind.config.js`. The file is not editable. It configures plugins which are dynamic and thus can not to be defined statically. The static part of the config resides in `tailwind.config.json`. This file can be edited via `.projenrc.ts`, e.g.:

```typescript
const tailwindConfig = project.tryFindObjectFile('tailwind.config.json')
tailwindConfig?.addOverride('theme.colors.aaaaaa', '#aaaaaa')
tailwindConfig?.addOverride('theme.fontSize.18', 'calc(18 * 1rem / 16)')
```

Note that the `tailwind.config.js` is not editable by default. In order to edit the file (e.g. for adding plugins) set its `readonly` attribute to `false`. But be aware that the run of `npx projen` command would overwrite all local changes resetting it to default content.

```typescript
const tailwindConfig = project.tryFindFile('tailwind.config.js')
if (tailwindConfig) {
  tailwindConfig.readonly = false
}
```

#### Codegen config

The template uses `@graphql-codegen` packages for GraphQL management. The main config is created with a custom class `CodegenConfigYaml`. The created file `codegen.yml` is not directly editable. In order to edit the config use `codegenConfig` property of the project. The class exposes methods to override restricted subset of config properties:

```typescript
// Set global `schema` property.
project.codegenConfig
  ?.overrideSchema('./schema.json')
  // Set global `overwrite` property.
  .overrideOverwrite(true)
  // Set plugins for an output path within global `generates` property.
  .overridePluginsForOutput('./generated/resolvers.ts', ['typescript', 'typescript-resolvers'])
  // Delete plugins for an output path within global `generates` property.
  .overridePluginsForOutput('./generated/index.ts')
  // Set documents for an output path within global `generates` property.
  .overrideDocumentsForOutput('./generated/index.ts', 'src/**/graphql/!(*.generated).ts')
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

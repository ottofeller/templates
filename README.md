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
The config for NextJS is separated into two parts:
- `next.config.defaults.js` - default config options deployed with the template; the file is readonly and shall not be edited;
- `next.config.js` - editable config that by default only imports the `next.config.defaults.js`; feel free to edit the file, add required options, or include only the needed part of the default config.

#### Tailwind
The template uses tailwind for CSS. The main config used by tailwind is `tailwind.config.js`. The file is not editable. It configures plugins which are dynamic and thus can not to be defined statically. The static part of the config resides in `tailwind.config.json`. This file can be edited via `.projenrc.ts`, e.g.:
```typescript
const tailwindConfig = project.tryFindObjectFile('tailwind.config.json')
tailwindConfig?.addOverride('theme.colors.aaaaaa', '#aaaaaa')
tailwindConfig?.addOverride('theme.fontSize.18', 'calc(18 * 1rem / 16)')

tailwindConfig?.addOverride('theme.fontSize', {
  20: 'calc(20 * 1rem / 16)',
  28: 'calc(28 * 1rem / 16)',
})

tailwindConfig?.addOverride('theme', {
  colors: {ffffff: '#ffffff'},

  borderRadius: {
    4   : 'calc(4 * 1rem / 16)',
    full: '9999px',
    none: '0',
  },
})
```

##### Plugins
The project options contain a property `tailwindPlugins` of type `Array<string>` that allows setting plugins. There are two distinct cases:
1. for a plugin that can be simply required from a package just include the project name.
This project setup
```typescript
const project = new OttofellerNextjsProject({
  ...
  tailwindPlugins: ['@tailwindcss/forms', '@tailwindcss/aspect-ratio'],
})
```
results in the following config:
```javascript
const plugin = require('tailwindcss/plugin')
const staticConfig = require('./tailwind.config.json')

module.exports = {
  ...staticConfig,

  plugins: [
    ...defaultPlugins,

    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
```
2. for plugins defined as a function passed to `tailwindcss/plugin` the function shall be stringified.
This project setup
```typescript
import plugin from 'tailwindcss/plugin'

// NOTE: The plugin callback type is not exported
type Plugin = Parameters<typeof plugin>[0]

const span: Plugin = ({addUtilities}) =>
  addUtilities({'.area-span-full': {gridArea: '1/1/-1/-1'}})

function scroll({addUtilities}: Parameters<Plugin>[0]): ReturnType<Plugin> {
  return addUtilities({'.scrollbar-hidden': {'&::-webkit-scrollbar': {display: 'none'}, scrollbarWidth: 'none'}})
}
const project = new OttofellerNextjsProject({
  ...
  tailwindPlugins: [`${span}`, `${scroll}`],
})
```
results in the following config:
```javascript
const plugin = require('tailwindcss/plugin')
const staticConfig = require('./tailwind.config.json')

module.exports = {
  ...staticConfig,

  plugins: [
    ...defaultPlugins,

    plugin(({addUtilities}) => addUtilities({'.area-span-full': {gridArea: '1/1/-1/-1'}})),
    plugin(function utilities2({addUtilities}) {
      return addUtilities({'.scrollbar-hidden': {'&::-webkit-scrollbar': {display: 'none'}, scrollbarWidth: 'none'}})
    }),
  ],
}
```

##### Manual editing (strongly discouraged)
Note that the `tailwind.config.js` is not editable and a run of `npx projen` command would overwrite all local changes resetting it to default content. In order to edit the file (e.g. something other than adding plugins) set its `readonly` attribute to `false`. But be aware that the run of `npx projen` command would overwrite all local changes resetting it to default content.
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

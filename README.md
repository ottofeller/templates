# OttoFeller Projen Templates
## Installation
Install dependencies:
```sh
npm install
```

Build the project. This will create/update the `.jsii` file (JSII config) and build the code:
```sh
npx projen build
```

## Usage
In order to synthesize (install) a certain project (template) from `@ottofeller/templates` call `npx projen new` in the dir of the new project in the following way:
```sh
# This will synthesize NextJS project in the current dir
npx projen new --from @ottofeller/templates ottofeller_nextjs
```

## Publishing
## Templates
### NextJS
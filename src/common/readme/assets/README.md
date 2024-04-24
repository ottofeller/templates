# {{PROJECT_TITLE}}

The app is created using a [projen](https://projen.io) template from `@ottofeller/templates` package.

## Update a project

In order to pull template updates you need to specify the desired version of the `@ottofeller/templates` package in either `.projenrc.ts` file or in `package.json` (if the version in `.projenrc.ts` is not fixed). Then run the default projen task:

```sh
npx projen
```

Upon completion the following changes would apply:

- all packages with specified versions are updated (if a template does not specify a dependency version, it is not managed by projen and can be updated by simply setting the desired version in `package.json`; note that this way `package-lock.json` is not necessarily updated, thus you need to check it as well);
- all projen-generated files are updated;
- all sample code files are left unchanged (note that if you have deleted some sample code files they will be recreated unless you use the `sampleCode: false` option).

## Install new packages

The common approach of installing packages by running `npm install <package-name>` won't work because `npx projen` re-synthesizes all files, including `package.json`. For details see https://github.com/ottofeller/templates?tab=readme-ov-file#install-new-packages.

To install a new packages to the project:

- Add a new item with the package name to either the `deps` or `devDeps` array in project options. Alternative way would be to use `project.addDeps('package-name')` or `project.addDevDeps('dev-package-name')`.
- Run `npx projen`. This will update the `package.json` as well as the lock file.

## Eject

To get rid of projen run this command:

```sh
npm run eject
```

The command removes default projen task, makes projen remove its authority from all the generated files and stop tracking changes. At this moment the project is managed as a regular repository (feel free to edit and remove files). For more details see https://github.com/ottofeller/templates?tab=readme-ov-file#eject.

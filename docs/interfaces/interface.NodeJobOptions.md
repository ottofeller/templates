[**@ottofeller/templates - v1.8.25**](../README.md)

***

[API](../README.md) > NodeJobOptions

---
title: NodeJobOptions
---

# Interface: NodeJobOptions

## Extends

- [`SetupNodeOptions`](interface.SetupNodeOptions.md)

## Properties

### nodeVersion

> **nodeVersion**?: `string` \| `number`

Version Spec of the version to use. Examples: 12.x, 10.15.1, >=10.15.0

#### Default

```ts
16
```

#### Inherited from

[`SetupNodeOptions`](interface.SetupNodeOptions.md).[`nodeVersion`](interface.SetupNodeOptions.md#nodeversion)

#### Source

[common/github/jobs/setup-node.ts:9](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/jobs/setup-node.ts#L9)

***

### projectPackage

> **`readonly`** **projectPackage**: `NodePackage`

Node package definition.

#### Inherited from

[`SetupNodeOptions`](interface.SetupNodeOptions.md).[`projectPackage`](interface.SetupNodeOptions.md#projectpackage)

#### Source

[common/github/jobs/setup-node.ts:14](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/jobs/setup-node.ts#L14)

***

### ref

> **ref**?: `string`

Git reference used in checkout action.
When checking out the repository that triggered a workflow,
this defaults to the reference or SHA for that event.
Otherwise, uses the default branch.

#### Inherited from

[`SetupNodeOptions`](interface.SetupNodeOptions.md).[`ref`](interface.SetupNodeOptions.md#ref)

#### Source

[common/github/jobs/setup-node.ts:22](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/jobs/setup-node.ts#L22)

***

### registryUrl

> **registryUrl**?: `string`

Optional registry to set up for auth.
Will set the registry in a project level .npmrc and .yarnrc file,
and set up auth to read in from env.NODE_AUTH_TOKEN.

#### Inherited from

[`SetupNodeOptions`](interface.SetupNodeOptions.md).[`registryUrl`](interface.SetupNodeOptions.md#registryurl)

#### Source

[common/github/jobs/setup-node.ts:29](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/jobs/setup-node.ts#L29)

***

### runScriptCommand

> **`readonly`** **runScriptCommand**: `string`

The command to use to run the script (e.g. `yarn run` or `npm run` depending on the package manager).

#### Source

[common/github/jobs/node-job-options.ts:9](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/jobs/node-job-options.ts#L9)

***

### runsOn

> **runsOn**?: `string`[]

#### Param

An array of one or more types of machine to run the job on.

#### Source

[common/github/jobs/node-job-options.ts:14](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/jobs/node-job-options.ts#L14)

***

### scope

> **scope**?: `string`

Optional scope for authenticating against scoped registries.

#### Inherited from

[`SetupNodeOptions`](interface.SetupNodeOptions.md).[`scope`](interface.SetupNodeOptions.md#scope)

#### Source

[common/github/jobs/setup-node.ts:34](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/jobs/setup-node.ts#L34)

***

### workingDirectory

> **workingDirectory**?: `string`

A working directory to all steps (the folder containing package.json with the script to run).

#### Default

```ts
./
```

#### Inherited from

[`SetupNodeOptions`](interface.SetupNodeOptions.md).[`workingDirectory`](interface.SetupNodeOptions.md#workingdirectory)

#### Source

[common/github/jobs/setup-node.ts:40](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/jobs/setup-node.ts#L40)

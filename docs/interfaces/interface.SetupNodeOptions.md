[**@ottofeller/templates - v1.8.25**](../README.md)

***

[API](../README.md) > SetupNodeOptions

---
title: SetupNodeOptions
---

# Interface: SetupNodeOptions

## Extended By

- [`NodeJobOptions`](interface.NodeJobOptions.md)

## Properties

### nodeVersion

> **nodeVersion**?: `string` \| `number`

Version Spec of the version to use. Examples: 12.x, 10.15.1, >=10.15.0

#### Default

```ts
16
```

#### Source

[common/github/jobs/setup-node.ts:9](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/jobs/setup-node.ts#L9)

***

### projectPackage

> **`readonly`** **projectPackage**: `NodePackage`

Node package definition.

#### Source

[common/github/jobs/setup-node.ts:14](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/jobs/setup-node.ts#L14)

***

### ref

> **ref**?: `string`

Git reference used in checkout action.
When checking out the repository that triggered a workflow,
this defaults to the reference or SHA for that event.
Otherwise, uses the default branch.

#### Source

[common/github/jobs/setup-node.ts:22](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/jobs/setup-node.ts#L22)

***

### registryUrl

> **registryUrl**?: `string`

Optional registry to set up for auth.
Will set the registry in a project level .npmrc and .yarnrc file,
and set up auth to read in from env.NODE_AUTH_TOKEN.

#### Source

[common/github/jobs/setup-node.ts:29](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/jobs/setup-node.ts#L29)

***

### scope

> **scope**?: `string`

Optional scope for authenticating against scoped registries.

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

#### Source

[common/github/jobs/setup-node.ts:40](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/jobs/setup-node.ts#L40)

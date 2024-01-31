[**@ottofeller/templates - v1.8.25**](../README.md)

***

[API](../README.md) > RustTestWorkflowOptions

---
title: RustTestWorkflowOptions
---

# Interface: RustTestWorkflowOptions

Options for RustTestWorkflow

## Extends

- `GithubWorkflowOptions`

## Properties

### name

> **name**?: `string`

The workflow name

#### Default

```ts
'test'
```

#### Source

[common/github/rust-test-workflow.ts:28](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/rust-test-workflow.ts#L28)

***

### runsOn

> **runsOn**?: `string`[]

Github Runner selection labels

#### Default

```ts
['ubuntu-latest']
```

#### Source

[common/github/rust-test-workflow.ts:22](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/rust-test-workflow.ts#L22)

***

### triggerOnBranches

> **triggerOnBranches**?: `string`[]

A list of branches on pushes to which the workflow will run.

#### Default

```ts
['main']
```

#### Source

[common/github/rust-test-workflow.ts:40](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/rust-test-workflow.ts#L40)

***

### triggerOnPaths

> **triggerOnPaths**?: `string`[]

A list of paths on pushes to which the workflow will run.

#### Default

```ts
['.']
```

#### Source

[common/github/rust-test-workflow.ts:34](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/rust-test-workflow.ts#L34)

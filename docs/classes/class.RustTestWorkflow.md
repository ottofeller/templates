[**@ottofeller/templates - v1.8.25**](../README.md)

***

[API](../README.md) > RustTestWorkflow

---
title: RustTestWorkflow
---

# Class: RustTestWorkflow

Configure a testing workflow with basic checks on a rust project.

## Extends

- `GithubWorkflow`

## Constructors

### constructor

> **new RustTestWorkflow**(`githubInstance`, `options` = `{}`): [`RustTestWorkflow`](class.RustTestWorkflow.md)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `githubInstance` | `GitHub` |
| `options` | [`RustTestWorkflowOptions`](../interfaces/interface.RustTestWorkflowOptions.md) |

#### Returns

[`RustTestWorkflow`](class.RustTestWorkflow.md)

#### Overrides

GithubWorkflow.constructor

#### Source

[common/github/rust-test-workflow.ts:73](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/rust-test-workflow.ts#L73)

## Methods

### addToProject

> `static` **addToProject**(`project`, `options`): `void`

Optionally creates a workflow within the given project
or within the project parent (for subprojects).

NOTE: Use this method if the described conditional logic is needed.
Otherwise just use the constructor.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `project` | `GitHubProject` |
| `options` | [`WithRustTestWorkflow`](../interfaces/interface.WithRustTestWorkflow.md) |

#### Returns

`void`

#### Source

[common/github/rust-test-workflow.ts:119](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/rust-test-workflow.ts#L119)

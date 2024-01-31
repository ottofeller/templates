[**@ottofeller/templates - v1.8.25**](../README.md)

***

[API](../README.md) > CodeOwners

---
title: CodeOwners
---

# Class: CodeOwners

## Extends

- `FileBase`

## Constructors

### constructor

> **new CodeOwners**(`github`, `options` = `{}`): [`CodeOwners`](class.CodeOwners.md)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `github` | `GitHub` |
| `options` | [`CodeOwnersOptions`](../interfaces/interface.CodeOwnersOptions.md) |

#### Returns

[`CodeOwners`](class.CodeOwners.md)

#### Overrides

FileBase.constructor

#### Source

[common/github/codeowners.ts:33](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/codeowners.ts#L33)

## Methods

### addOwners

> **addOwners**(...`codeOwners`): `void`

Adds owners to a file pattern.
Note that the order of owner definitions matters.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| ...`codeOwners` | [`PatternOwners`](../interfaces/interface.PatternOwners.md)[] | owners to add |

#### Returns

`void`

#### Source

[common/github/codeowners.ts:58](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/codeowners.ts#L58)

***

### synthesizeContent

> `protected` **synthesizeContent**(`_`): `undefined` \| `string`

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `_` | `IResolver` |

#### Returns

`undefined` \| `string`

#### Overrides

FileBase.synthesizeContent

#### Source

[common/github/codeowners.ts:62](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/codeowners.ts#L62)

***

### addToProject

> `static` **addToProject**(`project`, `options`): `void`

Optionally creates a workflow within the given project.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `project` | `GitHubProject` |
| `options` | [`WithCodeOwners`](../interfaces/interface.WithCodeOwners.md) |

#### Returns

`void`

#### Source

[common/github/codeowners.ts:45](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/codeowners.ts#L45)

***

### of

> `static` **of**(`project`): `undefined` \| [`CodeOwners`](class.CodeOwners.md)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `project` | `Project` |

#### Returns

`undefined` \| [`CodeOwners`](class.CodeOwners.md)

#### Source

[common/github/codeowners.ts:38](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/codeowners.ts#L38)

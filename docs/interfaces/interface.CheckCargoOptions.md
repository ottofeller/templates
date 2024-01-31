[**@ottofeller/templates - v1.8.25**](../README.md)

***

[API](../README.md) > CheckCargoOptions

---
title: CheckCargoOptions
---

# Interface: CheckCargoOptions

## Extends

- [`WithIgnoreBranches`](interface.WithIgnoreBranches.md)

## Properties

### ignoreBranches

> **ignoreBranches**?: `string`[]

An array of branch names to be excluded from commit message formatting.

#### Default

```ts
['main', 'dev']
```

#### Inherited from

[`WithIgnoreBranches`](interface.WithIgnoreBranches.md).[`ignoreBranches`](interface.WithIgnoreBranches.md#ignorebranches)

#### Source

[common/git/husky/with-ignore-branches.ts:7](https://github.com/ottofeller/templates/blob/0b981d6/src/common/git/husky/with-ignore-branches.ts#L7)

***

### isFormatting

> **isFormatting**?: `boolean`

Perform a code formatting step

#### Default

```ts
true
```

#### Source

[common/git/husky/check-cargo-options.ts:9](https://github.com/ottofeller/templates/blob/0b981d6/src/common/git/husky/check-cargo-options.ts#L9)

***

### workingDirectory

> **workingDirectory**?: `string`

Path to the cargo

#### Default

```ts
'.'
```

#### Source

[common/git/husky/check-cargo-options.ts:16](https://github.com/ottofeller/templates/blob/0b981d6/src/common/git/husky/check-cargo-options.ts#L16)

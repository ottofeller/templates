[**@ottofeller/templates - v1.8.25**](../README.md)

***

[API](../README.md) > CustomRuleOptions

---
title: CustomRuleOptions
---

# Interface: CustomRuleOptions

## Extends

- [`WithIgnoreBranches`](interface.WithIgnoreBranches.md)

## Properties

### command

> **`readonly`** **command**: `string`

A custom command to run in specified hook.

#### Source

[common/git/husky/custom-rule-options.ts:9](https://github.com/ottofeller/templates/blob/0b981d6/src/common/git/husky/custom-rule-options.ts#L9)

***

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

### trigger

> **`readonly`** **trigger**: [`GitHook`](../type-aliases/type-alias.GitHook.md)

Git hook to run the command in.

#### Source

[common/git/husky/custom-rule-options.ts:14](https://github.com/ottofeller/templates/blob/0b981d6/src/common/git/husky/custom-rule-options.ts#L14)

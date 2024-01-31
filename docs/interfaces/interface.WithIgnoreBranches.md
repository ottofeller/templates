[**@ottofeller/templates - v1.8.25**](../README.md)

***

[API](../README.md) > WithIgnoreBranches

---
title: WithIgnoreBranches
---

# Interface: WithIgnoreBranches

## Extended By

- [`CheckCargoOptions`](interface.CheckCargoOptions.md)
- [`CustomRuleOptions`](interface.CustomRuleOptions.md)

## Properties

### ignoreBranches

> **ignoreBranches**?: `string`[]

An array of branch names to be excluded from commit message formatting.

#### Default

```ts
['main', 'dev']
```

#### Source

[common/git/husky/with-ignore-branches.ts:7](https://github.com/ottofeller/templates/blob/0b981d6/src/common/git/husky/with-ignore-branches.ts#L7)

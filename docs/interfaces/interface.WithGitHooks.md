[**@ottofeller/templates - v1.8.25**](../README.md)

***

[API](../README.md) > WithGitHooks

---
title: WithGitHooks
---

# Interface: WithGitHooks

## Extended By

- [`OttofellerApolloServerProjectOptions`](interface.OttofellerApolloServerProjectOptions.md)
- [`OttofellerCDKProjectOptions`](interface.OttofellerCDKProjectOptions.md)
- [`OttofellerNextjsProjectOptions`](interface.OttofellerNextjsProjectOptions.md)
- [`OttofellerPlaywrightProjectOptions`](interface.OttofellerPlaywrightProjectOptions.md)
- [`OttofellerSSTProjectOptions`](interface.OttofellerSSTProjectOptions.md)

## Properties

### hasGitHooks

> **hasGitHooks**?: `boolean`

Include husky for git hook management.

#### Default

```ts
false
```

#### Source

[common/git/with-git-hooks.ts:9](https://github.com/ottofeller/templates/blob/0b981d6/src/common/git/with-git-hooks.ts#L9)

***

### huskyRules

> **huskyRules**?: [`HuskyRule`](interface.HuskyRule.md)

Include a default git hook that checks commit message.

#### Default

```ts
{ commitMsg: true }
```

#### Source

[common/git/with-git-hooks.ts:16](https://github.com/ottofeller/templates/blob/0b981d6/src/common/git/with-git-hooks.ts#L16)

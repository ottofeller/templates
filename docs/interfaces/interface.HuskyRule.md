[**@ottofeller/templates - v1.8.25**](../README.md)

***

[API](../README.md) > HuskyRule

---
title: HuskyRule
---

# Interface: HuskyRule

## Properties

### checkCargo

> **checkCargo**?: [`CheckCargoOptions`](interface.CheckCargoOptions.md)

Include pre-commit hook with `cargo check` command.

#### Default

```ts
undefined
```

#### Source

[common/git/husky/husky-rule.ts:11](https://github.com/ottofeller/templates/blob/0b981d6/src/common/git/husky/husky-rule.ts#L11)

***

### commitMsg

> **commitMsg**?: `boolean` \| [`WithIgnoreBranches`](interface.WithIgnoreBranches.md)

Include commit message hook.

#### Default

```ts
true
```

#### Source

[common/git/husky/husky-rule.ts:18](https://github.com/ottofeller/templates/blob/0b981d6/src/common/git/husky/husky-rule.ts#L18)

***

### huskyCustomRules

> **huskyCustomRules**?: [`CustomRuleOptions`](interface.CustomRuleOptions.md)[]

A custom rule that specifies a git hook
and a command to run when the hook triggers.

#### Default

```ts
undefined
```

#### Source

[common/git/husky/husky-rule.ts:26](https://github.com/ottofeller/templates/blob/0b981d6/src/common/git/husky/husky-rule.ts#L26)

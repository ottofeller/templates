[**@ottofeller/templates - v1.8.25**](../README.md)

***

[API](../README.md) > OttofellerNextjsProjectOptions

---
title: OttofellerNextjsProjectOptions
---

# Interface: OttofellerNextjsProjectOptions

## Extends

- `NextJsTypeScriptProjectOptions`.[`WithCodeOwners`](interface.WithCodeOwners.md).[`WithDocker`](interface.WithDocker.md).[`WithDefaultWorkflow`](interface.WithDefaultWorkflow.md).[`WithCustomLintPaths`](interface.WithCustomLintPaths.md).[`WithGitHooks`](interface.WithGitHooks.md).[`WithTelemetry`](interface.WithTelemetry.md)

## Properties

### codeOwners

> **codeOwners**?: [`PatternOwners`](interface.PatternOwners.md)[]

A list of objects that define a file pattern and corresponding owners for it.

#### Inherited from

[`WithCodeOwners`](interface.WithCodeOwners.md).[`codeOwners`](interface.WithCodeOwners.md#codeowners)

#### Source

[common/github/codeowners.ts:8](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/codeowners.ts#L8)

***

### hasDefaultGithubWorkflows

> **hasDefaultGithubWorkflows**?: `boolean`

Include a default GitHub pull request template.

#### Default

```ts
true
```

#### Inherited from

[`WithDefaultWorkflow`](interface.WithDefaultWorkflow.md).[`hasDefaultGithubWorkflows`](interface.WithDefaultWorkflow.md#hasdefaultgithubworkflows)

#### Source

[common/github/with-default-workflow.ts:7](https://github.com/ottofeller/templates/blob/0b981d6/src/common/github/with-default-workflow.ts#L7)

***

### hasDocker

> **hasDocker**?: `boolean`

Include docker-related files such as `.dockerignore`, `Dockerfile`, etc.

#### Default

```ts
true
```

#### Inherited from

[`WithDocker`](interface.WithDocker.md).[`hasDocker`](interface.WithDocker.md#hasdocker)

#### Source

[common/docker/with-docker.ts:7](https://github.com/ottofeller/templates/blob/0b981d6/src/common/docker/with-docker.ts#L7)

***

### hasGitHooks

> **hasGitHooks**?: `boolean`

Include husky for git hook management.

#### Default

```ts
false
```

#### Inherited from

[`WithGitHooks`](interface.WithGitHooks.md).[`hasGitHooks`](interface.WithGitHooks.md#hasgithooks)

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

#### Inherited from

[`WithGitHooks`](interface.WithGitHooks.md).[`huskyRules`](interface.WithGitHooks.md#huskyrules)

#### Source

[common/git/with-git-hooks.ts:16](https://github.com/ottofeller/templates/blob/0b981d6/src/common/git/with-git-hooks.ts#L16)

***

### isGraphqlEnabled

> **isGraphqlEnabled**?: `boolean`

Set up GraphQL dependencies and supplementary script.

#### Default

```ts
true
```

#### Source

[nextjs/index.ts:41](https://github.com/ottofeller/templates/blob/0b981d6/src/nextjs/index.ts#L41)

***

### isLighthouseEnabled

> **isLighthouseEnabled**?: `boolean`

Setup Lighthouse audit script & GitHub job.

#### Default

```ts
true
```

#### Source

[nextjs/index.ts:56](https://github.com/ottofeller/templates/blob/0b981d6/src/nextjs/index.ts#L56)

***

### isTelemetryEnabled

> **isTelemetryEnabled**?: `boolean`

Enable template usage telemetry.
Collects the data on the template package version, connected git remotes,
applied escape hatches, configured GitHub workflows.

#### Default

```ts
false
```

#### Inherited from

[`WithTelemetry`](interface.WithTelemetry.md).[`isTelemetryEnabled`](interface.WithTelemetry.md#istelemetryenabled)

#### Source

[common/telemetry/with-telemetry.ts:27](https://github.com/ottofeller/templates/blob/0b981d6/src/common/telemetry/with-telemetry.ts#L27)

***

### isUiConfigEnabled

> **isUiConfigEnabled**?: `boolean`

Setup ui packages. E.g. tailwindcss, postcss, @next/font, @headlessui/react.
Include basic styles into sample code.

#### Default

```ts
true
```

#### Source

[nextjs/index.ts:49](https://github.com/ottofeller/templates/blob/0b981d6/src/nextjs/index.ts#L49)

***

### lintPaths

> **lintPaths**?: `string`[]

An array of paths for linting and formatting.

#### Inherited from

[`WithCustomLintPaths`](interface.WithCustomLintPaths.md).[`lintPaths`](interface.WithCustomLintPaths.md#lintpaths)

#### Source

[common/lint/with-custom-lint-paths.ts:5](https://github.com/ottofeller/templates/blob/0b981d6/src/common/lint/with-custom-lint-paths.ts#L5)

***

### telemetryOptions

> **telemetryOptions**?: [`TelemetryOptions`](interface.TelemetryOptions.md)

Configuration options for telemetry

#### Inherited from

[`WithTelemetry`](interface.WithTelemetry.md).[`telemetryOptions`](interface.WithTelemetry.md#telemetryoptions)

#### Source

[common/telemetry/with-telemetry.ts:32](https://github.com/ottofeller/templates/blob/0b981d6/src/common/telemetry/with-telemetry.ts#L32)

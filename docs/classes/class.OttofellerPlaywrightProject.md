[**@ottofeller/templates - v1.8.25**](../README.md)

***

[API](../README.md) > OttofellerPlaywrightProject

---
title: OttofellerPlaywrightProject
---

# Class: OttofellerPlaywrightProject

Playwright template with TypeScript support.

## Pjid

ottofeller-playwright

## Extends

- `TypeScriptProject`

## Implements

- [`IWithTelemetryReportUrl`](../interfaces/interface.IWithTelemetryReportUrl.md)

## Constructors

### constructor

> **new OttofellerPlaywrightProject**(`options`): [`OttofellerPlaywrightProject`](class.OttofellerPlaywrightProject.md)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`OttofellerPlaywrightProjectOptions`](../interfaces/interface.OttofellerPlaywrightProjectOptions.md) |

#### Returns

[`OttofellerPlaywrightProject`](class.OttofellerPlaywrightProject.md)

#### Overrides

TypeScriptProject.constructor

#### Source

[playwright/index.ts:30](https://github.com/ottofeller/templates/blob/0b981d6/src/playwright/index.ts#L30)

## Properties

### reportTargetAuthHeaderName

> **reportTargetAuthHeaderName**?: `string`

Authorization header name for telemetry

#### Implementation of

[`IWithTelemetryReportUrl`](../interfaces/interface.IWithTelemetryReportUrl.md).[`reportTargetAuthHeaderName`](../interfaces/interface.IWithTelemetryReportUrl.md#reporttargetauthheadername)

#### Source

[playwright/index.ts:28](https://github.com/ottofeller/templates/blob/0b981d6/src/playwright/index.ts#L28)

***

### reportTargetUrl

> **reportTargetUrl**?: `string`

URL used for telemetry.

#### Implementation of

[`IWithTelemetryReportUrl`](../interfaces/interface.IWithTelemetryReportUrl.md).[`reportTargetUrl`](../interfaces/interface.IWithTelemetryReportUrl.md#reporttargeturl)

#### Source

[playwright/index.ts:27](https://github.com/ottofeller/templates/blob/0b981d6/src/playwright/index.ts#L27)

## Methods

### postSynthesize

> **postSynthesize**(): `void`

#### Returns

`void`

#### Overrides

TypeScriptProject.postSynthesize

#### Source

[playwright/index.ts:117](https://github.com/ottofeller/templates/blob/0b981d6/src/playwright/index.ts#L117)

[**@ottofeller/templates - v1.8.25**](../README.md)

***

[API](../README.md) > OttofellerNextjsProject

---
title: OttofellerNextjsProject
---

# Class: OttofellerNextjsProject

Nextjs template with TypeScript support.

## Pjid

ottofeller-nextjs

## Extends

- `NextJsTypeScriptProject`

## Implements

- [`IWithTelemetryReportUrl`](../interfaces/interface.IWithTelemetryReportUrl.md)

## Constructors

### constructor

> **new OttofellerNextjsProject**(`options`): [`OttofellerNextjsProject`](class.OttofellerNextjsProject.md)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`OttofellerNextjsProjectOptions`](../interfaces/interface.OttofellerNextjsProjectOptions.md) |

#### Returns

[`OttofellerNextjsProject`](class.OttofellerNextjsProject.md)

#### Overrides

NextJsTypeScriptProject.constructor

#### Source

[nextjs/index.ts:69](https://github.com/ottofeller/templates/blob/0b981d6/src/nextjs/index.ts#L69)

## Properties

### postSynthFormattingPaths

> **postSynthFormattingPaths**: `string`[]

#### Source

[nextjs/index.ts:65](https://github.com/ottofeller/templates/blob/0b981d6/src/nextjs/index.ts#L65)

***

### reportTargetAuthHeaderName

> **reportTargetAuthHeaderName**?: `string`

Authorization header name for telemetry

#### Implementation of

[`IWithTelemetryReportUrl`](../interfaces/interface.IWithTelemetryReportUrl.md).[`reportTargetAuthHeaderName`](../interfaces/interface.IWithTelemetryReportUrl.md#reporttargetauthheadername)

#### Source

[nextjs/index.ts:67](https://github.com/ottofeller/templates/blob/0b981d6/src/nextjs/index.ts#L67)

***

### reportTargetUrl

> **reportTargetUrl**?: `string`

URL used for telemetry.

#### Implementation of

[`IWithTelemetryReportUrl`](../interfaces/interface.IWithTelemetryReportUrl.md).[`reportTargetUrl`](../interfaces/interface.IWithTelemetryReportUrl.md#reporttargeturl)

#### Source

[nextjs/index.ts:66](https://github.com/ottofeller/templates/blob/0b981d6/src/nextjs/index.ts#L66)

## Methods

### postSynthesize

> **postSynthesize**(): `void`

#### Returns

`void`

#### Overrides

NextJsTypeScriptProject.postSynthesize

#### Source

[nextjs/index.ts:244](https://github.com/ottofeller/templates/blob/0b981d6/src/nextjs/index.ts#L244)

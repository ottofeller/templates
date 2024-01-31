[**@ottofeller/templates - v1.8.25**](../README.md)

***

[API](../README.md) > OttofellerSSTProject

---
title: OttofellerSSTProject
---

# Class: OttofellerSSTProject

SST template.

## Pjid

ottofeller-sst

## Extends

- `TypeScriptAppProject`

## Implements

- [`IWithTelemetryReportUrl`](../interfaces/interface.IWithTelemetryReportUrl.md)

## Constructors

### constructor

> **new OttofellerSSTProject**(`options`): [`OttofellerSSTProject`](class.OttofellerSSTProject.md)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`OttofellerSSTProjectOptions`](../interfaces/interface.OttofellerSSTProjectOptions.md) |

#### Returns

[`OttofellerSSTProject`](class.OttofellerSSTProject.md)

#### Overrides

TypeScriptAppProject.constructor

#### Source

[sst/index.ts:44](https://github.com/ottofeller/templates/blob/0b981d6/src/sst/index.ts#L44)

## Properties

### reportTargetAuthHeaderName

> **reportTargetAuthHeaderName**?: `string`

Authorization header name for telemetry

#### Implementation of

[`IWithTelemetryReportUrl`](../interfaces/interface.IWithTelemetryReportUrl.md).[`reportTargetAuthHeaderName`](../interfaces/interface.IWithTelemetryReportUrl.md#reporttargetauthheadername)

#### Source

[sst/index.ts:42](https://github.com/ottofeller/templates/blob/0b981d6/src/sst/index.ts#L42)

***

### reportTargetUrl

> **reportTargetUrl**?: `string`

URL used for telemetry.

#### Implementation of

[`IWithTelemetryReportUrl`](../interfaces/interface.IWithTelemetryReportUrl.md).[`reportTargetUrl`](../interfaces/interface.IWithTelemetryReportUrl.md#reporttargeturl)

#### Source

[sst/index.ts:41](https://github.com/ottofeller/templates/blob/0b981d6/src/sst/index.ts#L41)

## Methods

### postSynthesize

> **postSynthesize**(): `void`

#### Returns

`void`

#### Overrides

TypeScriptAppProject.postSynthesize

#### Source

[sst/index.ts:133](https://github.com/ottofeller/templates/blob/0b981d6/src/sst/index.ts#L133)

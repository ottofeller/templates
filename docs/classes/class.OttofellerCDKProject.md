[**@ottofeller/templates - v1.8.25**](../README.md)

***

[API](../README.md) > OttofellerCDKProject

---
title: OttofellerCDKProject
---

# Class: OttofellerCDKProject

AWS CDK template.

## Pjid

ottofeller-cdk

## Extends

- `AwsCdkTypeScriptApp`

## Implements

- [`IWithTelemetryReportUrl`](../interfaces/interface.IWithTelemetryReportUrl.md)

## Constructors

### constructor

> **new OttofellerCDKProject**(`options`): [`OttofellerCDKProject`](class.OttofellerCDKProject.md)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`OttofellerCDKProjectOptions`](../interfaces/interface.OttofellerCDKProjectOptions.md) |

#### Returns

[`OttofellerCDKProject`](class.OttofellerCDKProject.md)

#### Overrides

AwsCdkTypeScriptApp.constructor

#### Source

[cdk/index.ts:55](https://github.com/ottofeller/templates/blob/0b981d6/src/cdk/index.ts#L55)

## Properties

### initialReleaseVersion

> **`readonly`** **initialReleaseVersion**: `string` = `'0.0.1'`

#### Source

[cdk/index.ts:51](https://github.com/ottofeller/templates/blob/0b981d6/src/cdk/index.ts#L51)

***

### reportTargetAuthHeaderName

> **reportTargetAuthHeaderName**?: `string`

Authorization header name for telemetry

#### Implementation of

[`IWithTelemetryReportUrl`](../interfaces/interface.IWithTelemetryReportUrl.md).[`reportTargetAuthHeaderName`](../interfaces/interface.IWithTelemetryReportUrl.md#reporttargetauthheadername)

#### Source

[cdk/index.ts:53](https://github.com/ottofeller/templates/blob/0b981d6/src/cdk/index.ts#L53)

***

### reportTargetUrl

> **reportTargetUrl**?: `string`

URL used for telemetry.

#### Implementation of

[`IWithTelemetryReportUrl`](../interfaces/interface.IWithTelemetryReportUrl.md).[`reportTargetUrl`](../interfaces/interface.IWithTelemetryReportUrl.md#reporttargeturl)

#### Source

[cdk/index.ts:52](https://github.com/ottofeller/templates/blob/0b981d6/src/cdk/index.ts#L52)

## Methods

### postSynthesize

> **postSynthesize**(): `void`

#### Returns

`void`

#### Overrides

AwsCdkTypeScriptApp.postSynthesize

#### Source

[cdk/index.ts:182](https://github.com/ottofeller/templates/blob/0b981d6/src/cdk/index.ts#L182)

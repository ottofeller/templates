[**@ottofeller/templates - v1.8.25**](../README.md)

***

[API](../README.md) > OttofellerApolloServerProject

---
title: OttofellerApolloServerProject
---

# Class: OttofellerApolloServerProject

Apollo server template.

## Pjid

ottofeller-apollo-server

## Extends

- `TypeScriptAppProject`

## Implements

- [`IWithTelemetryReportUrl`](../interfaces/interface.IWithTelemetryReportUrl.md)

## Constructors

### constructor

> **new OttofellerApolloServerProject**(`options`): [`OttofellerApolloServerProject`](class.OttofellerApolloServerProject.md)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`OttofellerApolloServerProjectOptions`](../interfaces/interface.OttofellerApolloServerProjectOptions.md) |

#### Returns

[`OttofellerApolloServerProject`](class.OttofellerApolloServerProject.md)

#### Overrides

TypeScriptAppProject.constructor

#### Source

[apollo-server/index.ts:39](https://github.com/ottofeller/templates/blob/0b981d6/src/apollo-server/index.ts#L39)

## Properties

### reportTargetAuthHeaderName

> **reportTargetAuthHeaderName**?: `string`

Authorization header name for telemetry

#### Implementation of

[`IWithTelemetryReportUrl`](../interfaces/interface.IWithTelemetryReportUrl.md).[`reportTargetAuthHeaderName`](../interfaces/interface.IWithTelemetryReportUrl.md#reporttargetauthheadername)

#### Source

[apollo-server/index.ts:37](https://github.com/ottofeller/templates/blob/0b981d6/src/apollo-server/index.ts#L37)

***

### reportTargetUrl

> **reportTargetUrl**?: `string`

URL used for telemetry.

#### Implementation of

[`IWithTelemetryReportUrl`](../interfaces/interface.IWithTelemetryReportUrl.md).[`reportTargetUrl`](../interfaces/interface.IWithTelemetryReportUrl.md#reporttargeturl)

#### Source

[apollo-server/index.ts:36](https://github.com/ottofeller/templates/blob/0b981d6/src/apollo-server/index.ts#L36)

## Methods

### postSynthesize

> **postSynthesize**(): `void`

#### Returns

`void`

#### Overrides

TypeScriptAppProject.postSynthesize

#### Source

[apollo-server/index.ts:189](https://github.com/ottofeller/templates/blob/0b981d6/src/apollo-server/index.ts#L189)

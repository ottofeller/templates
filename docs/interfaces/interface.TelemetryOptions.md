[**@ottofeller/templates - v1.8.25**](../README.md)

***

[API](../README.md) > TelemetryOptions

---
title: TelemetryOptions
---

# Interface: TelemetryOptions

## Properties

### reportTargetAuthHeaderName

> **reportTargetAuthHeaderName**?: `string`

Authorization header name for telemetry

#### Source

[common/telemetry/with-telemetry.ts:10](https://github.com/ottofeller/templates/blob/0b981d6/src/common/telemetry/with-telemetry.ts#L10)

***

### reportTargetAuthTokenVar

> **reportTargetAuthTokenVar**?: `string`

The name of env var to extract header value from.
The value is expected to be stored in a CI secret.

#### Source

[common/telemetry/with-telemetry.ts:16](https://github.com/ottofeller/templates/blob/0b981d6/src/common/telemetry/with-telemetry.ts#L16)

***

### reportTargetUrl

> **`readonly`** **reportTargetUrl**: `string`

Endpoint URL to send telemetry data to.

#### Source

[common/telemetry/with-telemetry.ts:5](https://github.com/ottofeller/templates/blob/0b981d6/src/common/telemetry/with-telemetry.ts#L5)

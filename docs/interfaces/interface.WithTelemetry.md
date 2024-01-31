[**@ottofeller/templates - v1.8.25**](../README.md)

***

[API](../README.md) > WithTelemetry

---
title: WithTelemetry
---

# Interface: WithTelemetry

## Extended By

- [`OttofellerApolloServerProjectOptions`](interface.OttofellerApolloServerProjectOptions.md)
- [`OttofellerCDKProjectOptions`](interface.OttofellerCDKProjectOptions.md)
- [`OttofellerNextjsProjectOptions`](interface.OttofellerNextjsProjectOptions.md)
- [`OttofellerPlaywrightProjectOptions`](interface.OttofellerPlaywrightProjectOptions.md)
- [`OttofellerSSTProjectOptions`](interface.OttofellerSSTProjectOptions.md)

## Properties

### isTelemetryEnabled

> **isTelemetryEnabled**?: `boolean`

Enable template usage telemetry.
Collects the data on the template package version, connected git remotes,
applied escape hatches, configured GitHub workflows.

#### Default

```ts
false
```

#### Source

[common/telemetry/with-telemetry.ts:27](https://github.com/ottofeller/templates/blob/0b981d6/src/common/telemetry/with-telemetry.ts#L27)

***

### telemetryOptions

> **telemetryOptions**?: [`TelemetryOptions`](interface.TelemetryOptions.md)

Configuration options for telemetry

#### Source

[common/telemetry/with-telemetry.ts:32](https://github.com/ottofeller/templates/blob/0b981d6/src/common/telemetry/with-telemetry.ts#L32)

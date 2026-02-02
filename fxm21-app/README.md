# FXM21 Diagnostic Application (Scaffold)

This folder bootstraps the **next step** in building the FXM21 diagnostic application. It provides a minimal TypeScript structure with explicit extension points for:

- Ethernet communication with **HRT 710 ICP Con**.
- Dry-contact **HRT protocol** device discovery (FXM21 loop) and per-device diagnostics.
- Calibration workflows for a single FXM21 device or the full 6-device loop.

## Structure

```
fxm21-app/
  src/
    calibration/
      workflows.ts
    config/
      settings.ts
    connectors/
      hrt710.ts
    models/
      fxm21.ts
    services/
      device-registry.ts
      diagnostics.ts
      health.ts
      logger.ts
      polling.ts
      retry.ts
    index.ts
```

## Next Actions

1. Implement the TCP client in `connectors/hrt710.ts` using the vendor protocol spec.
2. Wire real protocol parsing into `services/diagnostics.ts` and populate `models/fxm21.ts`.
3. Implement calibration command sequencing in `calibration/workflows.ts`.
4. Add persistence, observability, and RBAC once the connector is stable.

## Local Development

```
FXM21_USE_FAKE=true npm start
```

This will use the in-memory connector to simulate a 6-device FXM21 loop.

> Note: This is a scaffold only; production dependencies and build tooling will be added after protocol validation.

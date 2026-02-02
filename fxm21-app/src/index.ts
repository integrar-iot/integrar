import { Hrt710EthernetConnector } from "./connectors/hrt710";
import { defaultSettings } from "./config/settings";
import { CalibrationService } from "./calibration/workflows";
import { InMemoryDeviceRegistry } from "./services/device-registry";
import { DiagnosticsService } from "./services/diagnostics";

async function main(): Promise<void> {
  const connector = new Hrt710EthernetConnector({
    host: defaultSettings.hrt710Host,
    port: defaultSettings.hrt710Port,
    timeoutMs: defaultSettings.connectionTimeoutMs,
  });

  const registry = new InMemoryDeviceRegistry();
  const diagnostics = new DiagnosticsService(connector, registry);
  const calibration = new CalibrationService(connector);

  await connector.connect();
  await diagnostics.refreshDeviceRegistry();
  const statuses = await diagnostics.readAllStatuses();

  console.log("FXM21 statuses:", statuses);

  if (statuses[0]) {
    await calibration.calibrateSingle({
      deviceId: statuses[0].deviceId,
      mode: "single",
      requestedBy: "operator",
      requestedAt: new Date().toISOString(),
    });
  }

  await connector.disconnect();
}

main().catch((error) => {
  console.error("Diagnostic app failed:", error);
  process.exitCode = 1;
});

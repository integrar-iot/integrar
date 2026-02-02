import { FakeHrt710Connector, Hrt710EthernetConnector } from "./connectors/hrt710";
import { loadSettings } from "./config/settings";
import { CalibrationService } from "./calibration/workflows";
import { InMemoryDeviceRegistry } from "./services/device-registry";
import { DiagnosticsService } from "./services/diagnostics";
import { PollingService } from "./services/polling";
import { consoleLogger } from "./services/logger";
import { HealthService } from "./services/health";

async function main(): Promise<void> {
  const settings = loadSettings(process.env);

  const connector = settings.useFakeConnector
    ? new FakeHrt710Connector()
    : new Hrt710EthernetConnector({
        host: settings.hrt710Host,
        port: settings.hrt710Port,
        timeoutMs: settings.connectionTimeoutMs,
      });

  const registry = new InMemoryDeviceRegistry();
  const diagnostics = new DiagnosticsService(connector, registry);
  const calibration = new CalibrationService(connector);
  const health = new HealthService();
  const polling = new PollingService({ intervalMs: settings.pollIntervalMs }, consoleLogger, health);

  const shutdown = async () => {
    consoleLogger.info("Shutdown initiated");
    polling.stop();
    await connector.disconnect();
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  await connector.connect();

  const pollAction = async (): Promise<void> => {
    await diagnostics.refreshDeviceRegistry();
    const statuses = await diagnostics.readAllStatuses();
    consoleLogger.info("FXM21 statuses", { count: statuses.length });
  };

  if (settings.runOnce) {
    await pollAction();
  } else {
    await polling.start(pollAction);
  }

  if (!settings.useFakeConnector) {
    consoleLogger.warn("Calibration is not executed automatically in production mode.");
  } else {
    const firstId = registry.list()[0];
    if (firstId) {
      await calibration.calibrateSingle({
        deviceId: firstId,
        mode: "single",
        requestedBy: "operator",
        requestedAt: new Date().toISOString(),
      });
    }
  }

  await connector.disconnect();
}

main().catch((error) => {
  console.error("Diagnostic app failed:", error);
  process.exitCode = 1;
});

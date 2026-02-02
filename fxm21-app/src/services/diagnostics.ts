import type { Fxm21Status } from "../models/fxm21";
import type { Hrt710Connector } from "../connectors/hrt710";
import type { DeviceRegistry } from "./device-registry";

export class DiagnosticsService {
  constructor(
    private readonly connector: Hrt710Connector,
    private readonly registry: DeviceRegistry,
  ) {}

  async refreshDeviceRegistry(): Promise<void> {
    const deviceIds = await this.connector.listFxm21DeviceIds();
    deviceIds.forEach((deviceId) => this.registry.upsert(deviceId));
  }

  async readAllStatuses(): Promise<Fxm21Status[]> {
    const deviceIds = this.registry.list();
    return Promise.all(deviceIds.map((deviceId) => this.connector.readFxm21Status(deviceId)));
  }
}

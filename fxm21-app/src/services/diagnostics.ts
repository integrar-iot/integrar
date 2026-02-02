import type { Fxm21DeviceId, Fxm21Loop, Fxm21Status } from "../models/fxm21";
import type { Hrt710Connector } from "../connectors/hrt710";
import type { DeviceRegistry } from "./device-registry";

export class DiagnosticsService {
  constructor(
    private readonly connector: Hrt710Connector,
    private readonly registry: DeviceRegistry,
  ) {}

  async refreshDeviceRegistry(): Promise<void> {
    const loops = await this.connector.listFxm21Loops();
    loops.forEach((loop) => {
      loop.deviceIds.forEach((deviceId) => this.registry.upsert(loop.loopId, deviceId));
    });
  }

  async readAllStatuses(): Promise<Fxm21Status[]> {
    const loops = this.registry.listLoops();
    const requests: Array<Promise<Fxm21Status>> = [];

    loops.forEach((loop: Fxm21Loop) => {
      loop.deviceIds.forEach((deviceId: Fxm21DeviceId) => {
        requests.push(this.connector.readFxm21Status(deviceId, loop.loopId));
      });
    });

    return Promise.all(requests);
  }
}

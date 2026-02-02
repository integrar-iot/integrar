import type { Fxm21DeviceId } from "../models/fxm21";

export interface DeviceRegistry {
  upsert(deviceId: Fxm21DeviceId): void;
  list(): Fxm21DeviceId[];
}

export class InMemoryDeviceRegistry implements DeviceRegistry {
  private readonly deviceIds = new Set<Fxm21DeviceId>();

  upsert(deviceId: Fxm21DeviceId): void {
    this.deviceIds.add(deviceId);
  }

  list(): Fxm21DeviceId[] {
    return Array.from(this.deviceIds);
  }
}

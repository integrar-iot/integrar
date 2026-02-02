import type { Fxm21DeviceId, Fxm21Loop, Fxm21LoopId } from "../models/fxm21";

export interface DeviceRegistry {
  upsert(loopId: Fxm21LoopId, deviceId: Fxm21DeviceId): void;
  listDeviceIds(): Fxm21DeviceId[];
  listLoops(): Fxm21Loop[];
}

export class InMemoryDeviceRegistry implements DeviceRegistry {
  private readonly loops = new Map<Fxm21LoopId, Set<Fxm21DeviceId>>();

  upsert(loopId: Fxm21LoopId, deviceId: Fxm21DeviceId): void {
    const loop = this.loops.get(loopId) ?? new Set<Fxm21DeviceId>();
    loop.add(deviceId);
    this.loops.set(loopId, loop);
  }

  listDeviceIds(): Fxm21DeviceId[] {
    const deviceIds: Fxm21DeviceId[] = [];
    for (const loop of this.loops.values()) {
      deviceIds.push(...loop);
    }
    return deviceIds;
  }

  listLoops(): Fxm21Loop[] {
    return Array.from(this.loops.entries()).map(([loopId, deviceIds]) => ({
      loopId,
      deviceIds: Array.from(deviceIds),
    }));
  }
}

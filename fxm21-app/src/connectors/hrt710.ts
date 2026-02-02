import type { Fxm21DeviceId, Fxm21Status } from "../models/fxm21";
import { defaultRetryPolicy, withRetry, type RetryPolicy } from "../services/retry";

export interface Hrt710ConnectionOptions {
  host: string;
  port: number;
  timeoutMs: number;
  retryPolicy?: RetryPolicy;
}

export interface Hrt710Connector {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  listFxm21DeviceIds(): Promise<Fxm21DeviceId[]>;
  readFxm21Status(deviceId: Fxm21DeviceId): Promise<Fxm21Status>;
  runFxm21Calibration(deviceId: Fxm21DeviceId): Promise<void>;
}

export class Hrt710EthernetConnector implements Hrt710Connector {
  private readonly options: Hrt710ConnectionOptions;

  constructor(options: Hrt710ConnectionOptions) {
    this.options = options;
  }

  async connect(): Promise<void> {
    await withRetry(async () => {
      throw new Error("Not implemented: Ethernet connection to HRT 710");
    }, this.options.retryPolicy ?? defaultRetryPolicy);
  }

  async disconnect(): Promise<void> {
    throw new Error("Not implemented: close Ethernet connection");
  }

  async listFxm21DeviceIds(): Promise<Fxm21DeviceId[]> {
    throw new Error("Not implemented: FXM21 loop scan via HRT protocol");
  }

  async readFxm21Status(_deviceId: Fxm21DeviceId): Promise<Fxm21Status> {
    throw new Error("Not implemented: FXM21 status read via HRT 710");
  }

  async runFxm21Calibration(_deviceId: Fxm21DeviceId): Promise<void> {
    throw new Error("Not implemented: FXM21 calibration command sequence");
  }
}

export class FakeHrt710Connector implements Hrt710Connector {
  private connected = false;
  private readonly deviceIds: Fxm21DeviceId[];

  constructor(deviceCount = 6) {
    this.deviceIds = Array.from({ length: deviceCount }, (_, index) => `FXM21-${index + 1}`);
  }

  async connect(): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  async listFxm21DeviceIds(): Promise<Fxm21DeviceId[]> {
    this.ensureConnected();
    return [...this.deviceIds];
  }

  async readFxm21Status(deviceId: Fxm21DeviceId): Promise<Fxm21Status> {
    this.ensureConnected();
    return {
      deviceId,
      timestamp: new Date().toISOString(),
      metrics: {
        flowRate: Math.round(Math.random() * 1000) / 10,
        temperature: Math.round((20 + Math.random() * 10) * 10) / 10,
        valveOpen: Math.random() > 0.5,
      },
      alarms: [],
    };
  }

  async runFxm21Calibration(_deviceId: Fxm21DeviceId): Promise<void> {
    this.ensureConnected();
  }

  private ensureConnected(): void {
    if (!this.connected) {
      throw new Error("Connector is not connected");
    }
  }
}

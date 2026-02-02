import type { Fxm21DeviceId, Fxm21Status } from "../models/fxm21";

export interface Hrt710ConnectionOptions {
  host: string;
  port: number;
  timeoutMs: number;
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
    throw new Error("Not implemented: Ethernet connection to HRT 710");
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

import type { Fxm21CalibrationRequest, Fxm21CalibrationResult } from "../models/fxm21";
import type { Hrt710Connector } from "../connectors/hrt710";

export class CalibrationService {
  constructor(private readonly connector: Hrt710Connector) {}

  async calibrateSingle(request: Fxm21CalibrationRequest): Promise<Fxm21CalibrationResult> {
    await this.connector.runFxm21Calibration(request.deviceId);

    return {
      deviceId: request.deviceId,
      success: true,
      completedAt: new Date().toISOString(),
    };
  }

  async calibrateLoop(requests: Fxm21CalibrationRequest[]): Promise<Fxm21CalibrationResult[]> {
    const results: Fxm21CalibrationResult[] = [];

    for (const request of requests) {
      results.push(await this.calibrateSingle(request));
    }

    return results;
  }
}

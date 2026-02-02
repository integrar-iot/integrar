export type Fxm21DeviceId = string;
export type Fxm21LoopId = string;

export interface Fxm21Loop {
  loopId: Fxm21LoopId;
  deviceIds: Fxm21DeviceId[];
}

export interface Fxm21Status {
  deviceId: Fxm21DeviceId;
  loopId: Fxm21LoopId;
  timestamp: string;
  metrics: Record<string, number | string | boolean>;
  alarms: string[];
}

export interface Fxm21CalibrationRequest {
  deviceId: Fxm21DeviceId;
  mode: "single" | "loop";
  requestedBy: string;
  requestedAt: string;
}

export interface Fxm21CalibrationResult {
  deviceId: Fxm21DeviceId;
  success: boolean;
  completedAt: string;
  notes?: string;
}

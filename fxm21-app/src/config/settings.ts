export interface AppSettings {
  hrt710Host: string;
  hrt710Port: number;
  connectionTimeoutMs: number;
  pollIntervalMs: number;
  useFakeConnector: boolean;
  runOnce: boolean;
}

export const defaultSettings: AppSettings = {
  hrt710Host: "192.168.0.100",
  hrt710Port: 502,
  connectionTimeoutMs: 5000,
  pollIntervalMs: 5000,
  useFakeConnector: false,
  runOnce: false,
};

const parseNumber = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (!value) {
    return fallback;
  }

  return value.toLowerCase() === "true";
};

const requireValue = (label: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing required setting: ${label}`);
  }

  return value;
};

export const loadSettings = (env: Record<string, string | undefined>): AppSettings => {
  const useFakeConnector = parseBoolean(env.FXM21_USE_FAKE, defaultSettings.useFakeConnector);

  return {
    hrt710Host: useFakeConnector
      ? defaultSettings.hrt710Host
      : requireValue("FXM21_HRT710_HOST", env.FXM21_HRT710_HOST),
    hrt710Port: parseNumber(env.FXM21_HRT710_PORT, defaultSettings.hrt710Port),
    connectionTimeoutMs: parseNumber(env.FXM21_TIMEOUT_MS, defaultSettings.connectionTimeoutMs),
    pollIntervalMs: parseNumber(env.FXM21_POLL_INTERVAL_MS, defaultSettings.pollIntervalMs),
    useFakeConnector,
    runOnce: parseBoolean(env.FXM21_RUN_ONCE, defaultSettings.runOnce),
  };
};

export interface AppSettings {
  hrt710Host: string;
  hrt710Port: number;
  connectionTimeoutMs: number;
}

export const defaultSettings: AppSettings = {
  hrt710Host: "192.168.0.100",
  hrt710Port: 502,
  connectionTimeoutMs: 5000,
};

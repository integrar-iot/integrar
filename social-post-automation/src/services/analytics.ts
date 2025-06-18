interface Metric {
  platform: string;
  success: boolean;
  timestamp: number;
}

const metrics: Metric[] = [];

export function recordMetrics(platform: string, success: boolean) {
  metrics.push({ platform, success, timestamp: Date.now() });
}

export async function getMetrics() {
  return metrics;
}

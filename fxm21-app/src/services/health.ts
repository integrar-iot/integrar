export interface HealthSnapshot {
  lastSuccessAt?: string;
  lastErrorAt?: string;
  lastErrorMessage?: string;
  consecutiveFailures: number;
}

export class HealthService {
  private snapshot: HealthSnapshot = {
    consecutiveFailures: 0,
  };

  recordSuccess(): void {
    this.snapshot = {
      consecutiveFailures: 0,
      lastSuccessAt: new Date().toISOString(),
      lastErrorAt: this.snapshot.lastErrorAt,
      lastErrorMessage: this.snapshot.lastErrorMessage,
    };
  }

  recordFailure(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);

    this.snapshot = {
      lastSuccessAt: this.snapshot.lastSuccessAt,
      lastErrorAt: new Date().toISOString(),
      lastErrorMessage: message,
      consecutiveFailures: this.snapshot.consecutiveFailures + 1,
    };
  }

  getSnapshot(): HealthSnapshot {
    return { ...this.snapshot };
  }
}

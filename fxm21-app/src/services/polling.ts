import type { Logger } from "./logger";
import type { HealthService } from "./health";

export interface PollingOptions {
  intervalMs: number;
}

export class PollingService {
  private isRunning = false;

  constructor(
    private readonly options: PollingOptions,
    private readonly logger: Logger,
    private readonly health: HealthService,
  ) {}

  async start(action: () => Promise<void>): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.logger.info("Polling service started", { intervalMs: this.options.intervalMs });

    while (this.isRunning) {
      try {
        await action();
        this.health.recordSuccess();
      } catch (error) {
        this.health.recordFailure(error);
        this.logger.error("Polling action failed", { error: String(error) });
      }

      await new Promise((resolve) => setTimeout(resolve, this.options.intervalMs));
    }
  }

  stop(): void {
    this.isRunning = false;
    this.logger.info("Polling service stopped");
  }
}

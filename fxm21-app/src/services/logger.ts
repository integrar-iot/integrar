export interface Logger {
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}

export const consoleLogger: Logger = {
  info(message, meta) {
    if (meta) {
      console.info(message, meta);
    } else {
      console.info(message);
    }
  },
  warn(message, meta) {
    if (meta) {
      console.warn(message, meta);
    } else {
      console.warn(message);
    }
  },
  error(message, meta) {
    if (meta) {
      console.error(message, meta);
    } else {
      console.error(message);
    }
  },
};

declare const process: {
  env: Record<string, string | undefined>;
  exitCode?: number;
  on(event: "SIGINT" | "SIGTERM", listener: () => void): void;
};

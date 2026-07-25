export const requestLogger = {
  log: (method: string, path: string, durationMs: number, status: number) => {
    console.info(`[REQUEST] ${method} ${path} - ${status} (${durationMs}ms)`);
  },
};

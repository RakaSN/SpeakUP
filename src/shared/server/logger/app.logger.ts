export const appLogger = {
  info: (message: string, meta?: unknown) => console.log(`[APP-INFO] ${message}`, meta || ''),
  error: (message: string, error?: unknown) => console.error(`[APP-ERROR] ${message}`, error || ''),
  warn: (message: string, meta?: unknown) => console.warn(`[APP-WARN] ${message}`, meta || ''),
  debug: (message: string, meta?: unknown) => console.debug(`[APP-DEBUG] ${message}`, meta || ''),
};

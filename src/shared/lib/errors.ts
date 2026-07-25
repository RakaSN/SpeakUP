// Error Code Standard
export const ERROR_CODES = {
  AUTH_INVALID: 'AUTH_INVALID',
  AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',
  TICKET_NOT_FOUND: 'TICKET_NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MASTER_DATA_NOT_FOUND: 'MASTER_DATA_NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DUPLICATE_RESOURCE: 'DUPLICATE_RESOURCE',
  NOT_FOUND: 'NOT_FOUND',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;

  constructor(code: ErrorCode, message: string, statusCode = 400, details?: Record<string, unknown>) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

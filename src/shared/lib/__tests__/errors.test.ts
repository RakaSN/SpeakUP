import { describe, it, expect } from 'vitest';
import { AppError, ERROR_CODES } from '@/shared/lib/errors';

describe('Error Code Catalog', () => {
  it('harus memiliki semua kode error standar', () => {
    expect(ERROR_CODES.AUTH_INVALID).toBe('AUTH_INVALID');
    expect(ERROR_CODES.AUTH_FORBIDDEN).toBe('AUTH_FORBIDDEN');
    expect(ERROR_CODES.TICKET_NOT_FOUND).toBe('TICKET_NOT_FOUND');
    expect(ERROR_CODES.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
    expect(ERROR_CODES.MASTER_DATA_NOT_FOUND).toBe('MASTER_DATA_NOT_FOUND');
    expect(ERROR_CODES.INTERNAL_SERVER_ERROR).toBe('INTERNAL_SERVER_ERROR');
  });

  it('AppError harus menyimpan code, statusCode, dan message dengan benar', () => {
    const error = new AppError('AUTH_INVALID', 'Token tidak valid', 401);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('AUTH_INVALID');
    expect(error.message).toBe('Token tidak valid');
    expect(error.statusCode).toBe(401);
    expect(error.name).toBe('AppError');
  });

  it('AppError harus memiliki default statusCode 400', () => {
    const error = new AppError('VALIDATION_ERROR', 'Field wajib kosong');

    expect(error.statusCode).toBe(400);
  });

  it('AppError harus menyimpan details jika diberikan', () => {
    const details = { field: 'email', reason: 'format tidak valid' };
    const error = new AppError('VALIDATION_ERROR', 'Validasi gagal', 422, details);

    expect(error.details).toEqual(details);
  });
});

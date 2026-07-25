import { describe, it, expect, vi } from 'vitest';
import { appLogger } from '@/shared/server/logger/app.logger';
import { auditLogger } from '@/shared/server/logger/audit.logger';
import { requestLogger } from '@/shared/server/logger/request.logger';

describe('App Logger', () => {
  it('info() harus memanggil console.log', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    appLogger.info('Test info message');
    expect(spy).toHaveBeenCalledWith('[APP-INFO] Test info message', '');
    spy.mockRestore();
  });

  it('error() harus memanggil console.error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    appLogger.error('Test error message', new Error('fail'));
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('warn() harus memanggil console.warn', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    appLogger.warn('Test warn');
    expect(spy).toHaveBeenCalledWith('[APP-WARN] Test warn', '');
    spy.mockRestore();
  });

  it('debug() harus memanggil console.debug', () => {
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    appLogger.debug('Test debug', { extra: true });
    expect(spy).toHaveBeenCalledWith('[APP-DEBUG] Test debug', { extra: true });
    spy.mockRestore();
  });
});

describe('Audit Logger', () => {
  it('logAction() harus mengeluarkan JSON terstruktur', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    auditLogger.logAction('user-123', 'STATUS_CHANGED', 'ticket-456', 'Mengubah status');

    expect(spy).toHaveBeenCalled();
    const logged = JSON.parse(spy.mock.calls[0][0] as string);
    expect(logged.log_type).toBe('AUDIT');
    expect(logged.actorId).toBe('user-123');
    expect(logged.action).toBe('STATUS_CHANGED');
    expect(logged.targetId).toBe('ticket-456');
    expect(logged.note).toBe('Mengubah status');
    expect(logged.timestamp).toBeDefined();
    spy.mockRestore();
  });

  it('logAction() harus mengisi note dengan "-" jika kosong', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    auditLogger.logAction('user-123', 'TICKET_CREATED', 'ticket-789');

    const logged = JSON.parse(spy.mock.calls[0][0] as string);
    expect(logged.note).toBe('-');
    spy.mockRestore();
  });
});

describe('Request Logger', () => {
  it('log() harus mengeluarkan format yang benar', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    requestLogger.log('GET', '/api/health', 42, 200);
    expect(spy).toHaveBeenCalledWith('[REQUEST] GET /api/health - 200 (42ms)');
    spy.mockRestore();
  });
});

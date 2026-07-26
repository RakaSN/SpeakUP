import { describe, it, expect } from 'vitest';
import { checkRateLimit } from './security/rate-limit';
import { validateUploadedFile } from './security/upload-validator';

describe('Performance & Security Verification Suite (Sprint 5D)', () => {
  it('Rate limiter executes within < 5ms for rapid requests', () => {
    const start = performance.now();
    for (let i = 0; i < 5; i++) {
      checkRateLimit(`test-ip-${i}`, { limit: 10, windowMs: 60000 });
    }
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(10); // Under 10ms for 5 checks
  });

  it('File validator processes size and extension boundaries instantly', () => {
    const validResult = validateUploadedFile('document.pdf', 'application/pdf', 1024 * 1024);
    expect(validResult.valid).toBe(true);

    const invalidResult = validateUploadedFile('script.exe', 'application/octet-stream', 1024);
    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.error).toContain('tidak diizinkan');
  });
});

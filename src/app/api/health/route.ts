import { NextResponse } from 'next/server';
import { container } from '@/shared/server/container';

export async function GET() {
  let dbStatus = 'disconnected';
  try {
    // Jalankan simple query untuk test koneksi
    await container.db.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'error';
    container.logger.app.error('Database health check failed', error);
  }

  const isHealthy = dbStatus === 'connected';

  return NextResponse.json({
    status: isHealthy ? 'ok' : 'error',
    database: dbStatus,
    version: '0.0.1',
    timestamp: new Date().toISOString(),
  }, { 
    status: isHealthy ? 200 : 503 
  });
}

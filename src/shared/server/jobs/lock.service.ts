import { db } from '@/shared/server/db';

export const LockService = {
  /**
   * Attempt to acquire a distributed execution lock on a job with a specified lease TTL.
   */
  async acquireLock(jobCode: string, runnerId: string, leaseMs = 5 * 60 * 1000): Promise<boolean> {
    const now = new Date();
    const staleCutoff = new Date(now.getTime() - leaseMs);

    // Find current job config
    const config = await db.jobConfiguration.findUnique({
      where: { jobCode },
    });

    if (!config) return false;

    // Check if lock is currently active and valid
    const isLocked = config.lockedAt && config.lockedAt > staleCutoff && config.lockedBy !== runnerId;
    if (isLocked) {
      console.log(`[LockService] Contention: Job '${jobCode}' is currently locked by '${config.lockedBy}' until ${new Date(config.lockedAt!.getTime() + leaseMs).toISOString()}`);
      return false; // Contention: Lock held by another runner
    }

    // Acquire or renew lock
    await db.jobConfiguration.update({
      where: { jobCode },
      data: {
        lockedAt: now,
        lockedBy: runnerId,
        heartbeatAt: now,
      },
    });

    return true;
  },

  /**
   * Release an acquired lock.
   */
  async releaseLock(jobCode: string, runnerId: string): Promise<void> {
    const config = await db.jobConfiguration.findUnique({
      where: { jobCode },
    });

    // Only release if locked by this runner
    if (config?.lockedBy === runnerId) {
      await db.jobConfiguration.update({
        where: { jobCode },
        data: {
          lockedAt: null,
          lockedBy: null,
        },
      });
    }
  },

  /**
   * Perform recovery of stale locks that exceeded their lease time without being released.
   */
  async staleLockRecovery(leaseMs = 5 * 60 * 1000): Promise<number> {
    const staleCutoff = new Date(Date.now() - leaseMs);

    const result = await db.jobConfiguration.updateMany({
      where: {
        lockedAt: { lt: staleCutoff },
      },
      data: {
        lockedAt: null,
        lockedBy: null,
      },
    });

    if (result.count > 0) {
      console.log(`[LockService] Recovered ${result.count} stale job locks.`);
    }

    return result.count;
  },
};

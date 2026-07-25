export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Import secara dinamis agar tidak memicu eksekusi edge-runtime yang tidak kompatibel
    const { registerNotificationListeners } = await import('@/features/notifications/server/notification.listener');
    const { registerAuditListeners } = await import('@/features/audit/server/audit.listener');
    
    registerNotificationListeners();
    registerAuditListeners();
  }
}

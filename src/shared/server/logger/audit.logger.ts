export const auditLogger = {
  // Audit log bersifat kritikal dan append-only.
  // Pisahkan dari rotasi standar aplikasi (App logger).
  logAction: (actorId: string, action: string, targetId: string, note?: string) => {
    console.info(JSON.stringify({
      log_type: 'AUDIT',
      timestamp: new Date().toISOString(),
      actorId,
      action,
      targetId,
      note: note || '-'
    }));
    // Di masa depan bisa diekstensi untuk menulis ke file append-only atau datadog
  },
};

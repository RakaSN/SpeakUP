export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Import secara dinamis agar tidak memicu eksekusi edge-runtime yang tidak kompatibel
    const { registerNotificationListeners } = await import('@/features/notifications/server/notification.listener');
    const { registerAuditListeners } = await import('@/features/audit/server/audit.listener');
    const { JobRegistry } = await import('@/shared/server/jobs/job.registry');
    const { DummyLogJob } = await import('@/shared/server/jobs/dummy-log.job');
    const { SlaReminderJob } = await import('@/features/sla/jobs/sla-reminder.job');
    const { AutoEscalationJob } = await import('@/features/tickets/jobs/auto-escalation.job');
    const { DailyDigestJob } = await import('@/features/reports/jobs/daily-digest.job');
    const { CleanupJob } = await import('@/shared/server/jobs/cleanup.job');
    const { AIClassificationJob } = await import('@/features/tickets/jobs/ai-classification.job');
    const { AISummaryJob } = await import('@/features/tickets/jobs/ai-summary.job');
    const { AITrendAnalysisJob } = await import('@/features/tickets/jobs/ai-trend-analysis.job');
    const { AIPredictiveRiskJob } = await import('@/features/tickets/jobs/ai-predictive-risk.job');
    const { SchedulerService } = await import('@/shared/server/jobs/scheduler.service');

    registerNotificationListeners();
    registerAuditListeners();

    // Centralized Registration of All Platform & Business Jobs
    JobRegistry.register(new DummyLogJob());
    JobRegistry.register(new SlaReminderJob());
    JobRegistry.register(new AutoEscalationJob());
    JobRegistry.register(new DailyDigestJob());
    JobRegistry.register(new CleanupJob());
    JobRegistry.register(new AIClassificationJob());
    JobRegistry.register(new AISummaryJob());
    JobRegistry.register(new AITrendAnalysisJob());
    JobRegistry.register(new AIPredictiveRiskJob());

    // Boot Background Scheduler Engine
    SchedulerService.start();
  }
}


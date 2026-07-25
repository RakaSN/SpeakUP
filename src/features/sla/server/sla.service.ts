export type SlaStatus = 'ON_TRACK' | 'AT_RISK' | 'OVERDUE' | 'RESOLVED_ON_TIME' | 'RESOLVED_LATE';

export interface SlaState {
  slaStatus: SlaStatus;
  remainingHours: number;
  isOverdue: boolean;
  label: string;
  badgeClass: string;
}

export const SlaService = {
  /**
   * Menghitung status SLA secara presisi berdasarkan sumber waktu server tunggal.
   */
  calculateSlaState(ticket: {
    createdAt: Date | string;
    resolvedAt?: Date | string | null;
    targetResolutionAt?: Date | string | null;
    slaStatus?: SlaStatus | string | null;
  }): SlaState {
    const targetAt = ticket.targetResolutionAt ? new Date(ticket.targetResolutionAt) : null;
    
    // Jika tiket sudah selesai/ditutup
    if (ticket.resolvedAt && targetAt) {
      const resolvedAt = new Date(ticket.resolvedAt);
      const isOnTime = resolvedAt <= targetAt;
      return {
        slaStatus: isOnTime ? 'RESOLVED_ON_TIME' : 'RESOLVED_LATE',
        remainingHours: 0,
        isOverdue: !isOnTime,
        label: isOnTime ? 'Selesai Tepat Waktu' : 'Selesai Terlambat',
        badgeClass: isOnTime
          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
          : 'bg-destructive/10 text-destructive border-destructive/20',
      };
    }

    if (!targetAt) {
      return {
        slaStatus: 'ON_TRACK',
        remainingHours: 24,
        isOverdue: false,
        label: 'Tepat Waktu',
        badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      };
    }

    const now = new Date();
    const diffMs = targetAt.getTime() - now.getTime();
    const remainingHours = Math.round(diffMs / (1000 * 60 * 60));

    if (remainingHours < 0) {
      return {
        slaStatus: 'OVERDUE',
        remainingHours,
        isOverdue: true,
        label: `Terlambat ${Math.abs(remainingHours)} jam`,
        badgeClass: 'bg-destructive/10 text-destructive border-destructive/20 font-bold',
      };
    }

    if (remainingHours <= 4) {
      return {
        slaStatus: 'AT_RISK',
        remainingHours,
        isOverdue: false,
        label: `Mendekati Tenggat (${remainingHours} jam)`,
        badgeClass: 'bg-amber-50 text-amber-600 border-amber-200 font-semibold',
      };
    }

    return {
      slaStatus: 'ON_TRACK',
      remainingHours,
      isOverdue: false,
      label: `Sisa ${remainingHours} jam`,
      badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    };
  },
};

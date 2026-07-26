import { NotificationType } from '@prisma/client';

// ============================================================
// Template Variable Types
// ============================================================

export interface NotificationVariables {
  ticketNumber?: string;
  ticketTitle?: string;
  assigneeName?: string;
  newStatus?: string;
  date?: string;
  totalCreated?: number;
  totalResolved?: number;
  totalOverdue?: number;
  totalActive?: number;
  [key: string]: unknown;
}

// ============================================================
// Template Definition
// ============================================================

export type NotificationSeverity = 'INFO' | 'WARNING' | 'ERROR';
export type NotificationCategory = 'SYSTEM' | 'SLA' | 'TICKET' | 'REPORT';

export interface NotificationTemplate {
  readonly code: string;
  readonly severity: NotificationSeverity;
  readonly category: NotificationCategory;
  render(variables: NotificationVariables): { title: string; message: string };
}

// ============================================================
// Template Registry
// ============================================================

const templates: Record<string, NotificationTemplate> = {
  TICKET_CREATED: {
    code: 'TICKET_CREATED',
    severity: 'INFO',
    category: 'TICKET',
    render: () => ({
      title: 'Tiket Berhasil Dibuat',
      message: 'Tiket Anda telah diterima oleh sistem dan sedang menunggu peninjauan.',
    }),
  },

  TICKET_ASSIGNED: {
    code: 'TICKET_ASSIGNED',
    severity: 'INFO',
    category: 'TICKET',
    render: () => ({
      title: 'Penugasan Tiket Baru',
      message: 'Anda telah ditugaskan untuk menangani sebuah tiket baru.',
    }),
  },

  TICKET_STATUS_CHANGED: {
    code: 'TICKET_STATUS_CHANGED',
    severity: 'INFO',
    category: 'TICKET',
    render: (v) => ({
      title: `Status Tiket #${v.ticketNumber} Berubah`,
      message: `Status tiket Anda telah diperbarui menjadi ${v.newStatus}.`,
    }),
  },

  SLA_REMINDER: {
    code: 'SLA_REMINDER',
    severity: 'WARNING',
    category: 'SLA',
    render: (v) => ({
      title: `⚠️ Peringatan SLA: Tiket #${v.ticketNumber}`,
      message: `Tiket "${v.ticketTitle}" mendekati batas waktu penyelesaian SLA (sisa < 4 jam). Mohon segera ditindaklanjuti.`,
    }),
  },

  AUTO_ESCALATION: {
    code: 'AUTO_ESCALATION',
    severity: 'ERROR',
    category: 'SLA',
    render: (v) => ({
      title: `🚨 Eskalasi SLA: Tiket Terlambat #${v.ticketNumber}`,
      message: `Tiket "${v.ticketTitle}" telah melewati batas waktu SLA. Diperlukan intervensi manajemen.`,
    }),
  },

  DAILY_DIGEST: {
    code: 'DAILY_DIGEST',
    severity: 'INFO',
    category: 'REPORT',
    render: (v) => ({
      title: `📊 Ringkasan Eksekutif Harian — ${v.date}`,
      message: `Ringkasan 24 Jam Terakhir (${v.date}): ${v.totalCreated} tiket baru masuk, ${v.totalResolved} selesai, ${v.totalOverdue} overdue, dan ${v.totalActive} tiket aktif saat ini.`,
    }),
  },
};

/**
 * Get a notification template by code.
 */
export function getTemplate(code: string): NotificationTemplate | undefined {
  return templates[code];
}

/**
 * Get the NotificationType (Prisma enum) from template severity.
 */
export function severityToNotificationType(severity: NotificationSeverity): NotificationType {
  switch (severity) {
    case 'WARNING': return 'WARNING';
    case 'ERROR': return 'ERROR';
    default: return 'INFO';
  }
}

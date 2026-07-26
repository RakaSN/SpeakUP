import { SlaService } from '../server/sla.service';

interface SlaBadgeProps {
  createdAt: Date | string;
  resolvedAt?: Date | string | null;
  targetResolutionAt?: Date | string | null;
  slaStatus?: string | null;
}

export function SlaBadge({ createdAt, resolvedAt, targetResolutionAt, slaStatus }: SlaBadgeProps) {
  const slaState = SlaService.calculateSlaState({
    createdAt,
    resolvedAt,
    targetResolutionAt,
    slaStatus,
  });

  return (
    <span 
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${slaState.badgeClass}`}
      title={targetResolutionAt ? `Target Waktu: ${new Date(targetResolutionAt).toLocaleString('id-ID')}` : 'SLA Indicator'}
    >
      ⏱️ {slaState.label}
    </span>
  );
}

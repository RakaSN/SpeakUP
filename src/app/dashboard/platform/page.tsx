import { auth } from '@/features/auth/server/auth';
import { redirect } from 'next/navigation';
import { JobMetricsService } from '@/features/jobs/server/job-metrics.service';
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
} from '@/components/ui';
import {
  Server,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

export default async function PlatformDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const [health, breakdown, recentLogs] = await Promise.all([
    JobMetricsService.getHealthMetrics(7),
    JobMetricsService.getJobBreakdown(),
    JobMetricsService.getRecentLogs(20),
  ]);

  return (
    <div className="space-y-8 py-4 animate-fade-in">
      <PageHeader
        title="Platform Health Dashboard"
        description="Metrik kesehatan runtime, scheduler, dan background jobs (7 hari terakhir)."
        badge={<Badge variant="info">Platform Ops</Badge>}
      />

      {/* ── Platform Health Cards ─────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card variant="default" className="metric-accent">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Eksekusi (7 Hari)</p>
              <p className="text-3xl font-extrabold font-heading text-foreground">{health.totalExecutions}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Server className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card variant="default" className="metric-accent metric-accent-success">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Success Rate</p>
              <p className="text-3xl font-extrabold font-heading text-success">{health.successRate}%</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card variant="default" className="metric-accent metric-accent-destructive">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Failure Rate</p>
              <p className="text-3xl font-extrabold font-heading text-destructive">{health.failureRate}%</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card variant="default" className="metric-accent metric-accent-info">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rata-rata Durasi</p>
              <p className="text-3xl font-extrabold font-heading text-primary">{health.avgDurationMs}ms</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-info/10 text-info flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Insights Cards ─────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {health.longestRunningJob && (
          <Card variant="default" className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 text-warning-foreground flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Longest Running Job</p>
                <p className="text-sm font-semibold text-foreground">{health.longestRunningJob.jobCode}</p>
                <p className="text-xs text-muted-foreground">{health.longestRunningJob.durationMs}ms</p>
              </div>
            </CardContent>
          </Card>
        )}
        {health.mostFrequentJob && (
          <Card variant="default" className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 text-info flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Most Frequent Job</p>
                <p className="text-sm font-semibold text-foreground">{health.mostFrequentJob.jobCode}</p>
                <p className="text-xs text-muted-foreground">{health.mostFrequentJob.count} eksekusi</p>
              </div>
            </CardContent>
          </Card>
        )}
        {health.mostFailedJob && (
          <Card variant="default" className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Most Failed Job</p>
                <p className="text-sm font-semibold text-destructive">{health.mostFailedJob.jobCode}</p>
                <p className="text-xs text-muted-foreground">{health.mostFailedJob.count} kegagalan</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ── Registered Jobs (Scheduler Status) ─────── */}
      <Card variant="default" className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="w-4 h-4 text-primary" />
            Registered Jobs & Scheduler
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-modern">
              <thead>
                <tr>
                  <th>Job Code</th>
                  <th>Nama</th>
                  <th>Status</th>
                  <th>Total Run</th>
                  <th>Success %</th>
                  <th>Avg Duration</th>
                  <th>Last Run</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.map((job) => (
                  <tr key={job.jobCode}>
                    <td className="font-mono text-xs">{job.jobCode}</td>
                    <td className="text-foreground">{job.jobName}</td>
                    <td>
                      <Badge variant={job.isActive ? 'success' : 'secondary'} size="sm">
                        {job.isActive ? 'Active' : 'Disabled'}
                      </Badge>
                    </td>
                    <td className="font-semibold">{job.totalRuns}</td>
                    <td className="font-semibold">{job.successRate}%</td>
                    <td className="text-muted-foreground">{job.avgDurationMs}ms</td>
                    <td className="text-xs text-muted-foreground">
                      {job.lastRunAt ? new Date(job.lastRunAt).toLocaleString('id-ID') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Recent Executions Log ──────────────────── */}
      <Card variant="default" className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Server className="w-4 h-4 text-primary" />
            Riwayat Eksekusi Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-modern">
              <thead>
                <tr>
                  <th>Job Code</th>
                  <th>Status</th>
                  <th>Durasi</th>
                  <th>Pesan</th>
                  <th>Waktu</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="font-mono text-xs">{log.jobCode}</td>
                    <td>
                      <Badge variant={log.status === 'SUCCESS' ? 'success' : 'destructive'} size="sm">
                        {log.status}
                      </Badge>
                    </td>
                    <td className="text-xs text-muted-foreground">{log.durationMs ?? '—'}ms</td>
                    <td className="text-xs text-muted-foreground max-w-xs truncate">{log.message || '—'}</td>
                    <td className="text-xs text-muted-foreground">
                      {new Date(log.startedAt).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

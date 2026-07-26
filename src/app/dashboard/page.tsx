import { auth } from '@/features/auth/server/auth';
import { DashboardService } from '@/features/dashboard/server/dashboard.service';
import { SlaBadge } from '@/features/sla/components/sla-badge';
import Link from 'next/link';
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
} from '@/components/ui';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  Activity,
} from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const data = await DashboardService.getDashboardData(session.user.id);
  const aiTelemetry = data.extraWidgets?.aiTelemetry;
  const modelEvaluation = data.extraWidgets?.modelEvaluation;

  return (
    <div className="space-y-8 py-4 selection:bg-primary/20 animate-fade-in">
      {/* Cockpit Greeting Header */}
      <PageHeader
        title={`👋 Selamat datang kembali, ${session.user.name}`}
        description={`Cockpit Operasional Pengaduan Sekolah (${data.roleName}) • SMKS Kampung Jawa`}
        badge={
          <Badge variant="success" size="sm" className="bg-success/15 text-success border-success/30 font-medium">
            Cockpit PX v1.1
          </Badge>
        }
        actions={
          <div className="flex items-center gap-3">
            <Link href="/dashboard/tickets/create">
              <Button variant="default" size="sm" className="shadow-sm font-medium">
                <FileText className="w-4 h-4 mr-1.5" />
                Buat Tiket Baru
              </Button>
            </Link>
          </div>
        }
      />

      {/* Grid Metrik Cockpit (4 Core Cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card variant="default" className="metric-accent transition-all duration-200 hover:shadow-md border-border/80">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Tiket ({data.roleName})
              </p>
              <p className="text-3xl font-extrabold font-heading text-foreground">
                {data.metrics.total}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default" className="metric-accent metric-accent-success transition-all duration-200 hover:shadow-md border-border/80">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Selesai (Resolved)
              </p>
              <p className="text-3xl font-extrabold font-heading text-success">
                {data.metrics.resolved}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default" className="metric-accent metric-accent-warning transition-all duration-200 hover:shadow-md border-border/80">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Dalam Proses (Pending)
              </p>
              <p className="text-3xl font-extrabold font-heading text-warning-foreground">
                {data.metrics.pending}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-warning/10 text-warning-foreground flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {data.metrics.overdue !== undefined && (
          <Card variant="default" className="metric-accent metric-accent-destructive transition-all duration-200 hover:shadow-md border-border/80">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Tiket Overdue (SLA)
                </p>
                <p className="text-3xl font-extrabold font-heading text-destructive">
                  {data.metrics.overdue}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Governed AI Experience Card */}
      {aiTelemetry && (
        <Card variant="default" className="ai-card-glow animate-scale-in">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-base font-bold font-heading text-foreground">
                  AI Operations & Telemetry Center
                </h2>
                <Badge variant="outline" size="sm" className="bg-purple-500/10 text-purple-600 border-purple-500/30 text-[10px]">
                  Governed Active
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                Model: Gemini Active • SLA Telemetry
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-3.5 rounded-lg bg-surface/60 border border-border/50">
                <p className="text-[11px] font-medium text-muted-foreground uppercase">Inferensi 24 jam</p>
                <p className="text-xl font-bold text-foreground mt-0.5">{aiTelemetry.totalInferences}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-surface/60 border border-border/50">
                <p className="text-[11px] font-medium text-muted-foreground uppercase">Avg Latensi</p>
                <p className="text-xl font-bold text-info mt-0.5">{aiTelemetry.averageLatencyMs} ms</p>
              </div>

              <div className="p-3.5 rounded-lg bg-surface/60 border border-border/50">
                <p className="text-[11px] font-medium text-muted-foreground uppercase">Token Digunakan</p>
                <p className="text-xl font-bold text-foreground mt-0.5">{aiTelemetry.totalTokens.toLocaleString()}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-surface/60 border border-border/50">
                <p className="text-[11px] font-medium text-muted-foreground uppercase">Error Rate</p>
                <p className={`text-xl font-bold mt-0.5 ${aiTelemetry.errorRatePercentage > 5 ? 'text-destructive' : 'text-success'}`}>
                  {aiTelemetry.errorRatePercentage}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Model Evaluation Metric */}
      {modelEvaluation && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card variant="default" className="metric-accent border-border/80">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estimated Precision</p>
              <p className="text-3xl font-extrabold font-heading text-primary mt-2">
                {modelEvaluation.quality.estimatedOperationalPrecisionPercentage}%
              </p>
            </CardContent>
          </Card>

          <Card variant="default" className="metric-accent metric-accent-success border-border/80">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time-to-Accept</p>
              <p className="text-3xl font-extrabold font-heading text-success mt-2">
                {modelEvaluation.productivity.formattedTimeToAccept}
              </p>
            </CardContent>
          </Card>

          <Card variant="default" className="metric-accent metric-accent-info border-border/80">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Average Confidence</p>
              <p className="text-3xl font-extrabold font-heading text-info mt-2">
                {Math.round(modelEvaluation.quality.averageConfidenceScore * 100)}%
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabel Tiket Terbaru */}
      <Card variant="default" className="border-border/80 shadow-xs overflow-hidden">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span>Tiket Terbaru ({data.roleName})</span>
            </CardTitle>
            <Link href="/dashboard/tickets">
              <Button variant="ghost" size="sm" className="text-xs font-medium text-primary hover:text-primary">
                Lihat Semua Tiket
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm table-modern">
              <thead>
                <tr>
                  <th>No. Tiket</th>
                  <th>Judul Tiket</th>
                  <th>Status</th>
                  <th>Indikator SLA</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.recentTickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground text-xs">
                      Belum ada tiket pengaduan aktif.
                    </td>
                  </tr>
                ) : (
                  (data.recentTickets as unknown as Array<{
                    id: string;
                    ticketNumber: string;
                    title: string;
                    status: { name: string };
                    createdAt: Date;
                    resolvedAt?: Date | null;
                    targetResolutionAt?: Date | null;
                    slaStatus?: string | null;
                  }>).map((ticket) => (
                    <tr key={ticket.id} className="group">
                      <td className="font-mono font-semibold text-xs text-foreground">
                        {ticket.ticketNumber}
                      </td>
                      <td className="font-medium text-foreground max-w-md truncate">
                        {ticket.title}
                      </td>
                      <td>
                        <Badge variant="info" size="sm" className="font-medium text-xs">
                          {ticket.status.name}
                        </Badge>
                      </td>
                      <td>
                        <SlaBadge
                          createdAt={ticket.createdAt}
                          resolvedAt={ticket.resolvedAt}
                          targetResolutionAt={ticket.targetResolutionAt}
                          slaStatus={ticket.slaStatus}
                        />
                      </td>
                      <td className="text-right">
                        <Link href={`/dashboard/tickets/${ticket.id}`}>
                          <Button variant="outline" size="sm" className="text-xs font-medium shadow-xs">
                            Detail
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

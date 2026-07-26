import { AnalyticsService } from '@/features/analytics/server/analytics.service';
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
} from '@/components/ui';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  TrendingUp,
  PieChart,
} from 'lucide-react';

export default async function AnalyticsPage() {
  const [summary, categoryDist, statusDist, trends] = await Promise.all([
    AnalyticsService.getSummaryMetrics(),
    AnalyticsService.getCategoryDistribution(),
    AnalyticsService.getStatusDistribution(),
    AnalyticsService.getMonthlyTrends(),
  ]);

  return (
    <div className="space-y-8 py-4 animate-fade-in">
      <PageHeader
        title="Analitik & Ringkasan Laporan"
        description="Wawasan eksekutif mengenai performa penanganan tiket dan tren pengaduan."
        badge={<Badge variant="info">Insight Dashboard</Badge>}
      />

      {/* Grid Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card variant="default" className="metric-accent">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Tiket Masuk</p>
              <p className="text-3xl font-extrabold font-heading text-foreground">{summary.total}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card variant="default" className="metric-accent metric-accent-success">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tiket Selesai</p>
              <p className="text-3xl font-extrabold font-heading text-success">{summary.resolved}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card variant="default" className="metric-accent metric-accent-warning">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dalam Proses</p>
              <p className="text-3xl font-extrabold font-heading text-warning-foreground">{summary.pending}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-warning/10 text-warning-foreground flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card variant="default" className="metric-accent metric-accent-info">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tingkat Penyelesaian</p>
              <p className="text-3xl font-extrabold font-heading text-primary">{summary.resolutionRate}%</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid Visual Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Distribusi per Kategori */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChart className="w-4 h-4 text-primary" />
              Tiket Berdasarkan Kategori
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {categoryDist.map((c: { categoryId: string; name: string; count: number }) => {
              const percentage = summary.total > 0 ? ((c.count / summary.total) * 100).toFixed(0) : 0;
              return (
                <div key={c.categoryId} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-foreground">{c.name}</span>
                    <span className="text-muted-foreground">{c.count} Tiket ({percentage}%)</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="progress-bar-gradient h-full" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Distribusi per Status */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChart className="w-4 h-4 text-success" />
              Tiket Berdasarkan Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {statusDist.map((s: { statusId: string; name: string; count: number }) => {
              const percentage = summary.total > 0 ? ((s.count / summary.total) * 100).toFixed(0) : 0;
              return (
                <div key={s.statusId} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-foreground">{s.name}</span>
                    <span className="text-muted-foreground">{s.count} Tiket ({percentage}%)</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-success transition-all duration-500" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Tren 6 Bulan Terakhir */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-4 h-4 text-primary" />
            Tren Tiket (6 Bulan Terakhir)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-3 pt-2 text-center">
            {trends.map((t: { label: string; count: number }, idx: number) => {
              const maxCount = Math.max(...trends.map((tr: { count: number }) => tr.count), 1);
              const heightPercent = Math.round((t.count / maxCount) * 100);
              return (
                <div key={idx} className="flex flex-col items-center gap-2 group">
                  <span className="text-xs font-bold text-primary">{t.count}</span>
                  <div className="w-full bg-primary/10 rounded-lg h-28 flex items-end justify-center p-1 overflow-hidden">
                    <div
                      className="w-full progress-bar-gradient rounded-t-md transition-all duration-700 ease-out"
                      style={{ height: `${Math.max(heightPercent, 5)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium">{t.label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

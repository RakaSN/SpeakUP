import { AnalyticsService } from '@/features/analytics/server/analytics.service';

export default async function AnalyticsPage() {
  const [summary, categoryDist, statusDist, trends] = await Promise.all([
    AnalyticsService.getSummaryMetrics(),
    AnalyticsService.getCategoryDistribution(),
    AnalyticsService.getStatusDistribution(),
    AnalyticsService.getMonthlyTrends(),
  ]);

  return (
    <div className="space-y-8 py-4">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Analitik & Ringkasan Laporan</h1>
        <p className="text-sm text-muted-foreground">Wawasan eksekutif mengenai performa penanganan tiket dan tren pengaduan.</p>
      </div>

      {/* Grid Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Total Tiket Masuk</p>
          <p className="text-3xl font-bold mt-2">{summary.total}</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Tiket Selesai (Resolved)</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">{summary.resolved}</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Tiket Dalam Proses</p>
          <p className="text-3xl font-bold text-amber-500 mt-2">{summary.pending}</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Tingkat Penyelesaian (Rate)</p>
          <p className="text-3xl font-bold text-primary mt-2">{summary.resolutionRate}%</p>
        </div>
      </div>

      {/* Grid Visual Distribution */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Distribusi per Kategori */}
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Tiket Berdasarkan Kategori</h3>
          <div className="space-y-3">
            {categoryDist.map((c: { categoryId: string; name: string; count: number }) => {
              const percentage = summary.total > 0 ? ((c.count / summary.total) * 100).toFixed(0) : 0;
              return (
                <div key={c.categoryId} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{c.name}</span>
                    <span className="text-muted-foreground">{c.count} Tiket ({percentage}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Distribusi per Status */}
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Tiket Berdasarkan Status</h3>
          <div className="space-y-3">
            {statusDist.map((s: { statusId: string; name: string; count: number }) => {
              const percentage = summary.total > 0 ? ((s.count / summary.total) * 100).toFixed(0) : 0;
              return (
                <div key={s.statusId} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{s.name}</span>
                    <span className="text-muted-foreground">{s.count} Tiket ({percentage}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tren 6 Bulan Terakhir */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Tren Tiket (6 Bulan Terakhir)</h3>
        <div className="grid grid-cols-6 gap-2 pt-4 text-center">
          {trends.map((t: { label: string; count: number }, idx: number) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-primary">{t.count}</span>
              <div className="w-full bg-primary/20 rounded-t h-24 flex items-end justify-center p-1">
                <div className="w-full bg-primary rounded-t" style={{ height: `${Math.min(t.count * 10, 100)}%` }} />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

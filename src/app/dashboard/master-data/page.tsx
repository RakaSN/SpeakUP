import { MasterDataService } from '@/features/master-data/server/master-data.service';

type MasterItem = { id: string; name: string; description: string | null; isActive: boolean };

export default async function MasterDataPage() {
  const [categories, priorities, types, statuses] = await Promise.all([
    MasterDataService.getAllCategories(),
    MasterDataService.getAllPriorities(),
    MasterDataService.getAllTypes(),
    MasterDataService.getAllStatuses(),
  ]);

  return (
    <div className="space-y-8 py-4">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Manajemen Data Master</h1>
        <p className="text-sm text-muted-foreground">Kelola tabel referensi Kategori, Prioritas, Jenis Layanan, dan Status tiket.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Master Categories */}
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-semibold">Kategori Tiket</h3>
            <span className="text-xs bg-muted px-2 py-1 rounded font-mono">{categories.length} item</span>
          </div>
          <div className="divide-y text-sm">
            {categories.map((c: MasterItem) => (
              <div key={c.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{c.name}</p>
                  {c.description && <p className="text-xs text-muted-foreground">{c.description}</p>}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${c.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-muted text-muted-foreground'}`}>
                  {c.isActive ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Master Priorities */}
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-semibold">Tingkat Prioritas</h3>
            <span className="text-xs bg-muted px-2 py-1 rounded font-mono">{priorities.length} item</span>
          </div>
          <div className="divide-y text-sm">
            {priorities.map((p: MasterItem) => (
              <div key={p.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{p.name}</p>
                  {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${p.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-muted text-muted-foreground'}`}>
                  {p.isActive ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Master Types */}
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-semibold">Jenis Layanan</h3>
            <span className="text-xs bg-muted px-2 py-1 rounded font-mono">{types.length} item</span>
          </div>
          <div className="divide-y text-sm">
            {types.map((t: MasterItem) => (
              <div key={t.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{t.name}</p>
                  {t.description && <p className="text-xs text-muted-foreground">{t.description}</p>}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${t.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-muted text-muted-foreground'}`}>
                  {t.isActive ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Master Statuses */}
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-semibold">Status Tiket</h3>
            <span className="text-xs bg-muted px-2 py-1 rounded font-mono">{statuses.length} item</span>
          </div>
          <div className="divide-y text-sm">
            {statuses.map((s: MasterItem) => (
              <div key={s.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{s.name}</p>
                  {s.description && <p className="text-xs text-muted-foreground">{s.description}</p>}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${s.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-muted text-muted-foreground'}`}>
                  {s.isActive ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

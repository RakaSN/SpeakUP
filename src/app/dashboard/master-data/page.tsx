import { MasterDataService } from '@/features/master-data/server/master-data.service';
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
} from '@/components/ui';
import {
  Layers,
  AlertTriangle,
  Briefcase,
  GitBranch,
} from 'lucide-react';
import React from 'react';

type MasterItem = { id: string; name: string; description: string | null; isActive: boolean };

const sectionIcons: Record<string, React.ReactNode> = {
  'Kategori Pengaduan': <Layers className="w-4 h-4 text-primary" />,
  'Tingkat Prioritas & SLA': <AlertTriangle className="w-4 h-4 text-warning-foreground" />,
  'Jenis Layanan Sekolah': <Briefcase className="w-4 h-4 text-info" />,
  'Status Alur Penanganan': <GitBranch className="w-4 h-4 text-success" />,
};

export default async function MasterDataPage() {
  const [categories, priorities, types, statuses] = await Promise.all([
    MasterDataService.getAllCategories(),
    MasterDataService.getAllPriorities(),
    MasterDataService.getAllTypes(),
    MasterDataService.getAllStatuses(),
  ]);

  const renderSection = (title: string, items: MasterItem[]) => (
    <Card variant="default" className="hover:shadow-md transition-all duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            {sectionIcons[title]}
            {title}
          </CardTitle>
          <Badge variant="outline" size="sm">{items.length} Item</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border/60 text-sm">
          {items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between group hover:bg-accent/30 -mx-2 px-2 rounded-lg transition-colors">
              <div>
                <p className="font-semibold text-foreground">{item.name}</p>
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                )}
              </div>
              <Badge variant={item.isActive ? 'success' : 'secondary'} size="sm">
                {item.isActive ? 'Aktif' : 'Nonaktif'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 py-4 animate-fade-in">
      <PageHeader
        title="Manajemen Data Master & Referensi"
        description="Kelola tabel rujukan Kategori Pengaduan, Tingkat Prioritas, Jenis Layanan, dan Status Tiket."
        badge={<Badge variant="info">SDS v1.0</Badge>}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {renderSection('Kategori Pengaduan', categories)}
        {renderSection('Tingkat Prioritas & SLA', priorities)}
        {renderSection('Jenis Layanan Sekolah', types)}
        {renderSection('Status Alur Penanganan', statuses)}
      </div>
    </div>
  );
}

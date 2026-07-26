'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Ticket,
  BarChart3,
  FileDown,
  Users,
  Database,
  Bell,
  UserCircle,
  Server,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/tickets', label: 'Manajemen Tiket', icon: Ticket },
  { href: '/dashboard/analytics', label: 'Analitik & Grafik', icon: BarChart3 },
  { href: '/dashboard/reports', label: 'Ekspor Laporan', icon: FileDown },
  { href: '/dashboard/users', label: 'Manajemen User', icon: Users },
  { href: '/dashboard/master-data', label: 'Data Master', icon: Database },
  { href: '/dashboard/notifications', label: 'Notifikasi', icon: Bell },
  { href: '/dashboard/profile', label: 'Profil Saya', icon: UserCircle },
  { href: '/dashboard/platform', label: 'Platform Health', icon: Server },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden w-64 flex-col border-r border-border/80 bg-sidebar md:flex">
      {/* Brand */}
      <div className="flex h-16 items-center border-b border-border/80 px-5">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-xs transition-transform group-hover:scale-105">
            S
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold font-heading tracking-tight text-foreground">SpeakUp</span>
            <span className="text-[10px] text-muted-foreground font-medium -mt-0.5">Cockpit PX v1.1</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-3">
        <nav className="grid items-start px-3 text-sm font-medium space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-150 ${
                  active
                    ? 'bg-primary/10 text-primary font-semibold border-l-[3px] border-primary pl-[9px]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-primary' : ''}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-border/80 px-4 py-3">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <Sparkles className="w-3 h-3 text-purple-500" />
          <span>SDS v2.0 • AI Governed</span>
          <Badge variant="outline" size="sm" className="ml-auto text-[9px] px-1.5 py-0">
            Beta
          </Badge>
        </div>
      </div>
    </aside>
  );
}

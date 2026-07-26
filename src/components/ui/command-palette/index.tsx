'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  FileText,
  Users,
  BarChart3,
  Settings,
  ShieldCheck,
  Sparkles,
  X,
  Command,
} from 'lucide-react';
import { Badge } from '@/components/ui';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or custom trigger
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigationItems = [
    { label: 'Dashboard Utama', href: '/dashboard', icon: BarChart3, category: 'Navigasi' },
    { label: 'Manajemen Tiket Pengaduan', href: '/dashboard/tickets', icon: FileText, category: 'Navigasi' },
    { label: 'Kelola Pengguna & Peran', href: '/dashboard/users', icon: Users, category: 'Admin' },
    { label: 'Pusat Laporan & Ekspor', href: '/dashboard/reports', icon: BarChart3, category: 'Admin' },
    { label: 'Master Data & Pengaturan', href: '/dashboard/master-data', icon: Settings, category: 'Admin' },
    { label: 'Evaluasi Model AI', href: '/dashboard/platform', icon: Sparkles, category: 'AI Intelligence' },
  ];

  const filteredItems = navigationItems.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-150">
      <div className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
        {/* Search Header */}
        <div className="flex items-center px-4 border-b border-border/80 h-14">
          <Search className="w-5 h-5 text-muted-foreground mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Cari navigasi, tiket, pengguna, atau laporan... (Esc untuk menutup)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Tidak ada hasil yang cocok dengan &quot;{query}&quot;
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.href)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-all text-left text-sm group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-medium text-foreground group-hover:text-primary">
                      {item.label}
                    </span>
                  </div>
                  <Badge variant="outline" size="sm" className="text-[10px] font-normal">
                    {item.category}
                  </Badge>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-surface-muted border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Command className="w-3.5 h-3.5" />
            <span>Universal Navigation & Search</span>
          </div>
          <span>Tekan <kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-mono">Esc</kbd> untuk keluar</span>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';

type FilterOption = { id: string; name: string };

interface TicketFiltersProps {
  statuses: FilterOption[];
  categories: FilterOption[];
}

export function TicketFilters({ statuses, categories }: TicketFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get('statusId') || '';
  const currentCategory = searchParams.get('categoryId') || '';
  const currentSearch = searchParams.get('search') || '';

  const [searchValue, setSearchValue] = useState(currentSearch);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.set('page', '1'); // Reset ke halaman 1 setiap ganti filter
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    router.push(pathname + '?' + createQueryString(name, value));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange('search', searchValue);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <form onSubmit={handleSearchSubmit} className="flex-1">
        <input
          type="search"
          placeholder="Cari ID atau judul tiket..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </form>
      
      <select
        value={currentStatus}
        onChange={(e) => handleFilterChange('statusId', e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-[200px]"
      >
        <option value="">Semua Status</option>
        {statuses.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <select
        value={currentCategory}
        onChange={(e) => handleFilterChange('categoryId', e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-[200px]"
      >
        <option value="">Semua Kategori</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  );
}

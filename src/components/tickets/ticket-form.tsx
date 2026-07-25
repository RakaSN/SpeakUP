'use client';

import { useState, useTransition } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTicketSchema, type CreateTicketValues } from '@/features/tickets/validators/ticket.validator';
import { createTicketAction } from '@/features/tickets/server/ticket.action';

type MasterDataOption = { id: string; name: string };

interface TicketFormProps {
  types: MasterDataOption[];
  categories: MasterDataOption[];
  priorities: MasterDataOption[];
}

export function TicketForm({ types, categories, priorities }: TicketFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTicketValues>({
    resolver: zodResolver(CreateTicketSchema) as unknown as Resolver<CreateTicketValues>,
    defaultValues: {
      isAnonymous: false,
      visibility: 'INTERNAL',
    },
  });

  const onSubmit = () => {
    setError(null);
    const formElement = document.getElementById('ticket-form') as HTMLFormElement;
    const formData = new FormData(formElement);

    startTransition(async () => {
      try {
        const res = await createTicketAction(formData);
        if (res && !res.success) {
          setError(res.error || 'Gagal membuat tiket');
        }
      } catch {
        // Redirect errors from NextAuth handled automatically
      }
    });
  };

  return (
    <form id="ticket-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none" htmlFor="title">Judul Tiket</label>
        <input
          {...register('title')}
          type="text"
          id="title"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Ringkasan singkat masalah..."
        />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="typeId">Jenis Layanan</label>
          <select
            {...register('typeId')}
            id="typeId"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Pilih Jenis...</option>
            {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          {errors.typeId && <p className="text-xs text-destructive">{errors.typeId.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="categoryId">Kategori</label>
          <select
            {...register('categoryId')}
            id="categoryId"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Pilih Kategori...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="priorityId">Tingkat Prioritas</label>
          <select
            {...register('priorityId')}
            id="priorityId"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Pilih Prioritas...</option>
            {priorities.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {errors.priorityId && <p className="text-xs text-destructive">{errors.priorityId.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="visibility">Visibilitas</label>
          <select
            {...register('visibility')}
            id="visibility"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="PUBLIC">Publik (Semua Warga)</option>
            <option value="INTERNAL">Internal (Hanya Logged In)</option>
            <option value="CONFIDENTIAL">Rahasia (Pelapor, Assignee, Kepsek)</option>
            <option value="STRICTLY_CONFIDENTIAL">Sangat Rahasia (Khusus)</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none" htmlFor="description">Deskripsi Lengkap</label>
        <textarea
          {...register('description')}
          id="description"
          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Ceritakan detail kronologi atau keluhan Anda di sini..."
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none" htmlFor="attachment">Lampiran (Opsional)</label>
        <input
          type="file"
          id="attachment"
          name="attachment"
          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <p className="text-xs text-muted-foreground">Maksimal 5MB. Format: JPG, PNG, PDF, DOCX.</p>
      </div>

      <div className="flex items-center space-x-2">
        <input
          {...register('isAnonymous')}
          type="checkbox"
          id="isAnonymous"
          className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
        />
        <label htmlFor="isAnonymous" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Sembunyikan nama saya (Lapor secara Anonim)
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        {isPending ? 'Mengirim...' : 'Kirim Laporan'}
      </button>
    </form>
  );
}

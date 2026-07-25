import { z } from 'zod';

export const CreateTicketSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter').max(100, 'Judul maksimal 100 karakter'),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter'),
  typeId: z.string().min(1, 'Jenis layanan wajib dipilih'),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  priorityId: z.string().min(1, 'Prioritas wajib dipilih'),
  isAnonymous: z.boolean().default(false),
  visibility: z.enum(['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'STRICTLY_CONFIDENTIAL']).default('INTERNAL'),
});

export type CreateTicketValues = z.infer<typeof CreateTicketSchema>;

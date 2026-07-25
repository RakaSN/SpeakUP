import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { AppError } from '@/shared/lib/errors';

export const StorageService = {
  async uploadTicketAttachment(file: File): Promise<{ fileName: string; fileUrl: string; fileType: string; fileSize: number }> {
    if (!file) throw new AppError('VALIDATION_ERROR', 'File tidak ditemukan');

    // Validasi tipe file (MIME)
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      throw new AppError('VALIDATION_ERROR', 'Tipe file tidak diizinkan. Harap unggah gambar, PDF, atau dokumen Word.');
    }

    // Validasi ukuran (Max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new AppError('VALIDATION_ERROR', 'Ukuran file melebihi batas 5MB.');
    }

    // Generate Path: storage/local/tickets/YYYY/MM
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    // Asumsi root project + storage/local/...
    const uploadDir = path.join(process.cwd(), 'storage', 'local', 'tickets', year, month);

    // Pastikan direktori ada
    await fs.mkdir(uploadDir, { recursive: true });

    // Sanitasi dan UUID
    const ext = path.extname(file.name);
    const uniqueFileName = `${crypto.randomUUID()}${ext}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    // Tulis file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    return {
      fileName: file.name, // Nama asli untuk display
      fileUrl: `/storage/local/tickets/${year}/${month}/${uniqueFileName}`, // Virtual URL untuk akses
      fileType: file.type,
      fileSize: file.size,
    };
  }
};

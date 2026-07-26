/**
 * SpeakUp Security Suite - Upload Validator Engine
 * Strict verification of file extensions, MIME types, and size boundaries.
 */

export interface FileValidationOptions {
  maxSizeBytes?: number; // Default: 5MB
  allowedExtensions?: string[];
  allowedMimeTypes?: string[];
}

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB
const DEFAULT_ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'pdf', 'docx', 'doc'];
const DEFAULT_ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

export function validateUploadedFile(
  fileName: string,
  mimeType: string,
  sizeBytes: number,
  options: FileValidationOptions = {}
): { valid: boolean; error?: string } {
  const maxSize = options.maxSizeBytes || DEFAULT_MAX_SIZE;
  const allowedExts = options.allowedExtensions || DEFAULT_ALLOWED_EXTENSIONS;
  const allowedMimes = options.allowedMimeTypes || DEFAULT_ALLOWED_MIME_TYPES;

  // 1. Check size boundary
  if (sizeBytes > maxSize) {
    const sizeMb = (maxSize / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `Ukuran file melebihi batas maksimum (${sizeMb}MB).`,
    };
  }

  // 2. Check extension whitelist
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (!ext || !allowedExts.includes(ext)) {
    return {
      valid: false,
      error: `Format file .${ext} tidak diizinkan. Gunakan ${allowedExts.join(', ')}.`,
    };
  }

  // 3. Check MIME type
  if (mimeType && !allowedMimes.includes(mimeType.toLowerCase())) {
    return {
      valid: false,
      error: `Tipe file (${mimeType}) tidak sesuai dengan kebijakan keamanan.`,
    };
  }

  return { valid: true };
}

import Link from 'next/link';

interface AttachmentItem {
  id: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
}

export function AttachmentList({ attachments }: { attachments: AttachmentItem[] }) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="space-y-4 pt-4 border-t mt-6">
      <h3 className="text-sm font-semibold text-muted-foreground">Lampiran ({attachments.length})</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {attachments.map((file) => (
          <Link
            key={file.id}
            href={file.fileUrl}
            target="_blank"
            className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary shrink-0">
                📄
              </div>
              <div className="truncate">
                <p className="truncate text-sm font-medium">{file.fileName}</p>
                <p className="text-xs text-muted-foreground">{(file.fileSize / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

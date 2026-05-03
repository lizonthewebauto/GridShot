'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';

import type { UploadedFile } from '@/types';

interface UploadLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (file: UploadedFile) => void;
}

export function UploadLibraryModal({ open, onClose, onSelect }: UploadLibraryModalProps) {
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    async function loadUploads() {
      setLoading(true);
      try {
        const response = await fetch('/api/uploads');
        const data = response.ok ? await response.json() : [];
        if (!cancelled) {
          setUploads(Array.isArray(data) ? data : []);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadUploads();

    return () => {
      cancelled = true;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
              Choose a photo
            </h2>
            <p className="text-xs text-muted mt-0.5">Pick any uploaded photo to replace the current slide image.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted transition-colors hover:bg-card-hover hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center py-14 text-sm text-muted">
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Loading uploads…
            </div>
          ) : uploads.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted">
              No uploaded photos yet. Add photos in Uploads first.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {uploads.map((file) => (
                <button
                  key={file.storagePath}
                  onClick={() => onSelect(file)}
                  className="overflow-hidden rounded-lg border border-border bg-background text-left transition-colors hover:bg-card-hover"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.url}
                    alt={file.name}
                    className="aspect-square w-full object-cover"
                  />
                  <div className="p-3">
                    <p className="truncate text-xs text-foreground">{file.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import type { UploadedFile } from '@/types';

interface PendingUpload {
  id: string;
  name: string;
  preview: string;
}

export default function UploadsPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadFiles();
  }, []);

  async function loadFiles() {
    const res = await fetch('/api/uploads');
    if (res.ok) {
      const data = await res.json();
      setFiles(data);
    }
    setLoading(false);
  }

  async function handleUpload(fileList: FileList) {
    const imageFiles = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    // Add all files as pending with local previews immediately
    const newPending: PendingUpload[] = imageFiles.map((file) => ({
      id: Math.random().toString(36).slice(2, 10),
      name: file.name,
      preview: URL.createObjectURL(file),
    }));
    setPending((prev) => [...newPending, ...prev]);

    // Upload each file individually, moving it from pending to files as it completes
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const pendingItem = newPending[i];

      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'photos');

      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (res.ok) {
          const { path, url } = await res.json();
          // Add to files list at the top
          setFiles((prev) => [
            { name: file.name, url, storagePath: path, createdAt: new Date().toISOString() },
            ...prev,
          ]);
        }
      } catch (err) {
        console.error('Upload failed:', file.name, err);
      }

      // Remove from pending
      URL.revokeObjectURL(pendingItem.preview);
      setPending((prev) => prev.filter((p) => p.id !== pendingItem.id));
    }
  }

  async function handleDelete(storagePath: string) {
    setDeleting(storagePath);
    const res = await fetch('/api/uploads', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storagePath }),
    });
    if (res.ok) {
      setFiles((prev) => prev.filter((f) => f.storagePath !== storagePath));
    }
    setDeleting(null);
  }

  const totalCount = files.length + pending.length;
  const hasContent = totalCount > 0;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Uploads Library</h1>
          <p className="text-muted mt-1">
            {files.length} photo{files.length !== 1 ? 's' : ''} in your library
            {pending.length > 0 && (
              <span className="text-accent ml-1">
                ({pending.length} uploading...)
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload Photos
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          if (e.target.files?.length) handleUpload(e.target.files);
          e.target.value = '';
        }}
        className="hidden"
      />

      {/* Drop zone wraps everything */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files);
        }}
        className={`transition-colors ${dragOver ? 'ring-2 ring-accent ring-inset rounded-lg' : ''}`}
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !hasContent ? (
          <div
            className="rounded-lg bg-card border-2 border-dashed border-border p-16 text-center cursor-pointer hover:border-accent/50 transition-colors"
            onClick={() => inputRef.current?.click()}
          >
            <ImageIcon className="w-12 h-12 text-muted mx-auto mb-4" />
            <h2 className="font-heading text-xl font-bold text-foreground mb-2">
              No uploads yet
            </h2>
            <p className="text-muted max-w-md mx-auto">
              Drag and drop photos here, or click to browse. These will be available when creating slides.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Pending uploads - show at the top with local preview + spinner */}
            {pending.map((item) => (
              <div
                key={item.id}
                className="relative rounded-lg overflow-hidden bg-card border border-accent/30"
              >
                <img
                  src={item.preview}
                  alt={item.name}
                  className="w-full aspect-square object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="p-2">
                  <p className="text-xs text-muted truncate">{item.name}</p>
                </div>
              </div>
            ))}

            {/* Uploaded files */}
            {files.map((file) => (
              <div
                key={file.storagePath}
                className="group relative rounded-lg overflow-hidden bg-card border border-border"
              >
                <img
                  src={file.url}
                  alt={file.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(file.storagePath)}
                    disabled={deleting === file.storagePath}
                    className="p-2 rounded-full bg-danger text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger/80 disabled:opacity-50"
                    title="Delete"
                  >
                    {deleting === file.storagePath ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="p-2">
                  <p className="text-xs text-muted truncate">{file.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

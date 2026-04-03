'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  photoUrl: string | null;
  onUpload: (url: string) => void;
}

export function ImageUploader({ photoUrl, onUpload }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return;
      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'photos');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        onUpload(url);
      }

      setUploading(false);
    },
    [onUpload]
  );

  return (
    <div className="space-y-3">
      <label className="text-xs font-medium text-foreground uppercase tracking-wider">
        Image uploader
      </label>

      {/* Upload Zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
        }`}
      >
        {uploading ? (
          <div className="py-4">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-muted mt-2">Uploading...</p>
          </div>
        ) : (
          <div className="py-4">
            <Upload className="w-8 h-8 text-muted mx-auto mb-2" />
            <p className="text-xs text-muted">Click or drag to upload</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="hidden"
      />

      {/* Thumbnail Preview */}
      {photoUrl && (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img src={photoUrl} alt="Uploaded" className="w-full h-24 object-cover" />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <ImageIcon className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}

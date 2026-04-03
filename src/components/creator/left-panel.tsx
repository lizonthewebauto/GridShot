'use client';

import { ImageUploader } from './image-uploader';
import { VibeSelector } from './vibe-selector';

interface LeftPanelProps {
  photoUrl: string | null;
  vibe: string;
  onPhotoUpload: (url: string) => void;
  onVibeChange: (vibe: string) => void;
}

export function LeftPanel({ photoUrl, vibe, onPhotoUpload, onVibeChange }: LeftPanelProps) {
  return (
    <div className="w-64 bg-card border-r border-border p-6 space-y-6 overflow-y-auto">
      <h2 className="text-xs font-medium text-foreground uppercase tracking-wider">
        Controls
      </h2>

      <ImageUploader photoUrl={photoUrl} onUpload={onPhotoUpload} />

      <VibeSelector value={vibe} onChange={onVibeChange} />
    </div>
  );
}

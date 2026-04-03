'use client';

import { VIBE_OPTIONS, type Vibe } from '@/types';

interface VibeSelectorProps {
  value: string;
  onChange: (vibe: string) => void;
}

export function VibeSelector({ value, onChange }: VibeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-foreground uppercase tracking-wider">
        Vibe Select
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {VIBE_OPTIONS.map((vibe) => (
          <option key={vibe} value={vibe}>
            {vibe}
          </option>
        ))}
      </select>
    </div>
  );
}

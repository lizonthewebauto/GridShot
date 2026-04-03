'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import { TEMPLATE_REGISTRY } from '@/lib/templates/registry';
import type { Preset } from '@/types';

interface PresetWithBrand extends Preset {
  brands: {
    name: string;
    color_primary: string;
    color_secondary: string;
    font_heading: string;
    font_body: string;
  };
}

export function PresetCard({ preset }: { preset: PresetWithBrand }) {
  const router = useRouter();
  const templateName =
    TEMPLATE_REGISTRY[preset.template_slug as keyof typeof TEMPLATE_REGISTRY]?.name ??
    preset.template_slug;

  async function handleDelete() {
    if (!confirm(`Delete preset "${preset.name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/presets/${preset.id}`, { method: 'DELETE' });
    if (res.ok) router.refresh();
  }

  return (
    <div className="bg-card border border-border rounded-lg p-5 hover:bg-card-hover transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{preset.name}</h3>
          <p className="text-muted text-sm mt-1">{preset.brands.name}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/presets/${preset.id}/edit`}
            className="p-1.5 text-muted hover:text-foreground transition-colors"
          >
            <Pencil size={16} />
          </Link>
          <button
            onClick={handleDelete}
            className="p-1.5 text-muted hover:text-danger transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted">Template:</span>
          <span className="text-foreground">{templateName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted">Vibe:</span>
          <span className="text-foreground">{preset.vibe}</span>
        </div>
        {preset.headline && (
          <div className="flex items-center gap-2">
            <span className="text-muted">Headline:</span>
            <span className="text-foreground truncate">{preset.headline}</span>
          </div>
        )}
      </div>

      <div className="flex gap-1.5 mt-3">
        <div
          className="w-8 h-8 rounded"
          style={{ backgroundColor: preset.brands.color_primary }}
          title="Primary"
        />
        <div
          className="w-8 h-8 rounded"
          style={{ backgroundColor: preset.brands.color_secondary }}
          title="Secondary"
        />
      </div>

      <div className="flex gap-2 mt-3 text-xs text-muted">
        <span>{preset.brands.font_heading}</span>
        <span>/</span>
        <span>{preset.brands.font_body}</span>
      </div>
    </div>
  );
}

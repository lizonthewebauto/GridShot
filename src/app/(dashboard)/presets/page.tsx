import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PresetCard } from '@/components/presets/preset-card';

export default async function PresetsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: presets } = await supabase
    .from('presets')
    .select('*, brands(name, color_primary, color_secondary, font_heading, font_body)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl font-bold text-foreground"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Presets
        </h1>
        <Link
          href="/presets/new"
          className="px-4 py-2 bg-accent-warm text-white rounded hover:bg-accent-warm-hover transition-colors"
        >
          Create Preset
        </Link>
      </div>

      {(!presets || presets.length === 0) ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted mb-2">No presets yet.</p>
          <p className="text-muted text-sm mb-4">
            Save your favorite brand + template combinations as presets for quick reuse.
          </p>
          <Link
            href="/presets/new"
            className="inline-block px-4 py-2 bg-accent-warm text-white rounded hover:bg-accent-warm-hover transition-colors"
          >
            Create Preset
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presets.map((preset) => (
            <PresetCard key={preset.id} preset={preset} />
          ))}
        </div>
      )}
    </div>
  );
}

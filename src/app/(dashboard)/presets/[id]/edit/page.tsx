import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PresetForm } from '@/components/presets/preset-form';

export default async function EditPresetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: preset } = await supabase
    .from('presets')
    .select('*')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single();

  if (!preset) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
        Edit Preset
      </h1>
      <PresetForm mode="edit" preset={preset} />
    </div>
  );
}

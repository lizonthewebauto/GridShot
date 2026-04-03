import { PresetForm } from '@/components/presets/preset-form';

export default function NewPresetPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
        Create Preset
      </h1>
      <PresetForm mode="create" />
    </div>
  );
}

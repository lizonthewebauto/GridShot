import { BrandForm } from '@/components/brands/brand-form';

export default function NewBrandPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Create Brand</h1>
        <p className="text-muted mt-1">Set up your brand identity with colors, fonts, and voice</p>
      </div>
      <BrandForm mode="create" />
    </div>
  );
}

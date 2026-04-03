import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { BrandForm } from '@/components/brands/brand-form';

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single();

  if (!brand) notFound();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Edit Brand</h1>
        <p className="text-muted mt-1">Update {brand.name}&apos;s settings</p>
      </div>
      <BrandForm brand={brand} mode="edit" />
    </div>
  );
}

import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BrandForm } from '@/components/brands/brand-form';
import { BrandConnections } from '@/components/brands/brand-connections';

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single();

  if (!brand) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
          Edit Brand
        </h1>
        <BrandForm mode="edit" brand={brand} />
      </div>
      <div className="border-t border-border pt-8">
        <BrandConnections brandId={brand.id} hasTeam={!!brand.bundle_social_team_id} />
      </div>
    </div>
  );
}

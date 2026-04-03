import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default async function BrandsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Brands</h1>
          <p className="text-muted mt-1">Manage your studio brands and identities</p>
        </div>
        <Link
          href="/brands/new"
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New Brand
        </Link>
      </div>

      {brands && brands.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.id}/edit`}
              className="rounded-lg bg-card border border-border p-6 hover:bg-card-hover transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-md flex items-center justify-center text-white font-heading font-bold text-lg"
                  style={{ backgroundColor: brand.color_primary }}
                >
                  {brand.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">{brand.name}</h3>
                  {brand.is_default && (
                    <span className="text-xs text-accent font-medium">Default</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mb-3">
                <div
                  className="w-6 h-6 rounded border border-border"
                  style={{ backgroundColor: brand.color_primary }}
                  title="Primary"
                />
                <div
                  className="w-6 h-6 rounded border border-border"
                  style={{ backgroundColor: brand.color_secondary }}
                  title="Secondary"
                />
                {brand.color_accent && (
                  <div
                    className="w-6 h-6 rounded border border-border"
                    style={{ backgroundColor: brand.color_accent }}
                    title="Accent"
                  />
                )}
              </div>

              <p className="text-xs text-muted">
                {brand.font_heading} &middot; {brand.font_body}
              </p>
              {brand.voice_description && (
                <p className="text-xs text-muted mt-1 line-clamp-2">
                  {brand.voice_description}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-card border border-border p-12 text-center">
          <p className="text-muted mb-4">No brands yet. Create your first one to get started.</p>
          <Link
            href="/brands/new"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Create Brand
          </Link>
        </div>
      )}
    </div>
  );
}

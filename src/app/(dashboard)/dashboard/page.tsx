import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { PlusCircle, Palette, Link2 } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });

  const { data: recentSlides } = await supabase
    .from('slides')
    .select('*, brands(name)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(6);

  const hasBrands = brands && brands.length > 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted mt-1">Create and manage your photography slides</p>
      </div>

      {!hasBrands ? (
        <div className="rounded-lg bg-card border border-border p-12 text-center">
          <Palette className="w-12 h-12 text-muted mx-auto mb-4" />
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">
            Create your first brand
          </h2>
          <p className="text-muted mb-6 max-w-md mx-auto">
            Set up your studio brand with colors, fonts, and voice to start creating beautiful slides.
          </p>
          <Link
            href="/brands/new"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Create Brand
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/create"
              className="rounded-lg bg-card border border-border p-6 hover:bg-card-hover transition-colors group"
            >
              <PlusCircle className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-heading text-lg font-bold text-foreground">Create Slide</h3>
              <p className="text-muted text-sm mt-1">Design a new social media slide</p>
            </Link>
            <Link
              href="/brands/new"
              className="rounded-lg bg-card border border-border p-6 hover:bg-card-hover transition-colors group"
            >
              <Palette className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-heading text-lg font-bold text-foreground">Add Brand</h3>
              <p className="text-muted text-sm mt-1">Set up another studio brand</p>
            </Link>
            <Link
              href="/connections"
              className="rounded-lg bg-card border border-border p-6 hover:bg-card-hover transition-colors group"
            >
              <Link2 className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-heading text-lg font-bold text-foreground">Connect Accounts</h3>
              <p className="text-muted text-sm mt-1">Link your social media platforms</p>
            </Link>
          </div>

          {/* Recent Slides */}
          {recentSlides && recentSlides.length > 0 && (
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                Recent Slides
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {recentSlides.map((slide) => (
                  <div
                    key={slide.id}
                    className="rounded-lg bg-card border border-border overflow-hidden"
                  >
                    {slide.photo_url ? (
                      <img
                        src={slide.photo_url}
                        alt={slide.headline || 'Slide'}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 bg-border/30 flex items-center justify-center text-muted text-sm">
                        No photo
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-sm font-medium text-foreground truncate">
                        {slide.headline || 'Untitled'}
                      </p>
                      <p className="text-xs text-muted mt-0.5">{slide.vibe} &middot; {slide.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Brands */}
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground mb-4">
              Your Brands
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.id}/edit`}
                  className="rounded-lg bg-card border border-border p-4 hover:bg-card-hover transition-colors flex items-center gap-4"
                >
                  <div
                    className="w-12 h-12 rounded-md flex items-center justify-center text-white font-heading font-bold text-lg"
                    style={{ backgroundColor: brand.color_primary }}
                  >
                    {brand.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{brand.name}</h3>
                    <p className="text-xs text-muted">
                      {brand.font_heading} &middot; {brand.font_body}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

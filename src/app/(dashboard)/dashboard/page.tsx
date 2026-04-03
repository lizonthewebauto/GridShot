import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: brands } = await supabase
    .from('brands')
    .select('id, name')
    .eq('user_id', user!.id);

  const hasBrands = brands && brands.length > 0;

  return (
    <div>
      <h1
        className="text-3xl font-bold text-foreground mb-2"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Welcome to Gridshot
      </h1>
      <p className="text-muted mb-8">Create stunning branded content from your photos.</p>

      {!hasBrands && (
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-2">Get Started</h2>
          <p className="text-muted mb-4">
            Set up your brand first so we can style your slides to match your look and feel.
          </p>
          <Link
            href="/brands/new"
            className="inline-block px-4 py-2 bg-accent text-white rounded hover:bg-accent-hover transition-colors"
          >
            Create Your Brand
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/create"
          className="bg-card border border-border rounded-lg p-6 hover:bg-card-hover transition-colors"
        >
          <h3 className="text-lg font-semibold text-foreground mb-2">Create Slide</h3>
          <p className="text-muted text-sm">
            Upload a photo and generate branded social content.
          </p>
        </Link>

        <Link
          href="/brands"
          className="bg-card border border-border rounded-lg p-6 hover:bg-card-hover transition-colors"
        >
          <h3 className="text-lg font-semibold text-foreground mb-2">Manage Brands</h3>
          <p className="text-muted text-sm">
            {hasBrands
              ? `You have ${brands.length} brand${brands.length > 1 ? 's' : ''} configured.`
              : 'Set up your brand colors, fonts, and voice.'}
          </p>
        </Link>
      </div>
    </div>
  );
}

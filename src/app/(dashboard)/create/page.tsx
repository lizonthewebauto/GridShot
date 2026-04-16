import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { SlideCreator } from '@/components/creator/slide-creator';
import type { Brand } from '@/types';

export default async function CreatePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', user!.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (!brands || brands.length === 0) {
    return (
      <div>
        <h1
          className="text-2xl font-bold text-foreground mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Slide Creator
        </h1>
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted mb-4">
            Set up a brand first so we can style slides with your colors and fonts.
          </p>
          <Link
            href="/brands/new"
            className="inline-block px-4 py-2 bg-accent-warm text-white rounded hover:bg-accent-warm-hover transition-colors"
          >
            Create Your Brand
          </Link>
        </div>
      </div>
    );
  }

  return <SlideCreator brands={brands as Brand[]} />;
}

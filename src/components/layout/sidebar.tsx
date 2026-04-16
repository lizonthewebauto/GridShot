'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  PlusSquare,
  Palette,
  SlidersHorizontal,
  Calendar,
  ImageIcon,
  LogOut,
  ChevronDown,
  Plus,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useBrand } from '@/components/brand-context';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/create', label: 'Create', icon: PlusSquare },
  { href: '/uploads', label: 'Uploads', icon: ImageIcon },
  { href: '/brands', label: 'Brands', icon: Palette },
  { href: '/presets', label: 'Presets', icon: SlidersHorizontal },
  { href: '/schedule', label: 'Schedule', icon: Calendar },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { brands, selectedBrand, setSelectedBrandId } = useBrand();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) {
      document.addEventListener('mousedown', onClick);
      return () => document.removeEventListener('mousedown', onClick);
    }
  }, [open]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col min-h-screen">
      <div className="p-5 border-b border-border">
        <h2
          className="text-xl font-bold text-foreground mb-3"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Gridshot
        </h2>

        {/* Brand selector */}
        <div className="relative" ref={dropdownRef}>
          {brands.length === 0 ? (
            <Link
              href="/brands/new"
              className="flex items-center justify-center gap-1.5 w-full rounded border border-dashed border-border px-3 py-2 text-xs text-muted hover:text-foreground hover:border-accent/40 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Create your first brand
            </Link>
          ) : (
            <>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full rounded border border-border bg-background px-2.5 py-2 text-sm text-foreground hover:bg-card-hover transition-colors text-left gap-2"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {selectedBrand && (
                    <span
                      className="w-3 h-3 rounded-full border border-border shrink-0"
                      style={{ backgroundColor: selectedBrand.color_primary }}
                    />
                  )}
                  <span className="truncate font-medium">
                    {selectedBrand?.name ?? 'Pick a brand'}
                  </span>
                </div>
                <ChevronDown className={cn('w-4 h-4 text-muted shrink-0 transition-transform', open && 'rotate-180')} />
              </button>

              {open && (
                <div className="absolute z-30 left-0 right-0 mt-1 bg-card border border-border rounded shadow-lg max-h-72 overflow-y-auto">
                  {brands.map((b) => {
                    const isActive = b.id === selectedBrand?.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => {
                          setSelectedBrandId(b.id);
                          setOpen(false);
                        }}
                        className={cn(
                          'flex items-center gap-2 w-full px-2.5 py-2 text-sm text-left transition-colors',
                          isActive ? 'bg-accent/10 text-accent' : 'text-foreground hover:bg-card-hover'
                        )}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-border shrink-0"
                          style={{ backgroundColor: b.color_primary }}
                        />
                        <span className="truncate flex-1">{b.name}</span>
                        {b.is_default && (
                          <span className="text-[10px] uppercase tracking-wider text-muted">Default</span>
                        )}
                      </button>
                    );
                  })}
                  <div className="border-t border-border">
                    <Link
                      href="/brands/new"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-2 text-sm text-muted hover:text-foreground hover:bg-card-hover transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      New brand
                    </Link>
                    {selectedBrand && (
                      <Link
                        href={`/brands/${selectedBrand.id}/edit`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-2 text-sm text-muted hover:text-foreground hover:bg-card-hover transition-colors"
                      >
                        <Palette className="w-3.5 h-3.5" />
                        Edit / connect socials
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors',
                isActive
                  ? 'bg-accent text-white'
                  : 'text-foreground hover:bg-card-hover'
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 rounded text-sm text-muted hover:text-foreground hover:bg-card-hover transition-colors w-full"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

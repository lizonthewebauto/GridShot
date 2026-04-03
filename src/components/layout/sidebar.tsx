'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Palette,
  PlusCircle,
  Link2,
  Calendar,
  Settings,
  LogOut,
  Crosshair,
  Image,
  FolderOpen,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { CreateModal } from '@/components/creator/create-modal';
import type { Brand } from '@/types';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/uploads', label: 'Uploads', icon: Image },
  { href: '/library', label: 'Content Library', icon: FolderOpen },
  { href: '/brands', label: 'My Brands', icon: Palette },
  { href: '/connections', label: 'Connections', icon: Link2 },
  { href: '/schedule', label: 'Schedule', icon: Calendar },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [createKey, setCreateKey] = useState(0);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('gridshot-theme') as 'dark' | 'light' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('gridshot-theme', next);
  }

  // Load brands on mount
  useEffect(() => {
    async function loadBrands() {
      const res = await fetch('/api/brands');
      if (res.ok) {
        const data: Brand[] = await res.json();
        setBrands(data);
        const saved = localStorage.getItem('gridshot-selected-brand');
        const savedBrand = saved && data.find((b) => b.id === saved);
        const defaultBrand = data.find((b) => b.is_default) || data[0];
        const active = savedBrand || defaultBrand;
        if (active) {
          setSelectedBrandId(active.id);
          localStorage.setItem('gridshot-selected-brand', active.id);
        }
      }
    }
    loadBrands();
  }, []);

  function selectBrand(id: string) {
    setSelectedBrandId(id);
    localStorage.setItem('gridshot-selected-brand', id);
    setBrandDropdownOpen(false);
    window.dispatchEvent(new CustomEvent('brand-changed', { detail: { brandId: id } }));
  }

  const selectedBrand = brands.find((b) => b.id === selectedBrandId);

  const openCreateModal = useCallback(() => {
    setCreateKey((k) => k + 1);
    setCreateOpen(true);
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener('open-create-modal', openCreateModal);
    return () => window.removeEventListener('open-create-modal', openCreateModal);
  }, [openCreateModal]);

  // Close brand dropdown on outside click
  useEffect(() => {
    if (!brandDropdownOpen) return;
    function handleClick() { setBrandDropdownOpen(false); }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [brandDropdownOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  // Shared nav content used by both desktop sidebar and mobile drawer
  const navContent = (
    <>
      {/* Brand selector */}
      {brands.length > 0 && (
        <div className="px-4 pt-4 pb-2 relative">
          <button
            onClick={(e) => { e.stopPropagation(); setBrandDropdownOpen(!brandDropdownOpen); }}
            className="flex items-center justify-between w-full px-3 py-2 rounded-md bg-background border border-border text-sm font-medium text-foreground hover:bg-card-hover transition-colors"
          >
            <span className="flex items-center gap-2 truncate">
              {selectedBrand?.logo_url ? (
                <img src={selectedBrand.logo_url} alt="" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ backgroundColor: selectedBrand?.color_primary || '#4a5940' }}
                >
                  {selectedBrand?.name?.charAt(0) || '?'}
                </div>
              )}
              <span className="truncate">{selectedBrand?.name || 'Select brand'}</span>
            </span>
            <ChevronDown className={cn('w-4 h-4 text-muted shrink-0 transition-transform', brandDropdownOpen && 'rotate-180')} />
          </button>

          {brandDropdownOpen && (
            <div className="absolute left-4 right-4 top-full mt-1 bg-card border border-border rounded-md shadow-lg z-50 py-1 max-h-60 overflow-y-auto">
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => selectBrand(brand.id)}
                  className={cn(
                    'flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors',
                    brand.id === selectedBrandId
                      ? 'bg-accent/10 text-accent'
                      : 'text-foreground hover:bg-card-hover'
                  )}
                >
                  {brand.logo_url ? (
                    <img src={brand.logo_url} alt="" className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ backgroundColor: brand.color_primary || '#4a5940' }}
                    >
                      {brand.name.charAt(0)}
                    </div>
                  )}
                  <span className="truncate">{brand.name}</span>
                  {brand.is_default && (
                    <span className="ml-auto text-[10px] text-muted uppercase tracking-wide">Default</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <nav className="flex-1 p-4 space-y-1">
        <button
          onClick={openCreateModal}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors w-full',
            pathname === '/create'
              ? 'bg-accent/10 text-accent'
              : 'text-muted hover:text-foreground hover:bg-card-hover'
          )}
        >
          <PlusCircle className="w-4 h-4" />
          Create
        </button>

        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted hover:text-foreground hover:bg-card-hover'
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-1">
        <div className="flex items-center gap-1">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted hover:text-foreground hover:bg-card-hover transition-colors flex-1"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-md text-muted hover:text-foreground hover:bg-card-hover transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted hover:text-foreground hover:bg-card-hover transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-accent" />
          <span className="font-heading text-base font-semibold tracking-tight text-foreground uppercase">
            Gridshot
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-muted hover:text-foreground hover:bg-card-hover transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-md text-muted hover:text-foreground hover:bg-card-hover transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'md:hidden fixed top-[57px] left-0 bottom-0 z-30 w-72 bg-card border-r border-border flex flex-col transition-transform duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border min-h-screen shrink-0">
        <div className="p-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Crosshair className="w-5 h-5 text-accent" />
            <span className="font-heading text-lg font-semibold tracking-tight text-foreground uppercase">
              Gridshot
            </span>
          </Link>
        </div>
        {navContent}
      </aside>

      <CreateModal key={createKey} open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}

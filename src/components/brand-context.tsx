'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Brand } from '@/types';

const STORAGE_KEY = 'gridshot:selected_brand_id';

interface BrandContextValue {
  brands: Brand[];
  selectedBrandId: string;
  selectedBrand: Brand | null;
  setSelectedBrandId: (id: string) => void;
  refresh: () => Promise<void>;
}

const BrandContext = createContext<BrandContextValue | null>(null);

interface BrandProviderProps {
  initialBrands: Brand[];
  children: ReactNode;
}

export function BrandProvider({ initialBrands, children }: BrandProviderProps) {
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [selectedBrandId, setSelectedBrandIdState] = useState<string>(() => {
    const def = initialBrands.find((b) => b.is_default) ?? initialBrands[0];
    return def?.id ?? '';
  });

  // Hydrate from localStorage if a saved selection still exists in current brands.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && brands.some((b) => b.id === stored)) {
      setSelectedBrandIdState(stored);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSelectedBrandId = useCallback((id: string) => {
    setSelectedBrandIdState(id);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, id);
    }
  }, []);

  const refresh = useCallback(async () => {
    const res = await fetch('/api/brands');
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data)) {
      setBrands(data);
      // If currently selected brand no longer exists, fall back to default.
      if (!data.some((b: Brand) => b.id === selectedBrandId)) {
        const def = data.find((b: Brand) => b.is_default) ?? data[0];
        if (def) setSelectedBrandId(def.id);
      }
    }
  }, [selectedBrandId, setSelectedBrandId]);

  const selectedBrand = useMemo(
    () => brands.find((b) => b.id === selectedBrandId) ?? null,
    [brands, selectedBrandId]
  );

  const value = useMemo(
    () => ({ brands, selectedBrandId, selectedBrand, setSelectedBrandId, refresh }),
    [brands, selectedBrandId, selectedBrand, setSelectedBrandId, refresh]
  );

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

export function useBrand(): BrandContextValue {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error('useBrand must be used within <BrandProvider>');
  return ctx;
}

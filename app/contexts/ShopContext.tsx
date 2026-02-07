'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const STORAGE_KEY = 'tailor_shop_name';

// Persist across provider remounts (e.g. Next.js navigation) and reloads
function getCachedShopName(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function setCachedShopName(name: string | null): void {
  try {
    if (name == null) sessionStorage.removeItem(STORAGE_KEY);
    else sessionStorage.setItem(STORAGE_KEY, name);
  } catch {
    /* ignore */
  }
}

interface ShopContextType {
  shopName: string | null;
  setShopName: (name: string | null) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  // Always start with null so server and client match (avoids hydration mismatch).
  // sessionStorage is read only in useEffect after mount.
  const [shopName, setShopNameState] = useState<string | null>(null);

  const setShopName = (name: string | null) => {
    setCachedShopName(name);
    setShopNameState(name);
  };

  useEffect(() => {
    const cached = getCachedShopName();
    if (cached) {
      setShopNameState(cached);
      return;
    }
    let cancelled = false;
    const fetchShopName = async () => {
      try {
        const response = await fetch('/api/shop');
        if (cancelled) return;
        if (response.ok) {
          const data = await response.json();
          if (data.shop?.shopName) {
            setCachedShopName(data.shop.shopName);
            setShopNameState(data.shop.shopName);
          }
        }
      } catch (error) {
        if (!cancelled) console.error('Failed to fetch shop name:', error);
      }
    };
    fetchShopName();
    return () => { cancelled = true; };
  }, []);

  return (
    <ShopContext.Provider value={{ shopName, setShopName }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}

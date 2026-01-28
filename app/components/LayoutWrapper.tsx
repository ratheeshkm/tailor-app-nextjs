'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide header on authentication and setup pages
  const authPages = ['/login', '/signup', '/shop-setup'];
  const hideHeader = authPages.includes(pathname);

  return (
    <>
      {!hideHeader && <Header />}
      {children}
    </>
  );
}

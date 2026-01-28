'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useNewStitching } from '../contexts/NewStitchingContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCustomersOpen, setIsCustomersOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shopName, setShopName] = useState('Stitching Order Management');
  const customersMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { triggerReset } = useNewStitching();

  useEffect(() => {
    setMounted(true);
    
    // Fetch shop name
    const fetchShopName = async () => {
      try {
        const response = await fetch('/api/shop');
        if (response.ok) {
          const data = await response.json();
          if (data.shop?.shopName) {
            setShopName(data.shop.shopName);
          }
        }
      } catch (error) {
        console.error('Failed to fetch shop name:', error);
      }
    };
    
    fetchShopName();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (customersMenuRef.current && !customersMenuRef.current.contains(event.target as Node)) {
        setIsCustomersOpen(false);
      }
    }

    if (isCustomersOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCustomersOpen]);

  // Hide menu on login page (pathname === '/')
  if (mounted && pathname === '/') {
    return null;
  }

  return (
    <>
      <header className="bg-white shadow-md dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex-shrink-0 hover:opacity-80 transition-opacity">
              <h1 className="text-xl font-bold text-black dark:text-white">{shopName}</h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              <button
                onClick={() => {
                  if (pathname === '/dashboard') {
                    window.location.href = '/dashboard';
                  } else {
                    router.push('/dashboard');
                  }
                }}
                className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
              >
                Orders
              </button>
              <div className="relative" ref={customersMenuRef}>
                <button
                  onClick={() => setIsCustomersOpen(!isCustomersOpen)}
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Customers
                </button>
                {isCustomersOpen && (
                  <div className="absolute z-10 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg">
                    <Link
                      href="/customers"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsCustomersOpen(false)}
                    >
                      Customer List
                    </Link>
                    <Link
                      href="/add-customer"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsCustomersOpen(false)}
                    >
                      Add Customer
                    </Link>
                  </div>
                )}
              </div>
              <button
                onClick={async () => {
                  try {
                    // Clear cookie on client side first
                    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    
                    // Call logout API
                    await fetch('/api/auth/logout', { 
                      method: 'POST',
                      credentials: 'include'
                    });
                    
                    // Clear any cached data
                    if ('caches' in window) {
                      caches.keys().then(names => {
                        names.forEach(name => caches.delete(name));
                      });
                    }
                    
                    // Force a full page reload with a logout flag and cache buster
                    window.location.href = `/?logout=true&t=${Date.now()}`;
                  } catch (error) {
                    console.error('Logout failed:', error);
                    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    window.location.href = `/?logout=true&t=${Date.now()}`;
                  }
                }}
                className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
              >
                Logout
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-gray-200 dark:bg-gray-700 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Popup */}
      <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black transition-opacity duration-300 ease-in-out"
          style={{ backgroundColor: isMenuOpen ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)' }}
          onClick={() => setIsMenuOpen(false)}
        ></div>

        {/* Modal */}
        <div className={`fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg transform transition-all duration-300 ease-in-out ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
          <div className="px-4 py-6 space-y-4">
            {/* Close button */}
            <div className="flex justify-end">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200"
              >
                <span className="sr-only">Close menu</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-2">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  if (pathname === '/dashboard') {
                    window.location.href = '/dashboard';
                  } else {
                    router.push('/dashboard');
                  }
                }}
                className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer"
              >
                Orders
              </button>
              <div>
                <button
                  onClick={() => setIsCustomersOpen(!isCustomersOpen)}
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                >
                  Customers
                  <svg className={`ml-2 h-5 w-5 inline transition-transform duration-200 ${isCustomersOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isCustomersOpen && (
                  <div className="mt-2 ml-4 space-y-1 opacity-100 transition-opacity duration-200">
                    <Link
                      href="/customers"
                      className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsCustomersOpen(false);
                      }}
                    >
                      Customer List
                    </Link>
                    <Link
                      href="/add-customer"
                      className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsCustomersOpen(false);
                      }}
                    >
                      Add Customer
                    </Link>
                  </div>
                )}
              </div>
              <hr className="my-2 dark:border-gray-700" />
              <button
                onClick={async () => {
                  try {
                    // Clear cookie on client side first
                    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    
                    // Call logout API
                    await fetch('/api/auth/logout', { 
                      method: 'POST',
                      credentials: 'include'
                    });
                    
                    // Clear any cached data
                    if ('caches' in window) {
                      caches.keys().then(names => {
                        names.forEach(name => caches.delete(name));
                      });
                    }
                    
                    // Force a full page reload with a logout flag and cache buster
                    window.location.href = `/?logout=true&t=${Date.now()}`;
                  } catch (error) {
                    console.error('Logout failed:', error);
                    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    window.location.href = `/?logout=true&t=${Date.now()}`;
                  }
                }}
                className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import { useEffect } from 'react';

export default function AuthCheck() {
  useEffect(() => {
    // Check if user is already logged in (auth-only; no shop/order APIs)
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          window.location.replace('/dashboard');
        }
      } catch {
        // User is not authenticated, stay on login page
      }
    };

    checkAuth();
  }, []);

  return null;
}

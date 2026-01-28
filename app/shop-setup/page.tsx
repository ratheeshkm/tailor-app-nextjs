'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

interface ShopFormInputs {
  shopName: string;
  phoneNumber: string;
  address?: string;
}

export default function ShopSetupPage() {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<ShopFormInputs>({
    mode: 'onBlur',
  });

  useEffect(() => {
    // Check if user is logged out or already has shop setup
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/shop', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (response.ok) {
          // User already has shop setup, redirect to dashboard
          router.push('/dashboard');
          return;
        }
        
        if (response.status === 401) {
          // User is not authenticated, redirect to login
          router.push('/login');
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  const onSubmit = async (data: ShopFormInputs) => {
    try {
      const response = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError('root', { message: errorData.error || 'Failed to save shop details' });
        return;
      }

      // Shop setup successful - redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('root', { message: 'An error occurred. Please try again.' });
      console.error('Shop setup error:', err);
    }
  };

  if (isChecking) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Setup Your Shop
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please provide your shop details to continue
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errors.root && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errors.root.message}
            </div>
          )}

          <div>
            <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Shop Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="shopName"
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your shop name"
              {...register('shopName', {
                required: 'Shop name is required',
              })}
            />
            {errors.shopName && (
              <p className="text-red-500 text-sm mt-1">{errors.shopName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter 10-digit phone number"
              {...register('phoneNumber', {
                required: 'Phone number is required',
                pattern: {
                  value: /^\d{10}$/,
                  message: 'Phone number must be exactly 10 digits',
                },
              })}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Shop Address <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <textarea
              id="address"
              disabled={isSubmitting}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Enter your shop address (optional)"
              {...register('address')}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Continue to Dashboard'}
          </button>
        </form>
      </div>
    </main>
  );
}

'use client';

import { ReactNode, useEffect, useState } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component that manages authentication state
 * across the application.
 *
 * @param children - The child components to render.
 * @returns The AuthProvider component.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const authData = localStorage.getItem('auth-storage');
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
        } catch (e) {
          console.error('Auth provider: Error parsing localStorage:', e);
        }
      }

      setIsHydrated(true);
    } catch (e) {
      setIsHydrated(true);
    }
  }, []);

  return (
    <>
      {isHydrated ? (
        children
      ) : (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold">Loading...</h2>
            <p className="text-gray-500">Please wait while the app loads</p>
          </div>
        </div>
      )}
    </>
  );
}

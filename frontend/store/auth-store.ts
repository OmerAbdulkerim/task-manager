import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/lib/auth';

// For direct access to auth state in debugging
let authState: {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
} = {
  user: null,
  token: null,
  isAuthenticated: false,
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

/**
 * Auth store using Zustand
 *
 * @remarks
 * This store is used to manage the user's authentication state.
 * It uses Zustand to store the user's information and token.
 *
 * @returns The auth store
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        console.log('Auth store: login called with user:', user);
        console.log(
          'Auth store: login called with token:',
          token ? 'exists' : 'missing',
        );

        // Set the cookie for middleware authentication
        const secure = process.env.NODE_ENV === 'production';
        document.cookie = `accessToken=${token}; path=/; ${secure ? 'secure; ' : ''}samesite=strict; max-age=86400`; // 24 hours

        // Update both the Zustand state and our local reference
        const newState = { user, token, isAuthenticated: true };
        authState = { ...newState };

        // Update localStorage directly as a backup
        try {
          localStorage.setItem('backup-auth-user', JSON.stringify(user));
          localStorage.setItem('backup-auth-token', token);
          localStorage.setItem('backup-auth-state', JSON.stringify(newState));
        } catch (e) {
          console.error('Failed to set localStorage backup:', e);
        }

        set(newState);
      },
      logout: () => {
        // Clear cookies when logging out
        document.cookie =
          'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';
        document.cookie =
          'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';

        // Reset state
        console.log('Auth store: logout called');
        authState = { user: null, token: null, isAuthenticated: false };

        // Clear backup localStorage
        try {
          localStorage.removeItem('backup-auth-user');
          localStorage.removeItem('backup-auth-token');
          localStorage.removeItem('backup-auth-state');
        } catch (e) {
          console.error('Failed to clear localStorage backup:', e);
        }

        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Log when state is rehydrated from storage
        console.log(
          'Auth store: rehydrated state, authenticated =',
          state?.isAuthenticated || false,
        );
        console.log(
          'Auth store: rehydrated state, user =',
          state?.user ? 'exists' : 'missing',
        );
        console.log(
          'Auth store: rehydrated state, token =',
          state?.token ? 'exists' : 'missing',
        );

        // Update our reference
        if (state) {
          authState = {
            user: state.user,
            token: state.token,
            isAuthenticated: state.isAuthenticated,
          };

          // Re-set the cookie after rehydration
          if (state.token) {
            const secure = process.env.NODE_ENV === 'production';
            document.cookie = `accessToken=${state.token}; path=/; ${secure ? 'secure; ' : ''}samesite=strict; max-age=86400`; // 24 hours
          }
        }

        // Try to recover from backup if needed
        if (!state?.user || !state?.token) {
          try {
            const backupUser = localStorage.getItem('backup-auth-user');
            const backupToken = localStorage.getItem('backup-auth-token');

            if (backupUser && backupToken) {
              console.log('Auth store: attempting recovery from backup');
              const parsedUser = JSON.parse(backupUser);

              if (parsedUser && backupToken) {
                console.log('Auth store: recovered from backup');
                // Update our reference
                authState = {
                  user: parsedUser,
                  token: backupToken,
                  isAuthenticated: true,
                };

                // Set the cookie from backup
                const secure = process.env.NODE_ENV === 'production';
                document.cookie = `accessToken=${backupToken}; path=/; ${secure ? 'secure; ' : ''}samesite=strict; max-age=86400`; // 24 hours

                // Instead of modifying state directly (which causes the type error),
                // use the set function to update the store after rehydration
                setTimeout(() => {
                  // Need to use setTimeout to ensure this runs after rehydration is complete
                  const store = useAuthStore.getState();
                  if (!store.user || !store.token) {
                    console.log('Auth store: updating store with backup data');
                    store.login(parsedUser, backupToken);
                  }
                }, 0);
              }
            }
          } catch (e) {
            console.error('Failed to recover from backup:', e);
          }
        }
      },
    },
  ),
);

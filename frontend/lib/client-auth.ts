'use client';

// Base API URL
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: {
    id: string;
    name: string;
  };
}

export interface AuthResponse {
  message: string;
  status: string;
  data: {
    user: User;
    accessToken: string;
  };
}

/**
 * Client-side login function
 *
 * @remarks
 * This function sends a POST request to the /auth/login endpoint to validate the user credentials.
 *
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns The user object and the access token.
 */
export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('loginUser: Login API error:', error);
      throw new Error(error.message || 'Login failed');
    }

    const result = await response.json();

    // Store the token in localStorage for use in API requests
    if (result.data?.accessToken) {
      localStorage.setItem('accessToken', result.data.accessToken);

      // Also set as a cookie for redundancy
      const secure = process.env.NODE_ENV === 'production';
      document.cookie = `accessToken=${result.data.accessToken}; path=/; ${secure ? 'secure; ' : ''}samesite=strict; max-age=86400`; // 24 hours
    } else {
      console.error('No access token received from server');
    }

    return result;
  } catch (err) {
    console.error('loginUser: Error during login:', err);
    throw err;
  }
}

/**
 * Client-side registration function
 *
 * @remarks
 * This function sends a POST request to the /auth/register endpoint
 * to create a new user account.
 *
 * @param email - The user's email address.
 * @param password - The user's password.
 * @param roleId - The ID of the user's role. Defaults to '1'.
 * @returns The user object and the access token.
 */
export async function registerUser(
  email: string,
  password: string,
  roleId: string = '1',
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, roleId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return await response.json();
  } catch (err) {
    console.error('Error during registration:', err);
    throw err;
  }
}

/**
 * Client-side logout function
 *
 * @remarks
 * This function sends a POST request to the /auth/logout endpoint
 * to log out the current user.
 */
export async function logoutUser(): Promise<void> {
  try {
    // Remove the token from localStorage
    localStorage.removeItem('accessToken');

    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (err) {
    console.error('Error during logout:', err);
    throw err;
  }
}

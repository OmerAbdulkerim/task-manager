import { API_URL } from './client-auth';

// Helper function to get the access token
const getAccessToken = (): string | null => {
  // First try to get from localStorage
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  if (token) {
    return token;
  }

  // If no token in localStorage, try to get from cookies
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'accessToken' && value) {
        return value;
      }
    }
  }

  return null;
};

// User role interface
export interface Role {
  id: number;
  name: string;
}

// User interface
export interface User {
  id: string;
  email: string;
  name?: string;
  roleId: number;
  createdAt: string;
  updatedAt: string;
  role?: Role;
}

// DTOs for creating and updating users
export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
  roleId: number;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  roleId?: number;
}

/**
 * Fetch all users (admin only)
 */
export async function fetchUsers(): Promise<User[]> {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await fetch(`${API_URL}/admin/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch users');
    }

    const data = await response.json();
    return data.data.users || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * Fetch a single user by ID (admin only)
 */
export async function fetchUserById(id: string): Promise<User> {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user');
    }

    const data = await response.json();
    return data.data.user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

/**
 * Create a new user (admin only)
 */
export async function createUser(userData: CreateUserDto): Promise<User> {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await fetch(`${API_URL}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create user');
    }

    const data = await response.json();
    return data.data.user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Update an existing user (admin only)
 */
export async function updateUser(
  id: string,
  userData: UpdateUserDto,
): Promise<User> {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user');
    }

    const data = await response.json();
    return data.data.user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

/**
 * Delete a user (admin only)
 */
export async function deleteUser(id: string): Promise<void> {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete user');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

/**
 * Fetch all available roles (admin only)
 */
export async function fetchRoles(): Promise<Role[]> {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await fetch(`${API_URL}/admin/roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch roles');
    }

    const data = await response.json();
    return data.data.roles || [];
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
}

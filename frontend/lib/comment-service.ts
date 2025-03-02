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

// Comment interface
export interface Comment {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  author: {
    id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

// DTOs for creating and updating comments
export interface CreateCommentDto {
  content: string;
  taskId: string;
  createdById?: string;
}

export interface UpdateCommentDto {
  content: string;
}

/**
 * Fetch all comments for a task
 */
export async function fetchCommentsByTaskId(
  taskId: string,
): Promise<Comment[]> {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await fetch(`${API_URL}/comments/task/${taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch comments');
    }

    const data = await response.json();
    return data.data.comments || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

/**
 * Fetch a single comment by ID
 */
export async function fetchCommentById(id: string): Promise<Comment> {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await fetch(`${API_URL}/comments/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch comment');
    }

    const data = await response.json();
    return data.data.comment;
  } catch (error) {
    console.error('Error fetching comment:', error);
    throw error;
  }
}

/**
 * Create a new comment
 */
export async function createComment(
  commentData: CreateCommentDto,
): Promise<Comment> {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create comment');
    }

    const data = await response.json();
    return data.data.comment;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

/**
 * Update an existing comment
 */
export async function updateComment(
  taskId: string | number,
  id: string,
  commentData: UpdateCommentDto,
): Promise<Comment> {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await fetch(`${API_URL}/comments/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update comment');
    }

    const data = await response.json();
    return data.data.comment;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
}

/**
 * Delete a comment
 */
export async function deleteComment(id: string): Promise<void> {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await fetch(`${API_URL}/comments/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete comment');
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

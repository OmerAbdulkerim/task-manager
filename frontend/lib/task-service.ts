import { API_URL } from './client-auth';

// Helper function to get the access token
const getAccessToken = (): string | null => {
  // First try to get from localStorage (this is set by loginUser)
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

// Enums to match backend
export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

// Interface for Task Category
export interface TaskCategory {
  id: number;
  name: string;
}

// Interface for Task Priority
export interface TaskPriority {
  id: number;
  name: string;
}

// Interface for User (minimal)
export interface User {
  id: string;
  email: string;
}

// Main Task interface that matches the backend model
export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priorityId: number;
  dueDate?: Date | null;
  createdById: string;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;

  // Relations - may be included depending on API response
  priority?: TaskPriority;
  createdBy?: User;
  category?: TaskCategory;
}

// DTOs for creating and updating tasks
export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priorityId: number;
  dueDate?: Date;
  categoryId: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priorityId?: number;
  dueDate?: Date | null;
  categoryId?: number;
}

// Task filtering options
export interface TaskFilterDto {
  priorityIds?: number[];
  statuses?: TaskStatus[];
  dueDateFrom?: Date;
  dueDateTo?: Date;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  sortDirection?: 'asc' | 'desc';
  sortBy?: 'priority' | 'status' | 'dueDate' | 'createdAt';
}

/**
 * Fetch all tasks for the current user
 */
export async function fetchTasks(): Promise<Task[]> {
  try {
    const token = getAccessToken();

    if (!token) {
      console.error('No access token found in storage or cookies');
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await fetch(`${API_URL}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from tasks API:', errorData);
      throw new Error(errorData.message || 'Failed to fetch tasks');
    }

    const data = await response.json();
    // The API returns tasks in a nested data.tasks structure
    return data.data.tasks || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

/**
 * Fetch a single task by ID
 */
export async function fetchTaskById(id: string): Promise<Task> {
  try {
    const token = getAccessToken();

    if (!token) {
      console.error('No access token found in storage or cookies');
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from task API:', errorData);
      throw new Error(errorData.message || 'Failed to fetch task');
    }

    const data = await response.json();
    // The API returns the task in a nested data.task structure
    return data.data.task;
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error;
  }
}

/**
 * Create a new task
 */
export async function createTask(taskData: CreateTaskDto): Promise<Task> {
  try {
    const token = getAccessToken();

    if (!token) {
      console.error('No access token found in storage or cookies');
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from create task API:', errorData);
      throw new Error(errorData.message || 'Failed to create task');
    }

    const data = await response.json();
    // The API returns the task in a nested data.task structure
    return data.data.task;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

/**
 * Update an existing task
 */
export async function updateTask(
  id: string,
  taskData: UpdateTaskDto,
): Promise<Task> {
  try {
    const token = getAccessToken();

    if (!token) {
      console.error('No access token found in storage or cookies');
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from update task API:', errorData);
      throw new Error(errorData.message || 'Failed to update task');
    }

    const data = await response.json();
    // The API returns the task in a nested data.task structure
    return data.data.task;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

/**
 * Delete a task
 */
export async function deleteTask(id: number): Promise<void> {
  try {
    const token = getAccessToken();

    if (!token) {
      console.error('No access token found in storage or cookies');
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from delete task API:', errorData);
      throw new Error(errorData.message || 'Failed to delete task');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}

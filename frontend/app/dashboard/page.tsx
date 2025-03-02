'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { useAuthStore } from '@/store/auth-store';
import {
  Task,
  TaskCategory,
  TaskPriority,
  TaskStatus,
  fetchTasks,
  deleteTask,
} from '@/lib/task-service';
import { TaskCard } from '@/components/task-card';
import { CreateTaskDialog } from '@/components/create-task-dialog';
import { EditTaskDialog } from '@/components/edit-task-dialog';

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Mock data for categories and priorities - in a real app, these would be fetched from the API
  const [categories, setCategories] = useState<TaskCategory[]>([
    { id: 1, name: 'Work' },
    { id: 2, name: 'Personal' },
    { id: 3, name: 'Shopping' },
  ]);

  const [priorities, setPriorities] = useState<TaskPriority[]>([
    { id: 1, name: 'LOW' },
    { id: 2, name: 'MEDIUM' },
    { id: 3, name: 'HIGH' },
  ]);

  // Stats derived from tasks - with proper null checks
  const totalTasks = tasks?.length || 0;
  const pendingTasks =
    tasks?.filter((task) => task.status === TaskStatus.PENDING)?.length || 0;
  const completedTasks =
    tasks?.filter((task) => task.status === TaskStatus.COMPLETED)?.length || 0;
  const inProgressTasks =
    tasks?.filter((task) => task.status === TaskStatus.IN_PROGRESS)?.length ||
    0;

  useEffect(() => {
    // Check authentication - the middleware will handle redirects, but we still check here as a backup
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    // Fetch dashboard data
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
      }
    }

    // Fetch tasks
    async function loadTasks() {
      try {
        const taskData = await fetchTasks();
        setTasks(taskData);
        setError('');
      } catch (err: any) {
        setError('Failed to load tasks. Please try again later.');

        // If authentication error, redirect to login
        if (err.message && err.message.includes('Authentication required')) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
    loadTasks();
  }, [isAuthenticated, user, router]);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      setLoading(true);
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err: any) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = async () => {
    try {
      setLoading(true);
      const taskData = await fetchTasks();
      setTasks(taskData);
      setError('');
    } catch (err: any) {
      console.error('Error refreshing tasks:', err);
      setError('Failed to refresh tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdated = async () => {
    try {
      setLoading(true);
      const taskData = await fetchTasks();
      setTasks(taskData);
      setError('');
    } catch (err: any) {
      console.error('Error refreshing tasks:', err);
      setError('Failed to refresh tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !tasks.length) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold">Loading...</h2>
          <p className="text-gray-500">
            Please wait while we load your dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <CreateTaskDialog
            categories={categories}
            priorities={priorities}
            onTaskCreated={handleTaskCreated}
          />
        </div>

        {/* Display error message if there is one */}
        {error && (
          <div className="relative mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Dashboard stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border-l-4 border-blue-500 bg-white p-4 shadow">
            <h2 className="font-semibold text-gray-500">Total Tasks</h2>
            <p className="text-2xl font-bold">{totalTasks}</p>
          </div>
          <div className="rounded-lg border-l-4 border-yellow-500 bg-white p-4 shadow">
            <h2 className="font-semibold text-gray-500">Pending</h2>
            <p className="text-2xl font-bold">{pendingTasks}</p>
          </div>
          <div className="rounded-lg border-l-4 border-purple-500 bg-white p-4 shadow">
            <h2 className="font-semibold text-gray-500">In Progress</h2>
            <p className="text-2xl font-bold">{inProgressTasks}</p>
          </div>
          <div className="rounded-lg border-l-4 border-green-500 bg-white p-4 shadow">
            <h2 className="font-semibold text-gray-500">Completed</h2>
            <p className="text-2xl font-bold">{completedTasks}</p>
          </div>
        </div>

        {/* Task list */}
        <h2 className="mb-4 text-xl font-semibold">Your Tasks</h2>

        {loading ? (
          <div className="py-10 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500">Loading your tasks...</p>
          </div>
        ) : tasks.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={(e) => handleDeleteTask(task.id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-white p-6 text-center shadow-md">
            <p className="text-gray-500">You don't have any tasks yet.</p>
            <p className="mt-2 text-gray-500">
              Click the &quot;Create Task&quot; button to get started.
            </p>
          </div>
        )}
      </main>

      <EditTaskDialog
        task={editingTask}
        categories={categories}
        priorities={priorities}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onTaskUpdated={handleTaskUpdated}
      />
    </div>
  );
}
